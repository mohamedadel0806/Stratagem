import { PartialType } from '@nestjs/swagger';
import { CreatePolicyExceptionDto } from './create-policy-exception.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExceptionStatus } from '../entities/policy-exception.entity';

export class UpdatePolicyExceptionDto extends PartialType(CreatePolicyExceptionDto) {
  @ApiPropertyOptional({ enum: Object.values(ExceptionStatus) })
  @IsOptional()
  @IsEnum(ExceptionStatus)
  status?: ExceptionStatus;

  @ApiPropertyOptional({ description: 'Rejection reason (if rejected)' })
  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @ApiPropertyOptional({ description: 'Approval conditions' })
  @IsOptional()
  @IsString()
  approval_conditions?: string;
}
