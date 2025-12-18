import { ReportType, ReportFormat, ScheduleFrequency } from '../entities/report-template.entity';
export declare class CreateReportTemplateDto {
    name: string;
    description?: string;
    reportType: ReportType;
    format?: ReportFormat;
    fieldSelection?: string[];
    filters?: Record<string, any>;
    grouping?: Record<string, any>;
    isScheduled?: boolean;
    scheduleFrequency?: ScheduleFrequency;
    scheduleCron?: string;
    scheduleTime?: string;
    distributionListId?: string;
    isShared?: boolean;
    sharedWithUserIds?: string[];
    sharedWithTeamIds?: string[];
    isOrganizationWide?: boolean;
}
