import { CreateRiskTreatmentDto } from './create-risk-treatment.dto';
declare const UpdateRiskTreatmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateRiskTreatmentDto, "risk_id">>>;
export declare class UpdateRiskTreatmentDto extends UpdateRiskTreatmentDto_base {
    actual_cost?: number;
    actual_completion_date?: string;
    progress_percentage?: number;
    progress_notes?: string;
    attachments?: Record<string, any>[];
}
export {};
