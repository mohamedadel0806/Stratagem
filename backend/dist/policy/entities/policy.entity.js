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
exports.Policy = exports.PolicyType = exports.PolicyStatus = void 0;
const typeorm_1 = require("typeorm");
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "draft";
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["UNDER_REVIEW"] = "under_review";
    PolicyStatus["ARCHIVED"] = "archived";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var PolicyType;
(function (PolicyType) {
    PolicyType["SECURITY"] = "security";
    PolicyType["COMPLIANCE"] = "compliance";
    PolicyType["OPERATIONAL"] = "operational";
    PolicyType["IT"] = "it";
    PolicyType["HR"] = "hr";
    PolicyType["FINANCE"] = "finance";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
let Policy = class Policy {
};
exports.Policy = Policy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Policy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Policy.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Policy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PolicyType,
        default: PolicyType.COMPLIANCE,
        name: 'policyType',
    }),
    __metadata("design:type", String)
], Policy.prototype, "policyType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PolicyStatus,
        default: PolicyStatus.DRAFT,
        name: 'status',
    }),
    __metadata("design:type", String)
], Policy.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Policy.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'organizationId' }),
    __metadata("design:type", String)
], Policy.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'ownerId' }),
    __metadata("design:type", String)
], Policy.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'effectiveDate' }),
    __metadata("design:type", Date)
], Policy.prototype, "effectiveDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'reviewDate' }),
    __metadata("design:type", Date)
], Policy.prototype, "reviewDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'documentUrl' }),
    __metadata("design:type", String)
], Policy.prototype, "documentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'documentName' }),
    __metadata("design:type", String)
], Policy.prototype, "documentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'documentMimeType' }),
    __metadata("design:type", String)
], Policy.prototype, "documentMimeType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], Policy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], Policy.prototype, "updatedAt", void 0);
exports.Policy = Policy = __decorate([
    (0, typeorm_1.Entity)('policies')
], Policy);
//# sourceMappingURL=policy.entity.js.map