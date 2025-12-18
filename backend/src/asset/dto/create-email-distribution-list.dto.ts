import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateEmailDistributionListDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  emailAddresses: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

