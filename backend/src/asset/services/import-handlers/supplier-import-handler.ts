import { Injectable } from '@nestjs/common';
import { SupplierService } from '../supplier.service';
import { CreateSupplierDto, ContactDto } from '../../dto/create-supplier.dto';
import { BaseImportHandler } from './base-import-handler';
import { CriticalityLevel } from '../../entities/physical-asset.entity';

@Injectable()
export class SupplierImportHandler extends BaseImportHandler {
  constructor(private supplierService: SupplierService) {
    super();
  }

  mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateSupplierDto {
    const assetData: any = {};

    for (const [csvColumn, assetField] of Object.entries(mapping)) {
      if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
        const value = row[csvColumn];

        // Handle array fields
        if (assetField === 'goodsServicesType' || assetField === 'complianceCertifications') {
          assetData[assetField] = this.parseArray(value);
        }
        // Handle contact objects (JSONB)
        else if (assetField === 'primaryContact' || assetField === 'secondaryContact') {
          try {
            if (typeof value === 'string' && value.startsWith('{')) {
              assetData[assetField] = JSON.parse(value);
            } else {
              // Parse from format: "name|title|email|phone" or "name,title,email,phone"
              const parts = value.split(/[|,]/).map((p: string) => p.trim());
              if (parts.length >= 4) {
                assetData[assetField] = {
                  name: parts[0],
                  title: parts[1],
                  email: parts[2],
                  phone: parts[3],
                } as ContactDto;
              } else if (parts.length >= 3) {
                assetData[assetField] = {
                  name: parts[0],
                  title: '',
                  email: parts[1],
                  phone: parts[2],
                } as ContactDto;
              }
            }
          } catch {
            // Ignore parsing errors
          }
        }
        // Handle enum fields
        else if (assetField === 'criticalityLevel') {
          assetData[assetField] = this.normalizeEnumValue(value, {
            'critical': 'critical',
            'high': 'high',
            'medium': 'medium',
            'low': 'low',
          }) as CriticalityLevel;
        }
        // Handle boolean fields
        else if (assetField === 'autoRenewal' || assetField === 'insuranceVerified') {
          assetData[assetField] = this.parseBoolean(value);
        }
        // Handle number fields
        else if (assetField === 'contractValue' || assetField === 'performanceRating') {
          assetData[assetField] = this.parseNumber(value);
        }
        // Handle date fields
        else if (['contractStartDate', 'contractEndDate', 'riskAssessmentDate', 'backgroundCheckDate', 'lastReviewDate'].includes(assetField)) {
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

  validate(data: CreateSupplierDto): string[] {
    const errors: string[] = [];

    if (!data.supplierName) {
      errors.push('Supplier name is required');
    }

    if (!data.uniqueIdentifier) {
      errors.push('Unique identifier is required');
    }

    return errors;
  }

  async createAsset(data: CreateSupplierDto, userId: string): Promise<any> {
    return this.supplierService.create(data, userId);
  }
}





