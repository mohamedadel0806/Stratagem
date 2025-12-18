import { StandardStatus } from '../entities/standard.entity';
export declare class StandardQueryDto {
    page?: number;
    limit?: number;
    status?: StandardStatus;
    policy_id?: string;
    control_objective_id?: string;
    owner_id?: string;
    search?: string;
    sort?: string;
}
