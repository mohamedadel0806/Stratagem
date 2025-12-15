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
exports.RiskCategory = exports.RiskTolerance = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var RiskTolerance;
(function (RiskTolerance) {
    RiskTolerance["LOW"] = "low";
    RiskTolerance["MEDIUM"] = "medium";
    RiskTolerance["HIGH"] = "high";
})(RiskTolerance || (exports.RiskTolerance = RiskTolerance = {}));
let RiskCategory = class RiskCategory {
};
exports.RiskCategory = RiskCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], RiskCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], RiskCategory.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'parent_category_id' }),
    __metadata("design:type", String)
], RiskCategory.prototype, "parent_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RiskCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_category_id' }),
    __metadata("design:type", RiskCategory)
], RiskCategory.prototype, "parent_category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RiskCategory, (category) => category.parent_category),
    __metadata("design:type", Array)
], RiskCategory.prototype, "sub_categories", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskTolerance,
        default: RiskTolerance.MEDIUM,
        name: 'risk_tolerance',
    }),
    __metadata("design:type", String)
], RiskCategory.prototype, "risk_tolerance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], RiskCategory.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], RiskCategory.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], RiskCategory.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], RiskCategory.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], RiskCategory.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskCategory.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RiskCategory.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], RiskCategory.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskCategory.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskCategory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], RiskCategory.prototype, "deleted_at", void 0);
exports.RiskCategory = RiskCategory = __decorate([
    (0, typeorm_1.Entity)('risk_categories'),
    (0, typeorm_1.Index)(['code'], { unique: true }),
    (0, typeorm_1.Index)(['parent_category_id']),
    (0, typeorm_1.Index)(['is_active']),
    (0, typeorm_1.Index)(['display_order'])
], RiskCategory);
//# sourceMappingURL=risk-category.entity.js.map