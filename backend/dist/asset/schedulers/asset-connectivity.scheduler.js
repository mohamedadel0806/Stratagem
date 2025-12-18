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
var AssetConnectivityScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetConnectivityScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let AssetConnectivityScheduler = AssetConnectivityScheduler_1 = class AssetConnectivityScheduler {
    constructor(physicalAssetRepository, notificationService) {
        this.physicalAssetRepository = physicalAssetRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AssetConnectivityScheduler_1.name);
    }
    async notifyUnapprovedConnectedAssets() {
        try {
            const unapproved = await this.physicalAssetRepository.find({
                where: {
                    deletedAt: (0, typeorm_2.IsNull)(),
                    connectivityStatus: physical_asset_entity_1.ConnectivityStatus.CONNECTED,
                },
                relations: ['owner'],
            });
            const suspects = unapproved.filter((a) => a.networkApprovalStatus && a.networkApprovalStatus !== physical_asset_entity_1.NetworkApprovalStatus.APPROVED);
            if (!suspects.length) {
                return;
            }
            for (const asset of suspects) {
                const ownerId = (asset.owner && asset.owner.id) || null;
                const title = 'Connected asset without network approval';
                const message = `Physical asset "${asset.assetDescription || asset.uniqueIdentifier}" is connected but has network approval status "${asset.networkApprovalStatus}".`;
                if (ownerId) {
                    await this.notificationService.create({
                        userId: ownerId,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title,
                        message,
                        entityType: 'physical_asset',
                        entityId: asset.id,
                        actionUrl: `/dashboard/assets/physical/${asset.id}`,
                        metadata: {
                            connectivityStatus: asset.connectivityStatus,
                            networkApprovalStatus: asset.networkApprovalStatus,
                        },
                    });
                }
                else {
                    this.logger.warn(`Connected unapproved asset ${asset.id} has no owner; skipping owner-specific notification.`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Failed to run notifyUnapprovedConnectedAssets: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, error === null || error === void 0 ? void 0 : error.stack);
        }
    }
};
exports.AssetConnectivityScheduler = AssetConnectivityScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetConnectivityScheduler.prototype, "notifyUnapprovedConnectedAssets", null);
exports.AssetConnectivityScheduler = AssetConnectivityScheduler = AssetConnectivityScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], AssetConnectivityScheduler);
//# sourceMappingURL=asset-connectivity.scheduler.js.map