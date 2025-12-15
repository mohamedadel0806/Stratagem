import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ComplianceAssessmentService } from '../services/compliance-assessment.service';
import {
  AssessmentResultDto,
  AssetComplianceStatusDto,
  ComplianceGapDto,
  BulkAssessmentResultDto,
  AssetComplianceListResponseDto,
} from '../dto/assessment-response.dto';
import { AssessAssetRequestDto, BulkAssessRequestDto } from '../dto/assessment-request.dto';
import {
  CreateValidationRuleDto,
  UpdateValidationRuleDto,
  ValidationRuleResponseDto,
} from '../dto/validation-rule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { AssetType, AssetTypeEnum, ComplianceStatus } from '../entities/asset-requirement-mapping.entity';

@ApiTags('compliance-assessments')
@Controller('compliance/assessments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplianceAssessmentController {
  constructor(private readonly assessmentService: ComplianceAssessmentService) {}

  @Post('assets/:assetType/:assetId/requirements/:requirementId')
  @ApiOperation({ summary: 'Assess a single asset against a specific requirement' })
  @ApiParam({ name: 'assetType', enum: AssetTypeEnum })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiParam({ name: 'requirementId', description: 'Requirement ID' })
  @ApiResponse({ status: 200, description: 'Assessment result', type: AssessmentResultDto })
  @ApiResponse({ status: 404, description: 'Asset or requirement not found' })
  async assessAssetRequirement(
    @Param('assetType', new ParseEnumPipe(AssetTypeEnum)) assetType: AssetType,
    @Param('assetId') assetId: string,
    @Param('requirementId') requirementId: string,
    @CurrentUser() user: User,
  ): Promise<AssessmentResultDto> {
    return this.assessmentService.assessAssetRequirement(assetType, assetId, requirementId, user.id);
  }

  @Post('assets/:assetType/:assetId')
  @ApiOperation({ summary: 'Assess all requirements for an asset' })
  @ApiParam({ name: 'assetType', enum: AssetTypeEnum })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'List of assessment results', type: [AssessmentResultDto] })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async assessAsset(
    @Param('assetType', new ParseEnumPipe(AssetTypeEnum)) assetType: AssetType,
    @Param('assetId') assetId: string,
    @CurrentUser() user: User,
  ): Promise<AssessmentResultDto[]> {
    return this.assessmentService.assessAsset(assetType, assetId, user.id);
  }

  @Get('assets/:assetType/:assetId')
  @ApiOperation({ summary: 'Get compliance status for an asset' })
  @ApiParam({ name: 'assetType', enum: AssetTypeEnum })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset compliance status', type: AssetComplianceStatusDto })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getAssetComplianceStatus(
    @Param('assetType', new ParseEnumPipe(AssetTypeEnum)) assetType: AssetType,
    @Param('assetId') assetId: string,
  ): Promise<AssetComplianceStatusDto> {
    return this.assessmentService.getAssetComplianceStatus(assetType, assetId);
  }

  @Get('assets/:assetType/:assetId/gaps')
  @ApiOperation({ summary: 'Get compliance gaps for an asset' })
  @ApiParam({ name: 'assetType', enum: AssetTypeEnum })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'List of compliance gaps', type: [ComplianceGapDto] })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getComplianceGaps(
    @Param('assetType', new ParseEnumPipe(AssetTypeEnum)) assetType: AssetType,
    @Param('assetId') assetId: string,
  ): Promise<ComplianceGapDto[]> {
    return this.assessmentService.getComplianceGaps(assetType, assetId);
  }

  @Get('assets-compliance-list')
  @ApiOperation({ summary: 'Get list of all assets with compliance status' })
  @ApiQuery({ name: 'assetType', required: false, enum: AssetTypeEnum, description: 'Filter by asset type' })
  @ApiQuery({ name: 'complianceStatus', required: false, description: 'Filter by compliance status' })
  @ApiQuery({ name: 'businessUnit', required: false, description: 'Filter by business unit' })
  @ApiQuery({ name: 'criticality', required: false, description: 'Filter by criticality level' })
  @ApiQuery({ name: 'searchQuery', required: false, description: 'Search query for asset name/identifier' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size (default: 20)' })
  @ApiResponse({ status: 200, description: 'List of assets with compliance status', type: AssetComplianceListResponseDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAssetComplianceList(
    @Query('assetType') assetType?: AssetType,
    @Query('complianceStatus') complianceStatus?: ComplianceStatus,
    @Query('businessUnit') businessUnit?: string,
    @Query('criticality') criticality?: string,
    @Query('searchQuery') searchQuery?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<AssetComplianceListResponseDto> {
    try {
      return await this.assessmentService.getAssetComplianceList(
        {
          assetType,
          complianceStatus,
          businessUnit,
          criticality,
          searchQuery,
        },
        { page: Math.max(1, page), pageSize: Math.min(100, Math.max(1, pageSize)) },
      );
    } catch (error) {
      console.error('Error in getAssetComplianceList controller:', error);
      throw error;
    }
  }

  @Post('bulk-assess')
  @ApiOperation({ summary: 'Bulk assess multiple assets' })
  @ApiResponse({ status: 200, description: 'Bulk assessment results', type: BulkAssessmentResultDto })
  async bulkAssess(
    @Body() dto: BulkAssessRequestDto,
    @CurrentUser() user: User,
  ): Promise<BulkAssessmentResultDto> {
    return this.assessmentService.bulkAssess(dto.assetType, dto.assetIds, user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get assessment history' })
  @ApiQuery({ name: 'assetType', required: false, enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @ApiQuery({ name: 'assetId', required: false, description: 'Asset ID' })
  @ApiQuery({ name: 'requirementId', required: false, description: 'Requirement ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset results' })
  @ApiResponse({ status: 200, description: 'Assessment history' })
  async getAssessmentHistory(
    @Query('assetType') assetType?: AssetType,
    @Query('assetId') assetId?: string,
    @Query('requirementId') requirementId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    // TODO: Implement assessment history retrieval
    return { message: 'Assessment history endpoint - to be implemented' };
  }

  // Validation Rules Management Endpoints

  @Post('rules')
  @ApiOperation({ summary: 'Create a new validation rule' })
  @ApiResponse({ status: 201, description: 'Validation rule created', type: ValidationRuleResponseDto })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async createValidationRule(
    @Body() createDto: CreateValidationRuleDto,
    @CurrentUser() user: User,
  ): Promise<ValidationRuleResponseDto> {
    return this.assessmentService.createValidationRule(createDto, user.id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all validation rules' })
  @ApiQuery({ name: 'requirementId', required: false, description: 'Filter by requirement ID' })
  @ApiQuery({ name: 'assetType', required: false, enum: AssetTypeEnum, description: 'Filter by asset type' })
  @ApiResponse({ status: 200, description: 'List of validation rules', type: [ValidationRuleResponseDto] })
  async findAllValidationRules(
    @Query('requirementId') requirementId?: string,
    @Query('assetType', new ParseEnumPipe(AssetTypeEnum, { optional: true })) assetType?: AssetType,
  ): Promise<ValidationRuleResponseDto[]> {
    return this.assessmentService.findAllValidationRules(requirementId, assetType);
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get a validation rule by ID' })
  @ApiParam({ name: 'id', description: 'Validation rule ID' })
  @ApiResponse({ status: 200, description: 'Validation rule details', type: ValidationRuleResponseDto })
  @ApiResponse({ status: 404, description: 'Validation rule not found' })
  async findValidationRuleById(@Param('id') id: string): Promise<ValidationRuleResponseDto> {
    return this.assessmentService.findValidationRuleById(id);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update a validation rule' })
  @ApiParam({ name: 'id', description: 'Validation rule ID' })
  @ApiResponse({ status: 200, description: 'Validation rule updated', type: ValidationRuleResponseDto })
  @ApiResponse({ status: 404, description: 'Validation rule not found' })
  async updateValidationRule(
    @Param('id') id: string,
    @Body() updateDto: UpdateValidationRuleDto,
  ): Promise<ValidationRuleResponseDto> {
    return this.assessmentService.updateValidationRule(id, updateDto);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete a validation rule' })
  @ApiParam({ name: 'id', description: 'Validation rule ID' })
  @ApiResponse({ status: 200, description: 'Validation rule deleted' })
  @ApiResponse({ status: 404, description: 'Validation rule not found' })
  async deleteValidationRule(@Param('id') id: string): Promise<{ message: string }> {
    await this.assessmentService.deleteValidationRule(id);
    return { message: 'Validation rule deleted successfully' };
  }
}

