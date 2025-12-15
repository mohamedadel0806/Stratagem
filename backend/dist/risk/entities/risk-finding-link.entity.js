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
exports.RiskFindingLink = exports.RiskFindingRelationshipType = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const finding_entity_1 = require("../../governance/findings/entities/finding.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var RiskFindingRelationshipType;
(function (RiskFindingRelationshipType) {
    RiskFindingRelationshipType["IDENTIFIED"] = "identified";
    RiskFindingRelationshipType["CONTRIBUTES_TO"] = "contributes_to";
    RiskFindingRelationshipType["MITIGATES"] = "mitigates";
    RiskFindingRelationshipType["EXACERBATES"] = "exacerbates";
    RiskFindingRelationshipType["RELATED"] = "related";
})(RiskFindingRelationshipType || (exports.RiskFindingRelationshipType = RiskFindingRelationshipType = {}));
let RiskFindingLink = class RiskFindingLink {
};
exports.RiskFindingLink = RiskFindingLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskFindingLink.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'finding_id' }),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "finding_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => finding_entity_1.Finding, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'finding_id' }),
    __metadata("design:type", finding_entity_1.Finding)
], RiskFindingLink.prototype, "finding", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'relationship_type',
    }),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "relationship_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'notes' }),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'linked_by' }),
    __metadata("design:type", String)
], RiskFindingLink.prototype, "linked_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'linked_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskFindingLink.prototype, "linker", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'linked_at' }),
    __metadata("design:type", Date)
], RiskFindingLink.prototype, "linked_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskFindingLink.prototype, "updated_at", void 0);
exports.RiskFindingLink = RiskFindingLink = __decorate([
    (0, typeorm_1.Entity)('risk_finding_links'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['finding_id']),
    (0, typeorm_1.Index)(['relationship_type'])
], RiskFindingLink);
//# sourceMappingURL=risk-finding-link.entity.js.map