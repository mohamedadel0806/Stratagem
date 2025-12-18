"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SupplierContractAlertScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierContractAlertScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../entities/supplier.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let SupplierContractAlertScheduler = SupplierContractAlertScheduler_1 = class SupplierContractAlertScheduler {
    constructor(supplierRepository, notificationService) {
        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(SupplierContractAlertScheduler_1.name);
    }
    async handleContractExpirationAlerts() {
        var _a, _b;
        this.logger.log('Checking for suppliers with contracts expiring soon...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const alertDays = [90, 60, 30];
            for (const days of alertDays) {
                const targetDate = new Date(today);
                targetDate.setDate(targetDate.getDate() + days);
                const suppliers = await this.supplierRepository
                    .createQueryBuilder('supplier')
                    .leftJoin('supplier.owner', 'owner')
                    .select([
                    'supplier.id',
                    'supplier.supplierName',
                    'supplier.contractReference',
                    'supplier.contractEndDate',
                    'supplier.autoRenewal',
                    'supplier.ownerId',
                    'owner.id',
                    'owner.email',
                ])
                    .where('supplier.deletedAt IS NULL')
                    .andWhere('supplier.contractEndDate IS NOT NULL')
                    .andWhere('supplier.contractEndDate = :targetDate', { targetDate })
                    .andWhere('supplier.autoRenewal = :autoRenewal', { autoRenewal: false })
                    .getMany();
                this.logger.log(`Found ${suppliers.length} suppliers with contracts expiring in ${days} days`);
                for (const supplier of suppliers) {
                    const ownerId = supplier.ownerId;
                    if (!ownerId) {
                        this.logger.warn(`Supplier ${supplier.id} (${supplier.supplierName}) has no owner, skipping alert`);
                        continue;
                    }
                    try {
                        const priority = days <= 30 ? notification_entity_1.NotificationPriority.HIGH : days <= 60 ? notification_entity_1.NotificationPriority.MEDIUM : notification_entity_1.NotificationPriority.LOW;
                        const message = days <= 30
                            ? `Contract for supplier "${supplier.supplierName}" expires in ${days} days. Immediate action required.`
                            : `Contract for supplier "${supplier.supplierName}" expires in ${days} days. Please review renewal options.`;
                        await this.notificationService.create({
                            userId: ownerId,
                            type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                            priority,
                            title: `Contract Expiring in ${days} Days`,
                            message,
                            metadata: {
                                assetType: 'supplier',
                                assetId: supplier.id,
                                contractReference: supplier.contractReference,
                                contractEndDate: (_a = supplier.contractEndDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                daysUntilExpiration: days,
                            },
                        });
                        this.logger.log(`Sent ${days}-day contract expiration alert for supplier ${supplier.id} to owner ${ownerId}`);
                    }
                    catch (error) {
                        this.logger.error(`Error sending contract expiration alert for supplier ${supplier.id}: ${error.message}`);
                    }
                }
            }
            const expiredSuppliers = await this.supplierRepository
                .createQueryBuilder('supplier')
                .leftJoin('supplier.owner', 'owner')
                .select([
                'supplier.id',
                'supplier.supplierName',
                'supplier.contractReference',
                'supplier.contractEndDate',
                'supplier.ownerId',
                'owner.id',
                'owner.email',
            ])
                .where('supplier.deletedAt IS NULL')
                .andWhere('supplier.contractEndDate IS NOT NULL')
                .andWhere('supplier.contractEndDate < :today', { today })
                .getMany();
            this.logger.log(`Found ${expiredSuppliers.length} suppliers with expired contracts`);
            for (const supplier of expiredSuppliers) {
                const ownerId = supplier.ownerId;
                if (!ownerId) {
                    continue;
                }
                try {
                    await this.notificationService.create({
                        userId: ownerId,
                        type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title: 'Contract Expired',
                        message: `Contract for supplier "${supplier.supplierName}" has expired. Please renew or terminate the relationship.`,
                        metadata: {
                            assetType: 'supplier',
                            assetId: supplier.id,
                            contractReference: supplier.contractReference,
                            contractEndDate: (_b = supplier.contractEndDate) === null || _b === void 0 ? void 0 : _b.toISOString(),
                        },
                    });
                    this.logger.log(`Sent expired contract alert for supplier ${supplier.id} to owner ${ownerId}`);
                }
                catch (error) {
                    this.logger.error(`Error sending expired contract alert for supplier ${supplier.id}: ${error.message}`);
                }
            }
            this.logger.log('Completed contract expiration alert processing');
        }
        catch (error) {
            this.logger.error(`Error in handleContractExpirationAlerts: ${error.message}`, error.stack);
        }
    }
};
exports.SupplierContractAlertScheduler = SupplierContractAlertScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_5AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierContractAlertScheduler.prototype, "handleContractExpirationAlerts", null);
exports.SupplierContractAlertScheduler = SupplierContractAlertScheduler = SupplierContractAlertScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], SupplierContractAlertScheduler);
//# sourceMappingURL=supplier-contract-alert.scheduler.js.map