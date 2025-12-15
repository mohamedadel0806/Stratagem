import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  GapAnalysisDto,
  FrameworkGapSummaryDto,
  RequirementGapDto,
  GapAnalysisQueryDto,
} from '../dto/gap-analysis.dto';

@Injectable()
export class GapAnalysisService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async performGapAnalysis(query?: GapAnalysisQueryDto): Promise<GapAnalysisDto> {
    // Parse framework IDs if provided
    const frameworkIds = query?.frameworkIds
      ? query.frameworkIds.split(',').map((id) => id.trim())
      : null;

    // Get all frameworks (or filtered ones)
    let frameworksQuery = `
      SELECT 
        f.id,
        f.name,
        f.code,
        f.description,
        COUNT(DISTINCT fr.id) as total_requirements
      FROM compliance_frameworks f
      LEFT JOIN framework_requirements fr ON fr.framework_id = f.id
    `;

    if (frameworkIds && frameworkIds.length > 0) {
      frameworksQuery += ` WHERE f.id = ANY($1::uuid[])`;
    }

    frameworksQuery += ` GROUP BY f.id, f.name, f.code, f.description ORDER BY f.name`;

    const frameworksResult = frameworkIds && frameworkIds.length > 0
      ? await this.entityManager.query(frameworksQuery, [frameworkIds])
      : await this.entityManager.query(frameworksQuery);

    const frameworkGaps: FrameworkGapSummaryDto[] = [];
    const allGaps: RequirementGapDto[] = [];

    // Analyze each framework
    for (const framework of frameworksResult) {
      const frameworkGap = await this.analyzeFrameworkGaps(
        framework.id,
        framework.name,
        parseInt(framework.total_requirements) || 0,
        query,
      );

      if (frameworkGap) {
        frameworkGaps.push(frameworkGap);
        allGaps.push(...frameworkGap.gaps);
      }
    }

    // Calculate overall statistics
    const totalRequirements = frameworkGaps.reduce((sum, fw) => sum + fw.totalRequirements, 0);
    const totalMapped = frameworkGaps.reduce((sum, fw) => sum + fw.mappedRequirements, 0);
    const totalUnmapped = frameworkGaps.reduce((sum, fw) => sum + fw.unmappedRequirements, 0);
    const overallCoverage =
      totalRequirements > 0 ? Math.round((totalMapped / totalRequirements) * 100) : 0;

    const criticalGapsCount = allGaps.filter(
      (gap) => gap.gapSeverity === 'critical' || gap.gapSeverity === 'high',
    ).length;

    // Generate recommendations
    const recommendations = this.generateRecommendations(frameworkGaps, allGaps);

