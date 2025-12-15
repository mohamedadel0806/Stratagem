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
exports.ComplianceAssessment = exports.AssessmentType = void 0;
const typeorm_1 = require("typeorm");
const compliance_requirement_entity_1 = require("./compliance-requirement.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const asset_requirement_mapping_entity_1 = require("./asset-requirement-mapping.entity");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["AUTOMATIC"] = "automatic";
    AssessmentType["MANUAL"] = "manual";
    AssessmentType["SCHEDULED"] = "scheduled";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
let ComplianceAssessment = class ComplianceAssessment {
};
exports.ComplianceAssessment = ComplianceAssessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'asset_type' }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'asset_id' }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_requirement_entity_1.ComplianceRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirement_id' }),
    __metadata("design:type", compliance_requirement_entity_1.ComplianceRequirement)
], ComplianceAssessment.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'requirement_id' }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "requirementId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentType,
        default: AssessmentType.AUTOMATIC,
        name: 'assessment_type',
    }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "assessmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_requirement_mapping_entity_1.ComplianceStatus,
        nullable: true,
        name: 'previous_status',
    }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "previousStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_requirement_mapping_entity_1.ComplianceStatus,
        name: 'new_status',
    }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'validation_results' }),
    __metadata("design:type", Array)
], ComplianceAssessment.prototype, "validationResults", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'assessed_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceAssessment.prototype, "assessedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assessed_by' }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "assessedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assessed_at' }),
    __metadata("design:type", Date)
], ComplianceAssessment.prototype, "assessedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "notes", void 0);
exports.ComplianceAssessment = ComplianceAssessment = __decorate([
    (0, typeorm_1.Entity)('compliance_assessments'),
    (0, typeorm_1.Index)(['assetType', 'assetId']),
    (0, typeorm_1.Index)(['requirementId']),
    (0, typeorm_1.Index)(['assessedAt'])
], ComplianceAssessment);
//# sourceMappingURL=compliance-assessment.entity.js.map