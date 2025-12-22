import { BaselineStatus } from '../entities/baseline.entity';
export declare class BaselineQueryDto {
    page?: number;
    limit?: number;
    status?: BaselineStatus;
    category?: string;
    search?: string;
    sort?: string;
}
