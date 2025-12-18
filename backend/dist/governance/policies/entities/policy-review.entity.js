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
exports.PolicyReview = exports.ReviewOutcome = exports.ReviewStatus = void 0;
const typeorm_1 = require("typeorm");
const policy_entity_1 = require("./policy.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["IN_PROGRESS"] = "in_progress";
    ReviewStatus["COMPLETED"] = "completed";
    ReviewStatus["DEFERRED"] = "deferred";
    ReviewStatus["CANCELLED"] = "cancelled";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var ReviewOutcome;
(function (ReviewOutcome) {
    ReviewOutcome["APPROVED"] = "approved";
    ReviewOutcome["REQUIRES_CHANGES"] = "requires_changes";
    ReviewOutcome["SUPERSEDED"] = "superseded";
    ReviewOutcome["ARCHIVED"] = "archived";
    ReviewOutcome["NO_CHANGES"] = "no_changes";
})(ReviewOutcome || (exports.ReviewOutcome = ReviewOutcome = {}));
let PolicyReview = class PolicyReview {
};
exports.PolicyReview = PolicyReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PolicyReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'policy_id' }),
    __metadata("design:type", String)
], PolicyReview.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_entity_1.Policy, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_entity_1.Policy)
], PolicyReview.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'review_date' }),
    __metadata("design:type", Date)
], PolicyReview.prototype, "review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.PENDING,
    }),
    __metadata("design:type", String)
], PolicyReview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewOutcome,
        nullable: true,
    }),
    __metadata("design:type", String)
], PolicyReview.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'reviewer_id' }),
    __metadata("design:type", String)
], PolicyReview.prototype, "reviewer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewer_id' }),
    __metadata("design:type", user_entity_1.User)
], PolicyReview.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PolicyReview.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'review_summary' }),
    __metadata("design:type", String)
], PolicyReview.prototype, "review_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'recommended_changes' }),
    __metadata("design:type", String)
], PolicyReview.prototype, "recommended_changes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_review_date' }),
    __metadata("design:type", Date)
], PolicyReview.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'completed_at' }),
    __metadata("design:type", Date)
], PolicyReview.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'initiated_by' }),
    __metadata("design:type", String)
], PolicyReview.prototype, "initiated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'initiated_by' }),
    __metadata("design:type", user_entity_1.User)
], PolicyReview.prototype, "initiator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PolicyReview.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PolicyReview.prototype, "updated_at", void 0);
exports.PolicyReview = PolicyReview = __decorate([
    (0, typeorm_1.Entity)('policy_reviews'),
    (0, typeorm_1.Index)(['policy_id']),
    (0, typeorm_1.Index)(['reviewer_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['review_date'])
], PolicyReview);
//# sourceMappingURL=policy-review.entity.js.map