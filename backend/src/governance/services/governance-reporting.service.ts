import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between, In } from 'typeorm';
import { Influencer } from '../influencers/entities/influencer.entity';
import { Policy, PolicyStatus } from '../policies/entities/policy.entity';
import { UnifiedControl, ControlStatus, ImplementationStatus } from '../unified-controls/entities/unified-control.entity';
import { Assessment, AssessmentStatus } from '../assessments/entities/assessment.entity';
import { Finding, FindingStatus, FindingSeverity } from '../findings/entities/finding.entity';
import { ReportType, ExportFormat, ReportQueryDto } from '../dto/report-query.dto';

// Lazy load csv-stringify to avoid module loading errors at startup
function getStringify() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const csvStringifySync = require('csv-stringify/sync');
    return csvStringifySync.stringify || csvStringifySync;
  } catch (error) {
    console.error('Failed to load csv-stringify/sync:', error);
    throw new Error('CSV export functionality is not available');
  }
}

@Injectable()
export class GovernanceReportingService {
  constructor(
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private unifiedControlRepository: Repository<UnifiedControl>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Finding)
    private findingRepository: Repository<Finding>,
  ) {}

  async generateReport(query: ReportQueryDto): Promise<{ data: any; filename: string; contentType: string }> {
    switch (query.type) {
      case ReportType.POLICY_COMPLIANCE:
        return this.generatePolicyComplianceReport(query);
      case ReportType.INFLUENCER:
        return this.generateInfluencerReport(query);
      case ReportType.CONTROL_IMPLEMENTATION:
        return this.generateControlImplementationReport(query);
      case ReportType.ASSESSMENT:
        return this.generateAssessmentReport(query);
      case ReportType.FINDINGS:
        return this.generateFindingsReport(query);
      case ReportType.CONTROL_STATUS:
        return this.generateControlStatusReport(query);
      default:
        throw new Error(`Unknown report type: ${query.type}`);
    }
  }

  private async generatePolicyComplianceReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    try {
      const where: any = { deleted_at: IsNull() };

      if (query.status) {
        where.status = query.status;
      }

      if (query.startDate && query.endDate) {
        where.created_at = Between(new Date(query.startDate), new Date(query.endDate));
      }

      let policies;
      try {
        policies = await this.policyRepository.find({
          where,
          relations: ['owner', 'creator'],
          order: { created_at: 'DESC' },
        });
      } catch (queryError: any) {
        // If relations fail, try without relations
        try {
          policies = await this.policyRepository.find({
            where,
            order: { created_at: 'DESC' },
          });
        } catch (fallbackError: any) {
          throw new Error(`Database query failed: ${fallbackError.message}`);
        }
      }

      const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          if (date.match(/^\d{4}-\d{2}-\d{2}/)) return date;
          const parsed = new Date(date);
          return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
        }
        try {
          return date.toISOString().split('T')[0];
        } catch {
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
        } catch (error) {
          // If mapping fails for a single policy, return minimal data
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
    } catch (error) {
      // Return error as CSV
      const errorRows = [{ Error: `Failed to generate policy compliance report: ${error.message}` }];
      return this.exportToCsv(errorRows, 'policy_compliance_report_error', query.format);
    }
  }

  private async generateInfluencerReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    try {
      const where: any = { deleted_at: IsNull() };

      if (query.status) {
        where.status = query.status;
      }

      if (query.startDate && query.endDate) {
        where.created_at = Between(new Date(query.startDate), new Date(query.endDate));
      }

      let influencers;
      try {
        influencers = await this.influencerRepository.find({
          where,
          relations: ['owner', 'creator'],
          order: { created_at: 'DESC' },
        });
      } catch (queryError: any) {
        try {
          influencers = await this.influencerRepository.find({
            where,
            order: { created_at: 'DESC' },
          });
        } catch (fallbackError: any) {
          throw new Error(`Database query failed: ${fallbackError.message}`);
        }
      }

      const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          if (date.match(/^\d{4}-\d{2}-\d{2}/)) return date;
          const parsed = new Date(date);
          return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
        }
        try {
          return date.toISOString().split('T')[0];
        } catch {
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
        } catch (error) {
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
    } catch (error) {
      const errorRows = [{ Error: `Failed to generate influencer report: ${error.message}` }];
      return this.exportToCsv(errorRows, 'influencer_report_error', query.format);
    }
  }

  private async generateControlImplementationReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    try {
      const where: any = { deleted_at: IsNull() };

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
      } catch (queryError: any) {
        try {
          controls = await this.unifiedControlRepository.find({
            where,
            order: { created_at: 'DESC' },
          });
        } catch (fallbackError: any) {
          throw new Error(`Database query failed: ${fallbackError.message}`);
        }
      }

      const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          if (date.match(/^\d{4}-\d{2}-\d{2}/)) return date;
          const parsed = new Date(date);
          return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
        }
        try {
          return date.toISOString().split('T')[0];
        } catch {
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
        } catch (error) {
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
    } catch (error) {
      const errorRows = [{ Error: `Failed to generate control implementation report: ${error.message}` }];
      return this.exportToCsv(errorRows, 'control_implementation_report_error', query.format);
    }
  }

  private async generateAssessmentReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    try {
      const where: any = { deleted_at: IsNull() };

      if (query.status) {
        where.status = query.status;
      }

      if (query.startDate && query.endDate) {
        where.start_date = Between(new Date(query.startDate), new Date(query.endDate));
      }

      let assessments;
      try {
        assessments = await this.assessmentRepository.find({
          where,
          relations: ['lead_assessor', 'creator'],
          order: { created_at: 'DESC' },
        });
      } catch (queryError: any) {
        try {
          assessments = await this.assessmentRepository.find({
            where,
            order: { created_at: 'DESC' },
          });
        } catch (fallbackError: any) {
          throw new Error(`Database query failed: ${fallbackError.message}`);
        }
      }

      const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          if (date.match(/^\d{4}-\d{2}-\d{2}/)) return date;
          const parsed = new Date(date);
          return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
        }
        try {
          return date.toISOString().split('T')[0];
        } catch {
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
        } catch (error) {
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
    } catch (error) {
      const errorRows = [{ Error: `Failed to generate assessment report: ${error.message}` }];
      return this.exportToCsv(errorRows, 'assessment_report_error', query.format);
    }
  }

  private async generateFindingsReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    try {
      const where: any = { deleted_at: IsNull() };

      if (query.status) {
        where.status = query.status;
      }

      if (query.startDate && query.endDate) {
        where.finding_date = Between(new Date(query.startDate), new Date(query.endDate));
      }

      let findings;
      try {
        findings = await this.findingRepository.find({
          where,
          relations: ['remediation_owner', 'unified_control', 'creator'],
          order: { finding_date: 'DESC' },
        });
      } catch (queryError: any) {
        try {
          findings = await this.findingRepository.find({
            where,
            order: { finding_date: 'DESC' },
          });
        } catch (fallbackError: any) {
          throw new Error(`Database query failed: ${fallbackError.message}`);
        }
      }

      const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          if (date.match(/^\d{4}-\d{2}-\d{2}/)) return date;
          const parsed = new Date(date);
          return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
        }
        try {
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      const rows = findings.map((finding) => {
        try {
          return {
            'Finding ID': finding.id || '',
            'Finding Identifier': finding.finding_identifier || '',
            'Title': finding.title || '',
            'Severity': finding.severity || '',
            'Status': finding.status || '',
            'Finding Date': formatDate(finding.finding_date),
            'Control Identifier': finding.unified_control?.control_identifier || '',
            'Remediation Owner': finding.remediation_owner
              ? `${finding.remediation_owner.firstName || ''} ${finding.remediation_owner.lastName || ''}`.trim()
              : '',
            'Remediation Due Date': formatDate(finding.remediation_due_date),
            'Remediation Completed Date': formatDate(finding.remediation_completed_date),
            'Retest Required': finding.retest_required ? 'Yes' : 'No',
            'Created At': formatDate(finding.created_at),
            'Updated At': formatDate(finding.updated_at),
          };
        } catch (error) {
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
    } catch (error) {
      const errorRows = [{ Error: `Failed to generate findings report: ${error.message}` }];
      return this.exportToCsv(errorRows, 'findings_report_error', query.format);
    }
  }

  private async generateControlStatusReport(
    query: ReportQueryDto,
  ): Promise<{ data: any; filename: string; contentType: string }> {
    const controls = await this.unifiedControlRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['control_owner'],
      order: { domain: 'ASC', control_identifier: 'ASC' },
    });

    // Group by status and implementation
    const statusCounts: Record<string, number> = {};
    const implementationCounts: Record<string, number> = {};
    const domainCounts: Record<string, number> = {};

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

  private exportToCsv(
    rows: any[],
    baseFilename: string,
    format: ExportFormat = ExportFormat.CSV,
  ): { data: Buffer; filename: string; contentType: string } {
    try {
      let csvContent: string;
      
      const stringify = getStringify();
      if (rows.length === 0) {
        // Return empty CSV with headers if no data
        csvContent = stringify([], { header: true, columns: ['No Data Available'] });
      } else {
        // Generate CSV with data
        csvContent = stringify(rows, { header: true });
      }

      const buffer = Buffer.from(csvContent, 'utf-8');
      const dateStr = new Date().toISOString().split('T')[0];
      
      return {
        data: buffer,
        filename: `${baseFilename}-${dateStr}.csv`,
        contentType: 'text/csv; charset=utf-8',
      };
    } catch (error: any) {
      // If CSV generation fails, return error message as CSV with proper formatting
      const errorMessage = error?.message || 'Unknown error occurred';
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
      } catch (fallbackError: any) {
        // Last resort: return a simple text CSV
        const simpleCsv = `Error\nFailed to generate report: ${errorMessage}\n`;
        return {
          data: Buffer.from(simpleCsv, 'utf-8'),
          filename: `${baseFilename}_error.csv`,
          contentType: 'text/csv; charset=utf-8',
        };
      }
    }
  }

  /**
   * Generate an error CSV report
   * Public method for controllers to use when service calls fail
   */
  generateErrorCsv(errorMessage: string, reportType: string): { data: Buffer; filename: string; contentType: string } {
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
    } catch (fallbackError: any) {
      // Last resort: return a simple text CSV
      const simpleCsv = `Error\n${errorMessage}\n`;
      return {
        data: Buffer.from(simpleCsv, 'utf-8'),
        filename: `${reportType}_error.csv`,
        contentType: 'text/csv; charset=utf-8',
      };
    }
  }
}

