import { User } from '../../../users/entities/user.entity';
import { SOP, ExecutionOutcome } from './sop.entity';
export declare class SOPLog {
    id: string;
    sop_id: string;
    sop: SOP;
    execution_date: Date;
    start_time: Date;
    end_time: Date;
    outcome: ExecutionOutcome;
    notes: string;
    step_results: Array<{
        step: string;
        result: string;
        observations?: string;
    }>;
    executor_id: string;
    executor: User;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
