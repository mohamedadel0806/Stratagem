import { User } from '../../users/entities/user.entity';
export declare enum AssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier",
    ALL = "all"
}
export declare enum ValidationType {
    REQUIRED = "required",
    REGEX = "regex",
    MIN_LENGTH = "min_length",
    MAX_LENGTH = "max_length",
    MIN_VALUE = "min_value",
    MAX_VALUE = "max_value",
    EMAIL = "email",
    URL = "url",
    DATE = "date",
    CUSTOM = "custom"
}
export declare enum ValidationSeverity {
    ERROR = "error",
    WARNING = "warning"
}
export declare class ValidationRule {
    id: string;
    name: string;
    description: string;
    assetType: AssetType;
    fieldName: string;
    validationType: ValidationType;
    regexPattern: string;
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    customValidationScript: string;
    errorMessage: string;
    severity: ValidationSeverity;
    dependencies: Array<{
        field: string;
        condition: string;
        value: any;
    }>;
    isActive: boolean;
    applyToImport: boolean;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
