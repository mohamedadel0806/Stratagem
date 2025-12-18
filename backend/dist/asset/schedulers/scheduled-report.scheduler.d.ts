import { Repository } from 'typeorm';
import { ReportTemplate } from '../entities/report-template.entity';
import { ReportTemplateService } from '../services/report-template.service';
export declare class ScheduledReportScheduler {
    private templateRepository;
    private reportTemplateService;
    private readonly logger;
    constructor(templateRepository: Repository<ReportTemplate>, reportTemplateService: ReportTemplateService);
    handleScheduledReports(): Promise<void>;
}
