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
exports.RiskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_entity_1 = require("../entities/risk.entity");
const risk_asset_link_entity_1 = require("../entities/risk-asset-link.entity");
const risk_control_link_entity_1 = require("../entities/risk-control-link.entity");
const risk_treatment_entity_1 = require("../entities/risk-treatment.entity");
const kri_risk_link_entity_1 = require("../entities/kri-risk-link.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
const risk_settings_service_1 = require("./risk-settings.service");
let RiskService = class RiskService {
    constructor(riskRepository, assetLinkRepository, controlLinkRepository, treatmentRepository, kriLinkRepository, workflowService, riskSettingsService) {
        this.riskRepository = riskRepository;
        this.assetLinkRepository = assetLinkRepository;
        this.controlLinkRepository = controlLinkRepository;
        this.treatmentRepository = treatmentRepository;
        this.kriLinkRepository = kriLinkRepository;
        this.workflowService = workflowService;
        this.riskSettingsService = riskSettingsService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        let queryBuilder = this.riskRepository.createQueryBuilder('risk')
            .leftJoinAndSelect('risk.owner', 'owner')
            .leftJoinAndSelect('risk.risk_category', 'risk_category')
            .leftJoinAndSelect('risk.risk_analyst', 'risk_analyst')
            .where('risk.deleted_at IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(risk.title ILIKE :search OR risk.description ILIKE :search OR risk.risk_id ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.status) {
            queryBuilder.andWhere('risk.status = :status', { status: query.status });
        }
        if (query === null || query === void 0 ? void 0 : query.category) {
            queryBuilder.andWhere('risk.category = :category', { category: query.category });
        }
        if (query === null || query === void 0 ? void 0 : query.category_id) {
            queryBuilder.andWhere('risk.category_id = :category_id', { category_id: query.category_id });
        }
        if ((query === null || query === void 0 ? void 0 : query.likelihood) !== undefined) {
            queryBuilder.andWhere('risk.likelihood = :likelihood', { likelihood: query.likelihood });
        }
        if ((query === null || query === void 0 ? void 0 : query.impact) !== undefined) {
            queryBuilder.andWhere('risk.impact = :impact', { impact: query.impact });
        }
        if (query === null || query === void 0 ? void 0 : query.current_risk_level) {
            queryBuilder.andWhere('risk.current_risk_level = :level', { level: query.current_risk_level });
        }
        if (query === null || query === void 0 ? void 0 : query.ownerId) {
            queryBuilder.andWhere('risk.ownerId = :ownerId', { ownerId: query.ownerId });
        }
        const total = await queryBuilder.getCount();
        const risks = await queryBuilder
            .orderBy('risk.current_risk_score', 'DESC', 'NULLS LAST')
            .addOrderBy('risk.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const riskIds = risks.map(r => r.id);
        const counts = await this.getIntegrationCounts(riskIds);
        return {
            data: risks.map((risk) => this.toResponseDto(risk, counts[risk.id])),
            total,
            page,
            limit,
        };
    }
    async findOne(id, organizationId) {
        const risk = await this.riskRepository.findOne({
            where: { id },
            relations: ['owner', 'risk_category', 'risk_sub_category', 'risk_analyst'],
        });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${id} not found`);
        }
        const counts = await this.getIntegrationCounts([id]);
        const appetiteInfo = await this.enrichWithRiskAppetite(risk, organizationId);
        return this.toResponseDto(risk, counts[id], appetiteInfo);
    }
    async create(createRiskDto, userId, organizationId) {
        const riskData = Object.assign(Object.assign({ title: createRiskDto.title, description: createRiskDto.description, risk_statement: createRiskDto.risk_statement, category: createRiskDto.category, category_id: createRiskDto.category_id, sub_category_id: createRiskDto.sub_category_id, status: createRiskDto.status || risk_entity_1.RiskStatus.IDENTIFIED, likelihood: createRiskDto.likelihood || risk_entity_1.RiskLikelihood.MEDIUM, impact: createRiskDto.impact || risk_entity_1.RiskImpact.MEDIUM, ownerId: createRiskDto.ownerId || userId, risk_analyst_id: createRiskDto.risk_analyst_id, date_identified: createRiskDto.date_identified ? new Date(createRiskDto.date_identified) : new Date(), threat_source: createRiskDto.threat_source, risk_velocity: createRiskDto.risk_velocity, early_warning_signs: createRiskDto.early_warning_signs, status_notes: createRiskDto.status_notes, business_process: createRiskDto.business_process, tags: createRiskDto.tags, business_unit_ids: createRiskDto.business_unit_ids, next_review_date: createRiskDto.next_review_date ? new Date(createRiskDto.next_review_date) : undefined, inherent_likelihood: createRiskDto.inherent_likelihood, inherent_impact: createRiskDto.inherent_impact, current_likelihood: createRiskDto.current_likelihood, current_impact: createRiskDto.current_impact, target_likelihood: createRiskDto.target_likelihood, target_impact: createRiskDto.target_impact }, (organizationId && { organizationId })), { created_by: userId });
        const risk = this.riskRepository.create(riskData);
        const savedRisk = await this.riskRepository.save(risk);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.RISK, savedRisk.id, workflow_entity_1.WorkflowTrigger.ON_CREATE, {
                status: savedRisk.status,
                category: savedRisk.category,
                likelihood: savedRisk.likelihood,
                impact: savedRisk.impact,
                current_risk_level: savedRisk.current_risk_level,
            });
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        return this.toResponseDto(savedRisk);
    }
    async update(id, updateRiskDto, userId) {
        const risk = await this.riskRepository.findOne({ where: { id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${id} not found`);
        }
        const oldStatus = risk.status;
        const oldRiskLevel = risk.current_risk_level;
        const updateData = Object.assign(Object.assign({}, updateRiskDto), { updated_by: userId });
        if (updateRiskDto.date_identified)
            updateData.date_identified = new Date(updateRiskDto.date_identified);
        if (updateRiskDto.next_review_date)
            updateData.next_review_date = new Date(updateRiskDto.next_review_date);
        Object.assign(risk, updateData);
        risk.version_number = (risk.version_number || 1) + 1;
        const updatedRisk = await this.riskRepository.save(risk);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.RISK, updatedRisk.id, workflow_entity_1.WorkflowTrigger.ON_UPDATE, {
                status: updatedRisk.status,
                category: updatedRisk.category,
                likelihood: updatedRisk.likelihood,
                impact: updatedRisk.impact,
                current_risk_level: updatedRisk.current_risk_level,
            });
            if (oldStatus !== updatedRisk.status) {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.RISK, updatedRisk.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, { oldStatus, newStatus: updatedRisk.status, category: updatedRisk.category });
            }
            if (oldRiskLevel !== updatedRisk.current_risk_level) {
            }
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        const counts = await this.getIntegrationCounts([id]);
        return this.toResponseDto(updatedRisk, counts[id]);
    }
    async remove(id) {
        const risk = await this.riskRepository.findOne({ where: { id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${id} not found`);
        }
        await this.riskRepository.softDelete(id);
    }
    async bulkUpdateStatus(ids, status) {
        const risks = await this.riskRepository.find({
            where: { id: (0, typeorm_2.In)(ids) },
        });
        if (risks.length === 0) {
            throw new common_1.NotFoundException('No risks found with the provided IDs');
        }
        risks.forEach(risk => {
            risk.status = status;
        });
        const updatedRisks = await this.riskRepository.save(risks);
        return {
            updated: updatedRisks.length,
            risks: updatedRisks.map(risk => this.toResponseDto(risk)),
        };
    }
    async getHeatmapData() {
        const risks = await this.riskRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        const heatmapMap = new Map();
        let maxRiskScore = 0;
        risks.forEach((risk) => {
            const likelihood = risk.current_likelihood || Number(risk.likelihood) || 3;
            const impact = risk.current_impact || Number(risk.impact) || 3;
            const riskScore = likelihood * impact;
            maxRiskScore = Math.max(maxRiskScore, riskScore);
            const key = `${likelihood}-${impact}`;
            if (!heatmapMap.has(key)) {
                heatmapMap.set(key, {
                    count: 0,
                    riskIds: [],
                    riskLevel: this.calculateRiskLevel(riskScore),
                });
            }
            const cell = heatmapMap.get(key);
            cell.count++;
            cell.riskIds.push(risk.id);
        });
        const cells = Array.from(heatmapMap.entries()).map(([key, data]) => {
            const [likelihood, impact] = key.split('-').map(Number);
            return {
                likelihood,
                impact,
                count: data.count,
                riskScore: likelihood * impact,
                riskIds: data.riskIds,
                riskLevel: data.riskLevel,
            };
        });
        return {
            cells,
            totalRisks: risks.length,
            maxRiskScore,
        };
    }
    async getDashboardSummary(organizationId) {
        var _a, _b;
        const risks = await this.riskRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        let maxAcceptableScore = 11;
        let riskAppetiteEnabled = true;
        try {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            maxAcceptableScore = settings.max_acceptable_risk_score;
            riskAppetiteEnabled = settings.enable_risk_appetite;
        }
        catch (error) {
            console.warn('Failed to get risk settings for dashboard:', error.message);
        }
        const today = new Date();
        let critical = 0, high = 0, medium = 0, low = 0;
        let overdueReviews = 0;
        let risksExceedingAppetite = 0;
        for (const risk of risks) {
            switch (risk.current_risk_level) {
                case risk_entity_1.RiskLevel.CRITICAL:
                    critical++;
                    break;
                case risk_entity_1.RiskLevel.HIGH:
                    high++;
                    break;
                case risk_entity_1.RiskLevel.MEDIUM:
                    medium++;
                    break;
                case risk_entity_1.RiskLevel.LOW:
                    low++;
                    break;
            }
            if (risk.next_review_date && new Date(risk.next_review_date) < today) {
                overdueReviews++;
            }
            if (riskAppetiteEnabled && risk.current_risk_score && risk.current_risk_score > maxAcceptableScore) {
                risksExceedingAppetite++;
            }
        }
        const activeTreatments = await this.treatmentRepository.count({
            where: {
                status: (0, typeorm_2.In)([risk_treatment_entity_1.TreatmentStatus.PLANNED, risk_treatment_entity_1.TreatmentStatus.IN_PROGRESS]),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        const kriLinks = await this.kriLinkRepository.find({
            relations: ['kri'],
        });
        let kriRed = 0, kriAmber = 0;
        for (const link of kriLinks) {
            if (((_a = link.kri) === null || _a === void 0 ? void 0 : _a.current_status) === 'red')
                kriRed++;
            else if (((_b = link.kri) === null || _b === void 0 ? void 0 : _b.current_status) === 'amber')
                kriAmber++;
        }
        return {
            total_risks: risks.length,
            critical_risks: critical,
            high_risks: high,
            medium_risks: medium,
            low_risks: low,
            risks_exceeding_appetite: risksExceedingAppetite,
            max_acceptable_score: maxAcceptableScore,
            risk_appetite_enabled: riskAppetiteEnabled,
            overdue_reviews: overdueReviews,
            active_treatments: activeTreatments,
            kri_red_count: kriRed,
            kri_amber_count: kriAmber,
        };
    }
    async getTopRisks(limit = 10) {
        const risks = await this.riskRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'risk_category'],
            order: { current_risk_score: 'DESC' },
            take: limit,
        });
        const riskIds = risks.map(r => r.id);
        const counts = await this.getIntegrationCounts(riskIds);
        return risks.map(risk => this.toResponseDto(risk, counts[risk.id]));
    }
    async getRisksNeedingReview(days = 7) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const risks = await this.riskRepository.find({
            where: [
                { next_review_date: (0, typeorm_2.LessThan)(futureDate), deleted_at: (0, typeorm_2.IsNull)() },
            ],
            relations: ['owner', 'risk_category'],
            order: { next_review_date: 'ASC' },
        });
        return risks.map(risk => this.toResponseDto(risk));
    }
    async getIntegrationCounts(riskIds) {
        const result = {};
        riskIds.forEach(id => {
            result[id] = {
                linked_assets_count: 0,
                linked_controls_count: 0,
                active_treatments_count: 0,
                kri_count: 0,
            };
        });
        if (riskIds.length === 0)
            return result;
        const assetCounts = await this.assetLinkRepository
            .createQueryBuilder('link')
            .select('link.risk_id', 'risk_id')
            .addSelect('COUNT(*)', 'count')
            .where('link.risk_id IN (:...ids)', { ids: riskIds })
            .groupBy('link.risk_id')
            .getRawMany();
        assetCounts.forEach(row => {
            if (result[row.risk_id])
                result[row.risk_id].linked_assets_count = parseInt(row.count);
        });
        const controlCounts = await this.controlLinkRepository
            .createQueryBuilder('link')
            .select('link.risk_id', 'risk_id')
            .addSelect('COUNT(*)', 'count')
            .where('link.risk_id IN (:...ids)', { ids: riskIds })
            .groupBy('link.risk_id')
            .getRawMany();
        controlCounts.forEach(row => {
            if (result[row.risk_id])
                result[row.risk_id].linked_controls_count = parseInt(row.count);
        });
        const treatmentCounts = await this.treatmentRepository
            .createQueryBuilder('treatment')
            .select('treatment.risk_id', 'risk_id')
            .addSelect('COUNT(*)', 'count')
            .where('treatment.risk_id IN (:...ids)', { ids: riskIds })
            .andWhere('treatment.status IN (:...statuses)', { statuses: ['planned', 'in_progress'] })
            .andWhere('treatment.deleted_at IS NULL')
            .groupBy('treatment.risk_id')
            .getRawMany();
        treatmentCounts.forEach(row => {
            if (result[row.risk_id])
                result[row.risk_id].active_treatments_count = parseInt(row.count);
        });
        const kriCounts = await this.kriLinkRepository
            .createQueryBuilder('link')
            .select('link.risk_id', 'risk_id')
            .addSelect('COUNT(*)', 'count')
            .where('link.risk_id IN (:...ids)', { ids: riskIds })
            .groupBy('link.risk_id')
            .getRawMany();
        kriCounts.forEach(row => {
            if (result[row.risk_id])
                result[row.risk_id].kri_count = parseInt(row.count);
        });
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
    async checkRiskAppetite(score, organizationId) {
        try {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            const exceeds = settings.enable_risk_appetite && score > settings.max_acceptable_risk_score;
            const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
            return {
                exceeds,
                maxAcceptable: settings.max_acceptable_risk_score,
                requiresEscalation: (riskLevel === null || riskLevel === void 0 ? void 0 : riskLevel.escalation) || false,
            };
        }
        catch (error) {
            console.warn('Failed to check risk appetite:', error.message);
            return {
                exceeds: false,
                maxAcceptable: 11,
                requiresEscalation: false,
            };
        }
    }
    toResponseDto(risk, counts, riskAppetiteInfo) {
        var _a, _b;
        return {
            id: risk.id,
            risk_id: risk.risk_id,
            title: risk.title,
            description: risk.description,
            risk_statement: risk.risk_statement,
            category: risk.category,
            category_id: risk.category_id,
            category_name: (_a = risk.risk_category) === null || _a === void 0 ? void 0 : _a.name,
            sub_category_id: risk.sub_category_id,
            sub_category_name: (_b = risk.risk_sub_category) === null || _b === void 0 ? void 0 : _b.name,
            status: risk.status,
            likelihood: risk.likelihood,
            impact: risk.impact,
            ownerId: risk.ownerId,
            owner_name: risk.owner
                ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
                : undefined,
            risk_analyst_id: risk.risk_analyst_id,
            risk_analyst_name: risk.risk_analyst
                ? `${risk.risk_analyst.firstName || ''} ${risk.risk_analyst.lastName || ''}`.trim()
                : undefined,
            date_identified: risk.date_identified ? (risk.date_identified instanceof Date ? risk.date_identified.toISOString() : new Date(risk.date_identified).toISOString()) : undefined,
            next_review_date: risk.next_review_date ? (risk.next_review_date instanceof Date ? risk.next_review_date.toISOString() : new Date(risk.next_review_date).toISOString()) : undefined,
            last_review_date: risk.last_review_date ? (risk.last_review_date instanceof Date ? risk.last_review_date.toISOString() : new Date(risk.last_review_date).toISOString()) : undefined,
            threat_source: risk.threat_source,
            risk_velocity: risk.risk_velocity,
            early_warning_signs: risk.early_warning_signs,
            status_notes: risk.status_notes,
            business_process: risk.business_process,
            tags: risk.tags,
            business_unit_ids: risk.business_unit_ids,
            version_number: risk.version_number,
            inherent_likelihood: risk.inherent_likelihood,
            inherent_impact: risk.inherent_impact,
            inherent_risk_score: risk.inherent_risk_score,
            inherent_risk_level: risk.inherent_risk_level,
            current_likelihood: risk.current_likelihood,
            current_impact: risk.current_impact,
            current_risk_score: risk.current_risk_score,
            current_risk_level: risk.current_risk_level,
            target_likelihood: risk.target_likelihood,
            target_impact: risk.target_impact,
            target_risk_score: risk.target_risk_score,
            target_risk_level: risk.target_risk_level,
            control_effectiveness: risk.control_effectiveness,
            linked_assets_count: counts === null || counts === void 0 ? void 0 : counts.linked_assets_count,
            linked_controls_count: counts === null || counts === void 0 ? void 0 : counts.linked_controls_count,
            active_treatments_count: counts === null || counts === void 0 ? void 0 : counts.active_treatments_count,
            kri_count: counts === null || counts === void 0 ? void 0 : counts.kri_count,
            exceeds_risk_appetite: riskAppetiteInfo === null || riskAppetiteInfo === void 0 ? void 0 : riskAppetiteInfo.exceeds_risk_appetite,
            requires_escalation: riskAppetiteInfo === null || riskAppetiteInfo === void 0 ? void 0 : riskAppetiteInfo.requires_escalation,
            recommended_response_time: riskAppetiteInfo === null || riskAppetiteInfo === void 0 ? void 0 : riskAppetiteInfo.recommended_response_time,
            risk_level_color: riskAppetiteInfo === null || riskAppetiteInfo === void 0 ? void 0 : riskAppetiteInfo.risk_level_color,
            createdAt: risk.createdAt ? (risk.createdAt instanceof Date ? risk.createdAt.toISOString() : new Date(risk.createdAt).toISOString()) : undefined,
            updatedAt: risk.updatedAt ? (risk.updatedAt instanceof Date ? risk.updatedAt.toISOString() : new Date(risk.updatedAt).toISOString()) : undefined,
        };
    }
    async enrichWithRiskAppetite(risk, organizationId) {
        const score = risk.current_risk_score || (risk.current_likelihood && risk.current_impact ? risk.current_likelihood * risk.current_impact : null);
        if (!score) {
            return {};
        }
        try {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
            return {
                exceeds_risk_appetite: settings.enable_risk_appetite && score > settings.max_acceptable_risk_score,
                requires_escalation: (riskLevel === null || riskLevel === void 0 ? void 0 : riskLevel.escalation) || false,
                recommended_response_time: riskLevel === null || riskLevel === void 0 ? void 0 : riskLevel.responseTime,
                risk_level_color: riskLevel === null || riskLevel === void 0 ? void 0 : riskLevel.color,
            };
        }
        catch (error) {
            console.warn('Failed to enrich with risk appetite:', error.message);
            return {};
        }
    }
    async getRisksExceedingAppetite(organizationId) {
        try {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            if (!settings.enable_risk_appetite) {
                return [];
            }
            const risks = await this.riskRepository
                .createQueryBuilder('risk')
                .leftJoinAndSelect('risk.owner', 'owner')
                .leftJoinAndSelect('risk.risk_category', 'risk_category')
                .where('risk.deleted_at IS NULL')
                .andWhere('risk.current_risk_score > :threshold', { threshold: settings.max_acceptable_risk_score })
                .orderBy('risk.current_risk_score', 'DESC')
                .getMany();
            const riskIds = risks.map(r => r.id);
            const counts = await this.getIntegrationCounts(riskIds);
            return Promise.all(risks.map(async (risk) => {
                const appetiteInfo = await this.enrichWithRiskAppetite(risk, organizationId);
                return this.toResponseDto(risk, counts[risk.id], appetiteInfo);
            }));
        }
        catch (error) {
            console.error('Error getting risks exceeding appetite:', error);
            return [];
        }
    }
};
exports.RiskService = RiskService;
exports.RiskService = RiskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_asset_link_entity_1.RiskAssetLink)),
    __param(2, (0, typeorm_1.InjectRepository)(risk_control_link_entity_1.RiskControlLink)),
    __param(3, (0, typeorm_1.InjectRepository)(risk_treatment_entity_1.RiskTreatment)),
    __param(4, (0, typeorm_1.InjectRepository)(kri_risk_link_entity_1.KRIRiskLink)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_service_1.WorkflowService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        risk_settings_service_1.RiskSettingsService])
], RiskService);
//# sourceMappingURL=risk.service.js.map