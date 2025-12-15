import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { PolicyStatus } from '../entities/policy.entity';

export class BulkUpdatePolicyDto {
  @ApiProperty({ description: 'Array of policy IDs to update', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({ enum: PolicyStatus, description: 'New status to apply to all selected policies' })
  @IsEnum(PolicyStatus)
  status: PolicyStatus;
}

