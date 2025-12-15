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
exports.RiskAssessmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_assessment_entity_1 = require("../entities/risk-assessment.entity");
const risk_entity_1 = require("../entities/risk.entity");
const risk_settings_service_1 = require("./risk-settings.service");
let RiskAssessmentService = class RiskAssessmentService {
    constructor(assessmentRepository, riskRepository, riskSettingsService) {
        this.assessmentRepository = assessmentRepository;
        this.riskRepository = riskRepository;
        this.riskSettingsService = riskSettingsService;
    }
    async findByRiskId(riskId, assessmentType) {
        const where = { risk_id: riskId };
        if (assessmentType) {
            where.assessment_type = assessmentType;
        }
        const assessments = await this.assessmentRepository.find({
            where,
            relations: ['assessor'],
            order: { assessment_date: 'DESC', created_at: 'DESC' },
        });
        return assessments.map(assessment => this.toResponseDto(assessment));
    }
    async findLatestByRiskId(riskId) {
        const assessments = await this.assessmentRepository.find({
            where: { risk_id: riskId, is_latest: true },
            relations: ['assessor'],
        });
        const result = {};
        for (const assessment of assessments) {
            result[assessment.assessment_type] = this.toResponseDto(assessment);
        }
        return result;
    }
    async findOne(id) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id },
            relations: ['assessor', 'risk'],
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Risk assessment with ID ${id} not found`);
        }
        return this.toResponseDto(assessment);
    }
    async create(createDto, userId, organizationId) {
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        if (createDto.assessment_method) {
            const isValidMethod = await this.validateAssessmentMethod(createDto.assessment_method, organizationId);
            if (!isValidMethod) {
                throw new common_1.BadRequestException(`Assessment method '${createDto.assessment_method}' is not active or does not exist`);
            }
        }
        await this.validateScaleValues(createDto.likelihood, createDto.impact, createDto.assessment_method, organizationId);
        const riskScore = createDto.likelihood * createDto.impact;
        const riskLevel = await this.calculateRiskLevelFromSettings(riskScore, organizationId);
        const exceedsAppetite = await this.riskSettingsService.exceedsRiskAppetite(riskScore, organizationId);
        const assessment = this.assessmentRepository.create(Object.assign(Object.assign({}, createDto), { assessment_date: createDto.assessment_date ? new Date(createDto.assessment_date) : new Date(), risk_score: riskScore, risk_level: riskLevel, assessor_id: userId, created_by: userId, is_latest: createDto.is_latest !== false }));
        const savedAssessment = await this.assessmentRepository.save(assessment);
        const fullAssessment = await this.assessmentRepository.findOne({
            where: { id: savedAssessment.id },
            relations: ['assessor'],
        });
        const response = this.toResponseDto(fullAssessment);
        if (exceedsAppetite) {
            response.exceeds_risk_appetite = true;
            response.appetite_warning = 'This assessment results in a risk score that exceeds the organization\'s risk appetite threshold';
        }
        return response;
    }
    async getAssessmentHistory(riskId, limit = 10) {
        const assessments = await this.assessmentRepository.find({
            where: { risk_id: riskId },
            relations: ['assessor'],
            order: { assessment_date: 'DESC', created_at: 'DESC' },
            take: limit,
        });
        return assessments.map(assessment => this.toResponseDto(assessment));
    }
    async compareAssessments(riskId) {
        const latest = await this.findLatestByRiskId(riskId);
        const result = Object.assign({}, latest);
        if (latest.inherent && latest.current) {
            result.risk_reduction_from_inherent =
                ((latest.inherent.risk_score - latest.current.risk_score) / latest.inherent.risk_score) * 100;
        }
        if (latest.current && latest.target) {
            result.gap_to_target = latest.current.risk_score - latest.target.risk_score;
        }
        return result;
    }
    async calculateRiskLevelFromSettings(score, organizationId) {
        try {
            const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
            if (riskLevel) {
                return riskLevel.level;
            }
        }
        catch (error) {
            console.warn('Failed to get risk level from settings, using defaults:', error.message);
        }
        return this.calculateRiskLevelDefault(score);
    }
    calculateRiskLevelDefault(score) {
        if (score >= 20)
            return risk_entity_1.RiskLevel.CRITICAL;
        if (score >= 12)
            return risk_entity_1.RiskLevel.HIGH;
        if (score >= 6)
            return risk_entity_1.RiskLevel.MEDIUM;
        return risk_entity_1.RiskLevel.LOW;
    }
    calculateRiskLevel(score) {
        return this.calculateRiskLevelDefault(score);
    }
    async validateAssessmentMethod(methodId, organizationId) {
        try {
            const activeMethods = await this.riskSettingsService.getActiveAssessmentMethods(organizationId);
            return activeMethods.some(m => m.id === methodId);
        }
        catch (error) {
            console.warn('Failed to validate assessment method:', error.message);
            return true;
        }
    }
    async validateScaleValues(likelihood, impact, methodId, organizationId) {
        try {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            let maxLikelihood = 5;
            let maxImpact = 5;
            if (methodId) {
                const method = settings.assessment_methods.find(m => m.id === methodId);
                if (method) {
                    maxLikelihood = method.likelihoodScale;
                    maxImpact = method.impactScale;
                }
            }
            else {
                const defaultMethod = settings.assessment_methods.find(m => m.id === settings.default_assessment_method);
                if (defaultMethod) {
                    maxLikelihood = defaultMethod.likelihoodScale;
                    maxImpact = defaultMethod.impactScale;
                }
            }
            if (likelihood < 1 || likelihood > maxLikelihood) {
                throw new common_1.BadRequestException(`Likelihood must be between 1 and ${maxLikelihood}`);
            }
            if (impact < 1 || impact > maxImpact) {
                throw new common_1.BadRequestException(`Impact must be between 1 and ${maxImpact}`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (likelihood < 1 || likelihood > 5 || impact < 1 || impact > 5) {
                throw new common_1.BadRequestException('Likelihood and impact must be between 1 and 5');
            }
        }
    }
    async getLikelihoodScaleDescriptions(organizationId) {
        return this.riskSettingsService.getLikelihoodScale(organizationId);
    }
    async getImpactScaleDescriptions(organizationId) {
        return this.riskSettingsService.getImpactScale(organizationId);
    }
    toResponseDto(assessment) {
        var _a, _b, _c, _d, _e;
        return {
            id: assessment.id,
            risk_id: assessment.risk_id,
            assessment_type: assessment.assessment_type,
            likelihood: assessment.likelihood,
            impact: assessment.impact,
            risk_score: assessment.risk_score,
            risk_level: assessment.risk_level,
            financial_impact: assessment.financial_impact,
            financial_impact_amount: assessment.financial_impact_amount,
            operational_impact: assessment.operational_impact,
            reputational_impact: assessment.reputational_impact,
            compliance_impact: assessment.compliance_impact,
            safety_impact: assessment.safety_impact,
            assessment_date: ((_b = (_a = assessment.assessment_date) === null || _a === void 0 ? void 0 : _a.toISOString) === null || _b === void 0 ? void 0 : _b.call(_a)) || ((_c = assessment.assessment_date) === null || _c === void 0 ? void 0 : _c.toString()),
            assessor_id: assessment.assessor_id,
            assessor_name: assessment.assessor
                ? `${assessment.assessor.firstName || ''} ${assessment.assessor.lastName || ''}`.trim()
                : undefined,
            assessment_method: assessment.assessment_method,
            assessment_notes: assessment.assessment_notes,
            assumptions: assessment.assumptions,
            confidence_level: assessment.confidence_level,
            evidence_attachments: assessment.evidence_attachments,
            is_latest: assessment.is_latest,
            created_at: (_d = assessment.created_at) === null || _d === void 0 ? void 0 : _d.toISOString(),
            updated_at: (_e = assessment.updated_at) === null || _e === void 0 ? void 0 : _e.toISOString(),
        };
    }
};
exports.RiskAssessmentService = RiskAssessmentService;
exports.RiskAssessmentService = RiskAssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_assessment_entity_1.RiskAssessment)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        risk_settings_service_1.RiskSettingsService])
], RiskAssessmentService);
//# sourceMappingURL=risk-assessment.service.js.map