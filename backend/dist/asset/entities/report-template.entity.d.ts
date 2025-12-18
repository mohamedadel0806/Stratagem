import { User } from '../../users/entities/user.entity';
export declare enum ReportType {
    ASSET_INVENTORY = "asset_inventory",
    COMPLIANCE_REPORT = "compliance_report",
    SECURITY_TEST_REPORT = "security_test_report",
    SOFTWARE_INVENTORY = "software_inventory",
    CONTRACT_EXPIRATION = "contract_expiration",
    SUPPLIER_CRITICALITY = "supplier_criticality",
    CUSTOM = "custom"
}
export declare enum ReportFormat {
    EXCEL = "excel",
    PDF = "pdf",
    CSV = "csv"
}
export declare enum ScheduleFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class ReportTemplate {
    id: string;
    name: string;
    description: string;
    reportType: ReportType;
    format: ReportFormat;
    fieldSelection: string[];
    filters: Record<string, any>;
    grouping: Record<string, any>;
    isScheduled: boolean;
    scheduleFrequency: ScheduleFrequency;
    scheduleCron: string;
    scheduleTime: string;
    distributionListId: string;
    isActive: boolean;
    isSystemTemplate: boolean;
    isShared?: boolean;
    sharedWithUserIds?: string[];
    sharedWithTeamIds?: string[];
    isOrganizationWide?: boolean;
    version?: number;
    lastRunAt: Date;
    nextRunAt: Date;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
