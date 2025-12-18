import { Repository } from 'typeorm';
import { InformationAsset } from '../entities/information-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class InformationAssetComplianceAlertScheduler {
    private readonly informationAssetRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(informationAssetRepository: Repository<InformationAsset>, notificationService: NotificationService);
    handleMissingComplianceAlerts(): Promise<void>;
}
