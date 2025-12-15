import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../entities/audit-log.entity';

export const AUDIT_ACTION_KEY = 'audit_action';

/**
 * Metadata interface for audit decorator
 */
export interface AuditMetadata {
  action: AuditAction;
  entityType: string;
  extractId?: (req: any) => string;
  description?: string;
}

/**
 * Decorator to mark a controller method for automatic audit logging
 * 
 * Usage:
 * @Audit(AuditAction.CREATE, 'workflow')
 * async createWorkflow(@Body() dto: CreateWorkflowDto) { ... }
 */
export const Audit = (action: AuditAction, entityType: string, options?: { extractId?: (req: any) => string; description?: string }) =>
  SetMetadata(AUDIT_ACTION_KEY, { action, entityType, ...options });
