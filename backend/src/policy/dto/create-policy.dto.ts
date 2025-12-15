import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PolicyType, PolicyStatus } from '../entities/policy.entity';

export class CreatePolicyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PolicyType })
  @IsEnum(PolicyType)
  policyType: PolicyType;

  @ApiProperty({ enum: PolicyStatus, required: false, default: PolicyStatus.DRAFT })
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
}

