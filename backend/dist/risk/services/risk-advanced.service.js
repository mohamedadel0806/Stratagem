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
exports.RiskAdvancedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_entity_1 = require("../entities/risk.entity");
const risk_asset_link_entity_1 = require("../entities/risk-asset-link.entity");
const risk_control_link_entity_1 = require("../entities/risk-control-link.entity");
const risk_treatment_entity_1 = require("../entities/risk-treatment.entity");
const kri_risk_link_entity_1 = require("../entities/kri-risk-link.entity");
const risk_settings_service_1 = require("./risk-settings.service");
let RiskAdvancedService = class RiskAdvancedService {
    constructor(riskRepository, assetLinkRepository, controlLinkRepository, treatmentRepository, kriLinkRepository, riskSettingsService) {
        this.riskRepository = riskRepository;
        this.assetLinkRepository = assetLinkRepository;
        this.controlLinkRepository = controlLinkRepository;
        this.treatmentRepository = treatmentRepository;
        this.kriLinkRepository = kriLinkRepository;
        this.riskSettingsService = riskSettingsService;
    }
    async compareRisks(request, organizationId) {
        const risks = await this.riskRepository.find({
            where: { id: (0, typeorm_2.In)(request.risk_ids), deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'risk_category'],
        });
        if (risks.length === 0) {
            throw new common_1.NotFoundException('No risks found with the provided IDs');
        }
        const riskIds = risks.map(r => r.id);
        const counts = await this.getIntegrationCounts(riskIds);
        const comparisonData = risks.map(risk => {
            var _a, _b, _c, _d, _e;
            const inherentScore = risk.inherent_risk_score ||
                (risk.inherent_likelihood && risk.inherent_impact ? risk.inherent_likelihood * risk.inherent_impact : null);
            const currentScore = risk.current_risk_score ||
                (risk.current_likelihood && risk.current_impact ? risk.current_likelihood * risk.current_impact : null);
            const targetScore = risk.target_risk_score ||
                (risk.target_likelihood && risk.target_impact ? risk.target_likelihood * risk.target_impact : null);
            const riskReduction = inherentScore && currentScore
                ? Math.round(((inherentScore - currentScore) / inherentScore) * 100)
                : null;
            const gapToTarget = currentScore && targetScore ? currentScore - targetScore : null;
            return {
                id: risk.id,
                risk_id: risk.risk_id,
                title: risk.title,
                category_name: (_a = risk.risk_category) === null || _a === void 0 ? void 0 : _a.name,
                status: risk.status,
                owner_name: risk.owner
                    ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
                    : undefined,
                inherent_likelihood: risk.inherent_likelihood,
                inherent_impact: risk.inherent_impact,
                inherent_risk_score: inherentScore,
                inherent_risk_level: risk.inherent_risk_level,
                current_likelihood: risk.current_likelihood,
                current_impact: risk.current_impact,
                current_risk_score: currentScore,
                current_risk_level: risk.current_risk_level,
                target_likelihood: risk.target_likelihood,
                target_impact: risk.target_impact,
                target_risk_score: targetScore,
                target_risk_level: risk.target_risk_level,
                control_effectiveness: risk.control_effectiveness,
                linked_controls_count: ((_b = counts[risk.id]) === null || _b === void 0 ? void 0 : _b.linked_controls_count) || 0,
                linked_assets_count: ((_c = counts[risk.id]) === null || _c === void 0 ? void 0 : _c.linked_assets_count) || 0,
                active_treatments_count: ((_d = counts[risk.id]) === null || _d === void 0 ? void 0 : _d.active_treatments_count) || 0,
                kri_count: ((_e = counts[risk.id]) === null || _e === void 0 ? void 0 : _e.kri_count) || 0,
                risk_reduction_percentage: riskReduction,
                gap_to_target: gapToTarget,
            };
        });
        const scores = comparisonData
            .map(r => r.current_risk_score)
            .filter((s) => s !== null && s !== undefined);
        const avgScore = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
            : 0;
        const sortedByScore = [...comparisonData]
            .filter(r => r.current_risk_score !== null && r.current_risk_score !== undefined)
            .sort((a, b) => (b.current_risk_score || 0) - (a.current_risk_score || 0));
        const highestRisk = sortedByScore[0];
        const lowestRisk = sortedByScore[sortedByScore.length - 1];
        const avgEffectiveness = comparisonData
            .map(r => r.control_effectiveness)
            .filter((e) => e !== null && e !== undefined);
        const summary = {
            total_risks: comparisonData.length,
            average_current_score: avgScore,
            highest_risk: highestRisk
                ? { id: highestRisk.id, title: highestRisk.title, score: highestRisk.current_risk_score || 0 }
                : { id: '', title: '', score: 0 },
            lowest_risk: lowestRisk
                ? { id: lowestRisk.id, title: lowestRisk.title, score: lowestRisk.current_risk_score || 0 }
                : { id: '', title: '', score: 0 },
            average_control_effectiveness: avgEffectiveness.length > 0
                ? Math.round(avgEffectiveness.reduce((a, b) => a + b, 0) / avgEffectiveness.length)
                : 0,
            total_linked_controls: comparisonData.reduce((sum, r) => sum + (r.linked_controls_count || 0), 0),
            total_active_treatments: comparisonData.reduce((sum, r) => sum + (r.active_treatments_count || 0), 0),
        };
        const comparisonMatrix = [
            {
                metric: 'Current Risk Score',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_risk_score || 0 })),
                variance: scores.length > 1 ? Math.max(...scores) - Math.min(...scores) : 0,
            },
            {
                metric: 'Current Likelihood',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_likelihood || 0 })),
            },
            {
                metric: 'Current Impact',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_impact || 0 })),
            },
            {
                metric: 'Risk Level',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_risk_level || 'unknown' })),
            },
            {
                metric: 'Control Effectiveness',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: `${r.control_effectiveness || 0}%` })),
            },
            {
                metric: 'Risk Reduction',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: `${r.risk_reduction_percentage || 0}%` })),
            },
            {
                metric: 'Gap to Target',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.gap_to_target || 0 })),
            },
            {
                metric: 'Linked Controls',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.linked_controls_count || 0 })),
            },
            {
                metric: 'Active Treatments',
                values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.active_treatments_count || 0 })),
            },
        ];
        return {
            risks: comparisonData,
            summary,
            comparison_matrix: comparisonMatrix,
        };
    }
    async simulateWhatIf(request, organizationId) {
        var _a, _b, _c;
        const risk = await this.riskRepository.findOne({
            where: { id: request.risk_id, deleted_at: (0, typeorm_2.IsNull)() },
        });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${request.risk_id} not found`);
        }
        const settings = await this.riskSettingsService.getSettings(organizationId);
        const originalLikelihood = risk.current_likelihood || Number(risk.likelihood) || 3;
        const originalImpact = risk.current_impact || Number(risk.impact) || 3;
        const originalScore = originalLikelihood * originalImpact;
        const originalLevel = await this.getRiskLevelFromSettings(originalScore, organizationId);
        const originalEffectiveness = risk.control_effectiveness || 0;
        const simulatedLikelihood = (_a = request.simulated_likelihood) !== null && _a !== void 0 ? _a : originalLikelihood;
        const simulatedImpact = (_b = request.simulated_impact) !== null && _b !== void 0 ? _b : originalImpact;
        let simulatedEffectiveness = (_c = request.simulated_control_effectiveness) !== null && _c !== void 0 ? _c : originalEffectiveness;
        if (request.additional_controls) {
            simulatedEffectiveness = Math.min(100, simulatedEffectiveness + (request.additional_controls * 10));
        }
        const baseSimulatedScore = simulatedLikelihood * simulatedImpact;
        const effectivenessReduction = simulatedEffectiveness / 100;
        const simulatedScore = Math.max(1, Math.round(baseSimulatedScore * (1 - effectivenessReduction * 0.5)));
        const simulatedLevel = await this.getRiskLevelFromSettings(simulatedScore, organizationId);
        const exceedsAppetite = settings.enable_risk_appetite &&
            simulatedScore > settings.max_acceptable_risk_score;
        const levelDetails = await this.riskSettingsService.getRiskLevelForScore(simulatedScore, organizationId);
        const recommendation = this.generateRecommendation(originalScore, simulatedScore, originalLevel, simulatedLevel, exceedsAppetite, request);
        return {
            original: {
                likelihood: originalLikelihood,
                impact: originalImpact,
                risk_score: originalScore,
                risk_level: originalLevel,
                control_effectiveness: originalEffectiveness,
            },
            simulated: {
                likelihood: simulatedLikelihood,
                impact: simulatedImpact,
                risk_score: simulatedScore,
                risk_level: simulatedLevel,
                control_effectiveness: simulatedEffectiveness,
            },
            impact_analysis: {
                score_change: simulatedScore - originalScore,
                score_change_percentage: originalScore > 0
                    ? Math.round(((simulatedScore - originalScore) / originalScore) * 100)
                    : 0,
                level_changed: originalLevel !== simulatedLevel,
                old_level: originalLevel,
                new_level: simulatedLevel,
                exceeds_appetite: exceedsAppetite,
                appetite_threshold: settings.max_acceptable_risk_score,
                recommendation,
            },
            risk_level_details: levelDetails ? {
                color: levelDetails.color,
                description: levelDetails.description,
                response_time: levelDetails.responseTime,
                requires_escalation: levelDetails.escalation,
            } : undefined,
        };
    }
    async batchWhatIf(request, organizationId) {
        const results = [];
        for (const scenario of request.scenarios) {
            const result = await this.simulateWhatIf(Object.assign({ risk_id: request.risk_id }, scenario), organizationId);
            results.push(result);
        }
        return results;
    }
    async generateCustomReport(config, organizationId) {
        let queryBuilder = this.riskRepository.createQueryBuilder('risk')
            .leftJoinAndSelect('risk.owner', 'owner')
            .leftJoinAndSelect('risk.risk_category', 'risk_category')
            .leftJoinAndSelect('risk.risk_analyst', 'risk_analyst')
            .where('risk.deleted_at IS NULL');
        if (config.risk_levels && config.risk_levels.length > 0) {
            queryBuilder.andWhere('risk.current_risk_level IN (:...levels)', { levels: config.risk_levels });
        }
        if (config.statuses && config.statuses.length > 0) {
            queryBuilder.andWhere('risk.status IN (:...statuses)', { statuses: config.statuses });
        }
        if (config.owner_ids && config.owner_ids.length > 0) {
            queryBuilder.andWhere('risk.ownerId IN (:...ownerIds)', { ownerIds: config.owner_ids });
        }
        if (config.categories && config.categories.length > 0) {
            queryBuilder.andWhere('risk.category_id IN (:...categoryIds)', { categoryIds: config.categories });
        }
        if (config.sort_by) {
            const direction = config.sort_direction || 'DESC';
            queryBuilder.orderBy(`risk.${config.sort_by}`, direction);
        }
        else {
            queryBuilder.orderBy('risk.current_risk_score', 'DESC');
        }
        const risks = await queryBuilder.getMany();
        let filteredRisks = risks;
        if (config.exceeds_appetite_only) {
            const settings = await this.riskSettingsService.getSettings(organizationId);
            filteredRisks = risks.filter(r => r.current_risk_score && r.current_risk_score > settings.max_acceptable_risk_score);
        }
        const riskIds = filteredRisks.map(r => r.id);
        const counts = await this.getIntegrationCounts(riskIds);
        const reportData = filteredRisks.map(risk => {
            var _a, _b, _c, _d, _e;
            const fullData = {
                id: risk.id,
                risk_id: risk.risk_id,
                title: risk.title,
                description: risk.description,
                risk_statement: risk.risk_statement,
                category: risk.category,
                category_name: (_a = risk.risk_category) === null || _a === void 0 ? void 0 : _a.name,
                status: risk.status,
                owner_name: risk.owner
                    ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
                    : undefined,
                analyst_name: risk.risk_analyst
                    ? `${risk.risk_analyst.firstName || ''} ${risk.risk_analyst.lastName || ''}`.trim()
                    : undefined,
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
                threat_source: risk.threat_source,
                risk_velocity: risk.risk_velocity,
                date_identified: risk.date_identified,
                next_review_date: risk.next_review_date,
                last_review_date: risk.last_review_date,
                linked_controls_count: ((_b = counts[risk.id]) === null || _b === void 0 ? void 0 : _b.linked_controls_count) || 0,
                linked_assets_count: ((_c = counts[risk.id]) === null || _c === void 0 ? void 0 : _c.linked_assets_count) || 0,
                active_treatments_count: ((_d = counts[risk.id]) === null || _d === void 0 ? void 0 : _d.active_treatments_count) || 0,
                kri_count: ((_e = counts[risk.id]) === null || _e === void 0 ? void 0 : _e.kri_count) || 0,
                created_at: risk.createdAt,
                updated_at: risk.updatedAt,
            };
            if (config.fields && config.fields.length > 0) {
                const selectedData = {};
                for (const field of config.fields) {
                    if (fullData[field] !== undefined) {
                        selectedData[field] = fullData[field];
                    }
                }
                return selectedData;
            }
            return fullData;
        });
        let summary;
        if (config.include_summary) {
            const scores = filteredRisks
                .map(r => r.current_risk_score)
                .filter((s) => s !== null && s !== undefined);
            summary = {
                total_risks: filteredRisks.length,
                average_score: scores.length > 0
                    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
                    : 0,
                max_score: scores.length > 0 ? Math.max(...scores) : 0,
                min_score: scores.length > 0 ? Math.min(...scores) : 0,
                by_level: {
                    critical: filteredRisks.filter(r => r.current_risk_level === risk_entity_1.RiskLevel.CRITICAL).length,
                    high: filteredRisks.filter(r => r.current_risk_level === risk_entity_1.RiskLevel.HIGH).length,
                    medium: filteredRisks.filter(r => r.current_risk_level === risk_entity_1.RiskLevel.MEDIUM).length,
                    low: filteredRisks.filter(r => r.current_risk_level === risk_entity_1.RiskLevel.LOW).length,
                },
                by_status: filteredRisks.reduce((acc, r) => {
                    acc[r.status] = (acc[r.status] || 0) + 1;
                    return acc;
                }, {}),
            };
        }
        let groupedData;
        if (config.group_by) {
            groupedData = reportData.reduce((acc, item) => {
                const key = String(item[config.group_by] || 'Unknown');
                if (!acc[key])
                    acc[key] = [];
                acc[key].push(item);
                return acc;
            }, {});
        }
        return {
            report_name: config.name,
            generated_at: new Date().toISOString(),
            filters_applied: {
                risk_levels: config.risk_levels,
                categories: config.categories,
                statuses: config.statuses,
                owner_ids: config.owner_ids,
                exceeds_appetite_only: config.exceeds_appetite_only,
                sort_by: config.sort_by,
                sort_direction: config.sort_direction,
                group_by: config.group_by,
            },
            data: groupedData ? [] : reportData,
            summary,
            grouped_data: groupedData,
        };
    }
    getAvailableReportFields() {
        return [
            { field: 'risk_id', label: 'Risk ID', category: 'Identification' },
            { field: 'title', label: 'Title', category: 'Identification' },
            { field: 'description', label: 'Description', category: 'Identification' },
            { field: 'risk_statement', label: 'Risk Statement', category: 'Identification' },
            { field: 'category_name', label: 'Category', category: 'Identification' },
            { field: 'status', label: 'Status', category: 'Identification' },
            { field: 'owner_name', label: 'Owner', category: 'Ownership' },
            { field: 'analyst_name', label: 'Analyst', category: 'Ownership' },
            { field: 'inherent_likelihood', label: 'Inherent Likelihood', category: 'Inherent Risk' },
            { field: 'inherent_impact', label: 'Inherent Impact', category: 'Inherent Risk' },
            { field: 'inherent_risk_score', label: 'Inherent Score', category: 'Inherent Risk' },
            { field: 'inherent_risk_level', label: 'Inherent Level', category: 'Inherent Risk' },
            { field: 'current_likelihood', label: 'Current Likelihood', category: 'Current Risk' },
            { field: 'current_impact', label: 'Current Impact', category: 'Current Risk' },
            { field: 'current_risk_score', label: 'Current Score', category: 'Current Risk' },
            { field: 'current_risk_level', label: 'Current Level', category: 'Current Risk' },
            { field: 'target_likelihood', label: 'Target Likelihood', category: 'Target Risk' },
            { field: 'target_impact', label: 'Target Impact', category: 'Target Risk' },
            { field: 'target_risk_score', label: 'Target Score', category: 'Target Risk' },
            { field: 'target_risk_level', label: 'Target Level', category: 'Target Risk' },
            { field: 'control_effectiveness', label: 'Control Effectiveness', category: 'Controls' },
            { field: 'linked_controls_count', label: 'Linked Controls', category: 'Controls' },
            { field: 'threat_source', label: 'Threat Source', category: 'Additional' },
            { field: 'risk_velocity', label: 'Risk Velocity', category: 'Additional' },
            { field: 'linked_assets_count', label: 'Linked Assets', category: 'Additional' },
            { field: 'active_treatments_count', label: 'Active Treatments', category: 'Additional' },
            { field: 'kri_count', label: 'KRIs', category: 'Additional' },
            { field: 'date_identified', label: 'Date Identified', category: 'Dates' },
            { field: 'next_review_date', label: 'Next Review', category: 'Dates' },
            { field: 'last_review_date', label: 'Last Review', category: 'Dates' },
            { field: 'created_at', label: 'Created At', category: 'Dates' },
            { field: 'updated_at', label: 'Updated At', category: 'Dates' },
        ];
    }
    async getRiskLevelFromSettings(score, organizationId) {
        try {
            const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
            return (riskLevel === null || riskLevel === void 0 ? void 0 : riskLevel.level) || this.getDefaultRiskLevel(score);
        }
        catch (_a) {
            return this.getDefaultRiskLevel(score);
        }
    }
    getDefaultRiskLevel(score) {
        if (score >= 20)
            return 'critical';
        if (score >= 12)
            return 'high';
        if (score >= 6)
            return 'medium';
        return 'low';
    }
    generateRecommendation(originalScore, simulatedScore, originalLevel, simulatedLevel, exceedsAppetite, request) {
        const recommendations = [];
        if (simulatedScore < originalScore) {
            const reduction = Math.round(((originalScore - simulatedScore) / originalScore) * 100);
            recommendations.push(`This scenario would reduce risk by ${reduction}%.`);
        }
        else if (simulatedScore > originalScore) {
            const increase = Math.round(((simulatedScore - originalScore) / originalScore) * 100);
            recommendations.push(`Warning: This scenario would increase risk by ${increase}%.`);
        }
        if (originalLevel !== simulatedLevel) {
            if (['critical', 'high'].includes(originalLevel) && ['medium', 'low'].includes(simulatedLevel)) {
                recommendations.push(`Risk level would improve from ${originalLevel} to ${simulatedLevel}.`);
            }
            else if (['medium', 'low'].includes(originalLevel) && ['critical', 'high'].includes(simulatedLevel)) {
                recommendations.push(`Warning: Risk level would worsen from ${originalLevel} to ${simulatedLevel}.`);
            }
        }
        if (exceedsAppetite) {
            recommendations.push('The simulated risk still exceeds organizational risk appetite. Additional controls or mitigation needed.');
        }
        else if (originalScore > 11 && simulatedScore <= 11) {
            recommendations.push('This scenario would bring the risk within acceptable appetite levels.');
        }
        if (request.additional_controls && request.additional_controls > 0) {
            recommendations.push(`Adding ${request.additional_controls} control(s) could achieve this result.`);
        }
        if (request.simulated_control_effectiveness && request.simulated_control_effectiveness > 50) {
            recommendations.push('Focus on improving control effectiveness through testing and monitoring.');
        }
        return recommendations.length > 0
            ? recommendations.join(' ')
            : 'No significant changes detected in this scenario.';
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
};
exports.RiskAdvancedService = RiskAdvancedService;
exports.RiskAdvancedService = RiskAdvancedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_asset_link_entity_1.RiskAssetLink)),
    __param(2, (0, typeorm_1.InjectRepository)(risk_control_link_entity_1.RiskControlLink)),
    __param(3, (0, typeorm_1.InjectRepository)(risk_treatment_entity_1.RiskTreatment)),
    __param(4, (0, typeorm_1.InjectRepository)(kri_risk_link_entity_1.KRIRiskLink)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        risk_settings_service_1.RiskSettingsService])
], RiskAdvancedService);
//# sourceMappingURL=risk-advanced.service.js.map