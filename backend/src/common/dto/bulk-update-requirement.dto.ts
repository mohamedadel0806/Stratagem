import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { RequirementStatus } from '../entities/compliance-requirement.entity';

export class BulkUpdateRequirementDto {
  @ApiProperty({ description: 'Array of requirement IDs to update', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({ enum: RequirementStatus, description: 'New status to apply to all selected requirements' })
  @IsEnum(RequirementStatus)
  status: RequirementStatus;
}

