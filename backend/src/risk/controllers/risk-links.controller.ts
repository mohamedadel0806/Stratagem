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
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskAssetLinkService } from '../services/risk-asset-link.service';
import { RiskControlLinkService } from '../services/risk-control-link.service';
import { RiskFindingLinkService } from '../services/risk-finding-link.service';
import { CreateRiskAssetLinkDto } from '../dto/links/create-risk-asset-link.dto';
import { CreateRiskControlLinkDto, UpdateRiskControlLinkDto } from '../dto/links/create-risk-control-link.dto';
import { CreateRiskFindingLinkDto, UpdateRiskFindingLinkDto } from '../dto/links/create-risk-finding-link.dto';
import { RiskAssetType } from '../entities/risk-asset-link.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('risks')
@Controller('risk-links')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RiskLinksController {
  constructor(
    private readonly assetLinkService: RiskAssetLinkService,
    private readonly controlLinkService: RiskControlLinkService,
    private readonly findingLinkService: RiskFindingLinkService,
  ) {}

  // ================== Asset Links ==================

  @Get('assets/risk/:riskId')
  async getAssetsByRisk(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.assetLinkService.findByRiskId(riskId);
  }

  @Get('assets/asset/:assetType/:assetId')
  async getRisksByAsset(
    @Param('assetType') assetType: RiskAssetType,
    @Param('assetId', ParseUUIDPipe) assetId: string,
  ) {
    return this.assetLinkService.getRisksForAsset(assetType, assetId);
  }

  @Get('assets/asset/:assetType/:assetId/score')
  async getAssetRiskScore(
    @Param('assetType') assetType: RiskAssetType,
    @Param('assetId', ParseUUIDPipe) assetId: string,
  ) {
    return this.assetLinkService.getAssetRiskScore(assetType, assetId);
  }

  @Get('assets/risk/:riskId/count')
  async countAssetsByRisk(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.assetLinkService.countByRisk(riskId);
  }

  @Post('assets')
  async createAssetLink(@Body() createDto: CreateRiskAssetLinkDto, @Request() req: any) {
    return this.assetLinkService.create(createDto, req.user?.id);
  }

  @Post('assets/bulk')
  async bulkCreateAssetLinks(
    @Body() body: { risk_id: string; assets: { asset_type: RiskAssetType; asset_id: string; impact_description?: string }[] },
    @Request() req: any,
  ) {
    return this.assetLinkService.bulkCreate(body.risk_id, body.assets, req.user?.id);
  }

  @Put('assets/:linkId')
  async updateAssetLinkDescription(
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body('impact_description') impactDescription: string,
  ) {
    return this.assetLinkService.updateImpactDescription(linkId, impactDescription);
  }

  @Delete('assets/:linkId')
  async removeAssetLink(@Param('linkId', ParseUUIDPipe) linkId: string) {
    await this.assetLinkService.remove(linkId);
    return { message: 'Asset link removed successfully' };
  }

  // ================== Control Links ==================

  @Get('controls/risk/:riskId')
  async getControlsByRisk(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.controlLinkService.findByRiskId(riskId);
  }

  @Get('controls/control/:controlId')
  async getRisksByControl(@Param('controlId', ParseUUIDPipe) controlId: string) {
    return this.controlLinkService.getRisksForControl(controlId);
  }

  @Get('controls/risk/:riskId/effectiveness')
  async getControlEffectiveness(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.controlLinkService.getControlEffectiveness(riskId);
  }

  @Get('controls/without-controls')
  async getRisksWithoutControls() {
    return this.controlLinkService.findRisksWithoutControls();
  }

  @Post('controls')
  async createControlLink(@Body() createDto: CreateRiskControlLinkDto, @Request() req: any) {
    return this.controlLinkService.create(createDto, req.user?.id);
  }

  @Put('controls/:linkId')
  async updateControlLink(
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body() updateDto: UpdateRiskControlLinkDto,
    @Request() req: any,
  ) {
    return this.controlLinkService.update(linkId, updateDto, req.user?.id);
  }

  @Delete('controls/:linkId')
  async removeControlLink(@Param('linkId', ParseUUIDPipe) linkId: string) {
    await this.controlLinkService.remove(linkId);
    return { message: 'Control link removed successfully' };
  }

  // ================== Finding Links ==================

  @Get('findings/risk/:riskId')
  @ApiOperation({ summary: 'Get all findings linked to a risk' })
  @ApiParam({ name: 'riskId', description: 'Risk ID' })
  @ApiResponse({ status: 200, description: 'List of linked findings' })
  async getFindingsByRisk(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.findingLinkService.getFindingsForRisk(riskId);
  }

  @Get('findings/finding/:findingId')
  @ApiOperation({ summary: 'Get all risks linked to a finding' })
  @ApiParam({ name: 'findingId', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  async getRisksByFinding(@Param('findingId', ParseUUIDPipe) findingId: string) {
    return this.findingLinkService.getRisksForFinding(findingId);
  }

  @Post('findings')
  @ApiOperation({ summary: 'Link a risk to a finding' })
  @ApiResponse({ status: 201, description: 'Risk-finding link created successfully' })
  @ApiResponse({ status: 404, description: 'Risk or finding not found' })
  @ApiResponse({ status: 409, description: 'Link already exists' })
  async createFindingLink(@Body() createDto: CreateRiskFindingLinkDto, @Request() req: any) {
    return this.findingLinkService.create(createDto, req.user?.id);
  }

  @Put('findings/:linkId')
  @ApiOperation({ summary: 'Update a risk-finding link' })
  @ApiParam({ name: 'linkId', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link updated successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async updateFindingLink(
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body() updateDto: UpdateRiskFindingLinkDto,
    @Request() req: any,
  ) {
    return this.findingLinkService.update(linkId, updateDto, req.user?.id);
  }

  @Delete('findings/:linkId')
  @ApiOperation({ summary: 'Remove a risk-finding link' })
  @ApiParam({ name: 'linkId', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link removed successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async removeFindingLink(@Param('linkId', ParseUUIDPipe) linkId: string) {
    await this.findingLinkService.remove(linkId);
    return { message: 'Finding link removed successfully' };
  }
}




