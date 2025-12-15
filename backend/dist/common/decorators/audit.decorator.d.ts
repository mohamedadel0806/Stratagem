import { AuditAction } from '../entities/audit-log.entity';
export declare const AUDIT_ACTION_KEY = "audit_action";
export interface AuditMetadata {
    action: AuditAction;
    entityType: string;
    extractId?: (req: any) => string;
    description?: string;
}
export declare const Audit: (action: AuditAction, entityType: string, options?: {
    extractId?: (req: any) => string;
    description?: string;
}) => import("@nestjs/common").CustomDecorator<string>;
