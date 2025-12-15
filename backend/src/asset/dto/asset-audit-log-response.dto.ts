import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType, AuditAction } from '../entities/asset-audit-log.entity';

export class AssetAuditLogResponseDto {
  @ApiProperty({ description: 'Audit log ID' })
  id: string;

  @ApiProperty({ description: 'Asset type', enum: AssetType })
  assetType: AssetType;

  @ApiProperty({ description: 'Asset ID' })
  assetId: string;

  @ApiProperty({ description: 'Action performed', enum: AuditAction })
  action: AuditAction;

  @ApiPropertyOptional({ description: 'Field name (for updates)' })
  fieldName?: string;

  @ApiPropertyOptional({ description: 'Old value (for updates)' })
  oldValue?: string;

  @ApiPropertyOptional({ description: 'New value (for updates)' })
  newValue?: string;

  @ApiPropertyOptional({ description: 'User who made the change' })
  changedBy?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiPropertyOptional({ description: 'Reason for change' })
  changeReason?: string;

  @ApiProperty({ description: 'When the change was made' })
  createdAt: string | Date;
}

export class AssetAuditLogQueryDto {
  @ApiPropertyOptional({ description: 'Start date for filtering', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'End date for filtering', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by action', enum: AuditAction })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

