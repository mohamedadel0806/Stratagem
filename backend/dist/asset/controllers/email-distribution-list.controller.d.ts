import { EmailDistributionListService } from '../services/email-distribution-list.service';
import { CreateEmailDistributionListDto } from '../dto/create-email-distribution-list.dto';
import { UpdateEmailDistributionListDto } from '../dto/update-email-distribution-list.dto';
export declare class EmailDistributionListController {
    private readonly distributionListService;
    constructor(distributionListService: EmailDistributionListService);
    create(dto: CreateEmailDistributionListDto, req: any): Promise<import("../entities/email-distribution-list.entity").EmailDistributionList>;
    findAll(): Promise<import("../entities/email-distribution-list.entity").EmailDistributionList[]>;
    findOne(id: string): Promise<import("../entities/email-distribution-list.entity").EmailDistributionList>;
    update(id: string, dto: UpdateEmailDistributionListDto): Promise<import("../entities/email-distribution-list.entity").EmailDistributionList>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
