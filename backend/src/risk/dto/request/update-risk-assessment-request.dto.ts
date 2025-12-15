import { IsString, IsUUID, IsEnum, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestPriority, RequestStatus } from '../../entities/risk-assessment-request.entity';

export class UpdateRiskAssessmentRequestDto {
  @ApiProperty({ description: 'User ID of the person who should perform the assessment', required: false })
  @IsOptional()
  @IsUUID()
  requested_for_id?: string;

  @ApiProperty({ enum: RequestPriority, required: false })
  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

  @ApiProperty({ enum: RequestStatus, required: false })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiProperty({ description: 'Due date for the assessment', required: false })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({ description: 'Justification for why this assessment is needed', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  justification?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;

  @ApiProperty({ description: 'Reason for rejection (if status is rejected)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejection_reason?: string;
}
