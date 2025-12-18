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
exports.PolicyException = exports.ExceptionType = exports.ExceptionStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const business_unit_entity_1 = require("../../../common/entities/business-unit.entity");
var ExceptionStatus;
(function (ExceptionStatus) {
    ExceptionStatus["REQUESTED"] = "requested";
    ExceptionStatus["UNDER_REVIEW"] = "under_review";
    ExceptionStatus["APPROVED"] = "approved";
    ExceptionStatus["REJECTED"] = "rejected";
    ExceptionStatus["EXPIRED"] = "expired";
    ExceptionStatus["REVOKED"] = "revoked";
})(ExceptionStatus || (exports.ExceptionStatus = ExceptionStatus = {}));
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["POLICY"] = "policy";
    ExceptionType["STANDARD"] = "standard";
    ExceptionType["CONTROL"] = "control";
    ExceptionType["BASELINE"] = "baseline";
})(ExceptionType || (exports.ExceptionType = ExceptionType = {}));
let PolicyException = class PolicyException {
};
exports.PolicyException = PolicyException;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PolicyException.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], PolicyException.prototype, "exception_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'exception_type' }),
    __metadata("design:type", String)
], PolicyException.prototype, "exception_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false, name: 'entity_id' }),
    __metadata("design:type", String)
], PolicyException.prototype, "entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'entity_type' }),
    __metadata("design:type", String)
], PolicyException.prototype, "entity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'requested_by' }),
    __metadata("design:type", String)
], PolicyException.prototype, "requested_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_by' }),
    __metadata("design:type", user_entity_1.User)
], PolicyException.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'requesting_business_unit_id' }),
    __metadata("design:type", String)
], PolicyException.prototype, "requesting_business_unit_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'requesting_business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], PolicyException.prototype, "requesting_business_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE', name: 'request_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "request_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false, name: 'business_justification' }),
    __metadata("design:type", String)
], PolicyException.prototype, "business_justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'compensating_controls' }),
    __metadata("design:type", String)
], PolicyException.prototype, "compensating_controls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'risk_assessment' }),
    __metadata("design:type", String)
], PolicyException.prototype, "risk_assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'start_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'end_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'auto_expire' }),
    __metadata("design:type", Boolean)
], PolicyException.prototype, "auto_expire", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExceptionStatus,
        default: ExceptionStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], PolicyException.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approved_by' }),
    __metadata("design:type", String)
], PolicyException.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], PolicyException.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'approval_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'approval_conditions' }),
    __metadata("design:type", String)
], PolicyException.prototype, "approval_conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'rejection_reason' }),
    __metadata("design:type", String)
], PolicyException.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'last_review_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "last_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_review_date' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'supporting_documents' }),
    __metadata("design:type", Object)
], PolicyException.prototype, "supporting_documents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], PolicyException.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], PolicyException.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], PolicyException.prototype, "deleted_at", void 0);
exports.PolicyException = PolicyException = __decorate([
    (0, typeorm_1.Entity)('policy_exceptions'),
    (0, typeorm_1.Index)(['exception_identifier']),
    (0, typeorm_1.Index)(['entity_type', 'entity_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['requested_by'])
], PolicyException);
//# sourceMappingURL=policy-exception.entity.js.map