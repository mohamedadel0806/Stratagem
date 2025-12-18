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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { SoftwareAssetService } from '../services/software-asset.service';
import { ImportService } from '../services/import.service';
import { CreateSoftwareAssetDto } from '../dto/create-software-asset.dto';
import { UpdateSoftwareAssetDto } from '../dto/update-software-asset.dto';
import { SoftwareAssetResponseDto } from '../dto/software-asset-response.dto';
import { SoftwareAssetQueryDto } from '../dto/software-asset-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@ApiTags('assets')
@Controller('assets/software')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SoftwareAssetController {
  constructor(
    private readonly softwareService: SoftwareAssetService,
    private readonly importService: ImportService,
    private readonly riskAssetLinkService: RiskAssetLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new software asset' })
  @ApiResponse({ status: 201, description: 'Software asset created successfully', type: SoftwareAssetResponseDto })
  async create(
    @Body() createDto: CreateSoftwareAssetDto,
    @CurrentUser() user: User,
  ): Promise<SoftwareAssetResponseDto> {
    return this.softwareService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all software assets with filters' })
  @ApiResponse({ status: 200, description: 'List of software assets' })
  async findAll(@Query() query: SoftwareAssetQueryDto): Promise<{
    data: SoftwareAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.softwareService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get software asset by ID' })
  @ApiParam({ name: 'id', description: 'Software asset ID' })
  @ApiResponse({ status: 200, description: 'Software asset details', type: SoftwareAssetResponseDto })
  async findOne(@Param('id') id: string): Promise<SoftwareAssetResponseDto> {
    return this.softwareService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a software asset' })
  @ApiParam({ name: 'id', description: 'Software asset ID' })
  @ApiResponse({ status: 200, description: 'Software asset updated successfully', type: SoftwareAssetResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSoftwareAssetDto,
    @CurrentUser() user: User,
  ): Promise<SoftwareAssetResponseDto> {
    return this.softwareService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a software asset (soft delete)' })
  @ApiParam({ name: 'id', description: 'Software asset ID' })
  @ApiResponse({ status: 200, description: 'Software asset deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ message: string }> {
    await this.softwareService.remove(id, user.id);
    return { message: 'Software asset deleted successfully' };
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
      throw new BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
    }

    const fileType = body?.fileType;
    const sheetName = body?.sheetName as string | undefined;
    const detectedFileType =
      fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');

    try {
      if (detectedFileType === 'excel') {
        return this.importService.previewExcel(file.buffer, 10, sheetName);
      } else {
        return this.importService.previewCSV(file.buffer);
      }
    } catch (error: any) {
      throw new BadRequestException(`Failed to parse file: ${error.message}`);
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Import software assets from CSV/Excel file' })
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
      throw new BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
    }

    if (!user || !user.userId) {
      throw new BadRequestException('User authentication required');
    }

    const fileType = body?.fileType;
    const fieldMappingStr = body?.fieldMapping;
    
    const detectedFileType = fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');
    
    let fieldMapping: Record<string, string> = {};
    try {
      fieldMapping = fieldMappingStr ? (typeof fieldMappingStr === 'string' ? JSON.parse(fieldMappingStr) : fieldMappingStr) : {};
    } catch (error) {
      throw new BadRequestException('Invalid fieldMapping JSON format');
    }

    return this.importService.importAssets(
      file.buffer,
      detectedFileType as any,
      'software',
      fieldMapping,
      user.userId,
      file.originalname,
    );
  }

  @Get('import/history')
  @ApiOperation({ summary: 'Get import history' })
  @ApiResponse({ status: 200, description: 'List of import logs' })
  async getImportHistory() {
    return this.importService.getImportHistory('software');
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
  @ApiOperation({ summary: 'Get all risks linked to this software asset' })
  @ApiParam({ name: 'id', description: 'Software asset ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisks(@Param('id') id: string) {
    return this.riskAssetLinkService.getRisksForAsset(RiskAssetType.SOFTWARE, id);
  }

  @Get(':id/risks/score')
  @ApiOperation({ summary: 'Get aggregate risk score for this software asset' })
  @ApiParam({ name: 'id', description: 'Software asset ID' })
  @ApiResponse({ status: 200, description: 'Asset risk score summary' })
  async getRiskScore(@Param('id') id: string) {
    return this.riskAssetLinkService.getAssetRiskScore(RiskAssetType.SOFTWARE, id);
  }

  @Get('inventory/report')
  @ApiOperation({ summary: 'Get software inventory report' })
  @ApiResponse({ status: 200, description: 'Software inventory report with grouping and unlicensed software' })
  async getInventoryReport(
    @Query('groupBy') groupBy?: 'type' | 'vendor' | 'none',
  ) {
    return this.softwareService.getInventoryReport(groupBy);
  }
}

