import { SOPStatus, SOPCategory } from '../entities/sop.entity';
export declare class CreateSOPDto {
    sop_identifier: string;
    title: string;
    category?: SOPCategory;
    subcategory?: string;
    purpose?: string;
    scope?: string;
    content?: string;
    version?: string;
    status?: SOPStatus;
    owner_id?: string;
    review_frequency?: string;
    next_review_date?: string;
    linked_policies?: string[];
    linked_standards?: string[];
    control_ids?: string[];
    tags?: string[];
}
