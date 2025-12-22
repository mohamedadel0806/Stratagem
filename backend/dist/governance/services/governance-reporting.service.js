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
exports.GovernanceReportingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const influencer_entity_1 = require("../influencers/entities/influencer.entity");
const policy_entity_1 = require("../policies/entities/policy.entity");
const policy_assignment_entity_1 = require("../policies/entities/policy-assignment.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const assessment_entity_1 = require("../assessments/entities/assessment.entity");
const finding_entity_1 = require("../findings/entities/finding.entity");
const report_query_dto_1 = require("../dto/report-query.dto");
function getStringify() {
    try {
        const csvStringifySync = require('csv-stringify/sync');
        return csvStringifySync.stringify || csvStringifySync;
    }
    catch (error) {
        console.error('Failed to load csv-stringify/sync:', error);
        throw new Error('CSV export functionality is not available');
    }
}
let GovernanceReportingService = class GovernanceReportingService {
    constructor(influencerRepository, policyRepository, assignmentRepository, unifiedControlRepository, assessmentRepository, findingRepository, entityManager) {
        this.influencerRepository = influencerRepository;
        this.policyRepository = policyRepository;
        this.assignmentRepository = assignmentRepository;
        this.unifiedControlRepository = unifiedControlRepository;
        this.assessmentRepository = assessmentRepository;
        this.findingRepository = findingRepository;
        this.entityManager = entityManager;
    }
    async generateReport(query) {
        switch (query.type) {
            case report_query_dto_1.ReportType.POLICY_COMPLIANCE:
                return this.generatePolicyComplianceReport(query);
            case report_query_dto_1.ReportType.INFLUENCER:
                return this.generateInfluencerReport(query);
            case report_query_dto_1.ReportType.CONTROL_IMPLEMENTATION:
                return this.generateControlImplementationReport(query);
            case report_query_dto_1.ReportType.ASSESSMENT:
                return this.generateAssessmentReport(query);
            case report_query_dto_1.ReportType.FINDINGS:
                return this.generateFindingsReport(query);
            case report_query_dto_1.ReportType.CONTROL_STATUS:
                return this.generateControlStatusReport(query);
            case report_query_dto_1.ReportType.EXECUTIVE_GOVERNANCE:
                return this.generateExecutiveGovernanceReport(query);
            default:
                throw new Error(`Unknown report type: ${query.type}`);
        }
    }
    async generateExecutiveGovernanceReport(query) {
        try {
            const summary = await this.getSummaryMetricsForReport();
            const controlStats = await this.getControlStatsForReport();
            const policyStats = await this.getPolicyStatsForReport();
            const findingStats = await this.getFindingStatsForReport();
            const rows = [
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Generated At', 'Value': new Date().toISOString() },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Total Influencers', 'Value': summary.totalInfluencers },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Total Policies', 'Value': summary.totalPolicies },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Policy Publication Rate', 'Value': `${Math.round((summary.publishedPolicies / (summary.totalPolicies || 1)) * 100)}%` },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Total Unified Controls', 'Value': summary.totalControls },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Control Implementation Rate', 'Value': `${Math.round((summary.implementedControls / (summary.totalControls || 1)) * 100)}%` },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Open Findings', 'Value': summary.openFindings },
                { 'Category': 'EXECUTIVE SUMMARY', 'Metric': 'Critical Gaps', 'Value': summary.criticalFindings },
                { 'Category': 'POLICIES', 'Metric': 'Published', 'Value': policyStats.byStatus.published },
                { 'Category': 'POLICIES', 'Metric': 'In Review', 'Value': policyStats.byStatus.inReview },
                { 'Category': 'POLICIES', 'Metric': 'Draft', 'Value': policyStats.byStatus.draft },
                { 'Category': 'POLICIES', 'Metric': 'Pending Review', 'Value': policyStats.pendingReview },
                { 'Category': 'CONTROLS', 'Metric': 'Active', 'Value': controlStats.byStatus.active },
                { 'Category': 'CONTROLS', 'Metric': 'Implemented', 'Value': controlStats.byImplementation.implemented },
                { 'Category': 'CONTROLS', 'Metric': 'In Progress', 'Value': controlStats.byImplementation.inProgress },
                { 'Category': 'CONTROLS', 'Metric': 'Planned', 'Value': controlStats.byImplementation.planned },
                { 'Category': 'FINDINGS', 'Metric': 'Total Open', 'Value': findingStats.byStatus.open },
                { 'Category': 'FINDINGS', 'Metric': 'Critical Severity', 'Value': findingStats.bySeverity.critical },
                { 'Category': 'FINDINGS', 'Metric': 'High Severity', 'Value': findingStats.bySeverity.high },
                { 'Category': 'FINDINGS', 'Metric': 'Overdue Remediation', 'Value': findingStats.overdueRemediation },
            ];
            return this.exportToCsv(rows, 'executive_governance_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate executive report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'executive_report_error', query.format);
        }
    }
    async getSummaryMetricsForReport() {
        return {
            totalInfluencers: await this.influencerRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            publishedPolicies: await this.policyRepository.count({ where: { status: policy_entity_1.PolicyStatus.PUBLISHED, deleted_at: (0, typeorm_2.IsNull)() } }),
            totalPolicies: await this.policyRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            totalControls: await this.unifiedControlRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            implementedControls: await this.unifiedControlRepository.count({ where: { implementation_status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED, deleted_at: (0, typeorm_2.IsNull)() } }),
            openFindings: await this.findingRepository.count({ where: { status: finding_entity_1.FindingStatus.OPEN, deleted_at: (0, typeorm_2.IsNull)() } }),
            criticalFindings: await this.findingRepository.count({ where: { severity: finding_entity_1.FindingSeverity.CRITICAL, deleted_at: (0, typeorm_2.IsNull)() } }),
        };
    }
    async getControlStatsForReport() {
        return {
            byStatus: {
                active: await this.unifiedControlRepository.count({ where: { status: unified_control_entity_1.ControlStatus.ACTIVE, deleted_at: (0, typeorm_2.IsNull)() } }),
            },
            byImplementation: {
                implemented: await this.unifiedControlRepository.count({ where: { implementation_status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED, deleted_at: (0, typeorm_2.IsNull)() } }),
                inProgress: await this.unifiedControlRepository.count({ where: { implementation_status: unified_control_entity_1.ImplementationStatus.IN_PROGRESS, deleted_at: (0, typeorm_2.IsNull)() } }),
                planned: await this.unifiedControlRepository.count({ where: { implementation_status: unified_control_entity_1.ImplementationStatus.PLANNED, deleted_at: (0, typeorm_2.IsNull)() } }),
            }
        };
    }
    async getPolicyStatsForReport() {
        return {
            byStatus: {
                published: await this.policyRepository.count({ where: { status: policy_entity_1.PolicyStatus.PUBLISHED, deleted_at: (0, typeorm_2.IsNull)() } }),
                inReview: await this.policyRepository.count({ where: { status: policy_entity_1.PolicyStatus.IN_REVIEW, deleted_at: (0, typeorm_2.IsNull)() } }),
                draft: await this.policyRepository.count({ where: { status: policy_entity_1.PolicyStatus.DRAFT, deleted_at: (0, typeorm_2.IsNull)() } }),
            },
            pendingReview: await this.policyRepository.count({ where: { next_review_date: (0, typeorm_2.LessThanOrEqual)(new Date()), deleted_at: (0, typeorm_2.IsNull)() } }),
        };
    }
    async getFindingStatsForReport() {
        return {
            byStatus: {
                open: await this.findingRepository.count({ where: { status: finding_entity_1.FindingStatus.OPEN, deleted_at: (0, typeorm_2.IsNull)() } }),
            },
            bySeverity: {
                critical: await this.findingRepository.count({ where: { severity: finding_entity_1.FindingSeverity.CRITICAL, deleted_at: (0, typeorm_2.IsNull)() } }),
                high: await this.findingRepository.count({ where: { severity: finding_entity_1.FindingSeverity.HIGH, deleted_at: (0, typeorm_2.IsNull)() } }),
            },
            overdueRemediation: await this.findingRepository.createQueryBuilder('f')
                .where('f.remediation_due_date < :now', { now: new Date() })
                .andWhere('f.status IN (:...s)', { statuses: [finding_entity_1.FindingStatus.OPEN, finding_entity_1.FindingStatus.IN_PROGRESS] })
                .getCount(),
        };
    }
    async getPolicyComplianceStats() {
        const policies = await this.policyRepository.find({
            where: { status: policy_entity_1.PolicyStatus.PUBLISHED, deleted_at: (0, typeorm_2.IsNull)() },
        });
        const stats = await Promise.all(policies.map(async (policy) => {
            const totalAssignments = await this.assignmentRepository.count({
                where: { policy_id: policy.id },
            });
            const acknowledged = await this.assignmentRepository.count({
                where: { policy_id: policy.id, acknowledged: true },
            });
            return {
                id: policy.id,
                title: policy.title,
                totalAssignments,
                acknowledged,
                rate: totalAssignments > 0 ? Math.round((acknowledged / totalAssignments) * 100) : 0,
            };
        }));
        const buStats = await this.entityManager.query(`
      SELECT 
        bu.name as department,
        COUNT(pa.id) as total,
        COUNT(CASE WHEN pa.acknowledged = true THEN 1 END) as acknowledged
      FROM policy_assignments pa
      LEFT JOIN users u ON pa.user_id = u.id
      LEFT JOIN business_units bu ON u.business_unit_id = bu.id
      WHERE bu.id IS NOT NULL
      GROUP BY bu.name
    `);
        return {
            byPolicy: stats,
            byDepartment: buStats.map(s => ({
                department: s.department,
                total: parseInt(s.total),
                acknowledged: parseInt(s.acknowledged),
                rate: parseInt(s.total) > 0 ? Math.round((parseInt(s.acknowledged) / parseInt(s.total)) * 100) : 0
            })),
        };
    }
    async generatePolicyComplianceReport(query) {
        try {
            const where = { deleted_at: (0, typeorm_2.IsNull)() };
            if (query.status) {
                where.status = query.status;
            }
            if (query.startDate && query.endDate) {
                where.created_at = (0, typeorm_2.Between)(new Date(query.startDate), new Date(query.endDate));
            }
            let policies;
            try {
                policies = await this.policyRepository.find({
                    where,
                    relations: ['owner', 'creator'],
                    order: { created_at: 'DESC' },
                });
            }
            catch (queryError) {
                try {
                    policies = await this.policyRepository.find({
                        where,
                        order: { created_at: 'DESC' },
                    });
                }
                catch (fallbackError) {
                    throw new Error(`Database query failed: ${fallbackError.message}`);
                }
            }
            const formatDate = (date) => {
                if (!date)
                    return '';
                if (typeof date === 'string') {
                    if (date.match(/^\d{4}-\d{2}-\d{2}/))
                        return date;
                    const parsed = new Date(date);
                    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
                }
                try {
                    return date.toISOString().split('T')[0];
                }
                catch (_a) {
                    return '';
                }
            };
            const rows = policies.map((policy) => {
                try {
                    return {
                        'Policy ID': policy.id || '',
                        'Title': policy.title || '',
                        'Type': policy.policy_type || '',
                        'Version': policy.version_number || policy.version || 1,
                        'Status': policy.status || '',
                        'Owner': policy.owner
                            ? `${policy.owner.firstName || ''} ${policy.owner.lastName || ''}`.trim()
                            : '',
                        'Effective Date': formatDate(policy.effective_date),
                        'Next Review Date': formatDate(policy.next_review_date),
                        'Published Date': formatDate(policy.published_date),
                        'Created By': policy.creator
                            ? `${policy.creator.firstName || ''} ${policy.creator.lastName || ''}`.trim()
                            : '',
                        'Created At': formatDate(policy.created_at),
                        'Updated At': formatDate(policy.updated_at),
                    };
                }
                catch (error) {
                    return {
                        'Policy ID': policy.id || '',
                        'Title': policy.title || 'Error processing policy',
                        'Type': '',
                        'Version': '',
                        'Status': '',
                        'Owner': '',
                        'Effective Date': '',
                        'Next Review Date': '',
                        'Published Date': '',
                        'Created By': '',
                        'Created At': '',
                        'Updated At': '',
                    };
                }
            });
            return this.exportToCsv(rows, 'policy_compliance_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate policy compliance report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'policy_compliance_report_error', query.format);
        }
    }
    async generateInfluencerReport(query) {
        try {
            const where = { deleted_at: (0, typeorm_2.IsNull)() };
            if (query.status) {
                where.status = query.status;
            }
            if (query.startDate && query.endDate) {
                where.created_at = (0, typeorm_2.Between)(new Date(query.startDate), new Date(query.endDate));
            }
            let influencers;
            try {
                influencers = await this.influencerRepository.find({
                    where,
                    relations: ['owner', 'creator'],
                    order: { created_at: 'DESC' },
                });
            }
            catch (queryError) {
                try {
                    influencers = await this.influencerRepository.find({
                        where,
                        order: { created_at: 'DESC' },
                    });
                }
                catch (fallbackError) {
                    throw new Error(`Database query failed: ${fallbackError.message}`);
                }
            }
            const formatDate = (date) => {
                if (!date)
                    return '';
                if (typeof date === 'string') {
                    if (date.match(/^\d{4}-\d{2}-\d{2}/))
                        return date;
                    const parsed = new Date(date);
                    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
                }
                try {
                    return date.toISOString().split('T')[0];
                }
                catch (_a) {
                    return '';
                }
            };
            const rows = influencers.map((influencer) => {
                try {
                    return {
                        'Influencer ID': influencer.id || '',
                        'Name': influencer.name || '',
                        'Category': influencer.category || '',
                        'Sub Category': influencer.sub_category || '',
                        'Issuing Authority': influencer.issuing_authority || '',
                        'Jurisdiction': influencer.jurisdiction || '',
                        'Reference Number': influencer.reference_number || '',
                        'Status': influencer.status || '',
                        'Applicability Status': influencer.applicability_status || '',
                        'Publication Date': formatDate(influencer.publication_date),
                        'Effective Date': formatDate(influencer.effective_date),
                        'Next Review Date': formatDate(influencer.next_review_date),
                        'Owner': influencer.owner
                            ? `${influencer.owner.firstName || ''} ${influencer.owner.lastName || ''}`.trim()
                            : '',
                        'Created At': formatDate(influencer.created_at),
                        'Updated At': formatDate(influencer.updated_at),
                    };
                }
                catch (error) {
                    return {
                        'Influencer ID': influencer.id || '',
                        'Name': influencer.name || 'Error processing influencer',
                        'Category': '',
                        'Sub Category': '',
                        'Issuing Authority': '',
                        'Jurisdiction': '',
                        'Reference Number': '',
                        'Status': '',
                        'Applicability Status': '',
                        'Publication Date': '',
                        'Effective Date': '',
                        'Next Review Date': '',
                        'Owner': '',
                        'Created At': '',
                        'Updated At': '',
                    };
                }
            });
            return this.exportToCsv(rows, 'influencer_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate influencer report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'influencer_report_error', query.format);
        }
    }
    async generateControlImplementationReport(query) {
        try {
            const where = { deleted_at: (0, typeorm_2.IsNull)() };
            if (query.status) {
                where.status = query.status;
            }
            let controls;
            try {
                controls = await this.unifiedControlRepository.find({
                    where,
                    relations: ['control_owner', 'creator'],
                    order: { created_at: 'DESC' },
                });
            }
            catch (queryError) {
                try {
                    controls = await this.unifiedControlRepository.find({
                        where,
                        order: { created_at: 'DESC' },
                    });
                }
                catch (fallbackError) {
                    throw new Error(`Database query failed: ${fallbackError.message}`);
                }
            }
            const formatDate = (date) => {
                if (!date)
                    return '';
                if (typeof date === 'string') {
                    if (date.match(/^\d{4}-\d{2}-\d{2}/))
                        return date;
                    const parsed = new Date(date);
                    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
                }
                try {
                    return date.toISOString().split('T')[0];
                }
                catch (_a) {
                    return '';
                }
            };
            const rows = controls.map((control) => {
                try {
                    return {
                        'Control ID': control.id || '',
                        'Control Identifier': control.control_identifier || '',
                        'Title': control.title || '',
                        'Domain': control.domain || '',
                        'Control Type': control.control_type || '',
                        'Status': control.status || '',
                        'Implementation Status': control.implementation_status || '',
                        'Owner': control.control_owner
                            ? `${control.control_owner.firstName || ''} ${control.control_owner.lastName || ''}`.trim()
                            : '',
                        'Target Implementation Date': formatDate(control.target_implementation_date),
                        'Actual Implementation Date': formatDate(control.actual_implementation_date),
                        'Created At': formatDate(control.created_at),
                        'Updated At': formatDate(control.updated_at),
                    };
                }
                catch (error) {
                    return {
                        'Control ID': control.id || '',
                        'Control Identifier': control.control_identifier || 'Error processing control',
                        'Title': '',
                        'Domain': '',
                        'Control Type': '',
                        'Status': '',
                        'Implementation Status': '',
                        'Owner': '',
                        'Target Implementation Date': '',
                        'Actual Implementation Date': '',
                        'Created At': '',
                        'Updated At': '',
                    };
                }
            });
            return this.exportToCsv(rows, 'control_implementation_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate control implementation report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'control_implementation_report_error', query.format);
        }
    }
    async generateAssessmentReport(query) {
        try {
            const where = { deleted_at: (0, typeorm_2.IsNull)() };
            if (query.status) {
                where.status = query.status;
            }
            if (query.startDate && query.endDate) {
                where.start_date = (0, typeorm_2.Between)(new Date(query.startDate), new Date(query.endDate));
            }
            let assessments;
            try {
                assessments = await this.assessmentRepository.find({
                    where,
                    relations: ['lead_assessor', 'creator'],
                    order: { created_at: 'DESC' },
                });
            }
            catch (queryError) {
                try {
                    assessments = await this.assessmentRepository.find({
                        where,
                        order: { created_at: 'DESC' },
                    });
                }
                catch (fallbackError) {
                    throw new Error(`Database query failed: ${fallbackError.message}`);
                }
            }
            const formatDate = (date) => {
                if (!date)
                    return '';
                if (typeof date === 'string') {
                    if (date.match(/^\d{4}-\d{2}-\d{2}/))
                        return date;
                    const parsed = new Date(date);
                    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
                }
                try {
                    return date.toISOString().split('T')[0];
                }
                catch (_a) {
                    return '';
                }
            };
            const rows = assessments.map((assessment) => {
                try {
                    return {
                        'Assessment ID': assessment.id || '',
                        'Assessment Identifier': assessment.assessment_identifier || '',
                        'Name': assessment.name || '',
                        'Type': assessment.assessment_type || '',
                        'Status': assessment.status || '',
                        'Start Date': formatDate(assessment.start_date),
                        'End Date': formatDate(assessment.end_date),
                        'Lead Assessor': assessment.lead_assessor
                            ? `${assessment.lead_assessor.firstName || ''} ${assessment.lead_assessor.lastName || ''}`.trim()
                            : '',
                        'Controls Total': assessment.controls_total || 0,
                        'Controls Assessed': assessment.controls_assessed || 0,
                        'Overall Score': assessment.overall_score || 0,
                        'Findings Critical': assessment.findings_critical || 0,
                        'Findings High': assessment.findings_high || 0,
                        'Findings Medium': assessment.findings_medium || 0,
                        'Findings Low': assessment.findings_low || 0,
                        'Created At': formatDate(assessment.created_at),
                        'Updated At': formatDate(assessment.updated_at),
                    };
                }
                catch (error) {
                    return {
                        'Assessment ID': assessment.id || '',
                        'Assessment Identifier': assessment.assessment_identifier || 'Error processing assessment',
                        'Name': '',
                        'Type': '',
                        'Status': '',
                        'Start Date': '',
                        'End Date': '',
                        'Lead Assessor': '',
                        'Controls Total': 0,
                        'Controls Assessed': 0,
                        'Overall Score': 0,
                        'Findings Critical': 0,
                        'Findings High': 0,
                        'Findings Medium': 0,
                        'Findings Low': 0,
                        'Created At': '',
                        'Updated At': '',
                    };
                }
            });
            return this.exportToCsv(rows, 'assessment_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate assessment report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'assessment_report_error', query.format);
        }
    }
    async generateFindingsReport(query) {
        try {
            const where = { deleted_at: (0, typeorm_2.IsNull)() };
            if (query.status) {
                where.status = query.status;
            }
            if (query.startDate && query.endDate) {
                where.finding_date = (0, typeorm_2.Between)(new Date(query.startDate), new Date(query.endDate));
            }
            let findings;
            try {
                findings = await this.findingRepository.find({
                    where,
                    relations: ['remediation_owner', 'unified_control', 'creator'],
                    order: { finding_date: 'DESC' },
                });
            }
            catch (queryError) {
                try {
                    findings = await this.findingRepository.find({
                        where,
                        order: { finding_date: 'DESC' },
                    });
                }
                catch (fallbackError) {
                    throw new Error(`Database query failed: ${fallbackError.message}`);
                }
            }
            const formatDate = (date) => {
                if (!date)
                    return '';
                if (typeof date === 'string') {
                    if (date.match(/^\d{4}-\d{2}-\d{2}/))
                        return date;
                    const parsed = new Date(date);
                    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
                }
                try {
                    return date.toISOString().split('T')[0];
                }
                catch (_a) {
                    return '';
                }
            };
            const rows = findings.map((finding) => {
                var _a;
                try {
                    return {
                        'Finding ID': finding.id || '',
                        'Finding Identifier': finding.finding_identifier || '',
                        'Title': finding.title || '',
                        'Severity': finding.severity || '',
                        'Status': finding.status || '',
                        'Finding Date': formatDate(finding.finding_date),
                        'Control Identifier': ((_a = finding.unified_control) === null || _a === void 0 ? void 0 : _a.control_identifier) || '',
                        'Remediation Owner': finding.remediation_owner
                            ? `${finding.remediation_owner.firstName || ''} ${finding.remediation_owner.lastName || ''}`.trim()
                            : '',
                        'Remediation Due Date': formatDate(finding.remediation_due_date),
                        'Remediation Completed Date': formatDate(finding.remediation_completed_date),
                        'Retest Required': finding.retest_required ? 'Yes' : 'No',
                        'Created At': formatDate(finding.created_at),
                        'Updated At': formatDate(finding.updated_at),
                    };
                }
                catch (error) {
                    return {
                        'Finding ID': finding.id || '',
                        'Finding Identifier': finding.finding_identifier || 'Error processing finding',
                        'Title': '',
                        'Severity': '',
                        'Status': '',
                        'Finding Date': '',
                        'Control Identifier': '',
                        'Remediation Owner': '',
                        'Remediation Due Date': '',
                        'Remediation Completed Date': '',
                        'Retest Required': '',
                        'Created At': '',
                        'Updated At': '',
                    };
                }
            });
            return this.exportToCsv(rows, 'findings_report', query.format);
        }
        catch (error) {
            const errorRows = [{ Error: `Failed to generate findings report: ${error.message}` }];
            return this.exportToCsv(errorRows, 'findings_report_error', query.format);
        }
    }
    async generateControlStatusReport(query) {
        const controls = await this.unifiedControlRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['control_owner'],
            order: { domain: 'ASC', control_identifier: 'ASC' },
        });
        const statusCounts = {};
        const implementationCounts = {};
        const domainCounts = {};
        controls.forEach((control) => {
            statusCounts[control.status] = (statusCounts[control.status] || 0) + 1;
            implementationCounts[control.implementation_status] =
                (implementationCounts[control.implementation_status] || 0) + 1;
            domainCounts[control.domain || 'Uncategorized'] = (domainCounts[control.domain || 'Uncategorized'] || 0) + 1;
        });
        const rows = [
            { 'Metric': 'Total Controls', 'Value': controls.length },
            { 'Metric': '', 'Value': '' },
            { 'Metric': 'By Status', 'Value': '' },
            ...Object.entries(statusCounts).map(([status, count]) => ({ 'Metric': `  ${status}`, 'Value': count })),
            { 'Metric': '', 'Value': '' },
            { 'Metric': 'By Implementation', 'Value': '' },
            ...Object.entries(implementationCounts).map(([status, count]) => ({
                'Metric': `  ${status}`,
                'Value': count,
            })),
            { 'Metric': '', 'Value': '' },
            { 'Metric': 'By Domain', 'Value': '' },
            ...Object.entries(domainCounts).map(([domain, count]) => ({ 'Metric': `  ${domain}`, 'Value': count })),
        ];
        return this.exportToCsv(rows, 'control_status_report', query.format);
    }
    exportToCsv(rows, baseFilename, format = report_query_dto_1.ExportFormat.CSV) {
        try {
            let csvContent;
            const stringify = getStringify();
            if (rows.length === 0) {
                csvContent = stringify([], { header: true, columns: ['No Data Available'] });
            }
            else {
                csvContent = stringify(rows, { header: true });
            }
            const buffer = Buffer.from(csvContent, 'utf-8');
            const dateStr = new Date().toISOString().split('T')[0];
            return {
                data: buffer,
                filename: `${baseFilename}-${dateStr}.csv`,
                contentType: 'text/csv; charset=utf-8',
            };
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred';
            const errorRow = [{ Error: `Failed to generate report: ${errorMessage}` }];
            try {
                const stringify = getStringify();
                const csvContent = stringify(errorRow, { header: true });
                const buffer = Buffer.from(csvContent, 'utf-8');
                return {
                    data: buffer,
                    filename: `${baseFilename}_error.csv`,
                    contentType: 'text/csv; charset=utf-8',
                };
            }
            catch (fallbackError) {
                const simpleCsv = `Error\nFailed to generate report: ${errorMessage}\n`;
                return {
                    data: Buffer.from(simpleCsv, 'utf-8'),
                    filename: `${baseFilename}_error.csv`,
                    contentType: 'text/csv; charset=utf-8',
                };
            }
        }
    }
    generateErrorCsv(errorMessage, reportType) {
        const errorRow = [{ Error: errorMessage }];
        try {
            const stringify = getStringify();
            const csvContent = stringify(errorRow, { header: true });
            const buffer = Buffer.from(csvContent, 'utf-8');
            return {
                data: buffer,
                filename: `${reportType}_error.csv`,
                contentType: 'text/csv; charset=utf-8',
            };
        }
        catch (fallbackError) {
            const simpleCsv = `Error\n${errorMessage}\n`;
            return {
                data: Buffer.from(simpleCsv, 'utf-8'),
                filename: `${reportType}_error.csv`,
                contentType: 'text/csv; charset=utf-8',
            };
        }
    }
};
exports.GovernanceReportingService = GovernanceReportingService;
exports.GovernanceReportingService = GovernanceReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(policy_assignment_entity_1.PolicyAssignment)),
    __param(3, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(4, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(5, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __param(6, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager])
], GovernanceReportingService);
//# sourceMappingURL=governance-reporting.service.js.map