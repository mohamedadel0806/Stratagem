import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UnifiedControl, ImplementationStatus } from '../unified-controls/entities/unified-control.entity';
import { Assessment, AssessmentStatus } from '../assessments/entities/assessment.entity';
import { AssessmentResult } from '../assessments/entities/assessment-result.entity';
import { FrameworkControlMapping, MappingCoverage } from '../unified-controls/entities/framework-control-mapping.entity';
import { FrameworkRequirement } from '../unified-controls/entities/framework-requirement.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';

export enum ComplianceStatus {
  MET = 'met',
  NOT_MET = 'not_met',
  PARTIALLY_MET = 'partially_met',
  NOT_APPLICABLE = 'not_applicable',
}

export interface FrameworkScorecardDto {
  frameworkId: string;
  frameworkName: string;
  frameworkCode: string;
  overallCompliance: number; // Percentage
  totalRequirements: number;
  metRequirements: number;
  notMetRequirements: number;
  partiallyMetRequirements: number;
  notApplicableRequirements: number;
  breakdownByDomain: DomainBreakdown[];
  controlImplementationStatus: {
    implemented: number;
    inProgress: number;
    planned: number;
    notImplemented: number;
  };
  assessmentResults: {
    completed: number;
    inProgress: number;
    averageScore: number;
  };
  gaps: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trend?: {
    previousPeriod: number;
    change: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}

export interface DomainBreakdown {
  domain: string;
  totalRequirements: number;
  met: number;
  notMet: number;
  partiallyMet: number;
  notApplicable: number;
  compliancePercentage: number;
}

export interface ComplianceScorecardResponse {
  generatedAt: Date;
  frameworks: FrameworkScorecardDto[];
  overallCompliance: number;
  summary: {
    totalFrameworks: number;
    totalRequirements: number;
    totalMet: number;
    totalNotMet: number;
    averageCompliance: number;
  };
}

@Injectable()
export class ComplianceScorecardService {
  constructor(
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentResult)
    private assessmentResultRepository: Repository<AssessmentResult>,
    @InjectRepository(FrameworkControlMapping)
    private mappingRepository: Repository<FrameworkControlMapping>,
    @InjectRepository(FrameworkRequirement)
    private requirementRepository: Repository<FrameworkRequirement>,
    @InjectRepository(ComplianceFramework)
    private frameworkRepository: Repository<ComplianceFramework>,
  ) {}

