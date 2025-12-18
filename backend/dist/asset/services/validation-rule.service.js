"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ValidationRuleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const validation_rule_entity_1 = require("../entities/validation-rule.entity");
let ValidationRuleService = ValidationRuleService_1 = class ValidationRuleService {
    constructor(ruleRepository) {
        this.ruleRepository = ruleRepository;
        this.logger = new common_1.Logger(ValidationRuleService_1.name);
    }
    async create(dto, userId) {
        const rule = this.ruleRepository.create(Object.assign(Object.assign({}, dto), { createdById: userId }));
        return this.ruleRepository.save(rule);
    }
    async findAll(assetType) {
        const where = { isActive: true };
        if (assetType && assetType !== validation_rule_entity_1.AssetType.ALL) {
            where.assetType = assetType;
        }
        return this.ruleRepository.find({
            where,
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const rule = await this.ruleRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!rule) {
            throw new common_1.NotFoundException(`Validation rule with ID ${id} not found`);
        }
        return rule;
    }
    async update(id, dto) {
        const rule = await this.findOne(id);
        Object.assign(rule, dto);
        return this.ruleRepository.save(rule);
    }
    async delete(id) {
        const rule = await this.findOne(id);
        await this.ruleRepository.remove(rule);
    }
    async validateAsset(asset, assetType) {
        const rules = await this.findAll(assetType);
        const errors = [];
        const warnings = [];
        for (const rule of rules) {
            if (rule.assetType !== validation_rule_entity_1.AssetType.ALL && rule.assetType !== assetType) {
                continue;
            }
            if (rule.dependencies && rule.dependencies.length > 0) {
                let shouldValidate = true;
                for (const dep of rule.dependencies) {
                    const depValue = asset[dep.field];
                    let conditionMet = false;
                    switch (dep.condition) {
                        case 'equals':
                            conditionMet = depValue === dep.value;
                            break;
                        case 'not_equals':
                            conditionMet = depValue !== dep.value;
                            break;
                        case 'exists':
                            conditionMet = depValue !== null && depValue !== undefined && depValue !== '';
                            break;
                        case 'not_exists':
                            conditionMet = depValue === null || depValue === undefined || depValue === '';
                            break;
                    }
                    if (!conditionMet) {
                        shouldValidate = false;
                        break;
                    }
                }
                if (!shouldValidate) {
                    continue;
                }
            }
            const fieldValue = asset[rule.fieldName];
            const validationResult = this.validateField(fieldValue, rule);
            if (!validationResult.isValid) {
                const message = rule.errorMessage || validationResult.message;
                if (rule.severity === validation_rule_entity_1.ValidationSeverity.ERROR) {
                    errors.push({ field: rule.fieldName, message, severity: rule.severity });
                }
                else {
                    warnings.push({ field: rule.fieldName, message });
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    async testValidationRule(ruleId, testValue) {
        const rule = await this.findOne(ruleId);
        const result = this.validateField(testValue, rule);
        return {
            isValid: result.isValid,
            message: result.message || rule.errorMessage || 'Validation passed',
        };
    }
    validateField(value, rule) {
        switch (rule.validationType) {
            case validation_rule_entity_1.ValidationType.REQUIRED:
                if (value === null || value === undefined || value === '') {
                    return { isValid: false, message: `${rule.fieldName} is required` };
                }
                break;
            case validation_rule_entity_1.ValidationType.REGEX:
                if (rule.regexPattern) {
                    const regex = new RegExp(rule.regexPattern);
                    if (value && !regex.test(String(value))) {
                        return { isValid: false, message: `${rule.fieldName} does not match required pattern` };
                    }
                }
                break;
            case validation_rule_entity_1.ValidationType.MIN_LENGTH:
                if (value && String(value).length < (rule.minLength || 0)) {
                    return {
                        isValid: false,
                        message: `${rule.fieldName} must be at least ${rule.minLength} characters`,
                    };
                }
                break;
            case validation_rule_entity_1.ValidationType.MAX_LENGTH:
                if (value && String(value).length > (rule.maxLength || 0)) {
                    return {
                        isValid: false,
                        message: `${rule.fieldName} must not exceed ${rule.maxLength} characters`,
                    };
                }
                break;
            case validation_rule_entity_1.ValidationType.MIN_VALUE:
                if (value !== null && value !== undefined && Number(value) < (rule.minValue || 0)) {
                    return {
                        isValid: false,
                        message: `${rule.fieldName} must be at least ${rule.minValue}`,
                    };
                }
                break;
            case validation_rule_entity_1.ValidationType.MAX_VALUE:
                if (value !== null && value !== undefined && Number(value) > (rule.maxValue || 0)) {
                    return {
                        isValid: false,
                        message: `${rule.fieldName} must not exceed ${rule.maxValue}`,
                    };
                }
                break;
            case validation_rule_entity_1.ValidationType.EMAIL:
                if (value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(String(value))) {
                        return { isValid: false, message: `${rule.fieldName} must be a valid email address` };
                    }
                }
                break;
            case validation_rule_entity_1.ValidationType.URL:
                if (value) {
                    try {
                        new URL(String(value));
                    }
                    catch (_a) {
                        return { isValid: false, message: `${rule.fieldName} must be a valid URL` };
                    }
                }
                break;
            case validation_rule_entity_1.ValidationType.DATE:
                if (value) {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        return { isValid: false, message: `${rule.fieldName} must be a valid date` };
                    }
                }
                break;
            case validation_rule_entity_1.ValidationType.CUSTOM:
                if (rule.customValidationScript) {
                    try {
                        const func = new Function('value', rule.customValidationScript);
                        const result = func(value);
                        if (!result) {
                            return { isValid: false, message: `${rule.fieldName} failed custom validation` };
                        }
                    }
                    catch (error) {
                        this.logger.error(`Custom validation script error: ${error.message}`);
                        return { isValid: false, message: `Custom validation error: ${error.message}` };
                    }
                }
                break;
        }
        return { isValid: true };
    }
};
exports.ValidationRuleService = ValidationRuleService;
exports.ValidationRuleService = ValidationRuleService = ValidationRuleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(validation_rule_entity_1.ValidationRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ValidationRuleService);
//# sourceMappingURL=validation-rule.service.js.map