    return {
      generatedAt: new Date(),
      totalFrameworks: frameworkGaps.length,
      totalRequirements,
      totalMappedRequirements: totalMapped,
      totalUnmappedRequirements: totalUnmapped,
      overallCoveragePercentage: overallCoverage,
      frameworks: frameworkGaps,
      allGaps,
      criticalGapsCount,
      recommendations,
    };
  }

  private async analyzeFrameworkGaps(
    frameworkId: string,
    frameworkName: string,
    totalRequirements: number,
    query?: GapAnalysisQueryDto,
  ): Promise<FrameworkGapSummaryDto | null> {
    if (totalRequirements === 0) {
      return null;
    }

    // Get all requirements for this framework with their mapping status
    let requirementsQuery = `
      SELECT 
        fr.id as requirement_id,
        fr.requirement_identifier,
        fr.requirement_text,
        fr.domain,
        fr.category,
        fr.priority,
        fr.sub_category,
        COUNT(DISTINCT fcm.id) as mapped_controls_count,
        COALESCE(
          CASE 
            WHEN COUNT(DISTINCT fcm.id) = 0 THEN 'none'
            WHEN COUNT(DISTINCT CASE WHEN fcm.coverage_level = 'full' THEN fcm.id END) > 0 THEN 'full'
            ELSE 'partial'
          END,
          'none'
        ) as coverage_level
      FROM framework_requirements fr
      LEFT JOIN framework_control_mappings fcm ON fcm.framework_requirement_id = fr.id
      WHERE fr.framework_id = $1
    `;

    const queryParams: any[] = [frameworkId];

    // Apply filters
    if (query?.domain) {
      requirementsQuery += ` AND fr.domain = $${queryParams.length + 1}`;
      queryParams.push(query.domain);
    }

    if (query?.category) {
      requirementsQuery += ` AND fr.category = $${queryParams.length + 1}`;
      queryParams.push(query.category);
    }

    requirementsQuery += `
      GROUP BY 
        fr.id, 
        fr.requirement_identifier, 
        fr.requirement_text,
        fr.domain,
        fr.category,
        fr.priority,
        fr.sub_category
      ORDER BY fr.requirement_identifier
    `;

    const requirements = await this.entityManager.query(requirementsQuery, queryParams);

    // Filter by priority if requested
    let filteredRequirements = requirements;
    if (query?.priorityOnly) {
      filteredRequirements = requirements.filter(
        (req: any) => req.priority === 'critical' || req.priority === 'high',
      );
    }

    // Calculate gaps
    const gaps: RequirementGapDto[] = filteredRequirements
      .filter((req: any) => parseInt(req.mapped_controls_count) === 0)
      .map((req: any) => {
        // Determine gap severity based on priority
        let gapSeverity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        if (req.priority === 'critical') {
          gapSeverity = 'critical';
        } else if (req.priority === 'high') {
          gapSeverity = 'high';
        } else if (req.priority === 'medium') {
          gapSeverity = 'medium';
        } else {
          gapSeverity = 'low';
        }

        return {
          requirementId: req.requirement_id,
          requirementIdentifier: req.requirement_identifier,
          requirementText: req.requirement_text,
          frameworkId,
          frameworkName,
          domain: req.domain,
          category: req.category,
          priority: req.priority,
          coverageLevel: 'none',
          mappedControlsCount: 0,
          gapSeverity,
        };
      });

    // Calculate partial coverage requirements
    const partialCoverageRequirements = filteredRequirements.filter(
      (req: any) =>
        parseInt(req.mapped_controls_count) > 0 && req.coverage_level !== 'full',
    ).length;

    // Calculate mapped requirements
    const mappedRequirements = filteredRequirements.filter(
      (req: any) => parseInt(req.mapped_controls_count) > 0,
    ).length;

    const unmappedRequirements = gaps.length;
    const coveragePercentage =
      totalRequirements > 0
        ? Math.round((mappedRequirements / totalRequirements) * 100)
        : 0;

    const criticalGapsCount = gaps.filter((g) => g.gapSeverity === 'critical').length;
    const highPriorityGapsCount = gaps.filter((g) => g.gapSeverity === 'high').length;

    return {
      frameworkId,
      frameworkName,
      totalRequirements,
      mappedRequirements,
      unmappedRequirements,
      partialCoverageRequirements,
      coveragePercentage,
      gaps,
      criticalGapsCount,
      highPriorityGapsCount,
    };
  }

  private generateRecommendations(
    frameworkGaps: FrameworkGapSummaryDto[],
    allGaps: RequirementGapDto[],
  ): string[] {
    const recommendations: string[] = [];

    // Overall coverage recommendation
    const avgCoverage = frameworkGaps.reduce((sum, fw) => sum + fw.coveragePercentage, 0) / frameworkGaps.length;
    if (avgCoverage < 50) {
      recommendations.push(`Overall framework coverage is low (${Math.round(avgCoverage)}%). Consider mapping more controls to requirements.`);
    }

    // Critical gaps
    const criticalGaps = allGaps.filter((g) => g.gapSeverity === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push(
        `There are ${criticalGaps.length} critical priority requirements without controls. These should be addressed immediately.`,
      );
    }

    // High priority gaps
    const highGaps = allGaps.filter((g) => g.gapSeverity === 'high');
    if (highGaps.length > 0) {
      recommendations.push(
        `There are ${highGaps.length} high priority requirements without controls. Prioritize mapping controls to these requirements.`,
      );
    }

    // Framework-specific recommendations
    const lowCoverageFrameworks = frameworkGaps.filter((fw) => fw.coveragePercentage < 60);
    if (lowCoverageFrameworks.length > 0) {
      recommendations.push(
        `Frameworks with low coverage: ${lowCoverageFrameworks.map((f) => f.frameworkName).join(', ')}. Focus on improving coverage for these frameworks.`,
      );
    }

    // Partial coverage recommendation
    const partialCoverageCount = frameworkGaps.reduce(
      (sum, fw) => sum + fw.partialCoverageRequirements,
      0,
    );
    if (partialCoverageCount > 0) {
      recommendations.push(
        `There are ${partialCoverageCount} requirements with only partial control coverage. Consider adding additional controls or improving existing mappings.`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Framework coverage looks good! All requirements have appropriate controls mapped.');
    }

    return recommendations;
  }
}

