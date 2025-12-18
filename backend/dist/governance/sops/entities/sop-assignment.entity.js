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
exports.SOPAssignment = void 0;
const typeorm_1 = require("typeorm");
const sop_entity_1 = require("./sop.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
const business_unit_entity_1 = require("../../../common/entities/business-unit.entity");
let SOPAssignment = class SOPAssignment {
};
exports.SOPAssignment = SOPAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPAssignment.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPAssignment.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'user_id' }),
    __metadata("design:type", String)
], SOPAssignment.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SOPAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'role_id' }),
    __metadata("design:type", String)
], SOPAssignment.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'business_unit_id' }),
    __metadata("design:type", String)
], SOPAssignment.prototype, "business_unit_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], SOPAssignment.prototype, "business_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assigned_at' }),
    __metadata("design:type", Date)
], SOPAssignment.prototype, "assigned_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assigned_by' }),
    __metadata("design:type", String)
], SOPAssignment.prototype, "assigned_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPAssignment.prototype, "assigner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'notification_sent' }),
    __metadata("design:type", Boolean)
], SOPAssignment.prototype, "notification_sent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'notification_sent_at' }),
    __metadata("design:type", Date)
], SOPAssignment.prototype, "notification_sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SOPAssignment.prototype, "acknowledged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'acknowledged_at' }),
    __metadata("design:type", Date)
], SOPAssignment.prototype, "acknowledged_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPAssignment.prototype, "created_at", void 0);
exports.SOPAssignment = SOPAssignment = __decorate([
    (0, typeorm_1.Entity)('sop_assignments'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['user_id']),
    (0, typeorm_1.Index)(['role_id']),
    (0, typeorm_1.Index)(['business_unit_id']),
    (0, typeorm_1.Index)(['acknowledged']),
    (0, typeorm_1.Index)(['user_id', 'sop_id'])
], SOPAssignment);
//# sourceMappingURL=sop-assignment.entity.js.map