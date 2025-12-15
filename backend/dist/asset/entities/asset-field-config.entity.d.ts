import { User } from '../../users/entities/user.entity';
export declare enum AssetTypeEnum {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export declare enum FieldType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
    BOOLEAN = "boolean",
    SELECT = "select",
    MULTI_SELECT = "multi_select",
    TEXTAREA = "textarea",
    EMAIL = "email",
    URL = "url"
}
export declare class AssetFieldConfig {
    id: string;
    assetType: AssetTypeEnum;
    fieldName: string;
    displayName: string;
    fieldType: FieldType;
    isRequired: boolean;
    isEnabled: boolean;
    displayOrder: number;
    validationRule: string;
    validationMessage: string;
    selectOptions: string[];
    defaultValue: string;
    helpText: string;
    fieldDependencies: Record<string, any>;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
