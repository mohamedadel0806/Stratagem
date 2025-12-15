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
exports.ControlAssetMapping = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const unified_control_entity_1 = require("./unified-control.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var AssetType;
(function (AssetType) {
    AssetType["PHYSICAL"] = "physical";
    AssetType["INFORMATION"] = "information";
    AssetType["APPLICATION"] = "application";
    AssetType["SOFTWARE"] = "software";
    AssetType["SUPPLIER"] = "supplier";
})(AssetType || (exports.AssetType = AssetType = {}));
let ControlAssetMapping = class ControlAssetMapping {
};
exports.ControlAssetMapping = ControlAssetMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'unified_control_id' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "unified_control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'unified_control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], ControlAssetMapping.prototype, "unified_control", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'asset_type' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "asset_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'asset_id' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'implementation_date' }),
    __metadata("design:type", Date)
], ControlAssetMapping.prototype, "implementation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: unified_control_entity_1.ImplementationStatus,
        default: unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED,
        name: 'implementation_status',
    }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "implementation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'implementation_notes' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "implementation_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'last_test_date' }),
    __metadata("design:type", Date)
], ControlAssetMapping.prototype, "last_test_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'last_test_result' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "last_test_result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'effectiveness_score' }),
    __metadata("design:type", Number)
], ControlAssetMapping.prototype, "effectiveness_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_automated' }),
    __metadata("design:type", Boolean)
], ControlAssetMapping.prototype, "is_automated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'mapped_by' }),
    __metadata("design:type", String)
], ControlAssetMapping.prototype, "mapped_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mapped_by' }),
    __metadata("design:type", user_entity_1.User)
], ControlAssetMapping.prototype, "mapper", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'mapped_at' }),
    __metadata("design:type", Date)
], ControlAssetMapping.prototype, "mapped_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ControlAssetMapping.prototype, "updated_at", void 0);
exports.ControlAssetMapping = ControlAssetMapping = __decorate([
    (0, typeorm_1.Entity)('control_asset_mappings'),
    (0, typeorm_1.Index)(['unified_control_id']),
    (0, typeorm_1.Index)(['asset_type', 'asset_id']),
    (0, typeorm_1.Index)(['implementation_status'])
], ControlAssetMapping);
//# sourceMappingURL=control-asset-mapping.entity.js.map