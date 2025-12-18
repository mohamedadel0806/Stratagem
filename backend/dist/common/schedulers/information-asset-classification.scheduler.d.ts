import { Repository } from 'typeorm';
import { InformationAsset } from '../../asset/entities/information-asset.entity';
import { NotificationService } from '../services/notification.service';
export declare class InformationAssetClassificationScheduler {
    private readonly informationAssetRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(informationAssetRepository: Repository<InformationAsset>, notificationService: NotificationService);
    handleReclassificationReminders(): Promise<void>;
}
