import { ApiProperty } from '@nestjs/swagger';
import { RemediationPriority } from '../findings/entities/remediation-tracker.entity';

export class RemediationTrackerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  finding_id: string;

  @ApiProperty()
  finding_identifier: string;

  @ApiProperty()
  finding_title: string;

  @ApiProperty({ enum: RemediationPriority })
  remediation_priority: RemediationPriority;

  @ApiProperty({ type: 'string', format: 'date' })
  sla_due_date: string;

  @ApiProperty()
  remediation_steps?: string;

  @ApiProperty()
  assigned_to_id?: string;

  @ApiProperty()
  assigned_to_name?: string;

  @ApiProperty()
  progress_percent: number;

  @ApiProperty()
  progress_notes?: string;

  @ApiProperty({ type: 'string', format: 'date', nullable: true })
  completion_date?: string;

  @ApiProperty()
  sla_met: boolean;

  @ApiProperty({ nullable: true })
  days_to_completion?: number;

  @ApiProperty({ nullable: true })
  days_until_due?: number;

  @ApiProperty()
  status: 'on_track' | 'at_risk' | 'overdue' | 'completed';

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class RemediationDashboardDto {
  @ApiProperty()
  total_open_findings: number;

  @ApiProperty()
  findings_on_track: number;

  @ApiProperty()
  findings_at_risk: number;

  @ApiProperty()
  findings_overdue: number;

  @ApiProperty()
  average_days_to_completion: number;

  @ApiProperty()
  sla_compliance_rate: number;

  @ApiProperty({ type: [RemediationTrackerDto] })
  critical_findings: RemediationTrackerDto[];

  @ApiProperty({ type: [RemediationTrackerDto] })
  overdue_findings: RemediationTrackerDto[];

  @ApiProperty({ type: [RemediationTrackerDto] })
  upcoming_due: RemediationTrackerDto[];
}

export class CreateRemediationTrackerDto {
  @ApiProperty()
  finding_id: string;

  @ApiProperty({ enum: RemediationPriority, required: false })
  remediation_priority?: RemediationPriority;

  @ApiProperty({ type: 'string', format: 'date' })
  sla_due_date: string;

  @ApiProperty({ required: false })
  remediation_steps?: string;

  @ApiProperty({ required: false })
  assigned_to_id?: string;
}

export class UpdateRemediationTrackerDto {
  @ApiProperty({ required: false })
  remediation_priority?: RemediationPriority;

  @ApiProperty({ required: false })
  progress_percent?: number;

  @ApiProperty({ required: false })
  progress_notes?: string;

  @ApiProperty({ required: false })
  remediation_steps?: string;

  @ApiProperty({ required: false })
  assigned_to_id?: string;
}

export class CompleteRemediationDto {
  @ApiProperty()
  completion_notes: string;

  @ApiProperty({ required: false })
  completion_evidence?: Record<string, any>;
}
