import { InformationAssetService } from '../information-asset.service';
import { CreateInformationAssetDto } from '../../dto/create-information-asset.dto';
import { BaseImportHandler } from './base-import-handler';
export declare class InformationAssetImportHandler extends BaseImportHandler {
    private informationAssetService;
    constructor(informationAssetService: InformationAssetService);
    mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateInformationAssetDto;
    validate(data: CreateInformationAssetDto): string[];
    createAsset(data: CreateInformationAssetDto, userId: string): Promise<any>;
}
