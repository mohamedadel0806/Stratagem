import { CreatePolicyExceptionDto } from './create-policy-exception.dto';
import { ExceptionStatus } from '../entities/policy-exception.entity';
declare const UpdatePolicyExceptionDto_base: import("@nestjs/common").Type<Partial<CreatePolicyExceptionDto>>;
export declare class UpdatePolicyExceptionDto extends UpdatePolicyExceptionDto_base {
    status?: ExceptionStatus;
    rejection_reason?: string;
    approval_conditions?: string;
}
export {};
