import { VersionChangeType, VersionStatus } from '../entities/sop-version.entity';
export declare class CreateSOPVersionDto {
    sop_id: string;
    version_number: string;
    change_type: VersionChangeType;
    change_summary: string;
    change_details?: string;
    content_snapshot?: Record<string, any>;
    metadata_snapshot?: Record<string, any>;
    previous_version_id?: string;
    requires_retraining?: boolean;
    is_backward_compatible?: boolean;
}
export declare class UpdateSOPVersionDto {
    change_summary?: string;
    change_details?: string;
    status?: VersionStatus;
    requires_retraining?: boolean;
    is_backward_compatible?: boolean;
}
export declare class ApproveSOPVersionDto {
    status: VersionStatus;
    approval_comments?: string;
}
export declare class SOPVersionQueryDto {
    sop_id?: string;
    status?: VersionStatus;
    page?: number;
    limit?: number;
    sort?: string;
}
