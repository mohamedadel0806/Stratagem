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
import { BusinessApplicationService } from '../services/business-application.service';
import { ImportService } from '../services/import.service';
import { CreateBusinessApplicationDto } from '../dto/create-business-application.dto';
import { UpdateBusinessApplicationDto } from '../dto/update-business-application.dto';
import { BusinessApplicationResponseDto } from '../dto/business-application-response.dto';
import { BusinessApplicationQueryDto } from '../dto/business-application-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@ApiTags('assets')
@Controller('assets/applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessApplicationController {
  constructor(
    private readonly applicationService: BusinessApplicationService,
    private readonly importService: ImportService,
    private readonly riskAssetLinkService: RiskAssetLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business application' })
  @ApiResponse({ status: 201, description: 'Application created successfully', type: BusinessApplicationResponseDto })
  async create(
    @Body() createDto: CreateBusinessApplicationDto,
    @CurrentUser() user: User,
  ): Promise<BusinessApplicationResponseDto> {
    return this.applicationService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business applications with filters' })
  @ApiResponse({ status: 200, description: 'List of business applications' })
  async findAll(@Query() query: BusinessApplicationQueryDto): Promise<{
    data: BusinessApplicationResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.applicationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business application by ID' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application details', type: BusinessApplicationResponseDto })
  async findOne(@Param('id') id: string): Promise<BusinessApplicationResponseDto> {
    return this.applicationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application updated successfully', type: BusinessApplicationResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBusinessApplicationDto,
    @CurrentUser() user: User,
  ): Promise<BusinessApplicationResponseDto> {
    return this.applicationService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business application (soft delete)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ message: string }> {
    await this.applicationService.remove(id, user.id);
    return { message: 'Application deleted successfully' };
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
  @ApiOperation({ summary: 'Import business applications from CSV/Excel file' })
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
      'application',
      fieldMapping,
      user.userId,
      file.originalname,
    );
  }

  @Get('import/history')
  @ApiOperation({ summary: 'Get import history' })
  @ApiResponse({ status: 200, description: 'List of import logs' })
  async getImportHistory() {
    return this.importService.getImportHistory('application');
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
  @ApiOperation({ summary: 'Get all risks linked to this business application' })
  @ApiParam({ name: 'id', description: 'Business application ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisks(@Param('id') id: string) {
    return this.riskAssetLinkService.getRisksForAsset(RiskAssetType.APPLICATION, id);
  }

  @Get(':id/risks/score')
  @ApiOperation({ summary: 'Get aggregate risk score for this business application' })
  @ApiParam({ name: 'id', description: 'Business application ID' })
  @ApiResponse({ status: 200, description: 'Asset risk score summary' })
  async getRiskScore(@Param('id') id: string) {
    return this.riskAssetLinkService.getAssetRiskScore(RiskAssetType.APPLICATION, id);
  }
}

