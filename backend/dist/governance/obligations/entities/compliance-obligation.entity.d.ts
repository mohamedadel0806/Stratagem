import { User } from '../../../users/entities/user.entity';
import { Influencer } from '../../influencers/entities/influencer.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';
export declare enum ObligationStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    MET = "met",
    PARTIALLY_MET = "partially_met",
    NOT_MET = "not_met",
    NOT_APPLICABLE = "not_applicable",
    OVERDUE = "overdue"
}
export declare enum ObligationPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class ComplianceObligation {
    id: string;
    obligation_identifier: string;
    title: string;
    description: string;
    influencer_id: string | null;
    influencer: Influencer | null;
    source_reference: string;
    owner_id: string | null;
    owner: User | null;
    business_unit_id: string | null;
    business_unit: BusinessUnit | null;
    status: ObligationStatus;
    priority: ObligationPriority;
    due_date: Date | null;
    completion_date: Date | null;
    evidence_summary: string;
    custom_fields: Record<string, any>;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
