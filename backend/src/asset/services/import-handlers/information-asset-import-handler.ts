import { Injectable } from '@nestjs/common';
import { InformationAssetService } from '../information-asset.service';
import { CreateInformationAssetDto } from '../../dto/create-information-asset.dto';
import { BaseImportHandler } from './base-import-handler';
import { ClassificationLevel } from '../../entities/information-asset.entity';

@Injectable()
export class InformationAssetImportHandler extends BaseImportHandler {
  constructor(private informationAssetService: InformationAssetService) {
    super();
  }

  mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateInformationAssetDto {
    const assetData: any = {};

    for (const [csvColumn, assetField] of Object.entries(mapping)) {
      if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
        const value = row[csvColumn];

        // Handle array fields
        if (assetField === 'complianceRequirements') {
          assetData[assetField] = this.parseArray(value);
        }
        // Handle enum fields
        else if (assetField === 'classificationLevel') {
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
        // Handle date fields
        else if (['classificationDate', 'reclassificationDate'].includes(assetField)) {
          assetData[assetField] = this.parseDate(value);
        }
        // Regular string/number fields
        else {
          assetData[assetField] = value;
        }
      }
    }

    return assetData;
  }

  validate(data: CreateInformationAssetDto): string[] {
    const errors: string[] = [];

    if (!data.name) {
      errors.push('Name is required');
    }

    if (!data.informationType) {
      errors.push('Information type is required');
    }

    if (!data.classificationLevel) {
      errors.push('Classification level is required');
    }

    return errors;
  }

  async createAsset(data: CreateInformationAssetDto, userId: string): Promise<any> {
    return this.informationAssetService.create(data, userId);
  }
}





