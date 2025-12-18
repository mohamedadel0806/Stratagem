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
var SupplierAssessmentAlertScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierAssessmentAlertScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../entities/supplier.entity");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let SupplierAssessmentAlertScheduler = SupplierAssessmentAlertScheduler_1 = class SupplierAssessmentAlertScheduler {
    constructor(supplierRepository, notificationService) {
        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(SupplierAssessmentAlertScheduler_1.name);
    }
    async handleCriticalSuppliersWithoutAssessment() {
        this.logger.log('Checking for critical suppliers without recent assessments...');
        try {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            oneYearAgo.setHours(0, 0, 0, 0);
            const criticalSuppliers = await this.supplierRepository
                .createQueryBuilder('supplier')
                .leftJoin('supplier.owner', 'owner')
                .select([
                'supplier.id',
                'supplier.supplierName',
                'supplier.criticalityLevel',
                'supplier.riskAssessmentDate',
                'supplier.lastReviewDate',
                'supplier.ownerId',
                'owner.id',
                'owner.email',
            ])
                .where('supplier.deletedAt IS NULL')
                .andWhere('supplier.criticalityLevel IN (:...levels)', {
                levels: [physical_asset_entity_1.CriticalityLevel.CRITICAL, physical_asset_entity_1.CriticalityLevel.HIGH],
            })
                .andWhere('(supplier.riskAssessmentDate IS NULL OR supplier.riskAssessmentDate < :oneYearAgo OR supplier.lastReviewDate IS NULL OR supplier.lastReviewDate < :oneYearAgo)', { oneYearAgo })
                .getMany();
            this.logger.log(`Found ${criticalSuppliers.length} critical/high suppliers without recent assessments`);
            for (const supplier of criticalSuppliers) {
                const ownerId = supplier.ownerId;
                if (!ownerId) {
                    this.logger.warn(`Supplier ${supplier.id} (${supplier.supplierName}) has no owner, skipping alert`);
                    continue;
                }
                try {
                    const priority = supplier.criticalityLevel === physical_asset_entity_1.CriticalityLevel.CRITICAL
                        ? notification_entity_1.NotificationPriority.HIGH
                        : notification_entity_1.NotificationPriority.MEDIUM;
                    const lastAssessment = supplier.riskAssessmentDate || supplier.lastReviewDate;
                    const daysSince = lastAssessment
                        ? Math.floor((new Date().getTime() - new Date(lastAssessment).getTime()) / (1000 * 60 * 60 * 24))
                        : null;
                    const message = lastAssessment
                        ? `Critical supplier "${supplier.supplierName}" has not been assessed in ${daysSince} days. Please schedule a risk assessment.`
                        : `Critical supplier "${supplier.supplierName}" has never been assessed. Please complete a risk assessment.`;
                    await this.notificationService.create({
                        userId: ownerId,
                        type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                        priority,
                        title: 'Critical Supplier Assessment Required',
                        message,
                        metadata: {
                            assetType: 'supplier',
                            assetId: supplier.id,
                            criticalityLevel: supplier.criticalityLevel,
                            lastAssessmentDate: lastAssessment === null || lastAssessment === void 0 ? void 0 : lastAssessment.toISOString(),
                            daysSinceLastAssessment: daysSince,
                        },
                    });
                    this.logger.log(`Sent assessment alert for supplier ${supplier.id} to owner ${ownerId}`);
                }
                catch (error) {
                    this.logger.error(`Error sending assessment alert for supplier ${supplier.id}: ${error.message}`);
                }
            }
            this.logger.log(`Processed ${criticalSuppliers.length} critical suppliers without recent assessments`);
        }
        catch (error) {
            this.logger.error(`Error in handleCriticalSuppliersWithoutAssessment: ${error.message}`, error.stack);
        }
    }
};
exports.SupplierAssessmentAlertScheduler = SupplierAssessmentAlertScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_6AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierAssessmentAlertScheduler.prototype, "handleCriticalSuppliersWithoutAssessment", null);
exports.SupplierAssessmentAlertScheduler = SupplierAssessmentAlertScheduler = SupplierAssessmentAlertScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], SupplierAssessmentAlertScheduler);
//# sourceMappingURL=supplier-assessment-alert.scheduler.js.map