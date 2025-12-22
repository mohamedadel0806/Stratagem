import { ObligationStatus, ObligationPriority } from '../entities/compliance-obligation.entity';
export declare class CreateComplianceObligationDto {
    obligation_identifier?: string;
    title: string;
    description?: string;
    influencer_id?: string;
    source_reference?: string;
    owner_id?: string;
    business_unit_id?: string;
    status?: ObligationStatus;
    priority?: ObligationPriority;
    due_date?: string;
    evidence_summary?: string;
}
