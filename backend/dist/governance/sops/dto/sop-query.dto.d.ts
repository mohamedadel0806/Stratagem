import { SOPStatus, SOPCategory } from '../entities/sop.entity';
export declare class SOPQueryDto {
    page?: number;
    limit?: number;
    status?: SOPStatus;
    category?: SOPCategory;
    owner_id?: string;
    search?: string;
    sort?: string;
}
