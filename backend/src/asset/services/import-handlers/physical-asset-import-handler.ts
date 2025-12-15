import { Injectable } from '@nestjs/common';
import { PhysicalAssetService } from '../physical-asset.service';
import { CreatePhysicalAssetDto } from '../../dto/create-physical-asset.dto';
import { BaseImportHandler } from './base-import-handler';
import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../../entities/physical-asset.entity';

@Injectable()
export class PhysicalAssetImportHandler extends BaseImportHandler {
  constructor(private physicalAssetService: PhysicalAssetService) {
    super();
  }

  mapFields(row: Record<string, any>, mapping: Record<string, string>): CreatePhysicalAssetDto {
    const assetData: any = {};

    for (const [csvColumn, assetField] of Object.entries(mapping)) {
      if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
        const value = row[csvColumn];

        // Handle array fields (simple string arrays)
        if (assetField === 'ipAddresses' || assetField === 'macAddresses' || assetField === 'complianceRequirements') {
          assetData[assetField] = this.parseArray(value);
        }
        // Handle complex JSON array fields
        else if (assetField === 'installedSoftware') {
          try {
            // Try to parse as JSON first
            assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
          } catch {
            // If not JSON, try to parse from format: "name|version|patch_level"
            const items = this.parseArray(value);
            assetData[assetField] = items.map(item => {
              const parts = item.split('|');
              return {
                name: parts[0] || '',
                version: parts[1] || '',
                patch_level: parts[2] || '',
              };
            });
          }
        }
        else if (assetField === 'activePortsServices') {
          try {
            // Try to parse as JSON first
            assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
          } catch {
            // If not JSON, try to parse from format: "port|service|protocol"
            const items = this.parseArray(value);
            assetData[assetField] = items.map(item => {
              const parts = item.split('|');
              return {
                port: parseInt(parts[0]) || 0,
                service: parts[1] || '',
                protocol: parts[2] || '',
              };
            });
          }
        }
        // Handle JSON object fields
        else if (assetField === 'securityTestResults') {
          try {
            assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
          } catch {
            // If not JSON, try to parse from format: "date|findings|severity"
            const parts = value.split('|');
            assetData[assetField] = {
              last_test_date: this.parseDate(parts[0]) || new Date().toISOString(),
              findings: parts[1] || '',
              severity: parts[2] || '',
            };
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
        else if (assetField === 'connectivityStatus') {
          assetData[assetField] = this.normalizeEnumValue(value, {
            'connected': 'connected',
            'disconnected': 'disconnected',
            'unknown': 'unknown',
          }) as ConnectivityStatus;
        }
        else if (assetField === 'networkApprovalStatus') {
          assetData[assetField] = this.normalizeEnumValue(value, {
            'approved': 'approved',
            'pending': 'pending',
            'rejected': 'rejected',
            'not_required': 'not_required',
            'not required': 'not_required',
          }) as NetworkApprovalStatus;
        }
        // Handle date fields
        else if (['purchaseDate', 'warrantyExpiry', 'lastConnectivityCheck'].includes(assetField)) {
          assetData[assetField] = this.parseDate(value);
        }
        // Handle legacy location fields - combine into physicalLocation
        else if (assetField === 'location' || assetField === 'building' || assetField === 'floor' || assetField === 'room') {
          // Build physicalLocation from location parts
          if (!assetData.physicalLocation) {
            assetData.physicalLocation = '';
          }
          const parts = [assetData.physicalLocation, value].filter(Boolean);
          assetData.physicalLocation = parts.join(', ');
        }
        // Regular string/number fields
        else {
          assetData[assetField] = value;
        }
      }
    }

    return assetData;
  }

  validate(data: CreatePhysicalAssetDto): string[] {
    const errors: string[] = [];

    if (!data.assetDescription) {
      errors.push('Asset description is required');
    }

    if (!data.uniqueIdentifier) {
      errors.push('Unique identifier is required');
    }

    return errors;
  }

  async createAsset(data: CreatePhysicalAssetDto, userId: string): Promise<any> {
    return this.physicalAssetService.create(data, userId);
  }
}

