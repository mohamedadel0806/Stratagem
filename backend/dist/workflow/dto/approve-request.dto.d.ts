import { ApprovalStatus } from '../entities/workflow-approval.entity';
import { CaptureSignatureDto } from './capture-signature.dto';
export declare class ApproveRequestDto {
    status: ApprovalStatus;
    comments?: string;
    signature?: CaptureSignatureDto;
}
