import { BusinessApplicationService } from '../business-application.service';
import { CreateBusinessApplicationDto } from '../../dto/create-business-application.dto';
import { BaseImportHandler } from './base-import-handler';
export declare class BusinessApplicationImportHandler extends BaseImportHandler {
    private businessApplicationService;
    constructor(businessApplicationService: BusinessApplicationService);
    mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateBusinessApplicationDto;
    validate(data: CreateBusinessApplicationDto): string[];
    createAsset(data: CreateBusinessApplicationDto, userId: string): Promise<any>;
}
