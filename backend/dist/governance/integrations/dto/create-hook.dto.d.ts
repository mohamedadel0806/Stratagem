import { HookType, HookAction } from '../entities/integration-hook.entity';
export declare class CreateIntegrationHookDto {
    name: string;
    description?: string;
    type: HookType;
    action: HookAction;
    config?: any;
    isActive?: boolean;
}
