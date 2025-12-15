import { ControlType, ControlStatus, ImplementationStatus } from '../entities/unified-control.entity';
export declare class UnifiedControlQueryDto {
    page?: number;
    limit?: number;
    control_type?: ControlType;
    status?: ControlStatus;
    implementation_status?: ImplementationStatus;
    domain?: string;
    control_owner_id?: string;
    search?: string;
    sort?: string;
}
