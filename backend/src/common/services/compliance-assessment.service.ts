import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AssetRequirementMapping,
  ComplianceStatus,
  AssetType,
} from '../entities/asset-requirement-mapping.entity';
import { ComplianceValidationRule, ValidationLogic } from '../entities/compliance-validation-rule.entity';
import { ComplianceAssessment, AssessmentType, ValidationResults } from '../entities/compliance-assessment.entity';
import { ComplianceRequirement } from '../entities/compliance-requirement.entity';
import {
  AssessmentResultDto,
  RuleEvaluationResultDto,
  AssetComplianceStatusDto,
  ComplianceGapDto,
  BulkAssessmentResultDto,
} from '../dto/assessment-response.dto';
import { CreateValidationRuleDto, UpdateValidationRuleDto, ValidationRuleResponseDto } from '../dto/validation-rule.dto';
import { PhysicalAssetService } from '../../asset/services/physical-asset.service';
import { InformationAssetService } from '../../asset/services/information-asset.service';
import { BusinessApplicationService } from '../../asset/services/business-application.service';
import { SoftwareAssetService } from '../../asset/services/software-asset.service';
import { SupplierService } from '../../asset/services/supplier.service';

@Injectable()
export class ComplianceAssessmentService {
  constructor(
    @InjectRepository(AssetRequirementMapping)
    private mappingRepository: Repository<AssetRequirementMapping>,
    @InjectRepository(ComplianceValidationRule)
    private rulesRepository: Repository<ComplianceValidationRule>,
    @InjectRepository(ComplianceAssessment)
    private assessmentRepository: Repository<ComplianceAssessment>,
    @InjectRepository(ComplianceRequirement)
    private requirementsRepository: Repository<ComplianceRequirement>,
    @Inject(forwardRef(() => PhysicalAssetService))
    private physicalAssetService: PhysicalAssetService,
    @Inject(forwardRef(() => InformationAssetService))
    private informationAssetService: InformationAssetService,
    @Inject(forwardRef(() => BusinessApplicationService))
    private businessApplicationService: BusinessApplicationService,
    @Inject(forwardRef(() => SoftwareAssetService))
    private softwareAssetService: SoftwareAssetService,
    @Inject(forwardRef(() => SupplierService))
    private supplierService: SupplierService,
  ) {}

  /**
   * Get asset data by type and ID
   */
  private async getAsset(assetType: AssetType, assetId: string): Promise<any> {
    switch (assetType) {
      case 'physical':
        return this.physicalAssetService.findOne(assetId);
      case 'information':
        return this.informationAssetService.findOne(assetId);
      case 'application':
        return this.businessApplicationService.findOne(assetId);
      case 'software':
        return this.softwareAssetService.findOne(assetId);
      case 'supplier':
        return this.supplierService.findOne(assetId);
      default:
        throw new NotFoundException(`Unknown asset type: ${assetType}`);
    }
  }

  /**
   * Get nested field value from asset object
   */
  private getFieldValue(asset: any, fieldPath: string): any {
    return fieldPath.split('.').reduce((obj, key) => {
      if (obj === null || obj === undefined) return undefined;
      return obj[key];
    }, asset);
  }

