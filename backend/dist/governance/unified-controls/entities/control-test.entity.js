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
exports.ControlTest = exports.ControlTestResult = exports.ControlTestStatus = exports.ControlTestType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const unified_control_entity_1 = require("./unified-control.entity");
const control_asset_mapping_entity_1 = require("./control-asset-mapping.entity");
var ControlTestType;
(function (ControlTestType) {
    ControlTestType["DESIGN"] = "design";
    ControlTestType["OPERATING"] = "operating";
    ControlTestType["TECHNICAL"] = "technical";
    ControlTestType["MANAGEMENT"] = "management";
})(ControlTestType || (exports.ControlTestType = ControlTestType = {}));
var ControlTestStatus;
(function (ControlTestStatus) {
    ControlTestStatus["PLANNED"] = "planned";
    ControlTestStatus["IN_PROGRESS"] = "in_progress";
    ControlTestStatus["COMPLETED"] = "completed";
    ControlTestStatus["CANCELLED"] = "cancelled";
})(ControlTestStatus || (exports.ControlTestStatus = ControlTestStatus = {}));
var ControlTestResult;
(function (ControlTestResult) {
    ControlTestResult["PASS"] = "pass";
    ControlTestResult["FAIL"] = "fail";
    ControlTestResult["INCONCLUSIVE"] = "inconclusive";
    ControlTestResult["NOT_APPLICABLE"] = "not_applicable";
})(ControlTestResult || (exports.ControlTestResult = ControlTestResult = {}));
let ControlTest = class ControlTest {
};
exports.ControlTest = ControlTest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ControlTest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'unified_control_id' }),
    __metadata("design:type", String)
], ControlTest.prototype, "unified_control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'unified_control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], ControlTest.prototype, "unified_control", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'control_asset_mapping_id', nullable: true }),
    __metadata("design:type", String)
], ControlTest.prototype, "control_asset_mapping_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => control_asset_mapping_entity_1.ControlAssetMapping, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'control_asset_mapping_id' }),
    __metadata("design:type", control_asset_mapping_entity_1.ControlAssetMapping)
], ControlTest.prototype, "control_asset_mapping", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlTestType,
        default: ControlTestType.OPERATING,
    }),
    __metadata("design:type", String)
], ControlTest.prototype, "test_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'test_date' }),
    __metadata("design:type", Date)
], ControlTest.prototype, "test_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlTestStatus,
        default: ControlTestStatus.PLANNED,
    }),
    __metadata("design:type", String)
], ControlTest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlTestResult,
        nullable: true,
    }),
    __metadata("design:type", String)
], ControlTest.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'effectiveness_score' }),
    __metadata("design:type", Number)
], ControlTest.prototype, "effectiveness_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ControlTest.prototype, "test_procedure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ControlTest.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ControlTest.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'evidence_links' }),
    __metadata("design:type", Array)
], ControlTest.prototype, "evidence_links", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'tester_id' }),
    __metadata("design:type", String)
], ControlTest.prototype, "tester_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tester_id' }),
    __metadata("design:type", user_entity_1.User)
], ControlTest.prototype, "tester", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ControlTest.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ControlTest.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ControlTest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], ControlTest.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], ControlTest.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ControlTest.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], ControlTest.prototype, "deleted_at", void 0);
exports.ControlTest = ControlTest = __decorate([
    (0, typeorm_1.Entity)('control_tests'),
    (0, typeorm_1.Index)(['unified_control_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['test_date']),
    (0, typeorm_1.Index)(['tester_id'])
], ControlTest);
//# sourceMappingURL=control-test.entity.js.map