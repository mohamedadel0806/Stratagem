import { KRI, KRIStatus } from './kri.entity';
import { User } from '../../users/entities/user.entity';
export declare class KRIMeasurement {
    id: string;
    kri_id: string;
    kri: KRI;
    measurement_date: Date;
    value: number;
    status: KRIStatus;
    notes: string;
    measured_by: string;
    measurer: User;
    evidence_attachments: Record<string, any>[];
    created_at: Date;
}
