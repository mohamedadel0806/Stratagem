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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UnifiedControlsService } from './unified-controls.service';
import { ControlAssetMappingService } from './services/control-asset-mapping.service';
import { FrameworkControlMappingService } from './services/framework-control-mapping.service';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from './dto/create-control-asset-mapping.dto';
import { BulkDeleteControlAssetMappingDto } from './dto/bulk-delete-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from './dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from './dto/control-asset-mapping-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskControlLinkService } from '../../risk/services/risk-control-link.service';

@ApiTags('governance')
@Controller('api/v1/governance/unified-controls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnifiedControlsController {
  constructor(
    private readonly unifiedControlsService: UnifiedControlsService,
    private readonly controlAssetMappingService: ControlAssetMappingService,
    private readonly frameworkControlMappingService: FrameworkControlMappingService,
    private readonly riskControlLinkService: RiskControlLinkService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateUnifiedControlDto, @Request() req) {
    return this.unifiedControlsService.create(createDto, req.user.id);
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
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateUnifiedControlDto>, @Request() req) {
    return this.unifiedControlsService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.unifiedControlsService.remove(id);
  }

  // Control-Asset Mapping Endpoints
  @Post(':id/assets')
  @ApiOperation({ summary: 'Link an asset to a control' })
  @ApiResponse({ status: 201, description: 'Asset linked to control successfully' })
  @ApiResponse({ status: 404, description: 'Control not found' })
  @ApiResponse({ status: 409, description: 'Asset already linked to control' })
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

  // ================== Risk Integration Endpoints ==================

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
}

