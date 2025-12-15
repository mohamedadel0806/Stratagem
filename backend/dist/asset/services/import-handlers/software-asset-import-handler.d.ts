import { SoftwareAssetService } from '../software-asset.service';
import { CreateSoftwareAssetDto } from '../../dto/create-software-asset.dto';
import { BaseImportHandler } from './base-import-handler';
export declare class SoftwareAssetImportHandler extends BaseImportHandler {
    private softwareAssetService;
    constructor(softwareAssetService: SoftwareAssetService);
    mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateSoftwareAssetDto;
    validate(data: CreateSoftwareAssetDto): string[];
    createAsset(data: CreateSoftwareAssetDto, userId: string): Promise<any>;
}
