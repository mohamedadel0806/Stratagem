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
exports.KRIMeasurement = void 0;
const typeorm_1 = require("typeorm");
const kri_entity_1 = require("./kri.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let KRIMeasurement = class KRIMeasurement {
};
exports.KRIMeasurement = KRIMeasurement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KRIMeasurement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'kri_id' }),
    __metadata("design:type", String)
], KRIMeasurement.prototype, "kri_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kri_entity_1.KRI, (kri) => kri.measurements, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'kri_id' }),
    __metadata("design:type", kri_entity_1.KRI)
], KRIMeasurement.prototype, "kri", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'measurement_date' }),
    __metadata("design:type", Date)
], KRIMeasurement.prototype, "measurement_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], KRIMeasurement.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: kri_entity_1.KRIStatus,
        enumName: 'kri_status',
        nullable: true,
    }),
    __metadata("design:type", String)
], KRIMeasurement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KRIMeasurement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'measured_by' }),
    __metadata("design:type", String)
], KRIMeasurement.prototype, "measured_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'measured_by' }),
    __metadata("design:type", user_entity_1.User)
], KRIMeasurement.prototype, "measurer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'evidence_attachments' }),
    __metadata("design:type", Array)
], KRIMeasurement.prototype, "evidence_attachments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KRIMeasurement.prototype, "created_at", void 0);
exports.KRIMeasurement = KRIMeasurement = __decorate([
    (0, typeorm_1.Entity)('kri_measurements'),
    (0, typeorm_1.Index)(['kri_id']),
    (0, typeorm_1.Index)(['measurement_date']),
    (0, typeorm_1.Index)(['kri_id', 'measurement_date'])
], KRIMeasurement);
//# sourceMappingURL=kri-measurement.entity.js.map