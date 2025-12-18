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
import { InformationAssetService } from '../services/information-asset.service';
import { ImportService } from '../services/import.service';
import { CreateInformationAssetDto } from '../dto/create-information-asset.dto';
import { UpdateInformationAssetDto } from '../dto/update-information-asset.dto';
import { InformationAssetResponseDto } from '../dto/information-asset-response.dto';
import { InformationAssetQueryDto } from '../dto/information-asset-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@ApiTags('assets')
@Controller('assets/information')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InformationAssetController {
  constructor(
    private readonly assetService: InformationAssetService,
    private readonly importService: ImportService,
    private readonly riskAssetLinkService: RiskAssetLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new information asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully', type: InformationAssetResponseDto })
  async create(
    @Body() createDto: CreateInformationAssetDto,
    @CurrentUser() user: User,
  ): Promise<InformationAssetResponseDto> {
    return this.assetService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all information assets with filters' })
  @ApiResponse({ status: 200, description: 'List of information assets' })
  async findAll(@Query() query: InformationAssetQueryDto): Promise<{
    data: InformationAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.assetService.findAll(query);
  }

  @Get('reclassification/upcoming')
  @ApiOperation({ summary: 'Get information assets approaching reclassification' })
  @ApiResponse({ status: 200, description: 'List of assets due for reclassification' })
  async getReclassificationUpcoming(
    @Query('days') days?: string,
  ): Promise<{
    data: InformationAssetResponseDto[];
    total: number;
    days: number;
  }> {
    const daysNumber = days ? parseInt(days, 10) || 60 : 60;
    const assets = await this.assetService.getAssetsDueForReclassification(daysNumber);
    return {
      data: assets,
      total: assets.length,
      days: daysNumber,
    };
  }

  @Get('compliance/missing')
  @ApiOperation({ summary: 'Get information assets missing compliance information' })
  @ApiResponse({ status: 200, description: 'List of assets without compliance requirements' })
  async getAssetsMissingCompliance(): Promise<{
    data: InformationAssetResponseDto[];
    total: number;
  }> {
    const assets = await this.assetService.getAssetsMissingCompliance();
    return {
      data: assets,
      total: assets.length,
    };
  }

  @Get('compliance/report')
  @ApiOperation({ summary: 'Get compliance report for information assets' })
  @ApiResponse({ status: 200, description: 'Compliance report data' })
  async getComplianceReport(
    @Query('complianceRequirement') complianceRequirement?: string,
  ): Promise<{
    data: InformationAssetResponseDto[];
    total: number;
    complianceRequirement?: string;
  }> {
    const assets = await this.assetService.getComplianceReport(complianceRequirement);
    return {
      data: assets,
      total: assets.length,
      complianceRequirement,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get information asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset details', type: InformationAssetResponseDto })
  async findOne(@Param('id') id: string): Promise<InformationAssetResponseDto> {
    return this.assetService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an information asset' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully', type: InformationAssetResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInformationAssetDto,
    @CurrentUser() user: User,
  ): Promise<InformationAssetResponseDto> {
    return this.assetService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an information asset (soft delete)' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
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
    try {
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
          return await this.importService.previewExcel(file.buffer, 10, sheetName);
        } else {
          return await this.importService.previewCSV(file.buffer);
        }
      } catch (parseError: any) {
        console.error('[Information Asset Import Preview] Parse error:', parseError);
        throw new BadRequestException(`Failed to parse ${detectedFileType} file: ${parseError.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('[Information Asset Import Preview] Error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Import preview failed: ${error.message || 'Unknown error'}`);
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Import information assets from CSV/Excel file' })
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
      'information',
      fieldMapping,
      user.userId,
      file.originalname,
    );
  }

  @Get('import/history')
  @ApiOperation({ summary: 'Get import history' })
  @ApiResponse({ status: 200, description: 'List of import logs' })
  async getImportHistory() {
    return this.importService.getImportHistory('information');
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
  @ApiOperation({ summary: 'Get all risks linked to this information asset' })
  @ApiParam({ name: 'id', description: 'Information asset ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisks(@Param('id') id: string) {
    return this.riskAssetLinkService.getRisksForAsset(RiskAssetType.INFORMATION, id);
  }

  @Get(':id/risks/score')
  @ApiOperation({ summary: 'Get aggregate risk score for this information asset' })
  @ApiParam({ name: 'id', description: 'Information asset ID' })
  @ApiResponse({ status: 200, description: 'Asset risk score summary' })
  async getRiskScore(@Param('id') id: string) {
    return this.riskAssetLinkService.getAssetRiskScore(RiskAssetType.INFORMATION, id);
  }
}

