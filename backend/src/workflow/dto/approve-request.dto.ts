import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApprovalStatus } from '../entities/workflow-approval.entity';
import { CaptureSignatureDto } from './capture-signature.dto';

export class ApproveRequestDto {
  @ApiProperty({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ required: false, description: 'Digital signature data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CaptureSignatureDto)
  signature?: CaptureSignatureDto;
}

