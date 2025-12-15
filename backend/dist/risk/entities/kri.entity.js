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
exports.KRI = exports.KRITrend = exports.KRIStatus = exports.MeasurementFrequency = void 0;
const typeorm_1 = require("typeorm");
const risk_category_entity_1 = require("./risk-category.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const kri_measurement_entity_1 = require("./kri-measurement.entity");
const kri_risk_link_entity_1 = require("./kri-risk-link.entity");
var MeasurementFrequency;
(function (MeasurementFrequency) {
    MeasurementFrequency["DAILY"] = "daily";
    MeasurementFrequency["WEEKLY"] = "weekly";
    MeasurementFrequency["MONTHLY"] = "monthly";
    MeasurementFrequency["QUARTERLY"] = "quarterly";
    MeasurementFrequency["ANNUALLY"] = "annually";
})(MeasurementFrequency || (exports.MeasurementFrequency = MeasurementFrequency = {}));
var KRIStatus;
(function (KRIStatus) {
    KRIStatus["GREEN"] = "green";
    KRIStatus["AMBER"] = "amber";
    KRIStatus["RED"] = "red";
})(KRIStatus || (exports.KRIStatus = KRIStatus = {}));
var KRITrend;
(function (KRITrend) {
    KRITrend["IMPROVING"] = "improving";
    KRITrend["STABLE"] = "stable";
    KRITrend["WORSENING"] = "worsening";
})(KRITrend || (exports.KRITrend = KRITrend = {}));
let KRI = class KRI {
};
exports.KRI = KRI;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KRI.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'kri_id' }),
    __metadata("design:type", String)
], KRI.prototype, "kri_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], KRI.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KRI.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'category_id' }),
    __metadata("design:type", String)
], KRI.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_category_entity_1.RiskCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", risk_category_entity_1.RiskCategory)
], KRI.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'measurement_unit' }),
    __metadata("design:type", String)
], KRI.prototype, "measurement_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MeasurementFrequency,
        enumName: 'measurement_frequency_enum',
        default: MeasurementFrequency.MONTHLY,
        name: 'measurement_frequency',
    }),
    __metadata("design:type", String)
], KRI.prototype, "measurement_frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true, name: 'data_source' }),
    __metadata("design:type", String)
], KRI.prototype, "data_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'calculation_method' }),
    __metadata("design:type", String)
], KRI.prototype, "calculation_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_green' }),
    __metadata("design:type", Number)
], KRI.prototype, "threshold_green", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_amber' }),
    __metadata("design:type", Number)
], KRI.prototype, "threshold_amber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_red' }),
    __metadata("design:type", Number)
], KRI.prototype, "threshold_red", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'lower_better',
        name: 'threshold_direction',
    }),
    __metadata("design:type", String)
], KRI.prototype, "threshold_direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'current_value' }),
    __metadata("design:type", Number)
], KRI.prototype, "current_value", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KRIStatus,
        enumName: 'kri_status',
        nullable: true,
        name: 'current_status',
    }),
    __metadata("design:type", String)
], KRI.prototype, "current_status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KRITrend,
        enumName: 'kri_trend',
        nullable: true,
    }),
    __metadata("design:type", String)
], KRI.prototype, "trend", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'kri_owner_id' }),
    __metadata("design:type", String)
], KRI.prototype, "kri_owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'kri_owner_id' }),
    __metadata("design:type", user_entity_1.User)
], KRI.prototype, "kri_owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], KRI.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'last_measured_at' }),
    __metadata("design:type", Date)
], KRI.prototype, "last_measured_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_measurement_due' }),
    __metadata("design:type", Date)
], KRI.prototype, "next_measurement_due", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'target_value' }),
    __metadata("design:type", Number)
], KRI.prototype, "target_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'baseline_value' }),
    __metadata("design:type", Number)
], KRI.prototype, "baseline_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], KRI.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kri_measurement_entity_1.KRIMeasurement, (measurement) => measurement.kri),
    __metadata("design:type", Array)
], KRI.prototype, "measurements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kri_risk_link_entity_1.KRIRiskLink, (link) => link.kri),
    __metadata("design:type", Array)
], KRI.prototype, "risk_links", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], KRI.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], KRI.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KRI.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KRI.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], KRI.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KRI.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], KRI.prototype, "deleted_at", void 0);
exports.KRI = KRI = __decorate([
    (0, typeorm_1.Entity)('kris'),
    (0, typeorm_1.Index)(['kri_id']),
    (0, typeorm_1.Index)(['category_id']),
    (0, typeorm_1.Index)(['current_status']),
    (0, typeorm_1.Index)(['is_active']),
    (0, typeorm_1.Index)(['kri_owner_id'])
], KRI);
//# sourceMappingURL=kri.entity.js.map