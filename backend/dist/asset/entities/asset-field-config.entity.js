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
exports.AssetFieldConfig = exports.FieldType = exports.AssetTypeEnum = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AssetTypeEnum;
(function (AssetTypeEnum) {
    AssetTypeEnum["PHYSICAL"] = "physical";
    AssetTypeEnum["INFORMATION"] = "information";
    AssetTypeEnum["APPLICATION"] = "application";
    AssetTypeEnum["SOFTWARE"] = "software";
    AssetTypeEnum["SUPPLIER"] = "supplier";
})(AssetTypeEnum || (exports.AssetTypeEnum = AssetTypeEnum = {}));
var FieldType;
(function (FieldType) {
    FieldType["TEXT"] = "text";
    FieldType["NUMBER"] = "number";
    FieldType["DATE"] = "date";
    FieldType["BOOLEAN"] = "boolean";
    FieldType["SELECT"] = "select";
    FieldType["MULTI_SELECT"] = "multi_select";
    FieldType["TEXTAREA"] = "textarea";
    FieldType["EMAIL"] = "email";
    FieldType["URL"] = "url";
})(FieldType || (exports.FieldType = FieldType = {}));
let AssetFieldConfig = class AssetFieldConfig {
};
exports.AssetFieldConfig = AssetFieldConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetTypeEnum,
    }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FieldType,
    }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "fieldType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetFieldConfig.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AssetFieldConfig.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetFieldConfig.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "validationRule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "validationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], AssetFieldConfig.prototype, "selectOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "helpText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AssetFieldConfig.prototype, "fieldDependencies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssetFieldConfig.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AssetFieldConfig.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssetFieldConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssetFieldConfig.prototype, "updatedAt", void 0);
exports.AssetFieldConfig = AssetFieldConfig = __decorate([
    (0, typeorm_1.Entity)('asset_field_configs'),
    (0, typeorm_1.Index)(['assetType', 'fieldName'], { unique: true })
], AssetFieldConfig);
//# sourceMappingURL=asset-field-config.entity.js.map