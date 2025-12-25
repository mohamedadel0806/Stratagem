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
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AssetControlService } from './services/asset-control.service';
import { ControlAssetMapping, AssetType } from './entities/control-asset-mapping.entity';
import { ImplementationStatus } from './entities/unified-control.entity';

// DTOs for request validation
interface CreateMappingDto {
  asset_id: string;
  asset_type: AssetType;
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
  is_automated?: boolean;
}

interface UpdateMappingDto {
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
  last_test_date?: Date;
  last_test_result?: string;
  effectiveness_score?: number;
}

interface MapControlsToAssetsDto {
  asset_ids: string[];
  asset_type: AssetType;
}

interface BulkUpdateStatusDto {
  mapping_ids: string[];
  implementation_status: ImplementationStatus;
}

@ApiTags('Asset-Control Integration')
@Controller('governance/asset-control')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetControlController {
  constructor(private readonly assetControlService: AssetControlService) {}

  // ============================================================================
  // CONTROL MAPPING ENDPOINTS
  // ============================================================================

  @Post('controls/:controlId/map-asset')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Map a control to a single asset' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiResponse({ status: 201, description: 'Control mapped to asset successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  async mapControlToAsset(
    @Param('controlId') controlId: string,
    @Body() dto: CreateMappingDto,
    @Request() req,
  ): Promise<ControlAssetMapping> {
    return this.assetControlService.mapControlToAsset(controlId, dto, req.user.id);
  }

  @Post('controls/:controlId/map-assets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Map a control to multiple assets (bulk)' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiResponse({ status: 201, description: 'Control mapped to assets successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or conflict' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  async mapControlToAssets(
    @Param('controlId') controlId: string,
    @Body() dto: MapControlsToAssetsDto,
    @Request() req,
  ): Promise<ControlAssetMapping[]> {
    return this.assetControlService.mapControlToAssets(controlId, dto, req.user.id);
  }

  @Get('assets/:assetId/controls')
  @ApiOperation({ summary: 'Get all controls for an asset' })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiQuery({ name: 'assetType', enum: AssetType, required: true })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 25' })
  @ApiResponse({ status: 200, description: 'Asset controls retrieved successfully' })
  async getAssetControls(
    @Param('assetId') assetId: string,
    @Query('assetType') assetType: AssetType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ mappings: ControlAssetMapping[]; total: number }> {
    return this.assetControlService.getAssetControls(
      assetId,
      assetType,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
    );
  }

  @Get('controls/:controlId/assets')
  @ApiOperation({ summary: 'Get all assets for a control' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 25' })
  @ApiResponse({ status: 200, description: 'Control assets retrieved successfully' })
  async getControlAssets(
    @Param('controlId') controlId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ mappings: ControlAssetMapping[]; total: number }> {
    return this.assetControlService.getControlAssets(
      controlId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
    );
  }

  @Put('controls/:controlId/assets/:assetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a control-asset mapping' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Mapping updated successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async updateMapping(
    @Param('controlId') controlId: string,
    @Param('assetId') assetId: string,
    @Body() dto: UpdateMappingDto,
  ): Promise<ControlAssetMapping> {
    return this.assetControlService.updateMapping(controlId, assetId, dto);
  }

  @Delete('controls/:controlId/assets/:assetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a control-asset mapping' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiResponse({ status: 204, description: 'Mapping deleted successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async deleteMapping(
    @Param('controlId') controlId: string,
    @Param('assetId') assetId: string,
  ): Promise<void> {
    return this.assetControlService.deleteMapping(controlId, assetId);
  }

  // ============================================================================
  // COMPLIANCE & EFFECTIVENESS ENDPOINTS
  // ============================================================================

  @Get('assets/:assetId/compliance-score')
  @ApiOperation({ summary: 'Calculate compliance score for an asset' })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiQuery({ name: 'assetType', enum: AssetType, required: true })
  @ApiResponse({ status: 200, description: 'Compliance score calculated successfully' })
  async getAssetComplianceScore(
    @Param('assetId') assetId: string,
    @Query('assetType') assetType: AssetType,
  ): Promise<any> {
    return this.assetControlService.getAssetComplianceScore(assetId, assetType);
  }

  @Get('controls/:controlId/effectiveness')
  @ApiOperation({ summary: 'Calculate effectiveness score for a control' })
  @ApiParam({ name: 'controlId', description: 'Unified Control ID' })
  @ApiResponse({ status: 200, description: 'Effectiveness score calculated successfully' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  async getControlEffectiveness(@Param('controlId') controlId: string): Promise<any> {
    return this.assetControlService.getControlEffectiveness(controlId);
  }

  // ============================================================================
  // MATRIX & VISUALIZATION ENDPOINTS
  // ============================================================================

  @Get('matrix')
  @ApiOperation({ summary: 'Get asset-control matrix for visualization' })
  @ApiQuery({
    name: 'assetType',
    enum: AssetType,
    required: false,
    description: 'Filter by asset type',
  })
  @ApiQuery({ name: 'domain', type: String, required: false, description: 'Filter by domain' })
  @ApiQuery({
    name: 'status',
    enum: ImplementationStatus,
    required: false,
    description: 'Filter by implementation status',
  })
  @ApiResponse({ status: 200, description: 'Matrix retrieved successfully' })
  async getAssetControlMatrix(
    @Query('assetType') assetType?: AssetType,
    @Query('domain') domain?: string,
    @Query('status') status?: ImplementationStatus,
  ): Promise<any[]> {
    return this.assetControlService.getAssetControlMatrix(assetType, domain, status);
  }

  @Get('matrix/statistics')
  @ApiOperation({ summary: 'Get matrix statistics and metrics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getMatrixStatistics(): Promise<any> {
    return this.assetControlService.getMatrixStatistics();
  }

  // ============================================================================
  // BULK OPERATIONS ENDPOINTS
  // ============================================================================

  @Post('mappings/bulk-update-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk update implementation status for multiple mappings' })
  @ApiResponse({ status: 200, description: 'Mappings updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async bulkUpdateStatus(
    @Body() dto: BulkUpdateStatusDto,
    @Request() req,
  ): Promise<{ updated: number }> {
    return this.assetControlService.bulkUpdateStatus(dto, req.user.id);
  }

  // ============================================================================
  // DISCOVERY ENDPOINTS
  // ============================================================================

  @Get('controls/unmapped')
  @ApiOperation({ summary: 'Get controls without any asset mappings' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 25' })
  @ApiResponse({ status: 200, description: 'Unmapped controls retrieved successfully' })
  async getUnmappedControls(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<any> {
    return this.assetControlService.getUnmappedControls(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
    );
  }

  // ============================================================================
  // STATISTICS & REPORTING ENDPOINTS
  // ============================================================================

  @Get('statistics/comprehensive')
  @ApiOperation({ summary: 'Get comprehensive asset-control statistics' })
  @ApiResponse({ status: 200, description: 'Comprehensive statistics retrieved successfully' })
  async getComprehensiveStatistics(): Promise<any> {
    return this.assetControlService.getComprehensiveStatistics();
  }

  @Get('statistics/by-asset-type')
  @ApiOperation({ summary: 'Get compliance statistics broken down by asset type' })
  @ApiResponse({ status: 200, description: 'Asset type statistics retrieved successfully' })
  async getComplianceByAssetType(): Promise<any> {
    return this.assetControlService.getComplianceByAssetType();
  }
}
