"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceAssessmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_requirement_mapping_entity_1 = require("../entities/asset-requirement-mapping.entity");
const compliance_validation_rule_entity_1 = require("../entities/compliance-validation-rule.entity");
const compliance_assessment_entity_1 = require("../entities/compliance-assessment.entity");
const compliance_requirement_entity_1 = require("../entities/compliance-requirement.entity");
const physical_asset_service_1 = require("../../asset/services/physical-asset.service");
const information_asset_service_1 = require("../../asset/services/information-asset.service");
const business_application_service_1 = require("../../asset/services/business-application.service");
const software_asset_service_1 = require("../../asset/services/software-asset.service");
const supplier_service_1 = require("../../asset/services/supplier.service");
let ComplianceAssessmentService = class ComplianceAssessmentService {
    constructor(mappingRepository, rulesRepository, assessmentRepository, requirementsRepository, physicalAssetService, informationAssetService, businessApplicationService, softwareAssetService, supplierService) {
        this.mappingRepository = mappingRepository;
        this.rulesRepository = rulesRepository;
        this.assessmentRepository = assessmentRepository;
        this.requirementsRepository = requirementsRepository;
        this.physicalAssetService = physicalAssetService;
        this.informationAssetService = informationAssetService;
        this.businessApplicationService = businessApplicationService;
        this.softwareAssetService = softwareAssetService;
        this.supplierService = supplierService;
    }
    async getAsset(assetType, assetId) {
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
                throw new common_1.NotFoundException(`Unknown asset type: ${assetType}`);
        }
    }
    getFieldValue(asset, fieldPath) {
        return fieldPath.split('.').reduce((obj, key) => {
            if (obj === null || obj === undefined)
                return undefined;
            return obj[key];
        }, asset);
    }
    evaluateOperator(fieldValue, operator, expectedValue) {
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
    evaluateCriteria(criteria, asset) {
        if (!criteria || criteria.length === 0) {
            return true;
        }
        return criteria.every((criterion) => {
            const fieldValue = this.getFieldValue(asset, criterion.field);
            return this.evaluateOperator(fieldValue, criterion.operator, criterion.value);
        });
    }
    evaluateRule(rule, asset) {
        const logic = rule.validationLogic;
        const conditionsMet = this.evaluateCriteria(logic.conditions || [], asset);
        if (!conditionsMet) {
            return {
                ruleId: rule.id,
                ruleName: rule.ruleName,
                applicable: false,
                status: asset_requirement_mapping_entity_1.ComplianceStatus.NOT_APPLICABLE,
                message: 'Rule conditions not met',
            };
        }
        const compliant = this.evaluateCriteria(logic.complianceCriteria || [], asset);
        if (compliant) {
            return {
                ruleId: rule.id,
                ruleName: rule.ruleName,
                applicable: true,
                status: asset_requirement_mapping_entity_1.ComplianceStatus.COMPLIANT,
                message: 'All compliance criteria met',
            };
        }
        if (logic.nonComplianceCriteria && logic.nonComplianceCriteria.length > 0) {
            const nonCompliant = this.evaluateCriteria(logic.nonComplianceCriteria, asset);
            if (nonCompliant) {
                return {
                    ruleId: rule.id,
                    ruleName: rule.ruleName,
                    applicable: true,
                    status: asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT,
                    message: 'Non-compliance criteria detected',
                };
            }
        }
        if (logic.partialComplianceCriteria && logic.partialComplianceCriteria.length > 0) {
            const partiallyCompliant = this.evaluateCriteria(logic.partialComplianceCriteria, asset);
            if (partiallyCompliant) {
                return {
                    ruleId: rule.id,
                    ruleName: rule.ruleName,
                    applicable: true,
                    status: asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT,
                    message: 'Partial compliance criteria met',
                };
            }
        }
        return {
            ruleId: rule.id,
            ruleName: rule.ruleName,
            applicable: true,
            status: asset_requirement_mapping_entity_1.ComplianceStatus.REQUIRES_REVIEW,
            message: 'Unable to determine compliance automatically',
        };
    }
    determineStatus(results) {
        const applicableResults = results.filter((r) => r.applicable);
        if (applicableResults.length === 0) {
            return asset_requirement_mapping_entity_1.ComplianceStatus.NOT_APPLICABLE;
        }
        if (applicableResults.some((r) => r.status === asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT)) {
            return asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT;
        }
        if (applicableResults.every((r) => r.status === asset_requirement_mapping_entity_1.ComplianceStatus.COMPLIANT)) {
            return asset_requirement_mapping_entity_1.ComplianceStatus.COMPLIANT;
        }
        if (applicableResults.some((r) => r.status === asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT)) {
            return asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT;
        }
        return asset_requirement_mapping_entity_1.ComplianceStatus.REQUIRES_REVIEW;
    }
    async assessAssetRequirement(assetType, assetId, requirementId, assessedById) {
        const asset = await this.getAsset(assetType, assetId);
        const requirement = await this.requirementsRepository.findOne({ where: { id: requirementId } });
        if (!requirement) {
            throw new common_1.NotFoundException(`Requirement with ID ${requirementId} not found`);
        }
        const rules = await this.rulesRepository.find({
            where: { requirementId, assetType, isActive: true },
            order: { priority: 'DESC' },
        });
        const ruleResults = rules.map((rule) => this.evaluateRule(rule, asset));
        const status = this.determineStatus(ruleResults);
        let mapping = await this.mappingRepository.findOne({
            where: { assetType, assetId, requirementId },
        });
        const previousStatus = (mapping === null || mapping === void 0 ? void 0 : mapping.complianceStatus) || asset_requirement_mapping_entity_1.ComplianceStatus.NOT_ASSESSED;
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
        }
        else {
            mapping.complianceStatus = status;
            mapping.lastAssessedAt = new Date();
            mapping.assessedById = assessedById;
            mapping.autoAssessed = true;
        }
        await this.mappingRepository.save(mapping);
        const assessment = this.assessmentRepository.create({
            assetType,
            assetId,
            requirementId,
            assessmentType: compliance_assessment_entity_1.AssessmentType.AUTOMATIC,
            previousStatus,
            newStatus: status,
            validationResults: ruleResults,
            assessedById,
        });
        await this.assessmentRepository.save(assessment);
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
            assessmentType: compliance_assessment_entity_1.AssessmentType.AUTOMATIC,
        };
    }
    async assessAsset(assetType, assetId, assessedById) {
        const asset = await this.getAsset(assetType, assetId);
        const frameworkIds = asset.complianceRequirements || [];
        if (frameworkIds.length === 0) {
            return [];
        }
        const requirements = await this.requirementsRepository
            .createQueryBuilder('requirement')
            .leftJoin('requirement.framework', 'framework')
            .where('framework.id IN (:...frameworkIds)', { frameworkIds })
            .getMany();
        const results = await Promise.all(requirements.map((req) => this.assessAssetRequirement(assetType, assetId, req.id, assessedById)));
        return results;
    }
    async getAssetComplianceStatus(assetType, assetId) {
        const mappings = await this.mappingRepository.find({
            where: { assetType, assetId },
            relations: ['requirement'],
        });
        const totalRequirements = mappings.length;
        const compliantCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.COMPLIANT).length;
        const nonCompliantCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT).length;
        const partiallyCompliantCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT).length;
        const notAssessedCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.NOT_ASSESSED).length;
        const requiresReviewCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.REQUIRES_REVIEW).length;
        const notApplicableCount = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.NOT_APPLICABLE).length;
        const overallCompliancePercentage = totalRequirements > 0 ? Math.round((compliantCount / totalRequirements) * 100) : 0;
        const requirements = await Promise.all(mappings.map(async (mapping) => {
            var _a, _b;
            const latestAssessment = await this.assessmentRepository.findOne({
                where: { assetType, assetId, requirementId: mapping.requirementId },
                order: { assessedAt: 'DESC' },
            });
            return {
                assetType,
                assetId,
                requirementId: mapping.requirementId,
                requirementTitle: ((_a = mapping.requirement) === null || _a === void 0 ? void 0 : _a.title) || 'Unknown',
                status: mapping.complianceStatus,
                ruleResults: (latestAssessment === null || latestAssessment === void 0 ? void 0 : latestAssessment.validationResults) || [],
                recommendations: [],
                assessedAt: ((_b = mapping.lastAssessedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || new Date().toISOString(),
                assessmentType: (latestAssessment === null || latestAssessment === void 0 ? void 0 : latestAssessment.assessmentType) || compliance_assessment_entity_1.AssessmentType.AUTOMATIC,
            };
        }));
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
    async getComplianceGaps(assetType, assetId) {
        const mappings = await this.mappingRepository.find({
            where: { assetType, assetId },
            relations: ['requirement'],
        });
        const nonCompliantMappings = mappings.filter((m) => m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT ||
            m.complianceStatus === asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT);
        const gaps = await Promise.all(nonCompliantMappings.map(async (mapping) => {
            var _a, _b, _c;
            const latestAssessment = await this.assessmentRepository.findOne({
                where: { assetType, assetId, requirementId: mapping.requirementId },
                order: { assessedAt: 'DESC' },
            });
            const failedRules = ((latestAssessment === null || latestAssessment === void 0 ? void 0 : latestAssessment.validationResults) || []).filter((r) => r.status === asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT || r.status === asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT);
            const recommendations = this.generateRecommendations(failedRules, await this.getAsset(assetType, assetId));
            return {
                requirementId: mapping.requirementId,
                requirementTitle: ((_a = mapping.requirement) === null || _a === void 0 ? void 0 : _a.title) || 'Unknown',
                requirementCode: ((_b = mapping.requirement) === null || _b === void 0 ? void 0 : _b.requirementCode) || '',
                currentStatus: mapping.complianceStatus,
                gapDescription: `Asset does not meet requirements for ${(_c = mapping.requirement) === null || _c === void 0 ? void 0 : _c.title}`,
                recommendations,
                missingFields: [],
                failedRules,
            };
        }));
        return gaps;
    }
    generateRecommendations(ruleResults, asset) {
        const recommendations = [];
        ruleResults.forEach((result) => {
            if (result.status === asset_requirement_mapping_entity_1.ComplianceStatus.NON_COMPLIANT) {
                recommendations.push(`Fix issue identified by rule: ${result.ruleName} - ${result.message}`);
            }
            else if (result.status === asset_requirement_mapping_entity_1.ComplianceStatus.PARTIALLY_COMPLIANT) {
                recommendations.push(`Improve compliance for rule: ${result.ruleName} - ${result.message}`);
            }
        });
        return recommendations;
    }
    async bulkAssess(assetType, assetIds, assessedById) {
        const results = [];
        const errors = [];
        for (const assetId of assetIds) {
            try {
                const assetResults = await this.assessAsset(assetType, assetId, assessedById);
                results.push(...assetResults);
            }
            catch (error) {
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
    async createValidationRule(createDto, createdById) {
        var _a, _b;
        const requirement = await this.requirementsRepository.findOne({
            where: { id: createDto.requirementId },
        });
        if (!requirement) {
            throw new common_1.NotFoundException(`Requirement with ID ${createDto.requirementId} not found`);
        }
        const rule = this.rulesRepository.create(Object.assign(Object.assign({}, createDto), { createdById, priority: (_a = createDto.priority) !== null && _a !== void 0 ? _a : 0, isActive: (_b = createDto.isActive) !== null && _b !== void 0 ? _b : true }));
        const savedRule = await this.rulesRepository.save(rule);
        return this.toValidationRuleResponseDto(savedRule);
    }
    async findAllValidationRules(requirementId, assetType) {
        const where = {};
        if (requirementId)
            where.requirementId = requirementId;
        if (assetType)
            where.assetType = assetType;
        const rules = await this.rulesRepository.find({
            where,
            relations: ['requirement', 'createdBy'],
            order: { priority: 'DESC', createdAt: 'DESC' },
        });
        return rules.map((rule) => this.toValidationRuleResponseDto(rule));
    }
    async findValidationRuleById(id) {
        const rule = await this.rulesRepository.findOne({
            where: { id },
            relations: ['requirement', 'createdBy'],
        });
        if (!rule) {
            throw new common_1.NotFoundException(`Validation rule with ID ${id} not found`);
        }
        return this.toValidationRuleResponseDto(rule);
    }
    async updateValidationRule(id, updateDto) {
        const rule = await this.rulesRepository.findOne({ where: { id } });
        if (!rule) {
            throw new common_1.NotFoundException(`Validation rule with ID ${id} not found`);
        }
        if (updateDto.ruleName !== undefined)
            rule.ruleName = updateDto.ruleName;
        if (updateDto.ruleDescription !== undefined)
            rule.ruleDescription = updateDto.ruleDescription;
        if (updateDto.validationLogic !== undefined)
            rule.validationLogic = updateDto.validationLogic;
        if (updateDto.priority !== undefined)
            rule.priority = updateDto.priority;
        if (updateDto.isActive !== undefined)
            rule.isActive = updateDto.isActive;
        const updatedRule = await this.rulesRepository.save(rule);
        return this.toValidationRuleResponseDto(updatedRule);
    }
    async deleteValidationRule(id) {
        const result = await this.rulesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Validation rule with ID ${id} not found`);
        }
    }
    toValidationRuleResponseDto(rule) {
        var _a, _b;
        return {
            id: rule.id,
            requirementId: rule.requirementId,
            requirementTitle: (_a = rule.requirement) === null || _a === void 0 ? void 0 : _a.title,
            requirementCode: (_b = rule.requirement) === null || _b === void 0 ? void 0 : _b.requirementCode,
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
    async getAssetComplianceList(filters, pagination) {
        var _a;
        try {
            const { page = 1, pageSize = 20 } = pagination;
            const skip = (page - 1) * pageSize;
            const whereConditions = [];
            const queryParams = [];
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
            const limitParam = paramCounter;
            const offsetParam = paramCounter + 1;
            queryParams.push(pageSize, skip);
            const allAssets = await this.mappingRepository.query(`
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
        `, queryParams);
            const countParams = queryParams.slice(0, paramCounter - 1);
            const totalResult = await this.mappingRepository.query(`
        SELECT COUNT(*) as total
        FROM (
          SELECT DISTINCT asset_type, asset_id
          FROM asset_requirement_mapping
          ${whereClause}
        ) as distinct_assets
        `, countParams);
            const total = parseInt(((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.total) || '0', 10);
            const transformedAssets = (allAssets || []).map((asset) => ({
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
                    compliantAssets: transformedAssets.filter((a) => a.overallStatus === 'compliant').length,
                    nonCompliantAssets: transformedAssets.filter((a) => a.overallStatus === 'non_compliant').length,
                    partiallyCompliantAssets: transformedAssets.filter((a) => a.overallStatus === 'partially_compliant').length,
                    averageCompliancePercentage: transformedAssets.length > 0
                        ? Math.round(transformedAssets.reduce((sum, a) => sum + parseFloat(a.compliancePercentage || 0), 0) /
                            transformedAssets.length)
                        : 0,
                },
            };
        }
        catch (error) {
            console.error('Error in getAssetComplianceList:', error);
            console.error('Error stack:', error.stack);
            throw new Error(`Failed to fetch asset compliance list: ${error.message}`);
        }
    }
};
exports.ComplianceAssessmentService = ComplianceAssessmentService;
exports.ComplianceAssessmentService = ComplianceAssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_requirement_mapping_entity_1.AssetRequirementMapping)),
    __param(1, (0, typeorm_1.InjectRepository)(compliance_validation_rule_entity_1.ComplianceValidationRule)),
    __param(2, (0, typeorm_1.InjectRepository)(compliance_assessment_entity_1.ComplianceAssessment)),
    __param(3, (0, typeorm_1.InjectRepository)(compliance_requirement_entity_1.ComplianceRequirement)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => physical_asset_service_1.PhysicalAssetService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => information_asset_service_1.InformationAssetService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => business_application_service_1.BusinessApplicationService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => software_asset_service_1.SoftwareAssetService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => supplier_service_1.SupplierService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        physical_asset_service_1.PhysicalAssetService,
        information_asset_service_1.InformationAssetService,
        business_application_service_1.BusinessApplicationService,
        software_asset_service_1.SoftwareAssetService,
        supplier_service_1.SupplierService])
], ComplianceAssessmentService);
//# sourceMappingURL=compliance-assessment.service.js.map