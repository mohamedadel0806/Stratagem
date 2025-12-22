import { IsString, IsUUID, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Role name' })
  @IsString()
  role: string;

  @ApiPropertyOptional({ description: 'Business unit ID for row-level security' })
  @IsOptional()
  @IsUUID()
  business_unit_id?: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expires_at?: string;
}

export class BulkAssignRoleDto {
  @ApiProperty({ description: 'Array of user IDs', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  user_ids: string[];

  @ApiProperty({ description: 'Role name' })
  @IsString()
  role: string;

  @ApiPropertyOptional({ description: 'Business unit ID for row-level security' })
  @IsOptional()
  @IsUUID()
  business_unit_id?: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expires_at?: string;
}


