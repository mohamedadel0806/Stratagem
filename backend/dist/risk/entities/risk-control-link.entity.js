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
exports.RiskControlLink = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const unified_control_entity_1 = require("../../governance/unified-controls/entities/unified-control.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let RiskControlLink = class RiskControlLink {
};
exports.RiskControlLink = RiskControlLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskControlLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskControlLink.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'control_id' }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], RiskControlLink.prototype, "control", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'effectiveness_rating' }),
    __metadata("design:type", Number)
], RiskControlLink.prototype, "effectiveness_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'scale',
        name: 'effectiveness_type',
    }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "effectiveness_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'control_type_for_risk',
    }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "control_type_for_risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'linked_by' }),
    __metadata("design:type", String)
], RiskControlLink.prototype, "linked_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'linked_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskControlLink.prototype, "linker", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'linked_at' }),
    __metadata("design:type", Date)
], RiskControlLink.prototype, "linked_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'last_effectiveness_review' }),
    __metadata("design:type", Date)
], RiskControlLink.prototype, "last_effectiveness_review", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskControlLink.prototype, "updated_at", void 0);
exports.RiskControlLink = RiskControlLink = __decorate([
    (0, typeorm_1.Entity)('risk_control_links'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['control_id']),
    (0, typeorm_1.Index)(['effectiveness_rating'])
], RiskControlLink);
//# sourceMappingURL=risk-control-link.entity.js.map