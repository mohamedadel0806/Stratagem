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
import { SupplierService } from '../services/supplier.service';
import { ImportService } from '../services/import.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';
import { SupplierQueryDto } from '../dto/supplier-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@ApiTags('assets')
@Controller('assets/suppliers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly importService: ImportService,
    private readonly riskAssetLinkService: RiskAssetLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created successfully', type: SupplierResponseDto })
  async create(
    @Body() createDto: CreateSupplierDto,
    @CurrentUser() user: User,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers with filters' })
  @ApiResponse({ status: 200, description: 'List of suppliers' })
  async findAll(@Query() query: SupplierQueryDto): Promise<{
    data: SupplierResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.supplierService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'Supplier details', type: SupplierResponseDto })
  async findOne(@Param('id') id: string): Promise<SupplierResponseDto> {
    return this.supplierService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully', type: SupplierResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupplierDto,
    @CurrentUser() user: User,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier (soft delete)' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ message: string }> {
    await this.supplierService.remove(id, user.id);
    return { message: 'Supplier deleted successfully' };
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
  @ApiOperation({ summary: 'Import suppliers from CSV/Excel file' })
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
      'supplier',
      fieldMapping,
      user.userId,
      file.originalname,
    );
  }

  @Get('import/history')
  @ApiOperation({ summary: 'Get import history' })
  @ApiResponse({ status: 200, description: 'List of import logs' })
  async getImportHistory() {
    return this.importService.getImportHistory('supplier');
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
  @ApiOperation({ summary: 'Get all risks linked to this supplier' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisks(@Param('id') id: string) {
    return this.riskAssetLinkService.getRisksForAsset(RiskAssetType.SUPPLIER, id);
  }

  @Get(':id/risks/score')
  @ApiOperation({ summary: 'Get aggregate risk score for this supplier' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'Asset risk score summary' })
  async getRiskScore(@Param('id') id: string) {
    return this.riskAssetLinkService.getAssetRiskScore(RiskAssetType.SUPPLIER, id);
  }

  @Get('contracts/expiring')
  @ApiOperation({ summary: 'Get suppliers with contracts expiring within specified days' })
  @ApiResponse({ status: 200, description: 'List of suppliers with expiring contracts' })
  async getExpiringContracts(
    @Query('days') days?: string,
  ): Promise<{
    data: SupplierResponseDto[];
    total: number;
    days: number;
  }> {
    const daysNumber = days ? parseInt(days, 10) || 90 : 90;
    const suppliers = await this.supplierService.getExpiringContracts(daysNumber);
    return {
      data: suppliers,
      total: suppliers.length,
      days: daysNumber,
    };
  }

  @Get('critical/report')
  @ApiOperation({ summary: 'Get report of critical suppliers for executive review' })
  @ApiResponse({ status: 200, description: 'List of critical and high criticality suppliers' })
  async getCriticalSuppliersReport(): Promise<{
    data: SupplierResponseDto[];
    total: number;
  }> {
    const suppliers = await this.supplierService.getCriticalSuppliersReport();
    return {
      data: suppliers,
      total: suppliers.length,
    };
  }
}

