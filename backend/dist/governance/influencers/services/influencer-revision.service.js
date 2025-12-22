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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencerRevisionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const influencer_revision_entity_1 = require("../entities/influencer-revision.entity");
let InfluencerRevisionService = class InfluencerRevisionService {
    constructor(revisionRepository) {
        this.revisionRepository = revisionRepository;
    }
    async createRevision(influencer, revisionType, userId, revisionNotes, changesSummary, impactAssessment) {
        const revision = this.revisionRepository.create({
            influencer_id: influencer.id,
            revision_type: revisionType,
            revision_notes: revisionNotes,
            revision_date: new Date(),
            changes_summary: changesSummary,
            impact_assessment: impactAssessment,
            reviewed_by: revisionType === influencer_revision_entity_1.RevisionType.REVIEWED ? userId : null,
            created_by: userId,
        });
        return this.revisionRepository.save(revision);
    }
    async getRevisionHistory(influencerId) {
        return this.revisionRepository.find({
            where: { influencer_id: influencerId },
            relations: ['reviewer', 'creator'],
            order: { revision_date: 'DESC', created_at: 'DESC' },
        });
    }
    async getRevision(id) {
        return this.revisionRepository.findOne({
            where: { id },
            relations: ['influencer', 'reviewer', 'creator'],
        });
    }
    async getLatestRevision(influencerId) {
        return this.revisionRepository.findOne({
            where: { influencer_id: influencerId },
            relations: ['reviewer', 'creator'],
            order: { revision_date: 'DESC', created_at: 'DESC' },
        });
    }
};
exports.InfluencerRevisionService = InfluencerRevisionService;
exports.InfluencerRevisionService = InfluencerRevisionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(influencer_revision_entity_1.InfluencerRevision)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InfluencerRevisionService);
//# sourceMappingURL=influencer-revision.service.js.map