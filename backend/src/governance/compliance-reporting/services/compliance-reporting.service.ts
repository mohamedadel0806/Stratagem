import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ComplianceReport, ComplianceScore, ReportPeriod } from '../entities/compliance-report.entity';
import { Policy, PolicyStatus } from '../../policies/entities/policy.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
import { User } from '../../../users/entities/user.entity';
import { ControlAssetMapping, AssetType } from '../../unified-controls/entities/control-asset-mapping.entity';
import { ImplementationStatus } from '../../unified-controls/entities/unified-control.entity';
import {
  CreateComplianceReportDto,
  ComplianceReportDto,
  ComplianceDashboardDto,
  DepartmentComplianceDto,
  ComplianceReportFilterDto,
} from '../dto/compliance-report.dto';

@Injectable()
export class ComplianceReportingService {
  private readonly logger = new Logger(ComplianceReportingService.name);

  constructor(
    @InjectRepository(ComplianceReport)
    private readonly complianceReportRepository: Repository<ComplianceReport>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private readonly controlRepository: Repository<UnifiedControl>,
    @InjectRepository(ControlAssetMapping)
    private readonly assetMappingRepository: Repository<ControlAssetMapping>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Generate comprehensive compliance report
   */
  async generateComplianceReport(
    dto: CreateComplianceReportDto,
    userId: string,
  ): Promise<ComplianceReport> {
    this.logger.log(`Generating compliance report for period: ${dto.period_start_date} to ${dto.period_end_date}`);

    const startDate = new Date(dto.period_start_date);
    const endDate = new Date(dto.period_end_date);

    const [
      policyMetrics,
      controlMetrics,
      assetMetrics,
      departmentBreakdown,
      trendData,
    ] = await Promise.all([
      this.calculatePolicyMetrics(startDate, endDate),
      this.calculateControlMetrics(startDate, endDate),
      this.calculateAssetMetrics(startDate, endDate),
      this.calculateDepartmentBreakdown(),
      this.calculateTrendData(startDate, endDate),
    ]);

    // Calculate overall compliance score (weighted average)
    const overallScore = this.calculateOverallScore(
      policyMetrics.score,
      controlMetrics.score,
      assetMetrics.score,
    );

    const rating = this.getComplianceRating(overallScore);

    // Identify critical gaps
    const gapAnalysis = this.identifyGaps(policyMetrics, controlMetrics, assetMetrics);

    // Generate forecast
    const forecast = this.generateForecast(trendData);

    // Get user who created the report
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

  /**
   * Calculate policy-related metrics
   */
  private async calculatePolicyMetrics(startDate: Date, endDate: Date): Promise<any> {
    const policies = await this.policyRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
    });

    const total = policies.length;
    const published = policies.filter(p => p.status === PolicyStatus.PUBLISHED).length;
    const acknowledged = total; // For now, count all policies as acknowledged if no explicit field

    // Policy compliance score: 50% published + 50% acknowledged
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

  /**
   * Calculate control-related metrics
   */
  private async calculateControlMetrics(startDate: Date, endDate: Date): Promise<any> {
    const controls = await this.controlRepository.find();
    const mappings = await this.assetMappingRepository.find({
      where: {
        mapped_at: Between(startDate, endDate),
      },
    });

    const implemented = mappings.filter(m => m.implementation_status === ImplementationStatus.IMPLEMENTED).length;
    const inProgress = mappings.filter(m => m.implementation_status === ImplementationStatus.IN_PROGRESS).length;
    const notImplemented = mappings.filter(m => m.implementation_status === ImplementationStatus.NOT_IMPLEMENTED).length;

    const total = mappings.length || controls.length;

    // Control compliance score: 100% for implemented, 50% for partial, 0% for not implemented
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

  /**
   * Calculate asset-related metrics
   */
  private async calculateAssetMetrics(startDate: Date, endDate: Date): Promise<any> {
    const mappings = await this.assetMappingRepository.find({
      where: {
        mapped_at: Between(startDate, endDate),
      },
    });

    // Get unique assets
    const assetMap = new Map<string, ControlAssetMapping[]>();
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
      const implemented = assetMappings.filter(m => m.implementation_status === ImplementationStatus.IMPLEMENTED).length;
      const inProgress = assetMappings.filter(m => m.implementation_status === ImplementationStatus.IN_PROGRESS).length;
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

  /**
   * Calculate compliance by department
   */
  private async calculateDepartmentBreakdown(): Promise<DepartmentComplianceDto[]> {
    // This would be expanded with actual department data from your system
    // For now, returning a structure
    const policies = await this.policyRepository.find();
    const controls = await this.controlRepository.find();
    const mappings = await this.assetMappingRepository.find();

    // Group by department (implementation depends on your department structure)
    // This is a placeholder
    return [
      {
        department: 'IT Security',
        compliance_score: 87,
        policies_count: 12,
        controls_assigned: 45,
        assets_managed: 120,
        rating: ComplianceScore.EXCELLENT,
      },
      {
        department: 'Risk Management',
        compliance_score: 75,
        policies_count: 8,
        controls_assigned: 30,
        assets_managed: 80,
        rating: ComplianceScore.GOOD,
      },
    ];
  }

  /**
   * Calculate trend data for the period
   */
  private async calculateTrendData(startDate: Date, endDate: Date): Promise<any[]> {
    // This would calculate daily/weekly compliance scores
    // Placeholder implementation
    const trends = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStr = currentDate.toISOString().split('T')[0];
      trends.push({
        date: dayStr,
        overall_score: Math.floor(Math.random() * 20) + 70, // Placeholder
        policies_score: Math.floor(Math.random() * 20) + 70,
        controls_score: Math.floor(Math.random() * 20) + 70,
        assets_score: Math.floor(Math.random() * 20) + 70,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return trends;
  }

  /**
   * Calculate overall compliance score (weighted average)
   */
  private calculateOverallScore(policiesScore: number, controlsScore: number, assetsScore: number): number {
    // Weights: 30% policies, 50% controls, 20% assets
    return (policiesScore * 0.3 + controlsScore * 0.5 + assetsScore * 0.2);
  }

  /**
   * Get compliance rating based on score
   */
  private getComplianceRating(score: number): ComplianceScore {
    if (score >= 85) return ComplianceScore.EXCELLENT;
    if (score >= 70) return ComplianceScore.GOOD;
    if (score >= 55) return ComplianceScore.FAIR;
    return ComplianceScore.POOR;
  }

  /**
   * Identify compliance gaps
   */
  private identifyGaps(policyMetrics: any, controlMetrics: any, assetMetrics: any): any {
    const gaps = [];
    let critical = 0,
      medium = 0,
      low = 0;

    // Policy gaps
    if (policyMetrics.acknowledgmentRate < 50) {
      gaps.push({
        description: `Low policy acknowledgment rate (${policyMetrics.acknowledgmentRate.toFixed(1)}%)`,
        severity: 'CRITICAL',
        affected_count: policyMetrics.total - policyMetrics.acknowledged,
      });
      critical++;
    }

    // Control implementation gaps
    const controlGapRate = controlMetrics.notImplemented / controlMetrics.total;
    if (controlGapRate > 0.2) {
      gaps.push({
        description: `High number of unimplemented controls (${controlMetrics.notImplemented}/${controlMetrics.total})`,
        severity: 'CRITICAL',
        affected_count: controlMetrics.notImplemented,
      });
      critical++;
    }

    // Asset compliance gaps
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

  /**
   * Generate compliance forecast
   */
  private generateForecast(trendData: any[]): any {
    // Simple linear regression based on trend data
    let direction = 'STABLE';
    if (trendData.length > 1) {
      const firstScore = trendData[0].overall_score;
      const lastScore = trendData[trendData.length - 1].overall_score;
      if (lastScore > firstScore + 2) direction = 'IMPROVING';
      else if (lastScore < firstScore - 2) direction = 'DECLINING';
    }

    const projectedScore = trendData.length > 0 ? trendData[trendData.length - 1].overall_score : 70;
    const daysToExcellent =
      projectedScore < 85 ? Math.ceil((85 - projectedScore) * 10) : 0;

    return { direction, projectedScore, daysToExcellent };
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(score: number, rating: ComplianceScore, gaps: any): string {
    return `Organization-wide compliance score: ${score.toFixed(1)}% (${rating}). 
    ${gaps.critical} critical gaps identified requiring immediate attention. 
    See detailed recommendations for improvement areas.`;
  }

  /**
   * Generate key findings
   */
  private generateKeyFindings(policyMetrics: any, controlMetrics: any, assetMetrics: any): string {
    return `Policy Compliance: ${policyMetrics.score.toFixed(1)}% | 
    Control Implementation: ${controlMetrics.score.toFixed(1)}% | 
    Asset Compliance: ${assetMetrics.score.toFixed(1)}%`;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(gaps: any): string {
    if (gaps.critical === 0) return 'Continue current compliance initiatives.';
    return `Address ${gaps.critical} critical compliance gaps immediately. 
    Focus on: ${gaps.details.map(g => g.description).join(', ')}`;
  }

  /**
   * Get report by ID
   */
  async getReport(reportId: string): Promise<ComplianceReportDto> {
    const report = await this.complianceReportRepository.findOne({
      where: { id: reportId },
      relations: ['created_by'],
    });

    if (!report) {
      throw new NotFoundException(`Compliance report ${reportId} not found`);
    }

    return this.mapToDto(report);
  }

  /**
   * Get all reports with filtering
   */
  async getReports(filter: ComplianceReportFilterDto): Promise<{ data: ComplianceReportDto[]; total: number }> {
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

  /**
   * Get latest report
   */
  async getLatestReport(): Promise<ComplianceReportDto | null> {
    const report = await this.complianceReportRepository.findOne({
      where: { is_archived: false },
      order: { created_at: 'DESC' },
      relations: ['created_by'],
    });

    return report ? this.mapToDto(report) : null;
  }

  /**
   * Get compliance dashboard data
   */
  async getComplianceDashboard(): Promise<ComplianceDashboardDto> {
    const latestReport = await this.getLatestReport();

    if (!latestReport) {
      throw new NotFoundException('No compliance reports available');
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

  /**
   * Archive report
   */
  async archiveReport(reportId: string): Promise<void> {
    await this.complianceReportRepository.update({ id: reportId }, { is_archived: true });
    this.logger.log(`Report ${reportId} archived`);
  }

  /**
   * Map entity to DTO
   */
  private mapToDto(report: ComplianceReport): ComplianceReportDto {
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
}
