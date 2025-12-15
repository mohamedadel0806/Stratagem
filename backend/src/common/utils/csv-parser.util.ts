// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('csv-parse/sync');
import { RequirementStatus } from '../entities/compliance-requirement.entity';

export interface CSVRequirementRow {
  title: string;
  description?: string;
  requirementCode?: string;
  category?: string;
  complianceDeadline?: string;
  applicability?: string;
  status?: RequirementStatus;
}

export function parseCSVRequirements(csvContent: string): CSVRequirementRow[] {
  try {
    // Remove BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, '');
    
    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      cast: (value: any) => {
        // Trim whitespace
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      },
    }) as any[];

    if (!records || records.length === 0) {
      throw new Error('No records found in CSV');
    }

    return records.map((row) => {
      // Support multiple CSV formats
      // Format 1: ADGM format (Requirement ID, Requirement Title, Description, etc.)
      // Format 2: Simple format (title, description, requirementCode, status)
      
      const title = 
        row['Requirement Title'] || 
        row['requirement title'] || 
        row.title || 
        row.Title || 
        '';
      
      const requirementCode = 
        row['Requirement ID'] || 
        row['requirement id'] || 
        row.requirementCode || 
        row.code || 
        row.Code || 
        row['Requirement Code'] || 
        undefined;
      
      const description = 
        row.Description || 
        row.description || 
        row['Requirement Description'] || 
        undefined;
      
      // Extract Category separately
      const category = 
        row.Category || 
        row.category || 
        undefined;
      
      // Extract Compliance Deadline separately
      const complianceDeadline = 
        row['Compliance Deadline'] || 
        row['compliance deadline'] || 
        undefined;
      
      // Extract Applicability separately
      const applicability = 
        row.Applicability || 
        row.applicability || 
        undefined;

      const requirement: CSVRequirementRow = {
        title: title,
        description: description,
        requirementCode: requirementCode,
        category: category,
        complianceDeadline: complianceDeadline,
        applicability: applicability,
        status: mapStatusToEnum(row.status || row.Status || row['Status'] || 'not_started'),
      };

      return requirement;
    }).filter((req) => req.title && req.title.length > 0);
  } catch (error: any) {
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
}

function mapStatusToEnum(status: string): RequirementStatus {
  const normalized = status.toLowerCase().trim();
  
  switch (normalized) {
    case 'compliant':
      return RequirementStatus.COMPLIANT;
    case 'in_progress':
    case 'in progress':
    case 'inprogress':
      return RequirementStatus.IN_PROGRESS;
    case 'partially_compliant':
    case 'partially compliant':
    case 'partiallycompliant':
      return RequirementStatus.PARTIALLY_COMPLIANT;
    case 'non_compliant':
    case 'non compliant':
    case 'noncompliant':
      return RequirementStatus.NON_COMPLIANT;
    case 'not_started':
    case 'not started':
    case 'notstarted':
    default:
      return RequirementStatus.NOT_STARTED;
  }
}
