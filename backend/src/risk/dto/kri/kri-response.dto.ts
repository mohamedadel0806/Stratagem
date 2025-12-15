import { MeasurementFrequency, KRIStatus, KRITrend } from '../../entities/kri.entity';

export class KRIMeasurementResponseDto {
  id: string;
  kri_id: string;
  measurement_date: string;
  value: number;
  status?: KRIStatus;
  notes?: string;
  measured_by?: string;
  measurer_name?: string;
  evidence_attachments?: Record<string, any>[];
  created_at: string;
}

export class KRIResponseDto {
  id: string;
  kri_id: string;
  name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  measurement_unit?: string;
  measurement_frequency: MeasurementFrequency;
  data_source?: string;
  calculation_method?: string;
  threshold_green?: number;
  threshold_amber?: number;
  threshold_red?: number;
  threshold_direction: string;
  current_value?: number;
  current_status?: KRIStatus;
  trend?: KRITrend;
  kri_owner_id?: string;
  owner_name?: string;
  is_active: boolean;
  last_measured_at?: string;
  next_measurement_due?: string;
  target_value?: number;
  baseline_value?: number;
  tags?: string[];
  linked_risks_count?: number;
  measurement_due_status?: 'on_track' | 'due_soon' | 'overdue';
  recent_measurements?: KRIMeasurementResponseDto[];
  created_at: string;
  updated_at: string;
}