  /**
   * Evaluate a single operator
   */
  private evaluateOperator(fieldValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(expectedValue);
      case 'greater_than':
        return Number(fieldValue) > Number(expectedValue);
      case 'less_than':
        return Number(fieldValue) < Number(expectedValue);
      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
      case 'not_in':
        return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      case 'not_exists':
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      default:
        return false;
    }
  }

  /**
   * Evaluate conditions/criteria against asset data
   */
  private evaluateCriteria(criteria: Array<{ field: string; operator: string; value: any }>, asset: any): boolean {
    if (!criteria || criteria.length === 0) {
      return true; // No criteria means it always passes
    }

    return criteria.every((criterion) => {
      const fieldValue = this.getFieldValue(asset, criterion.field);
      return this.evaluateOperator(fieldValue, criterion.operator, criterion.value);
    });
  }

  /**
   * Evaluate a single rule against asset data
   */
  private evaluateRule(rule: ComplianceValidationRule, asset: any): RuleEvaluationResultDto {
    const logic = rule.validationLogic;

    // Check if conditions are met (rule applies to this asset)
    const conditionsMet = this.evaluateCriteria(logic.conditions || [], asset);
    if (!conditionsMet) {
      return {
        ruleId: rule.id,
        ruleName: rule.ruleName,
        applicable: false,
        status: ComplianceStatus.NOT_APPLICABLE,
        message: 'Rule conditions not met',
      };
    }

    // Evaluate compliance criteria
    const compliant = this.evaluateCriteria(logic.complianceCriteria || [], asset);
    if (compliant) {
      return {
        ruleId: rule.id,
        ruleName: rule.ruleName,
        applicable: true,
        status: ComplianceStatus.COMPLIANT,
        message: 'All compliance criteria met',
      };
    }

    // Check non-compliance criteria
    if (logic.nonComplianceCriteria && logic.nonComplianceCriteria.length > 0) {
      const nonCompliant = this.evaluateCriteria(logic.nonComplianceCriteria, asset);
      if (nonCompliant) {
        return {
          ruleId: rule.id,
          ruleName: rule.ruleName,
          applicable: true,
          status: ComplianceStatus.NON_COMPLIANT,
          message: 'Non-compliance criteria detected',
        };
      }
    }

    // Check partial compliance
    if (logic.partialComplianceCriteria && logic.partialComplianceCriteria.length > 0) {
      const partiallyCompliant = this.evaluateCriteria(logic.partialComplianceCriteria, asset);
      if (partiallyCompliant) {
        return {
          ruleId: rule.id,
          ruleName: rule.ruleName,
          applicable: true,
          status: ComplianceStatus.PARTIALLY_COMPLIANT,
          message: 'Partial compliance criteria met',
        };
      }
    }

    // Default: requires review
    return {
      ruleId: rule.id,
      ruleName: rule.ruleName,
      applicable: true,
      status: ComplianceStatus.REQUIRES_REVIEW,
      message: 'Unable to determine compliance automatically',
    };
  }

  /**
   * Determine overall status from multiple rule results
   */
  private determineStatus(results: RuleEvaluationResultDto[]): ComplianceStatus {
    const applicableResults = results.filter((r) => r.applicable);

    if (applicableResults.length === 0) {
      return ComplianceStatus.NOT_APPLICABLE;
    }

    // If any rule is non-compliant, overall is non-compliant
    if (applicableResults.some((r) => r.status === ComplianceStatus.NON_COMPLIANT)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    // If all rules are compliant, overall is compliant
    if (applicableResults.every((r) => r.status === ComplianceStatus.COMPLIANT)) {
      return ComplianceStatus.COMPLIANT;
    }

    // If any is partially compliant, overall is partially compliant
    if (applicableResults.some((r) => r.status === ComplianceStatus.PARTIALLY_COMPLIANT)) {
      return ComplianceStatus.PARTIALLY_COMPLIANT;
    }

    // Default: requires review
    return ComplianceStatus.REQUIRES_REVIEW;
  }

  /**
   * Assess a single asset against a requirement
   */
  async assessAssetRequirement(
    assetType: AssetType,
    assetId: string,
    requirementId: string,
    assessedById?: string,
  ): Promise<AssessmentResultDto> {
    // 1. Get asset data
    const asset = await this.getAsset(assetType, assetId);

    // 2. Get requirement
    const requirement = await this.requirementsRepository.findOne({ where: { id: requirementId } });
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${requirementId} not found`);
    }

    // 3. Get validation rules for this requirement + asset type
    const rules = await this.rulesRepository.find({
      where: { requirementId, assetType, isActive: true },
      order: { priority: 'DESC' },
    });

    // 4. Evaluate rules
    const ruleResults: RuleEvaluationResultDto[] = rules.map((rule) => this.evaluateRule(rule, asset));

    // 5. Determine overall status
    const status = this.determineStatus(ruleResults);

    // 6. Get or create mapping
    let mapping = await this.mappingRepository.findOne({
      where: { assetType, assetId, requirementId },
    });

    const previousStatus = mapping?.complianceStatus || ComplianceStatus.NOT_ASSESSED;

    if (!mapping) {
      mapping = this.mappingRepository.create({
        assetType,
        assetId,
        requirementId,
        complianceStatus: status,
        lastAssessedAt: new Date(),
        assessedById,
        autoAssessed: true,
      });
    } else {
      mapping.complianceStatus = status;
      mapping.lastAssessedAt = new Date();
      mapping.assessedById = assessedById;
      mapping.autoAssessed = true;
    }

    await this.mappingRepository.save(mapping);

    // 7. Save assessment history
    const assessment = this.assessmentRepository.create({
      assetType,
      assetId,
      requirementId,
      assessmentType: AssessmentType.AUTOMATIC,
      previousStatus,
      newStatus: status,
      validationResults: ruleResults as ValidationResults[],
      assessedById,
    });
    await this.assessmentRepository.save(assessment);

    // 8. Generate recommendations
    const recommendations = this.generateRecommendations(ruleResults, asset);

    return {
      assetType,
      assetId,
      requirementId,
      requirementTitle: requirement.title,
      status,
      ruleResults,
      recommendations,
      assessedAt: assessment.assessedAt.toISOString(),
      assessmentType: AssessmentType.AUTOMATIC,
    };
  }

  /**
   * Assess all requirements for an asset
   */
  async assessAsset(assetType: AssetType, assetId: string, assessedById?: string): Promise<AssessmentResultDto[]> {
    // Get asset data
    const asset = await this.getAsset(assetType, assetId);

    // Get all requirements linked to this asset (via framework)
    const frameworkIds = asset.complianceRequirements || [];
    if (frameworkIds.length === 0) {
      return []; // No frameworks linked, no requirements to assess
    }

    // Get all requirements for these frameworks
    const requirements = await this.requirementsRepository
      .createQueryBuilder('requirement')
      .leftJoin('requirement.framework', 'framework')
      .where('framework.id IN (:...frameworkIds)', { frameworkIds })
      .getMany();

    // Assess each requirement
    const results = await Promise.all(
      requirements.map((req) => this.assessAssetRequirement(assetType, assetId, req.id, assessedById)),
    );

    return results;
  }

  /**
   * Get compliance status for an asset
   */
  async getAssetComplianceStatus(assetType: AssetType, assetId: string): Promise<AssetComplianceStatusDto> {
    const mappings = await this.mappingRepository.find({
      where: { assetType, assetId },
      relations: ['requirement'],
    });

    const totalRequirements = mappings.length;
    const compliantCount = mappings.filter((m) => m.complianceStatus === ComplianceStatus.COMPLIANT).length;
    const nonCompliantCount = mappings.filter((m) => m.complianceStatus === ComplianceStatus.NON_COMPLIANT).length;
    const partiallyCompliantCount = mappings.filter(
      (m) => m.complianceStatus === ComplianceStatus.PARTIALLY_COMPLIANT,
    ).length;
    const notAssessedCount = mappings.filter((m) => m.complianceStatus === ComplianceStatus.NOT_ASSESSED).length;
    const requiresReviewCount = mappings.filter((m) => m.complianceStatus === ComplianceStatus.REQUIRES_REVIEW).length;
    const notApplicableCount = mappings.filter((m) => m.complianceStatus === ComplianceStatus.NOT_APPLICABLE).length;

    const overallCompliancePercentage =
      totalRequirements > 0 ? Math.round((compliantCount / totalRequirements) * 100) : 0;

    const requirements: AssessmentResultDto[] = await Promise.all(
      mappings.map(async (mapping) => {
        const latestAssessment = await this.assessmentRepository.findOne({
          where: { assetType, assetId, requirementId: mapping.requirementId },
          order: { assessedAt: 'DESC' },
        });

        return {
          assetType,
          assetId,
          requirementId: mapping.requirementId,
          requirementTitle: mapping.requirement?.title || 'Unknown',
          status: mapping.complianceStatus,
          ruleResults: (latestAssessment?.validationResults as RuleEvaluationResultDto[]) || [],
          recommendations: [],
          assessedAt: mapping.lastAssessedAt?.toISOString() || new Date().toISOString(),
          assessmentType: latestAssessment?.assessmentType || AssessmentType.AUTOMATIC,
        };
      }),
    );

    return {
      assetType,
      assetId,
      totalRequirements,
      compliantCount,
      nonCompliantCount,
      partiallyCompliantCount,
      notAssessedCount,
      requiresReviewCount,
      notApplicableCount,
      overallCompliancePercentage,
      requirements,
    };
  }

  /**
   * Get compliance gaps for an asset
   */
  async getComplianceGaps(assetType: AssetType, assetId: string): Promise<ComplianceGapDto[]> {
    const mappings = await this.mappingRepository.find({
      where: { assetType, assetId },
      relations: ['requirement'],
    });

    const nonCompliantMappings = mappings.filter(
      (m) =>
        m.complianceStatus === ComplianceStatus.NON_COMPLIANT ||
        m.complianceStatus === ComplianceStatus.PARTIALLY_COMPLIANT,
    );

    const gaps: ComplianceGapDto[] = await Promise.all(
      nonCompliantMappings.map(async (mapping) => {
        const latestAssessment = await this.assessmentRepository.findOne({
          where: { assetType, assetId, requirementId: mapping.requirementId },
          order: { assessedAt: 'DESC' },
        });

        const failedRules = ((latestAssessment?.validationResults as RuleEvaluationResultDto[]) || []).filter(
          (r) => r.status === ComplianceStatus.NON_COMPLIANT || r.status === ComplianceStatus.PARTIALLY_COMPLIANT,
        );

        const recommendations = this.generateRecommendations(failedRules, await this.getAsset(assetType, assetId));

        return {
          requirementId: mapping.requirementId,
          requirementTitle: mapping.requirement?.title || 'Unknown',
          requirementCode: mapping.requirement?.requirementCode || '',
          currentStatus: mapping.complianceStatus,
          gapDescription: `Asset does not meet requirements for ${mapping.requirement?.title}`,
          recommendations,
          missingFields: [],
          failedRules,
        };
      }),
    );

    return gaps;
  }

  /**
   * Generate recommendations from rule results
   */
  private generateRecommendations(ruleResults: RuleEvaluationResultDto[], asset: any): string[] {
    const recommendations: string[] = [];

    ruleResults.forEach((result) => {
      if (result.status === ComplianceStatus.NON_COMPLIANT) {
        recommendations.push(`Fix issue identified by rule: ${result.ruleName} - ${result.message}`);
      } else if (result.status === ComplianceStatus.PARTIALLY_COMPLIANT) {
        recommendations.push(`Improve compliance for rule: ${result.ruleName} - ${result.message}`);
      }
    });

    return recommendations;
  }

  /**
   * Bulk assess multiple assets
   */
  async bulkAssess(assetType: AssetType, assetIds: string[], assessedById?: string): Promise<BulkAssessmentResultDto> {
    const results: AssessmentResultDto[] = [];
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        const assetResults = await this.assessAsset(assetType, assetId, assessedById);
        results.push(...assetResults);
      } catch (error: any) {
        errors.push(`Failed to assess ${assetType} asset ${assetId}: ${error.message}`);
      }
    }

    return {
      totalAssessed: assetIds.length,
      successful: assetIds.length - errors.length,
      failed: errors.length,
      errors,
      results,
    };
  }

  /**
   * Create a new validation rule
   */
  async createValidationRule(
    createDto: CreateValidationRuleDto,
    createdById: string,
  ): Promise<ValidationRuleResponseDto> {
    // Verify requirement exists
    const requirement = await this.requirementsRepository.findOne({
      where: { id: createDto.requirementId },
    });
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${createDto.requirementId} not found`);
    }

    const rule = this.rulesRepository.create({
      ...createDto,
      createdById,
      priority: createDto.priority ?? 0,
      isActive: createDto.isActive ?? true,
    });

    const savedRule = await this.rulesRepository.save(rule);
    return this.toValidationRuleResponseDto(savedRule);
  }

  /**
   * Get all validation rules
   */
  async findAllValidationRules(requirementId?: string, assetType?: AssetType): Promise<ValidationRuleResponseDto[]> {
    const where: any = {};
    if (requirementId) where.requirementId = requirementId;
    if (assetType) where.assetType = assetType;

    const rules = await this.rulesRepository.find({
      where,
      relations: ['requirement', 'createdBy'],
      order: { priority: 'DESC', createdAt: 'DESC' },
    });

    return rules.map((rule) => this.toValidationRuleResponseDto(rule));
  }

  /**
   * Get a validation rule by ID
   */
  async findValidationRuleById(id: string): Promise<ValidationRuleResponseDto> {
    const rule = await this.rulesRepository.findOne({
      where: { id },
      relations: ['requirement', 'createdBy'],
    });

    if (!rule) {
      throw new NotFoundException(`Validation rule with ID ${id} not found`);
    }

    return this.toValidationRuleResponseDto(rule);
  }

  /**
   * Update a validation rule
   */
  async updateValidationRule(
    id: string,
    updateDto: UpdateValidationRuleDto,
  ): Promise<ValidationRuleResponseDto> {
    const rule = await this.rulesRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Validation rule with ID ${id} not found`);
    }

    // Update fields
    if (updateDto.ruleName !== undefined) rule.ruleName = updateDto.ruleName;
    if (updateDto.ruleDescription !== undefined) rule.ruleDescription = updateDto.ruleDescription;
    if (updateDto.validationLogic !== undefined) rule.validationLogic = updateDto.validationLogic as any;
    if (updateDto.priority !== undefined) rule.priority = updateDto.priority;
    if (updateDto.isActive !== undefined) rule.isActive = updateDto.isActive;

    const updatedRule = await this.rulesRepository.save(rule);
    return this.toValidationRuleResponseDto(updatedRule);
  }

  /**
   * Delete a validation rule
   */
  async deleteValidationRule(id: string): Promise<void> {
    const result = await this.rulesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Validation rule with ID ${id} not found`);
    }
  }

  /**
   * Convert rule entity to response DTO
   */
  private toValidationRuleResponseDto(rule: ComplianceValidationRule): ValidationRuleResponseDto {
    return {
      id: rule.id,
      requirementId: rule.requirementId,
      requirementTitle: rule.requirement?.title,
      requirementCode: rule.requirement?.requirementCode,
      assetType: rule.assetType,
      ruleName: rule.ruleName,
      ruleDescription: rule.ruleDescription,
      validationLogic: rule.validationLogic,
      priority: rule.priority,
      isActive: rule.isActive,
      createdById: rule.createdById,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    };
  }

  /**
   * Get list of all assets with their compliance status and linked controls
   * Supports filtering and pagination
   */
  async getAssetComplianceList(
    filters: {
      assetType?: AssetType;
      complianceStatus?: ComplianceStatus;
      businessUnit?: string;
      criticality?: string;
      searchQuery?: string;
    },
    pagination: { page: number; pageSize: number },
  ): Promise<any> {
    try {
      const { page = 1, pageSize = 20 } = pagination;
      const skip = (page - 1) * pageSize;

      // Build WHERE clause and parameters
      const whereConditions: string[] = [];
      const queryParams: any[] = [];
      let paramCounter = 1;

      if (filters.assetType) {
        whereConditions.push(`asset_type = $${paramCounter++}`);
        queryParams.push(filters.assetType);
      }
      if (filters.complianceStatus) {
        whereConditions.push(`compliance_status = $${paramCounter++}`);
        queryParams.push(filters.complianceStatus);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Add pagination parameters
      const limitParam = paramCounter;
      const offsetParam = paramCounter + 1;
      queryParams.push(pageSize, skip);

      // Query to get paginated results with asset details
      const allAssets = await this.mappingRepository.query(
        `
        WITH asset_compliance AS (
          SELECT 
            arm.asset_type,
            arm.asset_id,
            COUNT(*) as total_requirements,
            COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) as compliant_count,
            COUNT(CASE WHEN arm.compliance_status = 'non_compliant' THEN 1 END) as non_compliant_count,
            COUNT(CASE WHEN arm.compliance_status = 'partially_compliant' THEN 1 END) as partially_compliant_count,
            COUNT(CASE WHEN arm.compliance_status = 'not_assessed' THEN 1 END) as not_assessed_count,
            COUNT(CASE WHEN arm.compliance_status = 'requires_review' THEN 1 END) as requires_review_count,
            COUNT(CASE WHEN arm.compliance_status = 'not_applicable' THEN 1 END) as not_applicable_count,
            CASE 
              WHEN COUNT(*) = 0 THEN 0
              ELSE ROUND(100.0 * COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) / COUNT(*), 2)
            END as compliance_percentage,
            MAX(arm.created_at) as last_assessment_date,
            CASE
              WHEN COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) = COUNT(*) THEN 'compliant'
              WHEN COUNT(CASE WHEN arm.compliance_status = 'non_compliant' THEN 1 END) > 0 THEN 'non_compliant'
              WHEN COUNT(CASE WHEN arm.compliance_status = 'partially_compliant' THEN 1 END) > 0 THEN 'partially_compliant'
              ELSE 'not_assessed'
            END as overall_status
          FROM asset_requirement_mapping arm
          ${whereClause}
          GROUP BY arm.asset_type, arm.asset_id
        ),
        asset_details AS (
          SELECT 
            ac.asset_type,
            ac.asset_id,
            ac.total_requirements,
            ac.compliant_count,
            ac.non_compliant_count,
            ac.partially_compliant_count,
            ac.not_assessed_count,
            ac.requires_review_count,
            ac.not_applicable_count,
            ac.compliance_percentage,
            ac.last_assessment_date,
            ac.overall_status,
            COALESCE(pa.asset_description, ia.name, sa.software_name, 'Unknown') as asset_name,
            COALESCE(pa.unique_identifier, ia.unique_identifier, sa.unique_identifier, 'N/A') as asset_identifier,
            COALESCE(pa.asset_description, ia.description, sa.description, '') as description,
            COALESCE(pa.criticality_level::text, ia.criticality_level::text, sa."criticalityLevel"::text, '') as criticality,
            COALESCE(pa.department, sa.business_unit, '') as business_unit
          FROM asset_compliance ac
          LEFT JOIN physical_assets pa ON ac.asset_type = 'physical' AND ac.asset_id = pa.id
          LEFT JOIN information_assets ia ON ac.asset_type = 'information' AND ac.asset_id = ia.id
          LEFT JOIN software_assets sa ON ac.asset_type = 'software' AND ac.asset_id = sa.id
        )
        SELECT * FROM asset_details
        LIMIT $${limitParam} OFFSET $${offsetParam}
        `,
        queryParams,
      );

      // Query to get total count (without pagination)
      const countParams = queryParams.slice(0, paramCounter - 1); // Only filter params, not pagination
      const totalResult = await this.mappingRepository.query(
        `
        SELECT COUNT(*) as total
        FROM (
          SELECT DISTINCT asset_type, asset_id
          FROM asset_requirement_mapping
          ${whereClause}
        ) as distinct_assets
        `,
        countParams,
      );

      const total = parseInt(totalResult[0]?.total || '0', 10);

      // Transform snake_case to camelCase
      const transformedAssets = (allAssets || []).map((asset: any) => ({
        assetId: asset.asset_id,
        assetType: asset.asset_type,
        assetName: asset.asset_name,
        assetIdentifier: asset.asset_identifier,
        description: asset.description,
        criticality: asset.criticality,
        businessUnit: asset.business_unit,
        totalRequirements: asset.total_requirements,
        compliantCount: asset.compliant_count,
        nonCompliantCount: asset.non_compliant_count,
        partiallyCompliantCount: asset.partially_compliant_count,
        notAssessedCount: asset.not_assessed_count,
        requiresReviewCount: asset.requires_review_count,
        notApplicableCount: asset.not_applicable_count,
        compliancePercentage: asset.compliance_percentage,
        lastAssessmentDate: asset.last_assessment_date,
        overallStatus: asset.overall_status,
      }));

      return {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        assets: transformedAssets,
        complianceSummary: {
          totalAssets: total,
          compliantAssets: transformedAssets.filter((a: any) => a.overallStatus === 'compliant').length,
          nonCompliantAssets: transformedAssets.filter((a: any) => a.overallStatus === 'non_compliant').length,
          partiallyCompliantAssets: transformedAssets.filter(
            (a: any) => a.overallStatus === 'partially_compliant',
          ).length,
          averageCompliancePercentage:
            transformedAssets.length > 0
              ? Math.round(
                  transformedAssets.reduce((sum: number, a: any) => sum + parseFloat(a.compliancePercentage || 0), 0) /
                    transformedAssets.length,
                )
              : 0,
        },
      };
    } catch (error: any) {
      console.error('Error in getAssetComplianceList:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to fetch asset compliance list: ${error.message}`);
    }
  }
}

