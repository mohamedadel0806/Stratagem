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
exports.InfluencerRevision = exports.RevisionType = void 0;
const typeorm_1 = require("typeorm");
const influencer_entity_1 = require("./influencer.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var RevisionType;
(function (RevisionType) {
    RevisionType["CREATED"] = "created";
    RevisionType["UPDATED"] = "updated";
    RevisionType["STATUS_CHANGED"] = "status_changed";
    RevisionType["APPLICABILITY_CHANGED"] = "applicability_changed";
    RevisionType["REVIEWED"] = "reviewed";
    RevisionType["ARCHIVED"] = "archived";
})(RevisionType || (exports.RevisionType = RevisionType = {}));
let InfluencerRevision = class InfluencerRevision {
};
exports.InfluencerRevision = InfluencerRevision;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'influencer_id' }),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "influencer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => influencer_entity_1.Influencer, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'influencer_id' }),
    __metadata("design:type", influencer_entity_1.Influencer)
], InfluencerRevision.prototype, "influencer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RevisionType,
        name: 'revision_type',
    }),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "revision_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'revision_notes' }),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "revision_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'revision_date' }),
    __metadata("design:type", Date)
], InfluencerRevision.prototype, "revision_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'changes_summary' }),
    __metadata("design:type", Object)
], InfluencerRevision.prototype, "changes_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'impact_assessment' }),
    __metadata("design:type", Object)
], InfluencerRevision.prototype, "impact_assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'reviewed_by' }),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "reviewed_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewed_by' }),
    __metadata("design:type", user_entity_1.User)
], InfluencerRevision.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], InfluencerRevision.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], InfluencerRevision.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InfluencerRevision.prototype, "created_at", void 0);
exports.InfluencerRevision = InfluencerRevision = __decorate([
    (0, typeorm_1.Entity)('influencer_revisions'),
    (0, typeorm_1.Index)(['influencer_id']),
    (0, typeorm_1.Index)(['revision_date']),
    (0, typeorm_1.Index)(['revision_type'])
], InfluencerRevision);
//# sourceMappingURL=influencer-revision.entity.js.map