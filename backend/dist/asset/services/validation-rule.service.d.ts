import { Repository } from 'typeorm';
import { ValidationRule, AssetType, ValidationSeverity } from '../entities/validation-rule.entity';
import { CreateValidationRuleDto } from '../dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from '../dto/update-validation-rule.dto';
export interface ValidationResult {
    isValid: boolean;
    errors: Array<{
        field: string;
        message: string;
        severity: ValidationSeverity;
    }>;
    warnings: Array<{
        field: string;
        message: string;
    }>;
}
export declare class ValidationRuleService {
    private ruleRepository;
    private readonly logger;
    constructor(ruleRepository: Repository<ValidationRule>);
    create(dto: CreateValidationRuleDto, userId: string): Promise<ValidationRule>;
    findAll(assetType?: AssetType): Promise<ValidationRule[]>;
    findOne(id: string): Promise<ValidationRule>;
    update(id: string, dto: UpdateValidationRuleDto): Promise<ValidationRule>;
    delete(id: string): Promise<void>;
    validateAsset(asset: any, assetType: AssetType): Promise<ValidationResult>;
    testValidationRule(ruleId: string, testValue: any): Promise<{
        isValid: boolean;
        message: string;
    }>;
    private validateField;
}
