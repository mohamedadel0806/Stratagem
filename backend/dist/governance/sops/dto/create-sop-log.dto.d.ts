import { ExecutionOutcome } from '../entities/sop.entity';
export declare class CreateSOPLogDto {
    sop_id: string;
    execution_date: string;
    start_time?: string;
    end_time?: string;
    outcome?: ExecutionOutcome;
    notes?: string;
    step_results?: Array<{
        step: string;
        result: string;
        observations?: string;
    }>;
    executor_id?: string;
}
