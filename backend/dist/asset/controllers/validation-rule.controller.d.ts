import { ValidationRuleService } from '../services/validation-rule.service';
import { CreateValidationRuleDto } from '../dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from '../dto/update-validation-rule.dto';
import { AssetType } from '../entities/validation-rule.entity';
export declare class ValidationRuleController {
    private readonly validationRuleService;
    constructor(validationRuleService: ValidationRuleService);
    create(dto: CreateValidationRuleDto, req: any): Promise<import("../entities/validation-rule.entity").ValidationRule>;
    findAll(assetType?: AssetType): Promise<import("../entities/validation-rule.entity").ValidationRule[]>;
    findOne(id: string): Promise<import("../entities/validation-rule.entity").ValidationRule>;
    update(id: string, dto: UpdateValidationRuleDto): Promise<import("../entities/validation-rule.entity").ValidationRule>;
    delete(id: string): Promise<{
        message: string;
    }>;
    validateAsset(body: {
        asset: any;
        assetType: AssetType;
    }): Promise<import("../services/validation-rule.service").ValidationResult>;
    testRule(id: string, body: {
        testValue: any;
    }): Promise<{
        isValid: boolean;
        message: string;
    }>;
}
