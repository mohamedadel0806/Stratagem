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
exports.AssetDependency = exports.RelationshipType = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AssetType;
(function (AssetType) {
    AssetType["PHYSICAL"] = "physical";
    AssetType["INFORMATION"] = "information";
    AssetType["APPLICATION"] = "application";
    AssetType["SOFTWARE"] = "software";
    AssetType["SUPPLIER"] = "supplier";
})(AssetType || (exports.AssetType = AssetType = {}));
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["DEPENDS_ON"] = "depends_on";
    RelationshipType["USES"] = "uses";
    RelationshipType["CONTAINS"] = "contains";
    RelationshipType["HOSTS"] = "hosts";
    RelationshipType["PROCESSES"] = "processes";
    RelationshipType["STORES"] = "stores";
    RelationshipType["OTHER"] = "other";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
let AssetDependency = class AssetDependency {
};
exports.AssetDependency = AssetDependency;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetDependency.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
        name: 'source_asset_type',
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "sourceAssetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        name: 'source_asset_id',
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "sourceAssetId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
        name: 'target_asset_type',
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "targetAssetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        name: 'target_asset_id',
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "targetAssetId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RelationshipType,
        name: 'relationship_type',
        default: RelationshipType.DEPENDS_ON,
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "relationshipType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AssetDependency.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        name: 'created_by_id',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetDependency.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], AssetDependency.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], AssetDependency.prototype, "updatedAt", void 0);
exports.AssetDependency = AssetDependency = __decorate([
    (0, typeorm_1.Entity)('asset_dependencies'),
    (0, typeorm_1.Index)(['sourceAssetType', 'sourceAssetId']),
    (0, typeorm_1.Index)(['targetAssetType', 'targetAssetId']),
    (0, typeorm_1.Index)(['relationshipType']),
    (0, typeorm_1.Index)(['sourceAssetType', 'sourceAssetId', 'targetAssetType', 'targetAssetId'], { unique: true })
], AssetDependency);
//# sourceMappingURL=asset-dependency.entity.js.map