import { ApiProperty } from '@nestjs/swagger';
import { ApprovalStatus } from '../entities/workflow-approval.entity';

export class ApprovalResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  workflowExecutionId: string;

  @ApiProperty()
  approverId: string;

  @ApiProperty()
  approverName: string;

  @ApiProperty({ enum: ApprovalStatus })
  status: ApprovalStatus;

  @ApiProperty({ required: false })
  comments?: string;

  @ApiProperty()
  stepOrder: number;

  @ApiProperty({ required: false })
  respondedAt?: string;

  @ApiProperty()
  createdAt: string;
}

