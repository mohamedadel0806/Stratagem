export declare class AssignRoleDto {
    user_id: string;
    role: string;
    business_unit_id?: string;
    expires_at?: string;
}
export declare class BulkAssignRoleDto {
    user_ids: string[];
    role: string;
    business_unit_id?: string;
    expires_at?: string;
}
