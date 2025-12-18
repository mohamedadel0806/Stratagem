import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsEnum } from 'class-validator';
import { RiskFindingRelationshipType } from '../../entities/risk-finding-link.entity';

export class CreateRiskFindingLinkDto {
  @ApiProperty({ description: 'Risk ID' })
  @IsUUID()
  risk_id: string;

  @ApiProperty({ description: 'Finding ID' })
  @IsUUID()
  finding_id: string;

  @ApiPropertyOptional({
    description: 'How the finding relates to the risk',
    enum: RiskFindingRelationshipType,
  })
  @IsOptional()
  @IsEnum(RiskFindingRelationshipType)
  relationship_type?: RiskFindingRelationshipType;

  @ApiPropertyOptional({ description: 'Additional notes about the relationship' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRiskFindingLinkDto {
  @ApiPropertyOptional({
    description: 'How the finding relates to the risk',
    enum: RiskFindingRelationshipType,
  })
  @IsOptional()
  @IsEnum(RiskFindingRelationshipType)
  relationship_type?: RiskFindingRelationshipType;

  @ApiPropertyOptional({ description: 'Additional notes about the relationship' })
  @IsOptional()
  @IsString()
  notes?: string;
}

