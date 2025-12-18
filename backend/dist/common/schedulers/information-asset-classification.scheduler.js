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
var InformationAssetClassificationScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationAssetClassificationScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const information_asset_entity_1 = require("../../asset/entities/information-asset.entity");
const notification_service_1 = require("../services/notification.service");
const notification_entity_1 = require("../entities/notification.entity");
let InformationAssetClassificationScheduler = InformationAssetClassificationScheduler_1 = class InformationAssetClassificationScheduler {
    constructor(informationAssetRepository, notificationService) {
        this.informationAssetRepository = informationAssetRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(InformationAssetClassificationScheduler_1.name);
    }
    async handleReclassificationReminders() {
        var _a;
        this.logger.log('Starting scheduled information asset reclassification reminders...');
        try {
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const thirtyDaysFromNow = new Date(startOfToday);
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const assets = await this.informationAssetRepository.find({
                where: {
                    deletedAt: (0, typeorm_2.IsNull)(),
                    reclassificationDate: (0, typeorm_2.Between)(startOfToday, thirtyDaysFromNow),
                    reclassificationReminderSent: false,
                },
                relations: ['informationOwner', 'businessUnit'],
            });
            this.logger.log(`Found ${assets.length} information assets due for reclassification within 30 days`);
            for (const asset of assets) {
                const ownerId = asset.informationOwnerId;
                if (!ownerId) {
                    this.logger.warn(`Information asset ${asset.id} has upcoming reclassification but no information owner assigned`);
                    continue;
                }
                const daysRemaining = Math.ceil((asset.reclassificationDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
                const assetName = asset.name || asset.uniqueIdentifier;
                const buName = (_a = asset.businessUnit) === null || _a === void 0 ? void 0 : _a.name;
                await this.notificationService.create({
                    userId: ownerId,
                    type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                    priority: daysRemaining <= 7 ? notification_entity_1.NotificationPriority.URGENT : notification_entity_1.NotificationPriority.HIGH,
                    title: 'Information Asset Reclassification Due Soon',
                    message: `"${assetName}"${buName ? ` in ${buName}` : ''} is due for reclassification on ${asset.reclassificationDate.toISOString().split('T')[0]} (${daysRemaining} day(s) remaining).`,
                    entityType: 'information-asset',
                    entityId: asset.id,
                    actionUrl: `/dashboard/assets/information/${asset.id}`,
                    metadata: {
                        reclassificationDate: asset.reclassificationDate,
                        daysRemaining,
                    },
                });
                asset.reclassificationReminderSent = true;
                await this.informationAssetRepository.save(asset);
            }
            this.logger.log('Information asset reclassification reminders completed successfully');
        }
        catch (error) {
            this.logger.error('Error during information asset reclassification reminders:', error);
        }
    }
};
exports.InformationAssetClassificationScheduler = InformationAssetClassificationScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InformationAssetClassificationScheduler.prototype, "handleReclassificationReminders", null);
exports.InformationAssetClassificationScheduler = InformationAssetClassificationScheduler = InformationAssetClassificationScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], InformationAssetClassificationScheduler);
//# sourceMappingURL=information-asset-classification.scheduler.js.map