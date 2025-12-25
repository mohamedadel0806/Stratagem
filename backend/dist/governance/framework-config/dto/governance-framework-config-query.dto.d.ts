import { FrameworkType } from '../../entities/governance-framework-config.entity';
export declare class GovernanceFrameworkConfigQueryDto {
    page?: number;
    limit?: number;
    framework_type?: FrameworkType;
    is_active?: boolean;
    search?: string;
    sort?: string;
}
