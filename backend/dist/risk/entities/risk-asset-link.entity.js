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
exports.RiskAssetLink = exports.RiskAssetType = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var RiskAssetType;
(function (RiskAssetType) {
    RiskAssetType["PHYSICAL"] = "physical";
    RiskAssetType["INFORMATION"] = "information";
    RiskAssetType["SOFTWARE"] = "software";
    RiskAssetType["APPLICATION"] = "application";
    RiskAssetType["SUPPLIER"] = "supplier";
})(RiskAssetType || (exports.RiskAssetType = RiskAssetType = {}));
let RiskAssetLink = class RiskAssetLink {
};
exports.RiskAssetLink = RiskAssetLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskAssetLink.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskAssetType,
        name: 'asset_type',
    }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "asset_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'asset_id' }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'impact_description' }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "impact_description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'asset_criticality_at_link',
    }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "asset_criticality_at_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'linked_by' }),
    __metadata("design:type", String)
], RiskAssetLink.prototype, "linked_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'linked_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssetLink.prototype, "linker", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'linked_at' }),
    __metadata("design:type", Date)
], RiskAssetLink.prototype, "linked_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskAssetLink.prototype, "updated_at", void 0);
exports.RiskAssetLink = RiskAssetLink = __decorate([
    (0, typeorm_1.Entity)('risk_asset_links'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['asset_type', 'asset_id'])
], RiskAssetLink);
//# sourceMappingURL=risk-asset-link.entity.js.map