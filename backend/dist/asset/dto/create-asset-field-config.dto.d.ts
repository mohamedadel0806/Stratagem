import { AssetTypeEnum, FieldType } from '../entities/asset-field-config.entity';
export declare class CreateAssetFieldConfigDto {
    assetType: AssetTypeEnum;
    fieldName: string;
    displayName: string;
    fieldType: FieldType;
    isRequired?: boolean;
    isEnabled?: boolean;
    displayOrder?: number;
    validationRule?: string;
    validationMessage?: string;
    selectOptions?: string[];
    defaultValue?: string;
    helpText?: string;
    fieldDependencies?: Record<string, any>;
}
