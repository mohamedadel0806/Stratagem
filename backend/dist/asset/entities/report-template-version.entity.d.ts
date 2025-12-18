import { ReportTemplate } from './report-template.entity';
import { User } from '../../users/entities/user.entity';
import { ReportType, ReportFormat, ScheduleFrequency } from './report-template.entity';
export declare class ReportTemplateVersion {
    id: string;
    templateId: string;
    template: ReportTemplate;
    versionNumber: number;
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
    versionComment: string;
    createdById: string;
    createdBy: User;
    createdAt: Date;
}
