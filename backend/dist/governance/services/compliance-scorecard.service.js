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
exports.ComplianceScorecardService = exports.ComplianceStatus = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const assessment_entity_1 = require("../assessments/entities/assessment.entity");
const assessment_result_entity_1 = require("../assessments/entities/assessment-result.entity");
const framework_control_mapping_entity_1 = require("../unified-controls/entities/framework-control-mapping.entity");
const framework_requirement_entity_1 = require("../unified-controls/entities/framework-requirement.entity");
const compliance_framework_entity_1 = require("../../common/entities/compliance-framework.entity");
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["MET"] = "met";
    ComplianceStatus["NOT_MET"] = "not_met";
    ComplianceStatus["PARTIALLY_MET"] = "partially_met";
    ComplianceStatus["NOT_APPLICABLE"] = "not_applicable";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
let ComplianceScorecardService = class ComplianceScorecardService {
    constructor(controlRepository, assessmentRepository, assessmentResultRepository, mappingRepository, requirementRepository, frameworkRepository) {
        this.controlRepository = controlRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.mappingRepository = mappingRepository;
        this.requirementRepository = requirementRepository;
        this.frameworkRepository = frameworkRepository;
    }
    async generateScorecard(frameworkIds) {
        const frameworks = frameworkIds
            ? await this.frameworkRepository.find({ where: { id: (0, typeorm_2.In)(frameworkIds) } })
            : await this.frameworkRepository.find();
        const frameworkScorecards = [];
        for (const framework of frameworks) {
            const scorecard = await this.calculateFrameworkScorecard(framework.id, framework.name, framework.code);
            if (scorecard) {
                frameworkScorecards.push(scorecard);
            }
        }
        const totalRequirements = frameworkScorecards.reduce((sum, fw) => sum + fw.totalRequirements, 0);
        const totalMet = frameworkScorecards.reduce((sum, fw) => sum + fw.metRequirements, 0);
        const totalNotMet = frameworkScorecards.reduce((sum, fw) => sum + fw.notMetRequirements, 0);
        const averageCompliance = frameworkScorecards.length > 0
            ? frameworkScorecards.reduce((sum, fw) => sum + fw.overallCompliance, 0) / frameworkScorecards.length
            : 0;
        return {
            generatedAt: new Date(),
            frameworks: frameworkScorecards,
            overallCompliance: averageCompliance,
            summary: {
                totalFrameworks: frameworkScorecards.length,
                totalRequirements,
                totalMet,
                totalNotMet,
                averageCompliance: Math.round(averageCompliance),
            },
        };
    }
    async calculateFrameworkScorecard(frameworkId, frameworkName, frameworkCode) {
        const requirements = await this.requirementRepository.find({
            where: { framework_id: frameworkId },
            order: { display_order: 'ASC' },
        });
        if (requirements.length === 0) {
            return null;
        }
        const mappings = await this.mappingRepository
            .createQueryBuilder('mapping')
            .leftJoinAndSelect('mapping.unified_control', 'control')
            .leftJoinAndSelect('mapping.framework_requirement', 'requirement')
            .where('requirement.framework_id = :frameworkId', { frameworkId })
            .getMany();
        const domainMap = new Map();
        for (const req of requirements) {
            const domain = req.domain || 'Other';
            if (!domainMap.has(domain)) {
                domainMap.set(domain, []);
            }
            domainMap.get(domain).push(req);
        }
        const requirementStatuses = new Map();
        for (const req of requirements) {
            const reqMappings = mappings.filter((m) => { var _a; return ((_a = m.framework_requirement) === null || _a === void 0 ? void 0 : _a.id) === req.id; });
            if (reqMappings.length === 0) {
                requirementStatuses.set(req.id, ComplianceStatus.NOT_MET);
            }
            else {
                const allControls = reqMappings.map((m) => m.unified_control).filter(Boolean);
                const fullCoverageMappings = reqMappings.filter((m) => m.coverage_level === framework_control_mapping_entity_1.MappingCoverage.FULL);
                const partialCoverageMappings = reqMappings.filter((m) => m.coverage_level === framework_control_mapping_entity_1.MappingCoverage.PARTIAL);
                const notApplicableMappings = reqMappings.filter((m) => m.coverage_level === framework_control_mapping_entity_1.MappingCoverage.NOT_APPLICABLE);
                if (notApplicableMappings.length === reqMappings.length) {
                    requirementStatuses.set(req.id, ComplianceStatus.NOT_APPLICABLE);
                }
                else {
                    const implementedCount = allControls.filter((c) => (c === null || c === void 0 ? void 0 : c.implementation_status) === unified_control_entity_1.ImplementationStatus.IMPLEMENTED).length;
                    const partialCount = allControls.filter((c) => (c === null || c === void 0 ? void 0 : c.implementation_status) === unified_control_entity_1.ImplementationStatus.IN_PROGRESS).length;
                    if (fullCoverageMappings.length > 0 && implementedCount === fullCoverageMappings.length) {
                        requirementStatuses.set(req.id, ComplianceStatus.MET);
                    }
                    else if (implementedCount > 0 || partialCount > 0 || partialCoverageMappings.length > 0) {
                        requirementStatuses.set(req.id, ComplianceStatus.PARTIALLY_MET);
                    }
                    else {
                        requirementStatuses.set(req.id, ComplianceStatus.NOT_MET);
                    }
                }
            }
        }
        const domainBreakdown = [];
        for (const [domain, domainReqs] of domainMap.entries()) {
            const met = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.MET).length;
            const notMet = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_MET).length;
            const partiallyMet = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.PARTIALLY_MET).length;
            const notApplicable = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_APPLICABLE).length;
            domainBreakdown.push({
                domain,
                totalRequirements: domainReqs.length,
                met,
                notMet,
                partiallyMet,
                notApplicable,
                compliancePercentage: domainReqs.length > 0
                    ? Math.round(((met + notApplicable) / domainReqs.length) * 100)
                    : 0,
            });
        }
        const controlIds = mappings.map((m) => { var _a; return (_a = m.unified_control) === null || _a === void 0 ? void 0 : _a.id; }).filter(Boolean);
        const controls = controlIds.length > 0
            ? await this.controlRepository.find({ where: { id: (0, typeorm_2.In)(controlIds) } })
            : [];
        const implementationStatus = {
            implemented: controls.filter((c) => c.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED).length,
            inProgress: controls.filter((c) => c.implementation_status === unified_control_entity_1.ImplementationStatus.IN_PROGRESS).length,
            planned: controls.filter((c) => c.implementation_status === unified_control_entity_1.ImplementationStatus.PLANNED).length,
            notImplemented: controls.filter((c) => c.implementation_status === unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED).length,
        };
        const assessments = await this.assessmentRepository.find({
            where: { status: (0, typeorm_2.In)([assessment_entity_1.AssessmentStatus.COMPLETED, assessment_entity_1.AssessmentStatus.IN_PROGRESS]) },
        });
        const frameworkAssessments = assessments.filter((a) => {
            return a.selected_framework_ids && a.selected_framework_ids.includes(frameworkId);
        });
        const completedAssessments = frameworkAssessments.filter((a) => a.status === assessment_entity_1.AssessmentStatus.COMPLETED);
        const inProgressAssessments = frameworkAssessments.filter((a) => a.status === assessment_entity_1.AssessmentStatus.IN_PROGRESS);
        const allResults = await this.assessmentResultRepository.find({
            where: { assessment_id: (0, typeorm_2.In)(completedAssessments.map((a) => a.id)) },
        });
        const assessmentResults = allResults.filter((r) => controlIds.includes(r.unified_control_id));
        const averageScore = assessmentResults.length > 0
            ? Math.round(assessmentResults.reduce((sum, r) => sum + (r.effectiveness_rating || 0), 0) /
                assessmentResults.length)
            : 0;
        const gaps = {
            total: requirements.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_MET).length,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };
        const metCount = Array.from(requirementStatuses.values()).filter((s) => s === ComplianceStatus.MET).length;
        const notApplicableCount = Array.from(requirementStatuses.values()).filter((s) => s === ComplianceStatus.NOT_APPLICABLE).length;
        const overallCompliance = requirements.length > 0
            ? Math.round(((metCount + notApplicableCount) / requirements.length) * 100)
            : 0;
        const trend = await this.calculateTrend(frameworkId, overallCompliance);
        return {
            frameworkId,
            frameworkName,
            frameworkCode,
            overallCompliance,
            totalRequirements: requirements.length,
            metRequirements: metCount,
            notMetRequirements: gaps.total,
            partiallyMetRequirements: Array.from(requirementStatuses.values()).filter((s) => s === ComplianceStatus.PARTIALLY_MET).length,
            notApplicableRequirements: notApplicableCount,
            breakdownByDomain: domainBreakdown,
            controlImplementationStatus: implementationStatus,
            assessmentResults: {
                completed: completedAssessments.length,
                inProgress: inProgressAssessments.length,
                averageScore,
            },
            gaps,
            trend,
        };
    }
    async calculateTrend(frameworkId, currentCompliance) {
        const mappings = await this.mappingRepository
            .createQueryBuilder('mapping')
            .leftJoinAndSelect('mapping.unified_control', 'control')
            .leftJoinAndSelect('mapping.framework_requirement', 'requirement')
            .where('requirement.framework_id = :frameworkId', { frameworkId })
            .getMany();
        const controlIds = mappings.map((m) => { var _a; return (_a = m.unified_control) === null || _a === void 0 ? void 0 : _a.id; }).filter(Boolean);
        if (controlIds.length === 0) {
            return undefined;
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const controls = await this.controlRepository.find({
            where: { id: (0, typeorm_2.In)(controlIds) },
        });
        const recentlyImplemented = controls.filter((c) => {
            if (c.implementation_status !== unified_control_entity_1.ImplementationStatus.IMPLEMENTED)
                return false;
            if (!c.updated_at)
                return false;
            return new Date(c.updated_at) >= thirtyDaysAgo;
        }).length;
        const totalControls = controls.length;
        const previouslyImplemented = controls.filter((c) => c.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED).length - recentlyImplemented;
        const previousCompliance = totalControls > 0
            ? Math.round((previouslyImplemented / totalControls) * 100)
            : currentCompliance;
        const change = currentCompliance - previousCompliance;
        let trend = 'stable';
        if (change > 2) {
            trend = 'improving';
        }
        else if (change < -2) {
            trend = 'declining';
        }
        return {
            previousPeriod: previousCompliance,
            change: Math.round(change),
            trend,
        };
    }
};
exports.ComplianceScorecardService = ComplianceScorecardService;
exports.ComplianceScorecardService = ComplianceScorecardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(2, (0, typeorm_1.InjectRepository)(assessment_result_entity_1.AssessmentResult)),
    __param(3, (0, typeorm_1.InjectRepository)(framework_control_mapping_entity_1.FrameworkControlMapping)),
    __param(4, (0, typeorm_1.InjectRepository)(framework_requirement_entity_1.FrameworkRequirement)),
    __param(5, (0, typeorm_1.InjectRepository)(compliance_framework_entity_1.ComplianceFramework)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ComplianceScorecardService);
//# sourceMappingURL=compliance-scorecard.service.js.map