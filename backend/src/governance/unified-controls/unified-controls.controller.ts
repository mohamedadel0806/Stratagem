import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UnifiedControlsService } from './unified-controls.service';
import { ControlAssetMappingService, AssetCompliancePosture, AssetTypeComplianceOverview } from './services/control-asset-mapping.service';
import { FrameworkControlMappingService } from './services/framework-control-mapping.service';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from './dto/create-control-asset-mapping.dto';
import { BulkDeleteControlAssetMappingDto } from './dto/bulk-delete-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from './dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from './dto/control-asset-mapping-query.dto';
import { AssetType } from './entities/control-asset-mapping.entity';
import { ImplementationStatus } from './entities/unified-control.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskControlLinkService } from '../../risk/services/risk-control-link.service';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('governance')
@Controller('governance/unified-controls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnifiedControlsController {
  constructor(
    private readonly unifiedControlsService: UnifiedControlsService,
    private readonly controlAssetMappingService: ControlAssetMappingService,
    private readonly frameworkControlMappingService: FrameworkControlMappingService,
    private readonly riskControlLinkService: RiskControlLinkService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'UnifiedControl')
  create(@Body() createDto: CreateUnifiedControlDto, @Request() req) {
    return this.unifiedControlsService.create(createDto, req.user.id, req.user.tenantId);
  }

  @Get()
  findAll(@Query() queryDto: UnifiedControlQueryDto) {
    return this.unifiedControlsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unifiedControlsService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, 'UnifiedControl')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateUnifiedControlDto>, @Request() req) {
    return this.unifiedControlsService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit(AuditAction.DELETE, 'UnifiedControl')
  remove(@Param('id') id: string) {
    return this.unifiedControlsService.remove(id);
  }

  // Control-Asset Mapping Endpoints
  @Post(':id/assets')
  @ApiOperation({ summary: 'Link an asset to a control' })
  @ApiResponse({ status: 201, description: 'Asset linked to control successfully' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  @ApiResponse({ status: 409, description: 'Asset already linked to control' })
  @Audit(AuditAction.ASSIGN, 'UnifiedControl', { description: 'Linked asset to control' })
  linkAsset(
    @Param('id') controlId: string,
    @Body() createDto: CreateControlAssetMappingDto,
    @Request() req,
  ) {
    return this.controlAssetMappingService.create(controlId, createDto, req.user.id);
  }

  @Post(':id/assets/bulk')
  @ApiOperation({ summary: 'Bulk link assets to a control' })
  @ApiResponse({ status: 201, description: 'Assets linked to control successfully' })
  @Audit(AuditAction.ASSIGN, 'UnifiedControl', { description: 'Bulk linked assets to control' })
  bulkLinkAssets(
    @Param('id') controlId: string,
    @Body() bulkDto: BulkCreateControlAssetMappingDto,
    @Request() req,
  ) {
    return this.controlAssetMappingService.bulkCreate(controlId, bulkDto, req.user.id);
  }

  @Get(':id/assets')
  @ApiOperation({ summary: 'Get all assets linked to a control' })
  @ApiResponse({ status: 200, description: 'List of linked assets' })
  getLinkedAssets(@Param('id') controlId: string, @Query() queryDto: ControlAssetMappingQueryDto) {
    return this.controlAssetMappingService.findAll(controlId, queryDto);
  }

  @Get(':id/assets/:mappingId')
  @ApiOperation({ summary: 'Get a specific control-asset mapping' })
  @ApiResponse({ status: 200, description: 'Control-asset mapping details' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  getMapping(@Param('id') controlId: string, @Param('mappingId') mappingId: string) {
    return this.controlAssetMappingService.findOne(controlId, mappingId);
  }

  @Patch(':id/assets/:mappingId')
  @ApiOperation({ summary: 'Update a control-asset mapping' })
  @ApiResponse({ status: 200, description: 'Mapping updated successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  updateMapping(
    @Param('id') controlId: string,
    @Param('mappingId') mappingId: string,
    @Body() updateDto: UpdateControlAssetMappingDto,
  ) {
    return this.controlAssetMappingService.update(controlId, mappingId, updateDto);
  }

  @Delete(':id/assets/:mappingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlink an asset from a control' })
  @ApiResponse({ status: 204, description: 'Asset unlinked successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  unlinkAsset(@Param('id') controlId: string, @Param('mappingId') mappingId: string) {
    return this.controlAssetMappingService.remove(controlId, mappingId);
  }

  @Delete(':id/assets/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk unlink assets from a control' })
  @ApiResponse({ status: 200, description: 'Assets unlinked successfully' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  bulkUnlinkAssets(
    @Param('id') controlId: string,
    @Body() bulkDto: BulkDeleteControlAssetMappingDto,
  ) {
    return this.controlAssetMappingService.bulkRemove(controlId, bulkDto.mapping_ids);
  }

  @Get('assets/:assetType/:assetId/controls')
  @ApiOperation({ summary: 'Get all controls linked to an asset' })
  @ApiResponse({ status: 200, description: 'List of linked controls' })
  @ApiResponse({ status: 404, description: 'No controls found for asset' })
  getControlsForAsset(
    @Param('assetType') assetType: string,
    @Param('assetId') assetId: string,
    @Query() queryDto: ControlAssetMappingQueryDto,
  ) {
    return this.controlAssetMappingService.getControlsByAsset(assetType as any, assetId);
  }

  @Post('assets/:assetType/:assetId/controls')
  @ApiOperation({ summary: 'Link controls to an asset (from asset side)' })
  @ApiResponse({ status: 201, description: 'Controls linked to asset successfully' })
  @ApiResponse({ status: 409, description: 'Some controls already linked' })
  linkControlsToAsset(
    @Param('assetType') assetType: string,
    @Param('assetId') assetId: string,
    @Body() body: { control_ids: string[]; implementation_status?: string; implementation_notes?: string },
    @Request() req,
  ) {
    return this.controlAssetMappingService.linkControlsToAsset(
      assetType as any,
      assetId,
      body.control_ids,
      body.implementation_status,
      body.implementation_notes,
      req.user.id,
    );
  }

  @Delete('assets/:assetType/:assetId/controls/:controlId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlink a control from an asset (from asset side)' })
  @ApiResponse({ status: 204, description: 'Control unlinked successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  unlinkControlFromAsset(
    @Param('assetType') assetType: string,
    @Param('assetId') assetId: string,
    @Param('controlId') controlId: string,
  ) {
    return this.controlAssetMappingService.removeByAsset(controlId, assetType as any, assetId);
  }

  // ==================== ASSET COMPLIANCE ENDPOINTS (Story 5.1) ====================

  @Get('assets/:assetType/:assetId/compliance')
  @ApiOperation({ summary: 'Get asset compliance posture' })
  @ApiResponse({ status: 200, description: 'Asset compliance data retrieved successfully' })
  getAssetCompliancePosture(
    @Param('assetType') assetType: string,
    @Param('assetId') assetId: string,
  ): Promise<AssetCompliancePosture> {
    return this.controlAssetMappingService.getAssetCompliancePosture(assetType as any, assetId);
  }

  @Get('assets/:assetType/compliance-overview')
  @ApiOperation({ summary: 'Get compliance overview for asset type' })
  @ApiResponse({ status: 200, description: 'Compliance overview retrieved successfully' })
  getAssetTypeComplianceOverview(@Param('assetType') assetType: string): Promise<AssetTypeComplianceOverview> {
    return this.controlAssetMappingService.getAssetTypeComplianceOverview(assetType as any);
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get control-asset matrix data' })
  @ApiResponse({ status: 200, description: 'Matrix data retrieved successfully' })
  @ApiQuery({ name: 'assetType', required: false, enum: AssetType })
  @ApiQuery({ name: 'controlDomain', required: false })
  @ApiQuery({ name: 'implementationStatus', required: false, enum: ImplementationStatus })
  getControlAssetMatrix(
    @Query('assetType') assetType?: AssetType,
    @Query('controlDomain') controlDomain?: string,
    @Query('implementationStatus') implementationStatus?: ImplementationStatus,
  ) {
    return this.controlAssetMappingService.getControlAssetMatrix({
      assetType,
      controlDomain,
      implementationStatus,
    });
  }

  @Get(':id/effectiveness-summary')
  @ApiOperation({ summary: 'Get control effectiveness summary across assets' })
  @ApiResponse({ status: 200, description: 'Effectiveness summary retrieved successfully' })
  getControlEffectivenessSummary(@Param('id') controlId: string) {
    return this.controlAssetMappingService.getControlEffectivenessSummary(controlId);
  }

  @Patch('assets/bulk-update-status')
  @ApiOperation({ summary: 'Bulk update implementation status for asset-control mappings' })
  @ApiResponse({ status: 200, description: 'Status updates completed successfully' })
  bulkUpdateImplementationStatus(
    @Body() updates: Array<{
      controlId: string;
      assetType: AssetType;
      assetId: string;
      implementationStatus: ImplementationStatus;
      implementationNotes?: string;
      effectivenessScore?: number;
    }>,
    @Request() req,
  ) {
    return this.controlAssetMappingService.bulkUpdateImplementationStatus(updates, req.user.id);
  }

  // ==================== CONTROL LIBRARY ENDPOINTS (Story 3.1) ====================

  @Get(':id/risks')
  @ApiOperation({ summary: 'Get all risks linked to this control' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  getRisks(@Param('id') controlId: string) {
    return this.riskControlLinkService.getRisksForControl(controlId);
  }

  @Get(':id/risks/effectiveness')
  @ApiOperation({ summary: 'Get control effectiveness summary for linked risks' })
  @ApiResponse({ status: 200, description: 'Control effectiveness data' })
  getRiskEffectiveness(@Param('id') controlId: string) {
    return this.riskControlLinkService.getControlEffectivenessForControl(controlId);
  }

  // Framework-Control Mapping Endpoints
  @Get(':id/framework-mappings')
  @ApiOperation({ summary: 'Get framework mappings for a control' })
  @ApiResponse({ status: 200, description: 'Framework mappings retrieved successfully' })
  getFrameworkMappings(@Param('id') id: string) {
    return this.frameworkControlMappingService.getMappingsForControl(id);
  }

  @Post(':id/framework-mappings')
  @ApiOperation({ summary: 'Map a control to a framework requirement' })
  @ApiResponse({ status: 201, description: 'Mapping created successfully' })
  @Audit(AuditAction.ASSIGN, 'UnifiedControl', { description: 'Mapped control to framework requirement' })
  createFrameworkMapping(
    @Param('id') controlId: string,
    @Body() body: { requirement_id: string; coverage_level: string; mapping_notes?: string },
    @Request() req,
  ) {
    return this.frameworkControlMappingService.createMapping(
      controlId,
      body.requirement_id,
      body.coverage_level as any,
      body.mapping_notes,
      req.user.id,
    );
  }

  @Post(':id/framework-mappings/bulk')
  @ApiOperation({ summary: 'Bulk map a control to multiple framework requirements' })
  @ApiResponse({ status: 201, description: 'Mappings created successfully' })
  @Audit(AuditAction.ASSIGN, 'UnifiedControl', { description: 'Bulk mapped control to framework requirements' })
  bulkCreateFrameworkMappings(
    @Param('id') controlId: string,
    @Body() body: { requirement_ids: string[]; coverage_level: string; mapping_notes?: string },
    @Request() req,
  ) {
    return this.frameworkControlMappingService.bulkCreateMappings(
      controlId,
      body.requirement_ids,
      body.coverage_level as any,
      body.mapping_notes,
      req.user.id,
    );
  }

  @Patch('framework-mappings/:mappingId')
  @ApiOperation({ summary: 'Update a framework-control mapping' })
  @ApiResponse({ status: 200, description: 'Mapping updated successfully' })
  updateFrameworkMapping(
    @Param('mappingId') mappingId: string,
    @Body() body: { coverage_level?: string; mapping_notes?: string },
  ) {
    return this.frameworkControlMappingService.updateMapping(
      mappingId,
      body.coverage_level as any,
      body.mapping_notes,
    );
  }

  @Delete('framework-mappings/:mappingId')
  @ApiOperation({ summary: 'Delete a framework-control mapping' })
  @ApiResponse({ status: 200, description: 'Mapping deleted successfully' })
  deleteFrameworkMapping(@Param('mappingId') mappingId: string) {
    return this.frameworkControlMappingService.deleteMapping(mappingId);
  }

  @Get('frameworks/:frameworkId/coverage-matrix')
  @ApiOperation({ summary: 'Get coverage matrix for a framework' })
  @ApiResponse({ status: 200, description: 'Coverage matrix retrieved successfully' })
  getCoverageMatrix(@Param('frameworkId') frameworkId: string) {
    return this.frameworkControlMappingService.getCoverageMatrix(frameworkId);
  }

  // ==================== CONTROL LIBRARY ENDPOINTS (Story 3.1) ====================

  @Get('library/statistics')
  @ApiOperation({ summary: 'Get control library statistics' })
  @ApiResponse({ status: 200, description: 'Library statistics retrieved successfully' })
  getLibraryStatistics() {
    return this.unifiedControlsService.getLibraryStatistics();
  }

  @Get('library/domains/tree')
  @ApiOperation({ summary: 'Get domain hierarchy tree with control counts' })
  @ApiResponse({ status: 200, description: 'Domain tree retrieved successfully' })
  getDomainTree() {
    return this.unifiedControlsService.getDomainHierarchyTree();
  }

  @Get('library/domains')
  @ApiOperation({ summary: 'Get all active control domains' })
  @ApiResponse({ status: 200, description: 'Domains retrieved successfully' })
  getActiveDomains() {
    return this.unifiedControlsService.getActiveDomains();
  }

  @Get('library/types')
  @ApiOperation({ summary: 'Get all available control types' })
  @ApiResponse({ status: 200, description: 'Control types retrieved successfully' })
  getControlTypes() {
    return this.unifiedControlsService.getControlTypes();
  }

  @Get('library/browse')
  @ApiOperation({ summary: 'Browse control library with filtering' })
  @ApiResponse({ status: 200, description: 'Controls retrieved successfully' })
  browseLibrary(
    @Query('domain') domain?: string,
    @Query('type') type?: string,
    @Query('complexity') complexity?: string,
    @Query('status') status?: string,
    @Query('implementationStatus') implementationStatus?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.unifiedControlsService.browseLibrary({
      domain,
      type,
      complexity,
      status,
      implementationStatus,
      search,
      page,
      limit,
    });
  }

  @Get('library/dashboard')
  @ApiOperation({ summary: 'Get control library dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getControlsDashboard() {
    return this.unifiedControlsService.getControlsDashboard();
  }

  @Get('library/export')
  @ApiOperation({ summary: 'Export controls to CSV' })
  @ApiResponse({ status: 200, description: 'Controls exported successfully' })
  exportControls(
    @Query('domain') domain?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.unifiedControlsService.exportControls({ domain, type, status });
  }

  @Post('library/import')
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'UnifiedControl')
  @ApiOperation({ summary: 'Import controls from CSV data' })
  @ApiResponse({ status: 201, description: 'Controls imported successfully' })
  importControls(@Body() importData: any[], @Request() req) {
    return this.unifiedControlsService.importControls(importData, req.user.id);
  }

  @Get(':id/domain')
  @ApiOperation({ summary: 'Get all controls in the same domain' })
  @ApiResponse({ status: 200, description: 'Controls retrieved successfully' })
  getControlsByDomain(@Param('id') id: string) {
    return this.unifiedControlsService.findOne(id).then((control) =>
      this.unifiedControlsService.getControlsByDomain(control.domain),
    );
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related controls (similar domain/type)' })
  @ApiResponse({ status: 200, description: 'Related controls retrieved successfully' })
  getRelatedControls(@Param('id') id: string, @Query('limit') limit: number = 5) {
    return this.unifiedControlsService.getRelatedControls(id, limit);
  }

  @Get(':id/effectiveness')
  @ApiOperation({ summary: 'Get control effectiveness metrics' })
  @ApiResponse({ status: 200, description: 'Effectiveness data retrieved successfully' })
  getControlEffectiveness(@Param('id') id: string) {
    return this.unifiedControlsService.getControlEffectiveness(id);
  }
}


