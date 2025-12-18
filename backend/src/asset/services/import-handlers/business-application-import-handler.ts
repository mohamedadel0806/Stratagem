import { Injectable } from '@nestjs/common';
import { BusinessApplicationService } from '../business-application.service';
import { CreateBusinessApplicationDto, VendorContactDto } from '../../dto/create-business-application.dto';
import { BaseImportHandler } from './base-import-handler';
import { ClassificationLevel } from '../../entities/information-asset.entity';
import { CriticalityLevel } from '../../entities/business-application.entity';

@Injectable()
export class BusinessApplicationImportHandler extends BaseImportHandler {
  constructor(private businessApplicationService: BusinessApplicationService) {
    super();
  }

  mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateBusinessApplicationDto {
    const assetData: any = {};

    for (const [csvColumn, assetField] of Object.entries(mapping)) {
      if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
        const value = row[csvColumn];

        // Handle array fields
        if (assetField === 'dataProcessed' || assetField === 'complianceRequirements') {
          assetData[assetField] = this.parseArray(value);
        }
        // Handle vendor contact (JSONB object)
        else if (assetField === 'vendorContact') {
          try {
            if (typeof value === 'string' && value.startsWith('{')) {
              assetData[assetField] = JSON.parse(value);
            } else {
              const parts = value.split(/[|,]/).map((p: string) => p.trim());
              if (parts.length >= 3) {
                assetData[assetField] = {
                  name: parts[0],
                  email: parts[1],
                  phone: parts[2],
                } as VendorContactDto;
              }
            }
          } catch {
            // Ignore parsing errors
          }
        }
        // Handle security test results (JSONB object)
        else if (assetField === 'securityTestResults') {
          try {
            if (typeof value === 'string' && value.startsWith('{')) {
              assetData[assetField] = JSON.parse(value);
            }
          } catch {
            // Ignore parsing errors
          }
        }
        // Handle enum fields
        else if (assetField === 'dataClassification') {
          assetData[assetField] = this.normalizeEnumValue(value, {
            'public': 'public',
            'internal': 'internal',
            'confidential': 'confidential',
            'restricted': 'restricted',
            'secret': 'secret',
            'top_secret': 'top_secret',
            'top secret': 'top_secret',
          }) as ClassificationLevel;
        }
        else if (assetField === 'criticalityLevel') {
          assetData[assetField] = this.normalizeEnumValue(value, {
            'critical': 'critical',
            'high': 'high',
            'medium': 'medium',
            'low': 'low',
          }) as CriticalityLevel;
        }
        // Handle number fields
        else if (assetField === 'licenseCount') {
          assetData[assetField] = this.parseNumber(value);
        }
        // Handle date fields
        else if (['licenseExpiry', 'lastSecurityTestDate'].includes(assetField)) {
          assetData[assetField] = this.parseDate(value);
        }
        // Regular string fields
        else {
          assetData[assetField] = value;
        }
      }
    }

    return assetData;
  }

  validate(data: CreateBusinessApplicationDto): string[] {
    const errors: string[] = [];

    if (!data.applicationName) {
      errors.push('Application name is required');
    }

    return errors;
  }

  async createAsset(data: CreateBusinessApplicationDto, userId: string): Promise<any> {
    return this.businessApplicationService.create(data, userId);
  }
}





