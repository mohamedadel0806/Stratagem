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
exports.RiskAssessmentRequest = exports.RequestStatus = exports.RequestPriority = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const risk_assessment_entity_1 = require("./risk-assessment.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const risk_assessment_entity_2 = require("./risk-assessment.entity");
var RequestPriority;
(function (RequestPriority) {
    RequestPriority["CRITICAL"] = "critical";
    RequestPriority["HIGH"] = "high";
    RequestPriority["MEDIUM"] = "medium";
    RequestPriority["LOW"] = "low";
})(RequestPriority || (exports.RequestPriority = RequestPriority = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CANCELLED"] = "cancelled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let RiskAssessmentRequest = class RiskAssessmentRequest {
};
exports.RiskAssessmentRequest = RiskAssessmentRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'request_identifier' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "request_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskAssessmentRequest.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'requested_by_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "requested_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_by_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessmentRequest.prototype, "requested_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'requested_for_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "requested_for_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_for_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessmentRequest.prototype, "requested_for", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'assessment_type',
    }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "assessment_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: RequestPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'due_date' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approval_workflow_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "approval_workflow_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approved_by_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "approved_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessmentRequest.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'approved_at' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'rejected_by_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "rejected_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'rejected_by_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessmentRequest.prototype, "rejected_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'rejected_at' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "rejected_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'rejection_reason' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'completed_at' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'resulting_assessment_id' }),
    __metadata("design:type", String)
], RiskAssessmentRequest.prototype, "resulting_assessment_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_assessment_entity_1.RiskAssessment, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'resulting_assessment_id' }),
    __metadata("design:type", risk_assessment_entity_1.RiskAssessment)
], RiskAssessmentRequest.prototype, "resulting_assessment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskAssessmentRequest.prototype, "updated_at", void 0);
exports.RiskAssessmentRequest = RiskAssessmentRequest = __decorate([
    (0, typeorm_1.Entity)('risk_assessment_requests'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['requested_by_id']),
    (0, typeorm_1.Index)(['requested_for_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['assessment_type']),
    (0, typeorm_1.Index)(['due_date']),
    (0, typeorm_1.Index)(['request_identifier'])
], RiskAssessmentRequest);
//# sourceMappingURL=risk-assessment-request.entity.js.map