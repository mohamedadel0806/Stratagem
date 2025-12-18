import { ExceptionStatus, ExceptionType } from '../entities/policy-exception.entity';
export declare class QueryPolicyExceptionDto {
    page?: number;
    limit?: number;
    status?: ExceptionStatus;
    exception_type?: ExceptionType;
    entity_id?: string;
    entity_type?: string;
    requested_by?: string;
    requesting_business_unit_id?: string;
    search?: string;
}
