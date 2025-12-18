import { IsString, IsUUID, IsEnum, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssessmentType } from '../../entities/risk-assessment.entity';
import { RequestPriority, RequestStatus } from '../../entities/risk-assessment-request.entity';

export class CreateRiskAssessmentRequestDto {
  @ApiProperty({ description: 'Risk ID for which assessment is requested' })
  @IsUUID()
  risk_id: string;

  @ApiProperty({ description: 'User ID of the person who should perform the assessment', required: false })
  @IsOptional()
  @IsUUID()
  requested_for_id?: string;

  @ApiProperty({ enum: AssessmentType, description: 'Type of assessment requested' })
  @IsEnum(AssessmentType)
  assessment_type: AssessmentType;

  @ApiProperty({ enum: RequestPriority, default: RequestPriority.MEDIUM, required: false })
  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

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
}

