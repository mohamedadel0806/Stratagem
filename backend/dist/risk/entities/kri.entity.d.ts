import { RiskCategory } from './risk-category.entity';
import { User } from '../../users/entities/user.entity';
import { KRIMeasurement } from './kri-measurement.entity';
import { KRIRiskLink } from './kri-risk-link.entity';
export declare enum MeasurementFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUALLY = "annually"
}
export declare enum KRIStatus {
    GREEN = "green",
    AMBER = "amber",
    RED = "red"
}
export declare enum KRITrend {
    IMPROVING = "improving",
    STABLE = "stable",
    WORSENING = "worsening"
}
export declare class KRI {
    id: string;
    kri_id: string;
    name: string;
    description: string;
    category_id: string;
    category: RiskCategory;
    measurement_unit: string;
    measurement_frequency: MeasurementFrequency;
    data_source: string;
    calculation_method: string;
    threshold_green: number;
    threshold_amber: number;
    threshold_red: number;
    threshold_direction: string;
    current_value: number;
    current_status: KRIStatus;
    trend: KRITrend;
    kri_owner_id: string;
    kri_owner: User;
    is_active: boolean;
    last_measured_at: Date;
    next_measurement_due: Date;
    target_value: number;
    baseline_value: number;
    tags: string[];
    measurements: KRIMeasurement[];
    risk_links: KRIRiskLink[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
