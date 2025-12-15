import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../services/audit-log.service';
import { AUDIT_ACTION_KEY, AuditMetadata } from '../decorators/audit.decorator';
import { AuditAction, AuditLog } from '../entities/audit-log.entity';

/**
 * AuditLogInterceptor: Automatically logs all @Audit decorated methods
 * Captures request/response details and user information
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<AuditMetadata>(AUDIT_ACTION_KEY, context.getHandler());

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { user, body, params, query } = request;
    const { action, entityType, extractId, description } = auditMetadata;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          // Extract entity ID from params or use extractId function
          let entityId = params?.id || params?.entityId;
          if (extractId && typeof extractId === 'function') {
            entityId = extractId(request);
          } else if (response?.id) {
            entityId = response.id;
          }

          // Determine changes based on action
          let changes: Record<string, any> = {};
          if (action === AuditAction.CREATE && body) {
            changes = { created: body };
          } else if (action === AuditAction.UPDATE && body) {
            changes = { updated: body };
          }

          await this.auditLogService.log({
            userId: user?.userId || 'SYSTEM',
            action,
            entityType,
            entityId: entityId || 'UNKNOWN',
            description: description || `${action} ${entityType}`,
            changes,
            metadata: {
              method: request.method,
              path: request.path,
              statusCode: 200,
              duration: Date.now() - startTime,
              query: query && Object.keys(query).length > 0 ? query : undefined,
            },
            ipAddress: this.getIpAddress(request),
            userAgent: request.get('user-agent'),
          });
        } catch (error) {
          this.logger.error(`Failed to log audit entry: ${error.message}`, error.stack);
        }
      }),
      catchError((error) => {
        // Log failed operations
        this.logger.debug(`Audit error (${action} ${entityType}): ${error.message}`);
        throw error;
      }),
    );
  }

  /**
   * Extract client IP address from request
   */
  private getIpAddress(request: any): string {
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      'UNKNOWN'
    );
  }
}
