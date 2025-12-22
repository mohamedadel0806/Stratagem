import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationRule, AssetType, ValidationType, ValidationSeverity } from '../entities/validation-rule.entity';
import { CreateValidationRuleDto } from '../dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from '../dto/update-validation-rule.dto';

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string; severity: ValidationSeverity }>;
  warnings: Array<{ field: string; message: string }>;
}

@Injectable()
export class ValidationRuleService {
  private readonly logger = new Logger(ValidationRuleService.name);

  constructor(
    @InjectRepository(ValidationRule)
    private ruleRepository: Repository<ValidationRule>,
  ) {}

  async create(dto: CreateValidationRuleDto, userId: string): Promise<ValidationRule> {
    const rule = this.ruleRepository.create({
      ...dto,
      createdById: userId,
    });

    return this.ruleRepository.save(rule);
  }

  async findAll(assetType?: AssetType): Promise<ValidationRule[]> {
    const where: any = { isActive: true };
    if (assetType && assetType !== AssetType.ALL) {
      where.assetType = assetType;
    }

    return this.ruleRepository.find({
      where,
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ValidationRule> {
    const rule = await this.ruleRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!rule) {
      throw new NotFoundException(`Validation rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: string, dto: UpdateValidationRuleDto): Promise<ValidationRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, dto);
    return this.ruleRepository.save(rule);
  }

  async delete(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.ruleRepository.remove(rule);
  }

  async validateAsset(asset: any, assetType: AssetType): Promise<ValidationResult> {
    const rules = await this.findAll(assetType);
    const errors: Array<{ field: string; message: string; severity: ValidationSeverity }> = [];
    const warnings: Array<{ field: string; message: string }> = [];

    for (const rule of rules) {
      // Check if rule applies to this asset type
      if (rule.assetType !== AssetType.ALL && rule.assetType !== assetType) {
        continue;
      }

      // Check dependencies first
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
          continue; // Skip this rule if dependencies not met
        }
      }

      const fieldValue = asset[rule.fieldName];
      const validationResult = this.validateField(fieldValue, rule);

      if (!validationResult.isValid) {
        const message = rule.errorMessage || validationResult.message;
        if (rule.severity === ValidationSeverity.ERROR) {
          errors.push({ field: rule.fieldName, message, severity: rule.severity });
        } else {
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

  async testValidationRule(ruleId: string, testValue: any): Promise<{ isValid: boolean; message: string }> {
    const rule = await this.findOne(ruleId);
    const result = this.validateField(testValue, rule);

    return {
      isValid: result.isValid,
      message: result.message || rule.errorMessage || 'Validation passed',
    };
  }

  private validateField(value: any, rule: ValidationRule): { isValid: boolean; message?: string } {
    switch (rule.validationType) {
      case ValidationType.REQUIRED:
        if (value === null || value === undefined || value === '') {
          return { isValid: false, message: `${rule.fieldName} is required` };
        }
        break;

      case ValidationType.REGEX:
        if (rule.regexPattern) {
          const regex = new RegExp(rule.regexPattern);
          if (value && !regex.test(String(value))) {
            return { isValid: false, message: `${rule.fieldName} does not match required pattern` };
          }
        }
        break;

      case ValidationType.MIN_LENGTH:
        if (value && String(value).length < (rule.minLength || 0)) {
          return {
            isValid: false,
            message: `${rule.fieldName} must be at least ${rule.minLength} characters`,
          };
        }
        break;

      case ValidationType.MAX_LENGTH:
        if (value && String(value).length > (rule.maxLength || 0)) {
          return {
            isValid: false,
            message: `${rule.fieldName} must not exceed ${rule.maxLength} characters`,
          };
        }
        break;

      case ValidationType.MIN_VALUE:
        if (value !== null && value !== undefined && Number(value) < (rule.minValue || 0)) {
          return {
            isValid: false,
            message: `${rule.fieldName} must be at least ${rule.minValue}`,
          };
        }
        break;

      case ValidationType.MAX_VALUE:
        if (value !== null && value !== undefined && Number(value) > (rule.maxValue || 0)) {
          return {
            isValid: false,
            message: `${rule.fieldName} must not exceed ${rule.maxValue}`,
          };
        }
        break;

      case ValidationType.EMAIL:
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(value))) {
            return { isValid: false, message: `${rule.fieldName} must be a valid email address` };
          }
        }
        break;

      case ValidationType.URL:
        if (value) {
          try {
            new URL(String(value));
          } catch {
            return { isValid: false, message: `${rule.fieldName} must be a valid URL` };
          }
        }
        break;

      case ValidationType.DATE:
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return { isValid: false, message: `${rule.fieldName} must be a valid date` };
          }
        }
        break;

      case ValidationType.CUSTOM:
        if (rule.customValidationScript) {
          try {
            // Execute custom validation script
            // WARNING: In production, use a sandboxed environment for security
            const func = new Function('value', rule.customValidationScript);
            const result = func(value);
            if (!result) {
              return { isValid: false, message: `${rule.fieldName} failed custom validation` };
            }
          } catch (error: any) {
            this.logger.error(`Custom validation script error: ${error.message}`);
            return { isValid: false, message: `Custom validation error: ${error.message}` };
          }
        }
        break;
    }

    return { isValid: true };
  }
}



