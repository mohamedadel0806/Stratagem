import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../services/audit-log.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly auditLogService;
    private readonly reflector;
    private readonly logger;
    constructor(auditLogService: AuditLogService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getIpAddress;
}
