import { Response } from 'express';
import { ReportTemplateService } from '../services/report-template.service';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { UpdateReportTemplateDto } from '../dto/update-report-template.dto';
export declare class ReportTemplateController {
    private readonly reportTemplateService;
    constructor(reportTemplateService: ReportTemplateService);
    create(dto: CreateReportTemplateDto, req: any): Promise<import("../entities/report-template.entity").ReportTemplate>;
    findAll(req: any): Promise<import("../entities/report-template.entity").ReportTemplate[]>;
    findOne(id: string): Promise<import("../entities/report-template.entity").ReportTemplate>;
    update(id: string, dto: UpdateReportTemplateDto & {
        versionComment?: string;
    }, req: any): Promise<import("../entities/report-template.entity").ReportTemplate>;
    delete(id: string): Promise<{
        message: string;
    }>;
    generateReport(id: string, res: Response): Promise<void>;
    previewReport(id: string): Promise<{
        data: any[];
        count: number;
    }>;
    getVersionHistory(id: string): Promise<import("../entities/report-template-version.entity").ReportTemplateVersion[]>;
    restoreVersion(id: string, versionId: string, req: any): Promise<{
        message: string;
        template: import("../entities/report-template.entity").ReportTemplate;
    }>;
    updateSharing(id: string, sharingDto: {
        isShared?: boolean;
        sharedWithUserIds?: string[];
        sharedWithTeamIds?: string[];
        isOrganizationWide?: boolean;
    }, req: any): Promise<import("../entities/report-template.entity").ReportTemplate>;
    sendReport(id: string): Promise<{
        message: string;
    }>;
}
