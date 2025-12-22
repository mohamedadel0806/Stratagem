import { IsString, IsOptional, IsEnum, IsBoolean, IsObject } from 'class-validator';
import { HookType, HookAction } from '../entities/integration-hook.entity';

export class CreateIntegrationHookDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(HookType)
  type: HookType;

  @IsEnum(HookAction)
  action: HookAction;

  @IsObject()
  @IsOptional()
  config?: any;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}


