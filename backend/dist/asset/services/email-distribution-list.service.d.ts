import { Repository } from 'typeorm';
import { EmailDistributionList } from '../entities/email-distribution-list.entity';
import { CreateEmailDistributionListDto } from '../dto/create-email-distribution-list.dto';
import { UpdateEmailDistributionListDto } from '../dto/update-email-distribution-list.dto';
import { ReportFormat } from '../entities/report-template.entity';
import { User } from '../../users/entities/user.entity';
export declare class EmailDistributionListService {
    private distributionListRepository;
    private userRepository;
    private readonly logger;
    constructor(distributionListRepository: Repository<EmailDistributionList>, userRepository: Repository<User>);
    create(dto: CreateEmailDistributionListDto, userId: string): Promise<EmailDistributionList>;
    findAll(): Promise<EmailDistributionList[]>;
    findOne(id: string): Promise<EmailDistributionList>;
    update(id: string, dto: UpdateEmailDistributionListDto): Promise<EmailDistributionList>;
    delete(id: string): Promise<void>;
    sendReportEmail(emailAddresses: string[], reportName: string, reportBuffer: Buffer, format: ReportFormat, filename: string): Promise<void>;
}
