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
exports.EvidenceLinkage = exports.EvidenceLinkType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const evidence_entity_1 = require("./evidence.entity");
var EvidenceLinkType;
(function (EvidenceLinkType) {
    EvidenceLinkType["CONTROL"] = "control";
    EvidenceLinkType["ASSESSMENT"] = "assessment";
    EvidenceLinkType["FINDING"] = "finding";
    EvidenceLinkType["ASSET"] = "asset";
    EvidenceLinkType["POLICY"] = "policy";
    EvidenceLinkType["STANDARD"] = "standard";
})(EvidenceLinkType || (exports.EvidenceLinkType = EvidenceLinkType = {}));
let EvidenceLinkage = class EvidenceLinkage {
};
exports.EvidenceLinkage = EvidenceLinkage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'evidence_id' }),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "evidence_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => evidence_entity_1.Evidence, (evidence) => evidence.linkages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'evidence_id' }),
    __metadata("design:type", evidence_entity_1.Evidence)
], EvidenceLinkage.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EvidenceLinkType,
        name: 'link_type',
    }),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "link_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'linked_entity_id' }),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "linked_entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'link_description' }),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "link_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], EvidenceLinkage.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], EvidenceLinkage.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], EvidenceLinkage.prototype, "created_at", void 0);
exports.EvidenceLinkage = EvidenceLinkage = __decorate([
    (0, typeorm_1.Entity)('evidence_linkages'),
    (0, typeorm_1.Index)(['evidence_id']),
    (0, typeorm_1.Index)(['link_type', 'linked_entity_id'])
], EvidenceLinkage);
//# sourceMappingURL=evidence-linkage.entity.js.map