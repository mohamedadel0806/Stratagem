import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsJSON,
} from 'class-validator';
import { VersionChangeType, VersionStatus } from '../entities/sop-version.entity';

export class CreateSOPVersionDto {
  @IsUUID()
  sop_id: string;

  @IsString()
  version_number: string;

  @IsEnum(VersionChangeType)
  change_type: VersionChangeType;

  @IsString()
  change_summary: string;

  @IsOptional()
  @IsString()
  change_details?: string;

  @IsOptional()
  @IsJSON()
  content_snapshot?: Record<string, any>;

  @IsOptional()
  @IsJSON()
  metadata_snapshot?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  previous_version_id?: string;

  @IsOptional()
  @IsBoolean()
  requires_retraining?: boolean;

  @IsOptional()
  @IsBoolean()
  is_backward_compatible?: boolean;
}

export class UpdateSOPVersionDto {
  @IsOptional()
  @IsString()
  change_summary?: string;

  @IsOptional()
  @IsString()
  change_details?: string;

  @IsOptional()
  @IsEnum(VersionStatus)
  status?: VersionStatus;

  @IsOptional()
  @IsBoolean()
  requires_retraining?: boolean;

  @IsOptional()
  @IsBoolean()
  is_backward_compatible?: boolean;
}

export class ApproveSOPVersionDto {
  @IsEnum(VersionStatus)
  status: VersionStatus;

  @IsOptional()
  @IsString()
  approval_comments?: string;
}

export class SOPVersionQueryDto {
  @IsOptional()
  @IsUUID()
  sop_id?: string;

  @IsOptional()
  @IsEnum(VersionStatus)
  status?: VersionStatus;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}
