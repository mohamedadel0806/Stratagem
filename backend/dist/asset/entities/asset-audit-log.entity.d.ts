import { User } from '../../users/entities/user.entity';
export declare enum AssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export declare enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare class AssetAuditLog {
    id: string;
    assetType: AssetType;
    assetId: string;
    action: AuditAction;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedBy?: User;
    changedById?: string;
    changeReason?: string;
    createdAt: Date;
}
