import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RequirementStatus } from '../entities/compliance-requirement.entity';

export class CreateRequirementDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requirementCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complianceDeadline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  applicability?: string;

  @ApiProperty()
  @IsUUID()
  frameworkId: string;

  @ApiProperty({ enum: RequirementStatus, required: false })
  @IsOptional()
  @IsEnum(RequirementStatus)
  status?: RequirementStatus;
}

