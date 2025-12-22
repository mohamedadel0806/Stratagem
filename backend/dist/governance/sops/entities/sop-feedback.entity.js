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
exports.SOPFeedback = exports.FeedbackSentiment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const sop_entity_1 = require("./sop.entity");
var FeedbackSentiment;
(function (FeedbackSentiment) {
    FeedbackSentiment["VERY_POSITIVE"] = "very_positive";
    FeedbackSentiment["POSITIVE"] = "positive";
    FeedbackSentiment["NEUTRAL"] = "neutral";
    FeedbackSentiment["NEGATIVE"] = "negative";
    FeedbackSentiment["VERY_NEGATIVE"] = "very_negative";
})(FeedbackSentiment || (exports.FeedbackSentiment = FeedbackSentiment = {}));
let SOPFeedback = class SOPFeedback {
};
exports.SOPFeedback = SOPFeedback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPFeedback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPFeedback.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'submitted_by' }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "submitted_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'submitted_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPFeedback.prototype, "submitter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: FeedbackSentiment.NEUTRAL,
    }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "sentiment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'effectiveness_rating' }),
    __metadata("design:type", Number)
], SOPFeedback.prototype, "effectiveness_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'clarity_rating' }),
    __metadata("design:type", Number)
], SOPFeedback.prototype, "clarity_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'completeness_rating' }),
    __metadata("design:type", Number)
], SOPFeedback.prototype, "completeness_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'improvement_suggestions' }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "improvement_suggestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true, name: 'tagged_issues' }),
    __metadata("design:type", Array)
], SOPFeedback.prototype, "tagged_issues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'follow_up_required' }),
    __metadata("design:type", Boolean)
], SOPFeedback.prototype, "follow_up_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPFeedback.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPFeedback.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOPFeedback.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPFeedback.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOPFeedback.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOPFeedback.prototype, "deleted_at", void 0);
exports.SOPFeedback = SOPFeedback = __decorate([
    (0, typeorm_1.Entity)('sop_feedback'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['submitted_by']),
    (0, typeorm_1.Index)(['created_at']),
    (0, typeorm_1.Index)(['sentiment'])
], SOPFeedback);
//# sourceMappingURL=sop-feedback.entity.js.map