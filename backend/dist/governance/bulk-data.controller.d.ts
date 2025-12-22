import { Response } from 'express';
import { BulkDataService } from './services/bulk-data.service';
export declare class BulkDataController {
    private readonly bulkDataService;
    constructor(bulkDataService: BulkDataService);
    importData(type: 'policies' | 'controls', file: Express.Multer.File, req: any): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
    exportData(type: 'policies' | 'controls' | 'influencers', res: Response): Promise<void>;
}
