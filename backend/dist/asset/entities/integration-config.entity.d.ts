import { User } from '../../users/entities/user.entity';
export declare enum IntegrationType {
    CMDB = "cmdb",
    ASSET_MANAGEMENT_SYSTEM = "asset_management_system",
    REST_API = "rest_api",
    WEBHOOK = "webhook"
}
export declare enum IntegrationStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ERROR = "error"
}
export declare enum AuthenticationType {
    API_KEY = "api_key",
    BEARER_TOKEN = "bearer_token",
    BASIC_AUTH = "basic_auth",
    OAUTH2 = "oauth2"
}
export declare class IntegrationConfig {
    id: string;
    name: string;
    integrationType: IntegrationType;
    endpointUrl: string;
    authenticationType: AuthenticationType;
    apiKey: string;
    bearerToken: string;
    username: string;
    password: string;
    fieldMapping: Record<string, string>;
    syncInterval: string;
    status: IntegrationStatus;
    lastSyncError: string;
    lastSyncAt: Date;
    nextSyncAt: Date;
    createdById: string;
    createdBy: User;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
