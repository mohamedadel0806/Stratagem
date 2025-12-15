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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardOverviewDto = exports.AssetStatsDto = exports.AssetWithOutdatedSecurityTestDto = exports.AssetByComplianceScopeDto = exports.RecentAssetChangeDto = exports.AssetWithoutOwnerDto = exports.AssetCountByCriticalityDto = exports.AssetCountByTypeDto = exports.DashboardSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardSummaryDto {
}
exports.DashboardSummaryDto = DashboardSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "totalRisks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "activePolicies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "complianceScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "pendingTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "compliantRequirements", void 0);
class AssetCountByTypeDto {
}
exports.AssetCountByTypeDto = AssetCountByTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "physical", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "information", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "application", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "software", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByTypeDto.prototype, "total", void 0);
class AssetCountByCriticalityDto {
}
exports.AssetCountByCriticalityDto = AssetCountByCriticalityDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByCriticalityDto.prototype, "critical", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByCriticalityDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByCriticalityDto.prototype, "medium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetCountByCriticalityDto.prototype, "low", void 0);
class AssetWithoutOwnerDto {
}
exports.AssetWithoutOwnerDto = AssetWithoutOwnerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithoutOwnerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithoutOwnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithoutOwnerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithoutOwnerDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", String)
], AssetWithoutOwnerDto.prototype, "criticalityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AssetWithoutOwnerDto.prototype, "createdAt", void 0);
class RecentAssetChangeDto {
}
exports.RecentAssetChangeDto = RecentAssetChangeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "assetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentAssetChangeDto.prototype, "changedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RecentAssetChangeDto.prototype, "createdAt", void 0);
class AssetByComplianceScopeDto {
}
exports.AssetByComplianceScopeDto = AssetByComplianceScopeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetByComplianceScopeDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetByComplianceScopeDto.prototype, "count", void 0);
class AssetWithOutdatedSecurityTestDto {
}
exports.AssetWithOutdatedSecurityTestDto = AssetWithOutdatedSecurityTestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithOutdatedSecurityTestDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithOutdatedSecurityTestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetWithOutdatedSecurityTestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AssetWithOutdatedSecurityTestDto.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetWithOutdatedSecurityTestDto.prototype, "daysSinceLastTest", void 0);
class AssetStatsDto {
}
exports.AssetStatsDto = AssetStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssetCountByTypeDto }),
    __metadata("design:type", AssetCountByTypeDto)
], AssetStatsDto.prototype, "countByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssetCountByCriticalityDto }),
    __metadata("design:type", AssetCountByCriticalityDto)
], AssetStatsDto.prototype, "countByCriticality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssetWithoutOwnerDto] }),
    __metadata("design:type", Array)
], AssetStatsDto.prototype, "assetsWithoutOwner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RecentAssetChangeDto] }),
    __metadata("design:type", Array)
], AssetStatsDto.prototype, "recentChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssetByComplianceScopeDto], required: false }),
    __metadata("design:type", Array)
], AssetStatsDto.prototype, "assetsByComplianceScope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssetWithOutdatedSecurityTestDto], required: false }),
    __metadata("design:type", Array)
], AssetStatsDto.prototype, "assetsWithOutdatedSecurityTests", void 0);
class DashboardOverviewDto {
}
exports.DashboardOverviewDto = DashboardOverviewDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", DashboardSummaryDto)
], DashboardOverviewDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssetStatsDto, required: false }),
    __metadata("design:type", AssetStatsDto)
], DashboardOverviewDto.prototype, "assetStats", void 0);
//# sourceMappingURL=dashboard-overview.dto.js.map