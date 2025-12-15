import { ApiProperty } from '@nestjs/swagger';
import { PolicyStatus, PolicyType } from '../entities/policy.entity';

export class PolicyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: PolicyType })
  policyType: PolicyType;

  @ApiProperty({ enum: PolicyStatus })
  status: PolicyStatus;

  @ApiProperty({ required: false })
  version?: string;

  @ApiProperty({ required: false })
  effectiveDate?: string;

  @ApiProperty({ required: false })
  reviewDate?: string;

  @ApiProperty({ required: false })
  documentUrl?: string;

  @ApiProperty({ required: false })
  documentName?: string;

  @ApiProperty({ required: false })
  documentMimeType?: string;

  @ApiProperty()
  createdAt: string;
}

