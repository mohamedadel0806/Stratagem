import { ExceptionType } from '../entities/policy-exception.entity';
export declare class CreatePolicyExceptionDto {
    exception_identifier?: string;
    exception_type?: ExceptionType;
    entity_id: string;
    entity_type?: string;
    requesting_business_unit_id?: string;
    business_justification: string;
    compensating_controls?: string;
    risk_assessment?: string;
    start_date?: string;
    end_date?: string;
    auto_expire?: boolean;
    next_review_date?: string;
    supporting_documents?: Record<string, any>;
}
