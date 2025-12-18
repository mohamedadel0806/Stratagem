import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CriticalityLevel } from '../entities/business-application.entity';

export class BusinessApplicationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Application type (string)' })
  @IsOptional()
  @IsString()
  applicationType?: string;

  @ApiProperty({ enum: CriticalityLevel, required: false })
  @IsOptional()
  @IsEnum(CriticalityLevel)
  criticalityLevel?: CriticalityLevel;

  @ApiProperty({ required: false, description: 'Business unit ID (UUID)' })
  @IsOptional()
  @IsUUID()
  businessUnit?: string;

  @ApiProperty({ required: false, description: 'Owner ID (UUID)' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ required: false, description: 'Filter applications missing version number' })
  @IsOptional()
  @Type(() => Boolean)
  missingVersion?: boolean;

  @ApiProperty({ required: false, description: 'Filter applications missing patch level' })
  @IsOptional()
  @Type(() => Boolean)
  missingPatch?: boolean;

  @ApiProperty({ required: false, description: 'Filter by security test status: no-test, overdue, failed, passed' })
  @IsOptional()
  @IsString()
  securityTestStatus?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

