import { ObligationStatus, ObligationPriority } from '../entities/compliance-obligation.entity';
export declare class ObligationQueryDto {
    page?: number;
    limit?: number;
    status?: ObligationStatus;
    priority?: ObligationPriority;
    influencer_id?: string;
    owner_id?: string;
    business_unit_id?: string;
    search?: string;
    sort?: string;
}
