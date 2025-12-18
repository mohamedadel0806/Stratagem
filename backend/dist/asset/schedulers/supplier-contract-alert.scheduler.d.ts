import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class SupplierContractAlertScheduler {
    private readonly supplierRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(supplierRepository: Repository<Supplier>, notificationService: NotificationService);
    handleContractExpirationAlerts(): Promise<void>;
}
