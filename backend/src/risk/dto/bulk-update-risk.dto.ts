import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { RiskStatus } from '../entities/risk.entity';

export class BulkUpdateRiskDto {
  @ApiProperty({ description: 'Array of risk IDs to update', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({ enum: RiskStatus, description: 'New status to apply to all selected risks' })
  @IsEnum(RiskStatus)
  status: RiskStatus;
}

