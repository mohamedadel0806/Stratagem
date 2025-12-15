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
export declare function parseCSVRequirements(csvContent: string): CSVRequirementRow[];
