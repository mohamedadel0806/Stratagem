import { User } from '../../../users/entities/user.entity';
export declare enum HookType {
    SIEM = "siem",
    VULNERABILITY_SCANNER = "vulnerability_scanner",
    CLOUD_MONITOR = "cloud_monitor",
    CUSTOM = "custom"
}
export declare enum HookAction {
    CREATE_EVIDENCE = "create_evidence",
    CREATE_FINDING = "create_finding",
    UPDATE_CONTROL_STATUS = "update_control_status"
}
export declare class GovernanceIntegrationHook {
    id: string;
    name: string;
    description: string;
    type: HookType;
    action: HookAction;
    secretKey: string;
    config: {
        mapping: Record<string, string>;
        filters?: Array<{
            field: string;
            operator: string;
            value: any;
        }>;
        defaultValues?: Record<string, any>;
    };
    isActive: boolean;
    logs: GovernanceIntegrationLog[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
export declare class GovernanceIntegrationLog {
    id: string;
    hook_id: string;
    hook: GovernanceIntegrationHook;
    status: 'success' | 'failed';
    payload: any;
    result: any;
    errorMessage: string;
    ipAddress: string;
    created_at: Date;
}
