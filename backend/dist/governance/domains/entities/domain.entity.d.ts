import { User } from '../../../users/entities/user.entity';
export declare class ControlDomain {
    id: string;
    name: string;
    description: string;
    parent_id: string | null;
    parent: ControlDomain;
    children: ControlDomain[];
    owner_id: string | null;
    owner: User;
    code: string;
    display_order: number;
    is_active: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