  async generateScorecard(frameworkIds?: string[]): Promise<ComplianceScorecardResponse> {
    // Get frameworks
    const frameworks = frameworkIds
      ? await this.frameworkRepository.find({ where: { id: In(frameworkIds) } })
      : await this.frameworkRepository.find();

    const frameworkScorecards: FrameworkScorecardDto[] = [];

    for (const framework of frameworks) {
      const scorecard = await this.calculateFrameworkScorecard(framework.id, framework.name, framework.code);
      if (scorecard) {
        frameworkScorecards.push(scorecard);
      }
    }

    // Calculate overall summary
    const totalRequirements = frameworkScorecards.reduce((sum, fw) => sum + fw.totalRequirements, 0);
    const totalMet = frameworkScorecards.reduce((sum, fw) => sum + fw.metRequirements, 0);
    const totalNotMet = frameworkScorecards.reduce((sum, fw) => sum + fw.notMetRequirements, 0);
    const averageCompliance =
      frameworkScorecards.length > 0
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

  private async calculateFrameworkScorecard(
    frameworkId: string,
    frameworkName: string,
    frameworkCode: string,
  ): Promise<FrameworkScorecardDto | null> {
    // Get all requirements for this framework
    const requirements = await this.requirementRepository.find({
      where: { framework_id: frameworkId },
      order: { display_order: 'ASC' },
    });

    if (requirements.length === 0) {
      return null;
    }

    // Get all mappings for this framework via requirements
    const mappings = await this.mappingRepository
      .createQueryBuilder('mapping')
      .leftJoinAndSelect('mapping.unified_control', 'control')
      .leftJoinAndSelect('mapping.framework_requirement', 'requirement')
      .where('requirement.framework_id = :frameworkId', { frameworkId })
      .getMany();

    // Group requirements by domain
    const domainMap = new Map<string, FrameworkRequirement[]>();
    for (const req of requirements) {
      const domain = req.domain || 'Other';
      if (!domainMap.has(domain)) {
        domainMap.set(domain, []);
      }
      domainMap.get(domain)!.push(req);
    }

    // Calculate compliance per requirement
    const requirementStatuses = new Map<string, ComplianceStatus>();
    for (const req of requirements) {
      const reqMappings = mappings.filter((m) => m.framework_requirement?.id === req.id);
      
      if (reqMappings.length === 0) {
        requirementStatuses.set(req.id, ComplianceStatus.NOT_MET);
      } else {
        // Check coverage level and control implementation
        const allControls = reqMappings.map((m) => m.unified_control).filter(Boolean);
        const fullCoverageMappings = reqMappings.filter((m) => m.coverage_level === MappingCoverage.FULL);
        const partialCoverageMappings = reqMappings.filter((m) => m.coverage_level === MappingCoverage.PARTIAL);
        const notApplicableMappings = reqMappings.filter((m) => m.coverage_level === MappingCoverage.NOT_APPLICABLE);

        if (notApplicableMappings.length === reqMappings.length) {
          requirementStatuses.set(req.id, ComplianceStatus.NOT_APPLICABLE);
        } else {
          const implementedCount = allControls.filter(
            (c) => c?.implementation_status === ImplementationStatus.IMPLEMENTED,
          ).length;
          const partialCount = allControls.filter(
            (c) => c?.implementation_status === ImplementationStatus.IN_PROGRESS,
          ).length;

          // If we have full coverage mappings with all implemented, it's MET
          if (fullCoverageMappings.length > 0 && implementedCount === fullCoverageMappings.length) {
            requirementStatuses.set(req.id, ComplianceStatus.MET);
          } else if (implementedCount > 0 || partialCount > 0 || partialCoverageMappings.length > 0) {
            requirementStatuses.set(req.id, ComplianceStatus.PARTIALLY_MET);
          } else {
            requirementStatuses.set(req.id, ComplianceStatus.NOT_MET);
          }
        }
      }
    }

    // Calculate domain breakdown
    const domainBreakdown: DomainBreakdown[] = [];
    for (const [domain, domainReqs] of domainMap.entries()) {
      const met = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.MET).length;
      const notMet = domainReqs.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_MET).length;
      const partiallyMet = domainReqs.filter(
        (r) => requirementStatuses.get(r.id) === ComplianceStatus.PARTIALLY_MET,
      ).length;
      const notApplicable = domainReqs.filter(
        (r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_APPLICABLE,
      ).length;

      domainBreakdown.push({
        domain,
        totalRequirements: domainReqs.length,
        met,
        notMet,
        partiallyMet,
        notApplicable,
        compliancePercentage:
          domainReqs.length > 0
            ? Math.round(((met + notApplicable) / domainReqs.length) * 100)
            : 0,
      });
    }

    // Get control implementation status
    const controlIds = mappings.map((m) => m.unified_control?.id).filter(Boolean) as string[];
    const controls = controlIds.length > 0
      ? await this.controlRepository.find({ where: { id: In(controlIds) } })
      : [];

    const implementationStatus = {
      implemented: controls.filter((c) => c.implementation_status === ImplementationStatus.IMPLEMENTED).length,
      inProgress: controls.filter((c) => c.implementation_status === ImplementationStatus.IN_PROGRESS).length,
      planned: controls.filter((c) => c.implementation_status === ImplementationStatus.PLANNED).length,
      notImplemented: controls.filter((c) => c.implementation_status === ImplementationStatus.NOT_IMPLEMENTED).length,
    };

    // Get assessment results for this framework
    const assessments = await this.assessmentRepository.find({
      where: { status: In([AssessmentStatus.COMPLETED, AssessmentStatus.IN_PROGRESS]) },
    });
    
    // Filter assessments that relate to this framework
    const frameworkAssessments = assessments.filter((a) => {
      // Check if assessment includes this framework
      return a.selected_framework_ids && a.selected_framework_ids.includes(frameworkId);
    });

    const completedAssessments = frameworkAssessments.filter((a) => a.status === AssessmentStatus.COMPLETED);
    const inProgressAssessments = frameworkAssessments.filter((a) => a.status === AssessmentStatus.IN_PROGRESS);

    // Calculate average score from assessment results for framework controls
    const allResults = await this.assessmentResultRepository.find({
      where: { assessment_id: In(completedAssessments.map((a) => a.id)) },
    });
    
    const assessmentResults = allResults.filter((r) => controlIds.includes(r.unified_control_id));

    const averageScore =
      assessmentResults.length > 0
        ? Math.round(
            assessmentResults.reduce((sum, r) => sum + (r.effectiveness_rating || 0), 0) /
              assessmentResults.length,
          )
        : 0;

    // Calculate gaps
    const gaps = {
      total: requirements.filter((r) => requirementStatuses.get(r.id) === ComplianceStatus.NOT_MET).length,
      critical: 0, // Would need severity mapping
      high: 0,
      medium: 0,
      low: 0,
    };

    // Calculate overall compliance
    const metCount = Array.from(requirementStatuses.values()).filter((s) => s === ComplianceStatus.MET).length;
    const notApplicableCount = Array.from(requirementStatuses.values()).filter(
      (s) => s === ComplianceStatus.NOT_APPLICABLE,
    ).length;
    const overallCompliance =
      requirements.length > 0
        ? Math.round(((metCount + notApplicableCount) / requirements.length) * 100)
        : 0;

    // Calculate trend (compare with previous period - 30 days ago)
    const trend = await this.calculateTrend(frameworkId, overallCompliance);

    return {
      frameworkId,
      frameworkName,
      frameworkCode,
      overallCompliance,
      totalRequirements: requirements.length,
      metRequirements: metCount,
      notMetRequirements: gaps.total,
      partiallyMetRequirements: Array.from(requirementStatuses.values()).filter(
        (s) => s === ComplianceStatus.PARTIALLY_MET,
      ).length,
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

  /**
   * Calculate trend by comparing current compliance with previous period
   */
  private async calculateTrend(
    frameworkId: string,
    currentCompliance: number,
  ): Promise<{ previousPeriod: number; change: number; trend: 'improving' | 'declining' | 'stable' } | undefined> {
    // For now, we'll use a simple approach: compare with compliance 30 days ago
    // In a production system, you'd store historical framework-specific compliance data
    // For this implementation, we'll estimate based on control implementation changes
    
    // Get controls mapped to this framework
    const mappings = await this.mappingRepository
      .createQueryBuilder('mapping')
      .leftJoinAndSelect('mapping.unified_control', 'control')
      .leftJoinAndSelect('mapping.framework_requirement', 'requirement')
      .where('requirement.framework_id = :frameworkId', { frameworkId })
      .getMany();

    const controlIds = mappings.map((m) => m.unified_control?.id).filter(Boolean) as string[];
    
    if (controlIds.length === 0) {
      return undefined;
    }

    // Estimate previous compliance based on recently implemented controls
    // Controls implemented in the last 30 days would have been "not implemented" before
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const controls = await this.controlRepository.find({
      where: { id: In(controlIds) },
    });

    // Count controls that were likely implemented recently (within last 30 days)
    // Use updated_at as a proxy for when implementation status changed to IMPLEMENTED
    const recentlyImplemented = controls.filter((c) => {
      if (c.implementation_status !== ImplementationStatus.IMPLEMENTED) return false;
      if (!c.updated_at) return false;
      return new Date(c.updated_at) >= thirtyDaysAgo;
    }).length;

    // Estimate previous compliance: assume recently implemented controls were not implemented before
    // This is a simplified calculation - in production, you'd store historical snapshots
    const totalControls = controls.length;
    const previouslyImplemented = controls.filter(
      (c) => c.implementation_status === ImplementationStatus.IMPLEMENTED,
    ).length - recentlyImplemented;
    
    // Estimate previous compliance percentage
    // This is approximate - assumes controls map roughly 1:1 to requirements
    const previousCompliance = totalControls > 0
      ? Math.round((previouslyImplemented / totalControls) * 100)
      : currentCompliance;

    const change = currentCompliance - previousCompliance;
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    
    if (change > 2) {
      trend = 'improving';
    } else if (change < -2) {
      trend = 'declining';
    }

    return {
      previousPeriod: previousCompliance,
      change: Math.round(change),
      trend,
    };
  }
}
