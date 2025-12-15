import { ApiProperty } from '@nestjs/swagger';
import { RequirementStatus } from '../entities/compliance-requirement.entity';

export class RequirementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  requirementCode?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  complianceDeadline?: string;

  @ApiProperty({ required: false })
  applicability?: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ enum: RequirementStatus })
  status: RequirementStatus;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

