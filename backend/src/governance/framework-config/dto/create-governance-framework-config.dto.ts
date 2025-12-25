import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FrameworkType } from '../../entities/governance-framework-config.entity';

export class CreateGovernanceFrameworkConfigDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(FrameworkType)
  framework_type: FrameworkType;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsUUID()
  linked_framework_id?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    require_policy_approval?: boolean;
    require_control_testing?: boolean;
    policy_review_frequency?: string;
    control_review_frequency?: string;
    risk_assessment_required?: boolean;
    audit_required?: boolean;
    integration_points?: string[];
  };
}
