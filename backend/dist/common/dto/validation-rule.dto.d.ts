import { ValidationLogic } from '../entities/compliance-validation-rule.entity';
export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';
export declare class ConditionDto {
    field: string;
    operator: string;
    value: any;
}
export declare class CreateValidationRuleDto {
    requirementId: string;
    assetType: AssetType;
    ruleName: string;
    ruleDescription?: string;
    validationLogic: ValidationLogic;
    priority?: number;
    isActive?: boolean;
}
export declare class UpdateValidationRuleDto {
    ruleName?: string;
    ruleDescription?: string;
    validationLogic?: ValidationLogic;
    priority?: number;
    isActive?: boolean;
}
export declare class ValidationRuleResponseDto {
    id: string;
    requirementId: string;
    requirementTitle?: string;
    requirementCode?: string;
    assetType: AssetType;
    ruleName: string;
    ruleDescription?: string;
    validationLogic: ValidationLogic;
    priority: number;
    isActive: boolean;
    createdById?: string;
    createdAt: string;
    updatedAt: string;
}
