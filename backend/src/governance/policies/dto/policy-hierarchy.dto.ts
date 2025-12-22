import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsArray } from 'class-validator';

/**
 * DTO for policy hierarchy tree node
 * Used to represent a policy and its immediate children
 */
export class PolicyTreeNodeDto {
  @ApiProperty({ description: 'Policy ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Policy title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Policy type' })
  @IsString()
  policy_type: string;

  @ApiProperty({ description: 'Policy status' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Policy version' })
  @IsString()
  version: string;

  @ApiPropertyOptional({ description: 'Parent policy ID' })
  @IsOptional()
  @IsUUID()
  parent_policy_id?: string;

  @ApiProperty({ description: 'Child policies (immediate children only)' })
  @IsArray()
  children: PolicyTreeNodeDto[];
}

/**
 * DTO for complete policy hierarchy
 * Includes ancestors and descendants
 */
export class PolicyHierarchyDto {
  @ApiProperty({ description: 'Current policy ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Policy title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Policy type' })
  @IsString()
  policy_type: string;

  @ApiProperty({ description: 'Policy status' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Policy version' })
  @IsString()
  version: string;

  @ApiPropertyOptional({ description: 'Parent policy info' })
  @IsOptional()
  parent?: PolicyTreeNodeDto;

  @ApiProperty({ description: 'Child policies (immediate children)' })
  @IsArray()
  children: PolicyTreeNodeDto[];

  @ApiProperty({ description: 'All ancestor policies (from root to parent)' })
  @IsArray()
  ancestors: Array<{
    id: string;
    title: string;
    level: number;
  }>;

  @ApiProperty({ description: 'All descendant policies (all children, grandchildren, etc.)' })
  @IsArray()
  descendants: Array<{
    id: string;
    title: string;
    depth: number;
  }>;

  @ApiProperty({ description: 'Hierarchy level (0 for root)' })
  level: number;

  @ApiProperty({ description: 'Total descendants count' })
  descendantCount: number;

  @ApiProperty({ description: 'Whether this is a root policy' })
  isRoot: boolean;

  @ApiProperty({ description: 'Whether this policy has children' })
  hasChildren: boolean;
}

/**
 * DTO for setting parent policy
 */
export class SetPolicyParentDto {
  @ApiPropertyOptional({ description: 'Parent policy ID (null to remove parent)' })
  @IsOptional()
  @IsUUID()
  parent_policy_id?: string | null;

  @ApiPropertyOptional({ description: 'Reason for hierarchy change' })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for policy hierarchy response with statistics
 */
export class PolicyHierarchyWithStatsDto extends PolicyHierarchyDto {
  @ApiProperty({ description: 'Total policies in hierarchy' })
  totalPoliciesInHierarchy: number;

  @ApiProperty({ description: 'Average depth of children' })
  averageDepth: number;

  @ApiProperty({ description: 'Maximum depth of tree' })
  maxDepth: number;
}
