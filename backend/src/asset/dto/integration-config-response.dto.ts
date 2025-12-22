import { IntegrationType, IntegrationStatus, AuthenticationType } from '../entities/integration-config.entity';

export class IntegrationConfigResponseDto {
  id: string;
  name: string;
  integrationType: IntegrationType;
  endpointUrl: string;
  authenticationType: AuthenticationType;
  fieldMapping?: Record<string, string>;
  syncInterval?: string;
  status: IntegrationStatus;
  lastSyncError?: string;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  createdById: string;
  createdByName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}











