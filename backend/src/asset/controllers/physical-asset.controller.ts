import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { PhysicalAssetService } from '../services/physical-asset.service';
import { ImportService } from '../services/import.service';
import { CreatePhysicalAssetDto } from '../dto/create-physical-asset.dto';
import { UpdatePhysicalAssetDto } from '../dto/update-physical-asset.dto';
import { PhysicalAssetResponseDto } from '../dto/physical-asset-response.dto';
import { PhysicalAssetQueryDto } from '../dto/physical-asset-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@ApiTags('assets')
@Controller('assets/physical')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PhysicalAssetController {
  constructor(
    private readonly assetService: PhysicalAssetService,
    private readonly importService: ImportService,
    private readonly riskAssetLinkService: RiskAssetLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new physical asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully', type: PhysicalAssetResponseDto })
  @ApiResponse({ status: 409, description: 'Asset identifier already exists' })
  async create(
    @Body() createDto: CreatePhysicalAssetDto,
    @CurrentUser() user: User,
  ): Promise<PhysicalAssetResponseDto> {
    return this.assetService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all physical assets with filters' })
  @ApiResponse({ status: 200, description: 'List of physical assets' })
  async findAll(@Query() query: PhysicalAssetQueryDto): Promise<{
    data: PhysicalAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.assetService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get physical asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset details', type: PhysicalAssetResponseDto })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findOne(@Param('id') id: string): Promise<PhysicalAssetResponseDto> {
    return this.assetService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a physical asset' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully', type: PhysicalAssetResponseDto })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePhysicalAssetDto,
    @CurrentUser() user: User,
  ): Promise<PhysicalAssetResponseDto> {
    return this.assetService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a physical asset (soft delete)' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ message: string }> {
    await this.assetService.remove(id, user.id);
    return { message: 'Asset deleted successfully' };
  }

  @Post('import/preview')
  @ApiOperation({ summary: 'Preview import file (CSV/Excel)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'File preview with first 10 rows' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async previewImport(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      console.error('File is missing in request');
      throw new BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
    }

    // Extract fileType and optional sheetName from body (multipart/form-data)
    const fileType = body?.fileType;
    const sheetName = body?.sheetName as string | undefined;
    // Determine file type from parameter or file extension
    const detectedFileType =
      fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');

    try {
      if (detectedFileType === 'excel') {
        // Support multiple worksheets by allowing optional sheetName selection
        return this.importService.previewExcel(file.buffer, 10, sheetName);
      } else {
        return this.importService.previewCSV(file.buffer);
      }
    } catch (error: any) {
      throw new BadRequestException(`Failed to parse file: ${error.message}`);
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Import physical assets from CSV/Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Import completed' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async importAssets(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string; email: string; role: string },
    @Body() body: any,
  ) {
    if (!file) {
      console.error('File is missing in request');
      throw new BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
    }

    if (!user || !user.userId) {
      console.error('User is missing in request');
      throw new BadRequestException('User authentication required');
    }

    // Extract form fields from body (multipart/form-data)
    const fileType = body?.fileType;
    const fieldMappingStr = body?.fieldMapping;
    
    // Determine file type from parameter or file extension
    const detectedFileType = fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');
    
    // Parse field mapping
    let fieldMapping: Record<string, string> = {};
    try {
      fieldMapping = fieldMappingStr ? (typeof fieldMappingStr === 'string' ? JSON.parse(fieldMappingStr) : fieldMappingStr) : {};
    } catch (error) {
      throw new BadRequestException('Invalid fieldMapping JSON format');
    }

    return this.importService.importPhysicalAssets(
      file.buffer,
      detectedFileType as any,
      fieldMapping,
      user.userId,
      file.originalname,
    );
  }

  @Get('import/history')
  @ApiOperation({ summary: 'Get import history' })
  @ApiQuery({ name: 'assetType', required: false })
  @ApiResponse({ status: 200, description: 'List of import logs' })
  async getImportHistory(@Query('assetType') assetType?: string) {
    return this.importService.getImportHistory(assetType);
  }

  @Get('import/:id')
  @ApiOperation({ summary: 'Get import log by ID' })
  @ApiParam({ name: 'id', description: 'Import log ID' })
  @ApiResponse({ status: 200, description: 'Import log details' })
  async getImportLog(@Param('id') id: string) {
    return this.importService.getImportLog(id);
  }

  // ================== Risk Integration Endpoints ==================

  @Get(':id/risks')
  @ApiOperation({ summary: 'Get all risks linked to this physical asset' })
  @ApiParam({ name: 'id', description: 'Physical asset ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisks(@Param('id') id: string) {
    return this.riskAssetLinkService.getRisksForAsset(RiskAssetType.PHYSICAL, id);
  }

  @Get(':id/risks/score')
  @ApiOperation({ summary: 'Get aggregate risk score for this physical asset' })
  @ApiParam({ name: 'id', description: 'Physical asset ID' })
  @ApiResponse({ status: 200, description: 'Asset risk score summary' })
  async getRiskScore(@Param('id') id: string) {
    return this.riskAssetLinkService.getAssetRiskScore(RiskAssetType.PHYSICAL, id);
  }
}

