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
exports.KRIRiskLink = void 0;
const typeorm_1 = require("typeorm");
const kri_entity_1 = require("./kri.entity");
const risk_entity_1 = require("./risk.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let KRIRiskLink = class KRIRiskLink {
};
exports.KRIRiskLink = KRIRiskLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'kri_id' }),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "kri_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kri_entity_1.KRI, (kri) => kri.risk_links, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'kri_id' }),
    __metadata("design:type", kri_entity_1.KRI)
], KRIRiskLink.prototype, "kri", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], KRIRiskLink.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'indicator',
        name: 'relationship_type',
    }),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "relationship_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'linked_by' }),
    __metadata("design:type", String)
], KRIRiskLink.prototype, "linked_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'linked_by' }),
    __metadata("design:type", user_entity_1.User)
], KRIRiskLink.prototype, "linker", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'linked_at' }),
    __metadata("design:type", Date)
], KRIRiskLink.prototype, "linked_at", void 0);
exports.KRIRiskLink = KRIRiskLink = __decorate([
    (0, typeorm_1.Entity)('kri_risk_links'),
    (0, typeorm_1.Index)(['kri_id']),
    (0, typeorm_1.Index)(['risk_id'])
], KRIRiskLink);
//# sourceMappingURL=kri-risk-link.entity.js.map