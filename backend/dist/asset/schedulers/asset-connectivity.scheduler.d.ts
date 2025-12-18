import { Repository } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class AssetConnectivityScheduler {
    private readonly physicalAssetRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(physicalAssetRepository: Repository<PhysicalAsset>, notificationService: NotificationService);
    notifyUnapprovedConnectedAssets(): Promise<void>;
}
