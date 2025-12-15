import { MeasurementFrequency } from '../../entities/kri.entity';
export declare class CreateKRIDto {
    name: string;
    description?: string;
    category_id?: string;
    measurement_unit?: string;
    measurement_frequency?: MeasurementFrequency;
    data_source?: string;
    calculation_method?: string;
    threshold_green?: number;
    threshold_amber?: number;
    threshold_red?: number;
    threshold_direction?: string;
    kri_owner_id?: string;
    is_active?: boolean;
    next_measurement_due?: string;
    target_value?: number;
    baseline_value?: number;
    tags?: string[];
}
