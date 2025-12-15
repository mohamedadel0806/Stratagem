import { IntegrationType, AuthenticationType } from '../entities/integration-config.entity';
export declare class CreateIntegrationConfigDto {
    name: string;
    integrationType: IntegrationType;
    endpointUrl: string;
    authenticationType: AuthenticationType;
    apiKey?: string;
    bearerToken?: string;
    username?: string;
    password?: string;
    fieldMapping?: Record<string, string>;
    syncInterval?: string;
    notes?: string;
}
