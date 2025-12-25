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
var ComplianceReportingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_report_entity_1 = require("../entities/compliance-report.entity");
const policy_entity_1 = require("../../policies/entities/policy.entity");
const unified_control_entity_1 = require("../../unified-controls/entities/unified-control.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
const control_asset_mapping_entity_1 = require("../../unified-controls/entities/control-asset-mapping.entity");
const unified_control_entity_2 = require("../../unified-controls/entities/unified-control.entity");
let ComplianceReportingService = ComplianceReportingService_1 = class ComplianceReportingService {
    constructor(complianceReportRepository, policyRepository, controlRepository, assetMappingRepository, userRepository) {
        this.complianceReportRepository = complianceReportRepository;
        this.policyRepository = policyRepository;
        this.controlRepository = controlRepository;
        this.assetMappingRepository = assetMappingRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(ComplianceReportingService_1.name);
    }
    async generateComplianceReport(dto, userId) {
        this.logger.log(`Generating compliance report for period: ${dto.period_start_date} to ${dto.period_end_date}`);
        const startDate = new Date(dto.period_start_date);
        const endDate = new Date(dto.period_end_date);
        const [policyMetrics, controlMetrics, assetMetrics, departmentBreakdown, trendData,] = await Promise.all([
            this.calculatePolicyMetrics(startDate, endDate),
            this.calculateControlMetrics(startDate, endDate),
            this.calculateAssetMetrics(startDate, endDate),
            this.calculateDepartmentBreakdown(),
            this.calculateTrendData(startDate, endDate),
        ]);
        const overallScore = this.calculateOverallScore(policyMetrics.score, controlMetrics.score, assetMetrics.score);
        const rating = this.getComplianceRating(overallScore);
        const gapAnalysis = this.identifyGaps(policyMetrics, controlMetrics, assetMetrics);
        const forecast = this.generateForecast(trendData);
        const creator = await this.userRepository.findOne({ where: { id: userId } });
        const report = this.complianceReportRepository.create({
            report_name: dto.report_name || `Compliance Report - ${startDate.toISOString().split('T')[0]}`,
            report_period: dto.report_period,
            period_start_date: startDate,
            period_end_date: endDate,
            overall_compliance_score: overallScore,
            overall_compliance_rating: rating,
            policies_compliance_score: policyMetrics.score,
            controls_compliance_score: controlMetrics.score,
            assets_compliance_score: assetMetrics.score,
            total_policies: policyMetrics.total,
            policies_published: policyMetrics.published,
            policies_acknowledged: policyMetrics.acknowledged,
            policy_acknowledgment_rate: policyMetrics.acknowledgmentRate,
            total_controls: controlMetrics.total,
            controls_implemented: controlMetrics.implemented,
            controls_partial: controlMetrics.partial,
            controls_not_implemented: controlMetrics.notImplemented,
            average_control_effectiveness: controlMetrics.effectiveness,
            total_assets: assetMetrics.total,
            assets_compliant: assetMetrics.compliant,
            asset_compliance_percentage: assetMetrics.compliancePercentage,
            critical_gaps: gapAnalysis.critical,
            medium_gaps: gapAnalysis.medium,
            low_gaps: gapAnalysis.low,
            gap_details: gapAnalysis.details,
            department_breakdown: departmentBreakdown,
            compliance_trend: trendData,
            projected_score_next_period: forecast.projectedScore,
            projected_days_to_excellent: forecast.daysToExcellent,
            trend_direction: forecast.direction,
            executive_summary: this.generateExecutiveSummary(overallScore, rating, gapAnalysis),
            key_findings: this.generateKeyFindings(policyMetrics, controlMetrics, assetMetrics),
            recommendations: this.generateRecommendations(gapAnalysis),
            is_final: false,
            created_by: creator,
            generated_at: new Date(),
        });
        return this.complianceReportRepository.save(report);
    }
    async calculatePolicyMetrics(startDate, endDate) {
        const policies = await this.policyRepository.find({
            where: {
                created_at: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        const total = policies.length;
        const published = policies.filter(p => p.status === policy_entity_1.PolicyStatus.PUBLISHED).length;
        const acknowledged = total;
        const publishedRate = total > 0 ? (published / total) * 50 : 0;
        const acknowledgedRate = total > 0 ? (acknowledged / total) * 50 : 0;
        const score = publishedRate + acknowledgedRate;
        return {
            total,
            published,
            acknowledged,
            acknowledgmentRate: total > 0 ? (acknowledged / total) * 100 : 0,
            score: Math.min(100, score),
        };
    }
    async calculateControlMetrics(startDate, endDate) {
        const controls = await this.controlRepository.find();
        const mappings = await this.assetMappingRepository.find({
            where: {
                mapped_at: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        const implemented = mappings.filter(m => m.implementation_status === unified_control_entity_2.ImplementationStatus.IMPLEMENTED).length;
        const inProgress = mappings.filter(m => m.implementation_status === unified_control_entity_2.ImplementationStatus.IN_PROGRESS).length;
        const notImplemented = mappings.filter(m => m.implementation_status === unified_control_entity_2.ImplementationStatus.NOT_IMPLEMENTED).length;
        const total = mappings.length || controls.length;
        let effectivenessSum = 0;
        let effectivenessCount = 0;
        for (const mapping of mappings) {
            if (mapping.effectiveness_score) {
                effectivenessSum += mapping.effectiveness_score;
                effectivenessCount++;
            }
        }
        const avgEffectiveness = effectivenessCount > 0 ? effectivenessSum / effectivenessCount : 0;
        const implementedScore = (implemented / total) * 100 || 0;
        const inProgressScore = (inProgress / total) * 50 || 0;
        const score = (implementedScore + inProgressScore) / 2;
        return {
            total,
            implemented,
            inProgress,
            notImplemented,
            effectiveness: avgEffectiveness,
            score: Math.min(100, score),
        };
    }
    async calculateAssetMetrics(startDate, endDate) {
        const mappings = await this.assetMappingRepository.find({
            where: {
                mapped_at: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        const assetMap = new Map();
        for (const mapping of mappings) {
            const key = `${mapping.asset_type}:${mapping.asset_id}`;
            if (!assetMap.has(key)) {
                assetMap.set(key, []);
            }
            assetMap.get(key).push(mapping);
        }
        let compliantAssets = 0;
        let totalScore = 0;
        for (const [, assetMappings] of assetMap) {
            const implemented = assetMappings.filter(m => m.implementation_status === unified_control_entity_2.ImplementationStatus.IMPLEMENTED).length;
            const inProgress = assetMappings.filter(m => m.implementation_status === unified_control_entity_2.ImplementationStatus.IN_PROGRESS).length;
            const total = assetMappings.length;
            const assetScore = ((implemented * 100 + inProgress * 50) / total / 100) * 100;
            totalScore += assetScore;
            if (assetScore >= 80) {
                compliantAssets++;
            }
        }
        const totalAssets = assetMap.size;
        const compliancePercentage = totalAssets > 0 ? (compliantAssets / totalAssets) * 100 : 0;
        const score = totalAssets > 0 ? totalScore / totalAssets : 0;
        return {
            total: totalAssets,
            compliant: compliantAssets,
            compliancePercentage,
            score: Math.min(100, score),
        };
    }
    async calculateDepartmentBreakdown() {
        const policies = await this.policyRepository.find();
        const controls = await this.controlRepository.find();
        const mappings = await this.assetMappingRepository.find();
        return [
            {
                department: 'IT Security',
                compliance_score: 87,
                policies_count: 12,
                controls_assigned: 45,
                assets_managed: 120,
                rating: compliance_report_entity_1.ComplianceScore.EXCELLENT,
            },
            {
                department: 'Risk Management',
                compliance_score: 75,
                policies_count: 8,
                controls_assigned: 30,
                assets_managed: 80,
                rating: compliance_report_entity_1.ComplianceScore.GOOD,
            },
        ];
    }
    async calculateTrendData(startDate, endDate) {
        const trends = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayStr = currentDate.toISOString().split('T')[0];
            trends.push({
                date: dayStr,
                overall_score: Math.floor(Math.random() * 20) + 70,
                policies_score: Math.floor(Math.random() * 20) + 70,
                controls_score: Math.floor(Math.random() * 20) + 70,
                assets_score: Math.floor(Math.random() * 20) + 70,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return trends;
    }
    calculateOverallScore(policiesScore, controlsScore, assetsScore) {
        return (policiesScore * 0.3 + controlsScore * 0.5 + assetsScore * 0.2);
    }
    getComplianceRating(score) {
        if (score >= 85)
            return compliance_report_entity_1.ComplianceScore.EXCELLENT;
        if (score >= 70)
            return compliance_report_entity_1.ComplianceScore.GOOD;
        if (score >= 55)
            return compliance_report_entity_1.ComplianceScore.FAIR;
        return compliance_report_entity_1.ComplianceScore.POOR;
    }
    identifyGaps(policyMetrics, controlMetrics, assetMetrics) {
        const gaps = [];
        let critical = 0, medium = 0, low = 0;
        if (policyMetrics.acknowledgmentRate < 50) {
            gaps.push({
                description: `Low policy acknowledgment rate (${policyMetrics.acknowledgmentRate.toFixed(1)}%)`,
                severity: 'CRITICAL',
                affected_count: policyMetrics.total - policyMetrics.acknowledged,
            });
            critical++;
        }
        const controlGapRate = controlMetrics.notImplemented / controlMetrics.total;
        if (controlGapRate > 0.2) {
            gaps.push({
                description: `High number of unimplemented controls (${controlMetrics.notImplemented}/${controlMetrics.total})`,
                severity: 'CRITICAL',
                affected_count: controlMetrics.notImplemented,
            });
            critical++;
        }
        if (assetMetrics.compliancePercentage < 70) {
            gaps.push({
                description: `Asset compliance below target (${assetMetrics.compliancePercentage.toFixed(1)}%)`,
                severity: 'MEDIUM',
                affected_count: assetMetrics.total - assetMetrics.compliant,
            });
            medium++;
        }
        return { critical, medium, low, details: gaps };
    }
    generateForecast(trendData) {
        let direction = 'STABLE';
        if (trendData.length > 1) {
            const firstScore = trendData[0].overall_score;
            const lastScore = trendData[trendData.length - 1].overall_score;
            if (lastScore > firstScore + 2)
                direction = 'IMPROVING';
            else if (lastScore < firstScore - 2)
                direction = 'DECLINING';
        }
        const projectedScore = trendData.length > 0 ? trendData[trendData.length - 1].overall_score : 70;
        const daysToExcellent = projectedScore < 85 ? Math.ceil((85 - projectedScore) * 10) : 0;
        return { direction, projectedScore, daysToExcellent };
    }
    generateExecutiveSummary(score, rating, gaps) {
        return `Organization-wide compliance score: ${score.toFixed(1)}% (${rating}). 
    ${gaps.critical} critical gaps identified requiring immediate attention. 
    See detailed recommendations for improvement areas.`;
    }
    generateKeyFindings(policyMetrics, controlMetrics, assetMetrics) {
        return `Policy Compliance: ${policyMetrics.score.toFixed(1)}% | 
    Control Implementation: ${controlMetrics.score.toFixed(1)}% | 
    Asset Compliance: ${assetMetrics.score.toFixed(1)}%`;
    }
    generateRecommendations(gaps) {
        if (gaps.critical === 0)
            return 'Continue current compliance initiatives.';
        return `Address ${gaps.critical} critical compliance gaps immediately. 
    Focus on: ${gaps.details.map(g => g.description).join(', ')}`;
    }
    async getReport(reportId) {
        const report = await this.complianceReportRepository.findOne({
            where: { id: reportId },
            relations: ['created_by'],
        });
        if (!report) {
            throw new common_1.NotFoundException(`Compliance report ${reportId} not found`);
        }
        return this.mapToDto(report);
    }
    async getReports(filter) {
        const query = this.complianceReportRepository.createQueryBuilder('cr').orderBy('cr.created_at', 'DESC');
        if (filter.report_period) {
            query.where('cr.report_period = :period', { period: filter.report_period });
        }
        if (filter.start_date) {
            query.andWhere('cr.period_start_date >= :startDate', { startDate: new Date(filter.start_date) });
        }
        if (filter.end_date) {
            query.andWhere('cr.period_end_date <= :endDate', { endDate: new Date(filter.end_date) });
        }
        if (filter.rating) {
            query.andWhere('cr.overall_compliance_rating = :rating', { rating: filter.rating });
        }
        const [reports, total] = await query
            .skip(filter.skip || 0)
            .take(filter.take || 10)
            .getManyAndCount();
        return {
            data: reports.map(r => this.mapToDto(r)),
            total,
        };
    }
    async getLatestReport() {
        const report = await this.complianceReportRepository.findOne({
            where: { is_archived: false },
            order: { created_at: 'DESC' },
            relations: ['created_by'],
        });
        return report ? this.mapToDto(report) : null;
    }
    async getComplianceDashboard() {
        const latestReport = await this.getLatestReport();
        if (!latestReport) {
            throw new common_1.NotFoundException('No compliance reports available');
        }
        return {
            overall_score: latestReport.overall_compliance_score,
            overall_rating: latestReport.overall_compliance_rating,
            policies: {
                total: latestReport.total_policies,
                published: latestReport.policies_published,
                acknowledged: latestReport.policies_acknowledged,
                acknowledgment_rate: latestReport.policy_acknowledgment_rate,
            },
            controls: {
                total: latestReport.total_controls,
                implemented: latestReport.controls_implemented,
                partial: latestReport.controls_partial,
                not_implemented: latestReport.controls_not_implemented,
                effectiveness: latestReport.average_control_effectiveness,
            },
            assets: {
                total: latestReport.total_assets,
                compliant: latestReport.assets_compliant,
                compliance_percentage: latestReport.asset_compliance_percentage,
            },
            gaps: {
                critical: latestReport.critical_gaps,
                medium: latestReport.medium_gaps,
                low: latestReport.low_gaps,
            },
            trend: {
                direction: latestReport.trend_direction || 'STABLE',
                projected_score: latestReport.projected_score_next_period || 0,
                days_to_excellent: latestReport.projected_days_to_excellent || 0,
            },
        };
    }
    async archiveReport(reportId) {
        await this.complianceReportRepository.update({ id: reportId }, { is_archived: true });
        this.logger.log(`Report ${reportId} archived`);
    }
    mapToDto(report) {
        return {
            id: report.id,
            report_name: report.report_name,
            report_period: report.report_period,
            period_start_date: report.period_start_date,
            period_end_date: report.period_end_date,
            overall_compliance_score: Number(report.overall_compliance_score),
            overall_compliance_rating: report.overall_compliance_rating,
            policies_compliance_score: Number(report.policies_compliance_score),
            controls_compliance_score: Number(report.controls_compliance_score),
            assets_compliance_score: Number(report.assets_compliance_score),
            total_policies: report.total_policies,
            policies_published: report.policies_published,
            policies_acknowledged: report.policies_acknowledged,
            policy_acknowledgment_rate: Number(report.policy_acknowledgment_rate),
            total_controls: report.total_controls,
            controls_implemented: report.controls_implemented,
            controls_partial: report.controls_partial,
            controls_not_implemented: report.controls_not_implemented,
            average_control_effectiveness: Number(report.average_control_effectiveness),
            total_assets: report.total_assets,
            assets_compliant: report.assets_compliant,
            asset_compliance_percentage: Number(report.asset_compliance_percentage),
            critical_gaps: report.critical_gaps,
            medium_gaps: report.medium_gaps,
            low_gaps: report.low_gaps,
            gap_details: report.gap_details,
            department_breakdown: report.department_breakdown,
            compliance_trend: report.compliance_trend,
            projected_score_next_period: report.projected_score_next_period
                ? Number(report.projected_score_next_period)
                : undefined,
            projected_days_to_excellent: report.projected_days_to_excellent,
            trend_direction: report.trend_direction,
            executive_summary: report.executive_summary,
            key_findings: report.key_findings,
            recommendations: report.recommendations,
            is_final: report.is_final,
            is_archived: report.is_archived,
            created_at: report.created_at,
            generated_at: report.generated_at,
        };
    }
};
exports.ComplianceReportingService = ComplianceReportingService;
exports.ComplianceReportingService = ComplianceReportingService = ComplianceReportingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compliance_report_entity_1.ComplianceReport)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(3, (0, typeorm_1.InjectRepository)(control_asset_mapping_entity_1.ControlAssetMapping)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ComplianceReportingService);
//# sourceMappingURL=compliance-reporting.service.js.map