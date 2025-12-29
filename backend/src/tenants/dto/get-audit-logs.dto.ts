import { IsOptional, IsEnum, IsDateString, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TenantAuditAction } from '../../common/entities/tenant-audit-log.entity';

export class GetAuditLogsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 20;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @IsOptional()
    @IsEnum(TenantAuditAction)
    action?: TenantAuditAction;

    @IsOptional()
    @IsString()
    performedBy?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
