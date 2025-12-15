import { BulkOperationsService } from '../services/bulk-operations.service';
import { BulkUpdateDto, BulkUpdateResponseDto } from '../dto/bulk-update.dto';
import { User } from '../../users/entities/user.entity';
export declare class BulkOperationsController {
    private readonly bulkOperationsService;
    constructor(bulkOperationsService: BulkOperationsService);
    bulkUpdate(assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier', dto: BulkUpdateDto, user: User): Promise<BulkUpdateResponseDto>;
    bulkDelete(assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier', body: {
        assetIds: string[];
    }, user: User): Promise<BulkUpdateResponseDto>;
}
