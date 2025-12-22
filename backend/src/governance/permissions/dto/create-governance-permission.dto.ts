import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GovernanceModule, GovernanceAction } from '../entities/governance-permission.entity';

export class CreateGovernancePermissionDto {
  @ApiProperty({ enum: Object.values(GovernanceModule), description: 'Governance module' })
  @IsEnum(GovernanceModule)
  module: GovernanceModule;

  @ApiProperty({ enum: Object.values(GovernanceAction), description: 'Action to permit' })
  @IsEnum(GovernanceAction)
  action: GovernanceAction;

  @ApiProperty({ description: 'User role name' })
  @IsString()
  role: string;

  @ApiPropertyOptional({ description: 'Specific resource type within module' })
  @IsOptional()
  @IsString()
  resource_type?: string;

  @ApiPropertyOptional({ description: 'Row-level security conditions' })
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;
}


