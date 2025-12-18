import { Repository } from 'typeorm';
import { SecurityTestResult } from '../entities/security-test-result.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class SecurityTestAlertScheduler {
    private testResultRepository;
    private applicationRepository;
    private softwareRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(testResultRepository: Repository<SecurityTestResult>, applicationRepository: Repository<BusinessApplication>, softwareRepository: Repository<SoftwareAsset>, notificationService: NotificationService);
    handleFailedSecurityTestAlerts(): Promise<void>;
    handleOverdueSecurityTestAlerts(): Promise<void>;
}
