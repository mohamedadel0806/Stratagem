export declare enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    PUBLISH = "PUBLISH",
    ARCHIVE = "ARCHIVE",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    VIEW = "VIEW",
    ASSIGN = "ASSIGN",
    COMMENT = "COMMENT",
    STATUS_CHANGE = "STATUS_CHANGE",
    PERMISSION_GRANT = "PERMISSION_GRANT",
    PERMISSION_REVOKE = "PERMISSION_REVOKE"
}
export declare class AuditLog {
    id: string;
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    description: string;
    changes: Record<string, any>;
    metadata: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    static trackChanges(oldValue: any, newValue: any): Record<string, any>;
}
