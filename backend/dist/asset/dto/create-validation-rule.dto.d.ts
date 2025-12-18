import { AssetType, ValidationType, ValidationSeverity } from '../entities/validation-rule.entity';
export declare class CreateValidationRuleDto {
    name: string;
    description?: string;
    assetType: AssetType;
    fieldName: string;
    validationType: ValidationType;
    regexPattern?: string;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    customValidationScript?: string;
    errorMessage?: string;
    severity?: ValidationSeverity;
    dependencies?: Array<{
        field: string;
        condition: string;
        value: any;
    }>;
    isActive?: boolean;
    applyToImport?: boolean;
}
