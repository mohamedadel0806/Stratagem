import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PolicyType, PolicyStatus } from '../entities/policy.entity';

export class UpdatePolicyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PolicyType, required: false })
  @IsOptional()
  @IsEnum(PolicyType)
  policyType?: PolicyType;

  @ApiProperty({ enum: PolicyStatus, required: false })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  reviewDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentMimeType?: string;
}

