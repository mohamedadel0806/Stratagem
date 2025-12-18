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
var InformationAssetComplianceAlertScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationAssetComplianceAlertScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let InformationAssetComplianceAlertScheduler = InformationAssetComplianceAlertScheduler_1 = class InformationAssetComplianceAlertScheduler {
    constructor(informationAssetRepository, notificationService) {
        this.informationAssetRepository = informationAssetRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(InformationAssetComplianceAlertScheduler_1.name);
    }
    async handleMissingComplianceAlerts() {
        this.logger.log('Checking for information assets missing compliance information...');
        try {
            const assets = await this.informationAssetRepository
                .createQueryBuilder('asset')
                .leftJoin('asset.informationOwner', 'owner')
                .select([
                'asset.id',
                'asset.name',
                'asset.complianceRequirements',
                'asset.informationOwnerId',
                'owner.id',
                'owner.email',
            ])
                .where('asset.deletedAt IS NULL')
                .andWhere('(asset.complianceRequirements IS NULL OR asset.complianceRequirements::jsonb = \'[]\'::jsonb OR jsonb_array_length(asset.complianceRequirements::jsonb) = 0)')
                .getMany();
            this.logger.log(`Found ${assets.length} information assets missing compliance information`);
            for (const asset of assets) {
                const ownerId = asset.informationOwnerId;
                if (!ownerId) {
                    this.logger.warn(`Asset ${asset.id} (${asset.name}) has no information owner, skipping alert`);
                    continue;
                }
                try {
                    await this.notificationService.create({
                        userId: ownerId,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Missing Compliance Information',
                        message: `Information asset "${asset.name}" is missing compliance requirements. Please update the asset with appropriate compliance frameworks.`,
                        metadata: {
                            assetType: 'information',
                            assetId: asset.id,
                        },
                    });
                    this.logger.log(`Sent compliance alert for asset ${asset.id} to owner ${ownerId}`);
                }
                catch (error) {
                    this.logger.error(`Error sending compliance alert for asset ${asset.id}: ${error.message}`);
                }
            }
            this.logger.log(`Processed ${assets.length} information assets missing compliance information`);
        }
        catch (error) {
            this.logger.error(`Error in handleMissingComplianceAlerts: ${error.message}`, error.stack);
        }
    }
};
exports.InformationAssetComplianceAlertScheduler = InformationAssetComplianceAlertScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_4AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InformationAssetComplianceAlertScheduler.prototype, "handleMissingComplianceAlerts", null);
exports.InformationAssetComplianceAlertScheduler = InformationAssetComplianceAlertScheduler = InformationAssetComplianceAlertScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], InformationAssetComplianceAlertScheduler);
//# sourceMappingURL=information-asset-compliance-alert.scheduler.js.map