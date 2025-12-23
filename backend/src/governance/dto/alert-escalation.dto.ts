import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EscalationChainStatus } from '../entities/alert-escalation-chain.entity';

export class EscalationRuleDto {
  @ApiProperty({ description: 'Escalation level number', example: 1 })
  @IsNumber()
  level: number;

  @ApiProperty({ description: 'Minutes to wait before escalating', example: 30 })
  @IsNumber()
  delayMinutes: number;

  @ApiProperty({ description: 'Role IDs to escalate to', type: [String] })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiPropertyOptional({ description: 'Workflow ID to trigger', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @ApiProperty({
    description: 'Notification channels',
    enum: ['email', 'sms', 'in_app'],
    type: [String],
  })
  @IsArray()
  notifyChannels: ('email' | 'sms' | 'in_app')[];

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateEscalationChainDto {
  @ApiProperty({ description: 'Alert ID' })
  @IsUUID()
  alertId: string;

  @ApiPropertyOptional({ description: 'Alert Rule ID' })
  @IsOptional()
  @IsUUID()
  alertRuleId?: string;

  @ApiProperty({ description: 'Escalation rules', type: [EscalationRuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EscalationRuleDto)
  escalationRules: EscalationRuleDto[];

  @ApiPropertyOptional({ description: 'Escalation notes' })
  @IsOptional()
  @IsString()
  escalationNotes?: string;
}

export class EscalationHistoryDto {
  @ApiProperty({ description: 'Escalation level' })
  level: number;

  @ApiProperty({ description: 'When escalated' })
  escalatedAt: Date;

  @ApiProperty({ description: 'Roles escalated to', type: [String] })
  escalatedToRoles: string[];

  @ApiPropertyOptional({ description: 'Users escalated to', type: [String] })
  escalatedToUsers?: string[];

  @ApiPropertyOptional({ description: 'Workflow execution ID' })
  workflowTriggered?: string;

  @ApiPropertyOptional({
    description: 'Notifications sent',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        channel: { type: 'string' },
        recipients: { type: 'array', items: { type: 'string' } },
        sentAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  notificationsSent?: Array<{
    channel: 'email' | 'sms' | 'in_app';
    recipients: string[];
    sentAt: Date;
  }>;
}

export class EscalationChainDto {
  @ApiProperty({ description: 'Escalation chain ID' })
  id: string;

  @ApiProperty({ description: 'Alert ID' })
  alertId: string;

  @ApiProperty({ enum: EscalationChainStatus, description: 'Current status' })
  status: EscalationChainStatus;

  @ApiProperty({ description: 'Current escalation level' })
  currentLevel: number;

  @ApiProperty({ description: 'Maximum escalation levels' })
  maxLevels: number;

  @ApiPropertyOptional({ description: 'Next escalation time' })
  nextEscalationAt?: Date;

  @ApiProperty({ description: 'Escalation history', type: [EscalationHistoryDto] })
  escalationHistory: EscalationHistoryDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class EscalateAlertDto {
  @ApiPropertyOptional({ description: 'Escalation notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ResolveEscalationChainDto {
  @ApiProperty({ description: 'Resolution notes' })
  @IsString()
  resolutionNotes: string;
}

export class EscalationStatisticsDto {
  @ApiProperty({ description: 'Number of active escalation chains' })
  activeChains: number;

  @ApiProperty({ description: 'Number of pending escalations' })
  pendingEscalations: number;

  @ApiProperty({ description: 'Number of escalated alerts' })
  escalatedAlerts: number;

  @ApiProperty({ description: 'Average escalation levels' })
  averageEscalationLevels: number;
}
