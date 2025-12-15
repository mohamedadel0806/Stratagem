import { PhysicalAssetService } from '../physical-asset.service';
import { CreatePhysicalAssetDto } from '../../dto/create-physical-asset.dto';
import { BaseImportHandler } from './base-import-handler';
export declare class PhysicalAssetImportHandler extends BaseImportHandler {
    private physicalAssetService;
    constructor(physicalAssetService: PhysicalAssetService);
    mapFields(row: Record<string, any>, mapping: Record<string, string>): CreatePhysicalAssetDto;
    validate(data: CreatePhysicalAssetDto): string[];
    createAsset(data: CreatePhysicalAssetDto, userId: string): Promise<any>;
}
