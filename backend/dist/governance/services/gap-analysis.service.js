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
exports.GapAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let GapAnalysisService = class GapAnalysisService {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async performGapAnalysis(query) {
        const frameworkIds = (query === null || query === void 0 ? void 0 : query.frameworkIds)
            ? query.frameworkIds.split(',').map((id) => id.trim())
            : null;
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
        const frameworkGaps = [];
        const allGaps = [];
        for (const framework of frameworksResult) {
            const frameworkGap = await this.analyzeFrameworkGaps(framework.id, framework.name, parseInt(framework.total_requirements) || 0, query);
            if (frameworkGap) {
                frameworkGaps.push(frameworkGap);
                allGaps.push(...frameworkGap.gaps);
            }
        }
        const totalRequirements = frameworkGaps.reduce((sum, fw) => sum + fw.totalRequirements, 0);
        const totalMapped = frameworkGaps.reduce((sum, fw) => sum + fw.mappedRequirements, 0);
        const totalUnmapped = frameworkGaps.reduce((sum, fw) => sum + fw.unmappedRequirements, 0);
        const overallCoverage = totalRequirements > 0 ? Math.round((totalMapped / totalRequirements) * 100) : 0;
        const criticalGapsCount = allGaps.filter((gap) => gap.gapSeverity === 'critical' || gap.gapSeverity === 'high').length;
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
    async analyzeFrameworkGaps(frameworkId, frameworkName, totalRequirements, query) {
        if (totalRequirements === 0) {
            return null;
        }
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
        const queryParams = [frameworkId];
        if (query === null || query === void 0 ? void 0 : query.domain) {
            requirementsQuery += ` AND fr.domain = $${queryParams.length + 1}`;
            queryParams.push(query.domain);
        }
        if (query === null || query === void 0 ? void 0 : query.category) {
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
        let filteredRequirements = requirements;
        if (query === null || query === void 0 ? void 0 : query.priorityOnly) {
            filteredRequirements = requirements.filter((req) => req.priority === 'critical' || req.priority === 'high');
        }
        const gaps = filteredRequirements
            .filter((req) => parseInt(req.mapped_controls_count) === 0)
            .map((req) => {
            let gapSeverity = 'medium';
            if (req.priority === 'critical') {
                gapSeverity = 'critical';
            }
            else if (req.priority === 'high') {
                gapSeverity = 'high';
            }
            else if (req.priority === 'medium') {
                gapSeverity = 'medium';
            }
            else {
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
        const partialCoverageRequirements = filteredRequirements.filter((req) => parseInt(req.mapped_controls_count) > 0 && req.coverage_level !== 'full').length;
        const mappedRequirements = filteredRequirements.filter((req) => parseInt(req.mapped_controls_count) > 0).length;
        const unmappedRequirements = gaps.length;
        const coveragePercentage = totalRequirements > 0
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
    generateRecommendations(frameworkGaps, allGaps) {
        const recommendations = [];
        const avgCoverage = frameworkGaps.reduce((sum, fw) => sum + fw.coveragePercentage, 0) / frameworkGaps.length;
        if (avgCoverage < 50) {
            recommendations.push(`Overall framework coverage is low (${Math.round(avgCoverage)}%). Consider mapping more controls to requirements.`);
        }
        const criticalGaps = allGaps.filter((g) => g.gapSeverity === 'critical');
        if (criticalGaps.length > 0) {
            recommendations.push(`There are ${criticalGaps.length} critical priority requirements without controls. These should be addressed immediately.`);
        }
        const highGaps = allGaps.filter((g) => g.gapSeverity === 'high');
        if (highGaps.length > 0) {
            recommendations.push(`There are ${highGaps.length} high priority requirements without controls. Prioritize mapping controls to these requirements.`);
        }
        const lowCoverageFrameworks = frameworkGaps.filter((fw) => fw.coveragePercentage < 60);
        if (lowCoverageFrameworks.length > 0) {
            recommendations.push(`Frameworks with low coverage: ${lowCoverageFrameworks.map((f) => f.frameworkName).join(', ')}. Focus on improving coverage for these frameworks.`);
        }
        const partialCoverageCount = frameworkGaps.reduce((sum, fw) => sum + fw.partialCoverageRequirements, 0);
        if (partialCoverageCount > 0) {
            recommendations.push(`There are ${partialCoverageCount} requirements with only partial control coverage. Consider adding additional controls or improving existing mappings.`);
        }
        if (recommendations.length === 0) {
            recommendations.push('Framework coverage looks good! All requirements have appropriate controls mapped.');
        }
        return recommendations;
    }
};
exports.GapAnalysisService = GapAnalysisService;
exports.GapAnalysisService = GapAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], GapAnalysisService);
//# sourceMappingURL=gap-analysis.service.js.map