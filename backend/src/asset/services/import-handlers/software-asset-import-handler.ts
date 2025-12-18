import { Injectable } from '@nestjs/common';
import { SoftwareAssetService } from '../software-asset.service';
import { CreateSoftwareAssetDto, VendorContactDto, KnownVulnerabilityDto } from '../../dto/create-software-asset.dto';
import { BaseImportHandler } from './base-import-handler';

@Injectable()
export class SoftwareAssetImportHandler extends BaseImportHandler {
  constructor(private softwareAssetService: SoftwareAssetService) {
    super();
  }

  mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateSoftwareAssetDto {
    const assetData: any = {};

    for (const [csvColumn, assetField] of Object.entries(mapping)) {
      if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
        const value = row[csvColumn];

        // Handle vendor contact (JSONB object)
        if (assetField === 'vendorContact') {
          try {
            // Try parsing as JSON first
            if (typeof value === 'string' && value.startsWith('{')) {
              assetData[assetField] = JSON.parse(value);
            } else {
              // Otherwise, try to parse from format: "name|email|phone" or "name,email,phone"
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
        // Handle known vulnerabilities (JSONB array)
        else if (assetField === 'knownVulnerabilities') {
          try {
            if (typeof value === 'string' && value.startsWith('[')) {
              assetData[assetField] = JSON.parse(value);
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
        // Handle number fields
        else if (['licenseCount', 'installationCount'].includes(assetField)) {
          assetData[assetField] = this.parseNumber(value);
        }
        // Handle date fields
        else if (['licenseExpiry', 'lastSecurityTestDate', 'supportEndDate'].includes(assetField)) {
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

  validate(data: CreateSoftwareAssetDto): string[] {
    const errors: string[] = [];

    if (!data.softwareName) {
      errors.push('Software name is required');
    }

    return errors;
  }

  async createAsset(data: CreateSoftwareAssetDto, userId: string): Promise<any> {
    return this.softwareAssetService.create(data, userId);
  }
}





