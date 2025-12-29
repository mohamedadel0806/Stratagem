import { IsEnum, IsString, IsOptional, IsObject, IsUUID } from 'class-validator';
import { AuditAction } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsEnum(AuditAction)
  action: AuditAction;

  @IsString()
  entityType: string;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  changes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class AuditLogResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsString()
  action: string;

  @IsString()
  entityType: string;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  changes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  timestamp: string;
}

export class AuditLogSummaryDto {
  totalLogs: number;
  uniqueUsers: number;
  uniqueActions: number;
  uniqueEntities: number;
  oldestLog?: Date;
  newestLog?: Date;
}
