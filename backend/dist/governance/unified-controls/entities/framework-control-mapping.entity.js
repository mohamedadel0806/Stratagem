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
exports.FrameworkControlMapping = exports.MappingCoverage = void 0;
const typeorm_1 = require("typeorm");
const unified_control_entity_1 = require("./unified-control.entity");
const framework_requirement_entity_1 = require("./framework-requirement.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var MappingCoverage;
(function (MappingCoverage) {
    MappingCoverage["FULL"] = "full";
    MappingCoverage["PARTIAL"] = "partial";
    MappingCoverage["NOT_APPLICABLE"] = "not_applicable";
})(MappingCoverage || (exports.MappingCoverage = MappingCoverage = {}));
let FrameworkControlMapping = class FrameworkControlMapping {
};
exports.FrameworkControlMapping = FrameworkControlMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'framework_requirement_id' }),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "framework_requirement_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => framework_requirement_entity_1.FrameworkRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'framework_requirement_id' }),
    __metadata("design:type", framework_requirement_entity_1.FrameworkRequirement)
], FrameworkControlMapping.prototype, "framework_requirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'unified_control_id' }),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "unified_control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'unified_control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], FrameworkControlMapping.prototype, "unified_control", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MappingCoverage,
        default: MappingCoverage.FULL,
        name: 'coverage_level',
    }),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "coverage_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'mapping_notes' }),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "mapping_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'mapped_by' }),
    __metadata("design:type", String)
], FrameworkControlMapping.prototype, "mapped_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mapped_by' }),
    __metadata("design:type", user_entity_1.User)
], FrameworkControlMapping.prototype, "mapper", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'mapped_at' }),
    __metadata("design:type", Date)
], FrameworkControlMapping.prototype, "mapped_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FrameworkControlMapping.prototype, "created_at", void 0);
exports.FrameworkControlMapping = FrameworkControlMapping = __decorate([
    (0, typeorm_1.Entity)('framework_control_mappings'),
    (0, typeorm_1.Index)(['framework_requirement_id']),
    (0, typeorm_1.Index)(['unified_control_id']),
    (0, typeorm_1.Index)(['coverage_level'])
], FrameworkControlMapping);
//# sourceMappingURL=framework-control-mapping.entity.js.map