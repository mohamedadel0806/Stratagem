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
var GovernanceTrendService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceTrendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const governance_dashboard_service_1 = require("./governance-dashboard.service");
const governance_metric_snapshot_entity_1 = require("../metrics/entities/governance-metric-snapshot.entity");
let GovernanceTrendService = GovernanceTrendService_1 = class GovernanceTrendService {
    constructor(snapshotRepository, dashboardService) {
        this.snapshotRepository = snapshotRepository;
        this.dashboardService = dashboardService;
        this.logger = new common_1.Logger(GovernanceTrendService_1.name);
    }
    async getTrend(rangeDays = 30) {
        var _a;
        const sanitizedRange = Math.min(Math.max(rangeDays, 7), 90);
        const today = this.getUtcStartOfDay(new Date());
        await this.ensureSnapshotForDate(today);
        const startDate = this.getUtcStartOfDay(this.addDays(today, -sanitizedRange + 1));
        const snapshots = await this.snapshotRepository
            .createQueryBuilder('snapshot')
            .where('snapshot.snapshot_date >= :startDate', { startDate: this.formatDate(startDate) })
            .orderBy('snapshot.snapshot_date', 'ASC')
            .getMany();
        const filledSnapshots = this.fillMissingSnapshots(snapshots, startDate, today);
        const history = filledSnapshots.map((snapshot) => this.toTrendPoint(snapshot));
        const latestSnapshot = (_a = history[history.length - 1]) !== null && _a !== void 0 ? _a : this.toTrendPoint(await this.snapshotRepository.findOne({ order: { snapshot_date: 'DESC' } }));
        const forecast = this.buildForecast(filledSnapshots, 14);
        return {
            history,
            forecast,
            latestSnapshot,
            lastUpdatedAt: latestSnapshot ? new Date(`${latestSnapshot.date}T00:00:00.000Z`).toISOString() : new Date().toISOString(),
        };
    }
    async ensureSnapshotForDate(date) {
        const dateKey = this.formatDate(date);
        try {
            const summary = await this.dashboardService.getSummaryMetrics();
            const complianceRate = summary.totalControls > 0
                ? Math.round((summary.implementedControls / summary.totalControls) * 1000) / 10
                : 0;
            const assessmentCompletionRate = summary.totalAssessments > 0
                ? Math.round((summary.completedAssessments / summary.totalAssessments) * 1000) / 10
                : 0;
            const riskClosureRate = summary.totalFindings > 0
                ? Math.round(((summary.totalFindings - summary.openFindings) / summary.totalFindings) * 1000) / 10
                : 0;
            let snapshot = await this.snapshotRepository.findOne({ where: { snapshot_date: dateKey } });
            if (!snapshot) {
                snapshot = this.snapshotRepository.create({
                    snapshot_date: dateKey,
                    compliance_rate: complianceRate,
                    implemented_controls: summary.implementedControls,
                    total_controls: summary.totalControls,
                    open_findings: summary.openFindings,
                    critical_findings: summary.criticalFindings,
                    assessment_completion_rate: assessmentCompletionRate,
                    risk_closure_rate: riskClosureRate,
                    completed_assessments: summary.completedAssessments,
                    total_assessments: summary.totalAssessments,
                    approved_evidence: summary.approvedEvidence,
                    metadata: {
                        policiesUnderReview: summary.policiesUnderReview,
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            else {
                snapshot.compliance_rate = complianceRate;
                snapshot.implemented_controls = summary.implementedControls;
                snapshot.total_controls = summary.totalControls;
                snapshot.open_findings = summary.openFindings;
                snapshot.critical_findings = summary.criticalFindings;
                snapshot.assessment_completion_rate = assessmentCompletionRate;
                snapshot.risk_closure_rate = riskClosureRate;
                snapshot.completed_assessments = summary.completedAssessments;
                snapshot.total_assessments = summary.totalAssessments;
                snapshot.approved_evidence = summary.approvedEvidence;
                snapshot.metadata = {
                    policiesUnderReview: summary.policiesUnderReview,
                    timestamp: new Date().toISOString(),
                };
            }
            await this.snapshotRepository.save(snapshot);
        }
        catch (error) {
            this.logger.error(`Failed to persist governance snapshot for ${dateKey}`, error.stack);
        }
    }
    fillMissingSnapshots(snapshots, startDate, endDate) {
        const snapshotMap = new Map();
        snapshots.forEach((snapshot) => snapshotMap.set(snapshot.snapshot_date, snapshot));
        const results = [];
        let cursor = new Date(startDate);
        let lastKnown = null;
        while (cursor <= endDate) {
            const dateKey = this.formatDate(cursor);
            const snapshot = snapshotMap.get(dateKey);
            if (snapshot) {
                lastKnown = snapshot;
                results.push(snapshot);
            }
            else if (lastKnown) {
                results.push(Object.assign(Object.assign({}, lastKnown), { snapshot_date: dateKey }));
            }
            else {
                results.push(this.snapshotRepository.create({
                    snapshot_date: dateKey,
                    compliance_rate: 0,
                    implemented_controls: 0,
                    total_controls: 0,
                    open_findings: 0,
                    critical_findings: 0,
                    assessment_completion_rate: 0,
                    risk_closure_rate: 0,
                    completed_assessments: 0,
                    total_assessments: 0,
                    approved_evidence: 0,
                }));
            }
            cursor = this.addDays(cursor, 1);
        }
        return results;
    }
    buildForecast(snapshots, daysForward) {
        if (!snapshots.length) {
            return [];
        }
        const window = snapshots.slice(-Math.min(snapshots.length, 14));
        const complianceTrend = this.calculateTrendCoefficients(window.map((item) => item.compliance_rate));
        const findingsTrend = this.calculateTrendCoefficients(window.map((item) => item.open_findings));
        const lastDate = this.getUtcStartOfDay(new Date(`${snapshots[snapshots.length - 1].snapshot_date}T00:00:00Z`));
        const forecast = [];
        for (let day = 1; day <= daysForward; day++) {
            const complianceIndex = window.length - 1 + day;
            const projectedCompliance = this.clamp(complianceTrend.intercept + complianceTrend.slope * complianceIndex, 0, 100);
            const findingsIndex = window.length - 1 + day;
            const projectedFindings = Math.max(0, Math.round(findingsTrend.intercept + findingsTrend.slope * findingsIndex));
            const futureDate = this.formatDate(this.addDays(lastDate, day));
            forecast.push({
                date: futureDate,
                projectedComplianceRate: Math.round(projectedCompliance * 10) / 10,
                projectedOpenFindings: projectedFindings,
            });
        }
        return forecast;
    }
    calculateTrendCoefficients(values) {
        if (!values.length) {
            return { slope: 0, intercept: 0 };
        }
        if (values.length === 1) {
            return { slope: 0, intercept: values[0] };
        }
        const n = values.length;
        const indices = values.map((_, index) => index);
        const sumX = indices.reduce((sum, value) => sum + value, 0);
        const sumY = values.reduce((sum, value) => sum + value, 0);
        const sumXY = values.reduce((sum, value, index) => sum + value * index, 0);
        const sumX2 = indices.reduce((sum, value) => sum + value * value, 0);
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator === 0) {
            return { slope: 0, intercept: values[values.length - 1] };
        }
        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    }
    toTrendPoint(snapshot) {
        if (!snapshot) {
            return {
                date: this.formatDate(new Date()),
                complianceRate: 0,
                implementedControls: 0,
                totalControls: 0,
                openFindings: 0,
                assessmentCompletionRate: 0,
                riskClosureRate: 0,
            };
        }
        return {
            date: snapshot.snapshot_date,
            complianceRate: snapshot.compliance_rate,
            implementedControls: snapshot.implemented_controls,
            totalControls: snapshot.total_controls,
            openFindings: snapshot.open_findings,
            assessmentCompletionRate: snapshot.assessment_completion_rate,
            riskClosureRate: snapshot.risk_closure_rate,
        };
    }
    getUtcStartOfDay(date) {
        const clone = new Date(date);
        clone.setUTCHours(0, 0, 0, 0);
        return clone;
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    addDays(date, days) {
        const clone = new Date(date);
        clone.setUTCDate(clone.getUTCDate() + days);
        return clone;
    }
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};
exports.GovernanceTrendService = GovernanceTrendService;
exports.GovernanceTrendService = GovernanceTrendService = GovernanceTrendService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(governance_metric_snapshot_entity_1.GovernanceMetricSnapshot)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        governance_dashboard_service_1.GovernanceDashboardService])
], GovernanceTrendService);
//# sourceMappingURL=governance-trend.service.js.map