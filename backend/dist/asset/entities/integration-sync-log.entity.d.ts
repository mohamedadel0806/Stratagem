import { IntegrationConfig } from './integration-config.entity';
export declare enum SyncStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    PARTIAL = "partial"
}
export declare class IntegrationSyncLog {
    id: string;
    integrationConfigId: string;
    integrationConfig: IntegrationConfig;
    status: SyncStatus;
    totalRecords: number;
    successfulSyncs: number;
    failedSyncs: number;
    skippedRecords: number;
    errorMessage: string;
    syncDetails: Record<string, any>;
    startedAt: Date;
    completedAt: Date;
}
