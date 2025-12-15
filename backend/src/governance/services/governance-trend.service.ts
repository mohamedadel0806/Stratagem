import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceDashboardService } from './governance-dashboard.service';
import { GovernanceMetricSnapshot } from '../metrics/entities/governance-metric-snapshot.entity';
import {
  GovernanceTrendResponseDto,
  GovernanceTrendPointDto,
  GovernanceForecastPointDto,
} from '../dto/governance-trend.dto';

@Injectable()
export class GovernanceTrendService {
  private readonly logger = new Logger(GovernanceTrendService.name);

  constructor(
    @InjectRepository(GovernanceMetricSnapshot)
    private readonly snapshotRepository: Repository<GovernanceMetricSnapshot>,
    private readonly dashboardService: GovernanceDashboardService,
  ) {}

  async getTrend(rangeDays = 30): Promise<GovernanceTrendResponseDto> {
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
    const latestSnapshot = history[history.length - 1] ?? this.toTrendPoint(await this.snapshotRepository.findOne({ order: { snapshot_date: 'DESC' } }));

    const forecast = this.buildForecast(filledSnapshots, 14);

    return {
      history,
      forecast,
      latestSnapshot,
      lastUpdatedAt: latestSnapshot ? new Date(`${latestSnapshot.date}T00:00:00.000Z`).toISOString() : new Date().toISOString(),
    };
  }

  async ensureSnapshotForDate(date: Date): Promise<void> {
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
      } else {
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
    } catch (error) {
      this.logger.error(`Failed to persist governance snapshot for ${dateKey}`, error.stack);
    }
  }

  private fillMissingSnapshots(
    snapshots: GovernanceMetricSnapshot[],
    startDate: Date,
    endDate: Date,
  ): GovernanceMetricSnapshot[] {
    const snapshotMap = new Map<string, GovernanceMetricSnapshot>();
    snapshots.forEach((snapshot) => snapshotMap.set(snapshot.snapshot_date, snapshot));

    const results: GovernanceMetricSnapshot[] = [];
    let cursor = new Date(startDate);
    let lastKnown: GovernanceMetricSnapshot | null = null;

    while (cursor <= endDate) {
      const dateKey = this.formatDate(cursor);
      const snapshot = snapshotMap.get(dateKey);

      if (snapshot) {
        lastKnown = snapshot;
        results.push(snapshot);
      } else if (lastKnown) {
        results.push({ ...lastKnown, snapshot_date: dateKey });
      } else {
        results.push(
          this.snapshotRepository.create({
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
          }),
        );
      }

      cursor = this.addDays(cursor, 1);
    }

    return results;
  }

  private buildForecast(snapshots: GovernanceMetricSnapshot[], daysForward: number): GovernanceForecastPointDto[] {
    if (!snapshots.length) {
      return [];
    }

    const window = snapshots.slice(-Math.min(snapshots.length, 14));
    const complianceTrend = this.calculateTrendCoefficients(window.map((item) => item.compliance_rate));
    const findingsTrend = this.calculateTrendCoefficients(window.map((item) => item.open_findings));

    const lastDate = this.getUtcStartOfDay(new Date(`${snapshots[snapshots.length - 1].snapshot_date}T00:00:00Z`));
    const forecast: GovernanceForecastPointDto[] = [];

    for (let day = 1; day <= daysForward; day++) {
      const complianceIndex = window.length - 1 + day;
      const projectedCompliance = this.clamp(
        complianceTrend.intercept + complianceTrend.slope * complianceIndex,
        0,
        100,
      );

      const findingsIndex = window.length - 1 + day;
      const projectedFindings = Math.max(
        0,
        Math.round(findingsTrend.intercept + findingsTrend.slope * findingsIndex),
      );

      const futureDate = this.formatDate(this.addDays(lastDate, day));
      forecast.push({
        date: futureDate,
        projectedComplianceRate: Math.round(projectedCompliance * 10) / 10,
        projectedOpenFindings: projectedFindings,
      });
    }

    return forecast;
  }

  private calculateTrendCoefficients(values: number[]): { slope: number; intercept: number } {
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

  private toTrendPoint(snapshot?: GovernanceMetricSnapshot): GovernanceTrendPointDto {
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

  private getUtcStartOfDay(date: Date): Date {
    const clone = new Date(date);
    clone.setUTCHours(0, 0, 0, 0);
    return clone;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const clone = new Date(date);
    clone.setUTCDate(clone.getUTCDate() + days);
    return clone;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
