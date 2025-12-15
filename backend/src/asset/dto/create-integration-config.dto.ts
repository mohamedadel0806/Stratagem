import { IsString, IsEnum, IsUrl, IsOptional, IsObject, ValidateIf } from 'class-validator';
import { IntegrationType, AuthenticationType } from '../entities/integration-config.entity';

export class CreateIntegrationConfigDto {
  @IsString()
  name: string;

  @IsEnum(IntegrationType)
  integrationType: IntegrationType;

  @IsUrl()
  endpointUrl: string;

  @IsEnum(AuthenticationType)
  authenticationType: AuthenticationType;

  @ValidateIf((o) => o.authenticationType === AuthenticationType.API_KEY)
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ValidateIf((o) => o.authenticationType === AuthenticationType.BEARER_TOKEN)
  @IsString()
  @IsOptional()
  bearerToken?: string;

  @ValidateIf((o) => o.authenticationType === AuthenticationType.BASIC_AUTH)
  @IsString()
  @IsOptional()
  username?: string;

  @ValidateIf((o) => o.authenticationType === AuthenticationType.BASIC_AUTH)
  @IsString()
  @IsOptional()
  password?: string;

  @IsObject()
  @IsOptional()
  fieldMapping?: Record<string, string>;

  @IsString()
  @IsOptional()
  syncInterval?: string; // e.g., '1h', '24h', '1d'

  @IsString()
  @IsOptional()
  notes?: string;
}








