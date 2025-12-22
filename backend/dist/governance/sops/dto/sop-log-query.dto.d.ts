import { ExecutionOutcome } from '../entities/sop.entity';
export declare class SOPLogQueryDto {
    page?: number;
    limit?: number;
    sop_id?: string;
    executor_id?: string;
    outcome?: ExecutionOutcome;
    search?: string;
}
