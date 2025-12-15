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
exports.KRIService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kri_entity_1 = require("../entities/kri.entity");
const kri_measurement_entity_1 = require("../entities/kri-measurement.entity");
const kri_risk_link_entity_1 = require("../entities/kri-risk-link.entity");
let KRIService = class KRIService {
    constructor(kriRepository, measurementRepository, linkRepository) {
        this.kriRepository = kriRepository;
        this.measurementRepository = measurementRepository;
        this.linkRepository = linkRepository;
    }
    async findAll(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.categoryId)
            where.category_id = filters.categoryId;
        if (filters === null || filters === void 0 ? void 0 : filters.status)
            where.current_status = filters.status;
        if (filters === null || filters === void 0 ? void 0 : filters.ownerId)
            where.kri_owner_id = filters.ownerId;
        if ((filters === null || filters === void 0 ? void 0 : filters.isActive) !== undefined)
            where.is_active = filters.isActive;
        const kris = await this.kriRepository.find({
            where,
            relations: ['category', 'kri_owner', 'risk_links'],
            order: { created_at: 'DESC' },
        });
        return kris.map(kri => this.toResponseDto(kri));
    }
    async findOne(id) {
        const kri = await this.kriRepository.findOne({
            where: { id },
            relations: ['category', 'kri_owner', 'risk_links', 'measurements'],
        });
        if (!kri) {
            throw new common_1.NotFoundException(`KRI with ID ${id} not found`);
        }
        const recentMeasurements = await this.measurementRepository.find({
            where: { kri_id: id },
            relations: ['measurer'],
            order: { measurement_date: 'DESC' },
            take: 10,
        });
        const dto = this.toResponseDto(kri);
        dto.recent_measurements = recentMeasurements.map(m => this.toMeasurementResponseDto(m));
        return dto;
    }
    async create(createDto, userId) {
        const kri = this.kriRepository.create(Object.assign(Object.assign({}, createDto), { next_measurement_due: createDto.next_measurement_due
                ? new Date(createDto.next_measurement_due)
                : this.calculateNextMeasurementDate(createDto.measurement_frequency), created_by: userId }));
        const savedKri = await this.kriRepository.save(kri);
        const fullKri = await this.kriRepository.findOne({
            where: { id: savedKri.id },
            relations: ['category', 'kri_owner'],
        });
        return this.toResponseDto(fullKri);
    }
    async update(id, updateDto, userId) {
        const kri = await this.kriRepository.findOne({ where: { id } });
        if (!kri) {
            throw new common_1.NotFoundException(`KRI with ID ${id} not found`);
        }
        const updateData = Object.assign(Object.assign({}, updateDto), { updated_by: userId });
        if (updateDto.next_measurement_due) {
            updateData.next_measurement_due = new Date(updateDto.next_measurement_due);
        }
        Object.assign(kri, updateData);
        const updatedKri = await this.kriRepository.save(kri);
        const fullKri = await this.kriRepository.findOne({
            where: { id: updatedKri.id },
            relations: ['category', 'kri_owner', 'risk_links'],
        });
        return this.toResponseDto(fullKri);
    }
    async remove(id) {
        const kri = await this.kriRepository.findOne({ where: { id } });
        if (!kri) {
            throw new common_1.NotFoundException(`KRI with ID ${id} not found`);
        }
        await this.kriRepository.softDelete(id);
    }
    async addMeasurement(createDto, userId) {
        const kri = await this.kriRepository.findOne({ where: { id: createDto.kri_id } });
        if (!kri) {
            throw new common_1.NotFoundException(`KRI with ID ${createDto.kri_id} not found`);
        }
        const measurement = this.measurementRepository.create(Object.assign(Object.assign({}, createDto), { measurement_date: new Date(createDto.measurement_date), measured_by: userId }));
        const savedMeasurement = await this.measurementRepository.save(measurement);
        kri.next_measurement_due = this.calculateNextMeasurementDate(kri.measurement_frequency);
        await this.kriRepository.save(kri);
        const fullMeasurement = await this.measurementRepository.findOne({
            where: { id: savedMeasurement.id },
            relations: ['measurer'],
        });
        return this.toMeasurementResponseDto(fullMeasurement);
    }
    async getMeasurementHistory(kriId, limit = 50) {
        const measurements = await this.measurementRepository.find({
            where: { kri_id: kriId },
            relations: ['measurer'],
            order: { measurement_date: 'DESC' },
            take: limit,
        });
        return measurements.map(m => this.toMeasurementResponseDto(m));
    }
    async linkToRisk(kriId, riskId, relationshipType = 'indicator', notes, userId) {
        const existingLink = await this.linkRepository.findOne({
            where: { kri_id: kriId, risk_id: riskId },
        });
        if (existingLink) {
            return;
        }
        const link = this.linkRepository.create({
            kri_id: kriId,
            risk_id: riskId,
            relationship_type: relationshipType,
            notes,
            linked_by: userId,
        });
        await this.linkRepository.save(link);
    }
    async unlinkFromRisk(kriId, riskId) {
        await this.linkRepository.delete({ kri_id: kriId, risk_id: riskId });
    }
    async getLinkedRisks(kriId) {
        const links = await this.linkRepository.find({
            where: { kri_id: kriId },
            relations: ['risk'],
        });
        return links.map(link => ({
            link_id: link.id,
            risk_id: link.risk.id,
            risk_identifier: link.risk.risk_id,
            risk_title: link.risk.title,
            risk_level: link.risk.current_risk_level,
            relationship_type: link.relationship_type,
        }));
    }
    async getKRIsForRisk(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['kri', 'kri.category'],
        });
        return links.map(link => this.toResponseDto(link.kri));
    }
    async getKRIStatusSummary() {
        const kris = await this.kriRepository.find({ where: { is_active: true } });
        const today = new Date();
        const summary = {
            total: kris.length,
            by_status: { green: 0, amber: 0, red: 0, unknown: 0 },
            by_trend: { improving: 0, stable: 0, worsening: 0, unknown: 0 },
            overdue_measurements: 0,
        };
        for (const kri of kris) {
            if (kri.current_status) {
                summary.by_status[kri.current_status]++;
            }
            else {
                summary.by_status.unknown++;
            }
            if (kri.trend) {
                summary.by_trend[kri.trend]++;
            }
            else {
                summary.by_trend.unknown++;
            }
            if (kri.next_measurement_due && kri.next_measurement_due < today) {
                summary.overdue_measurements++;
            }
        }
        return summary;
    }
    async getKRIsRequiringAttention() {
        const today = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(today.getDate() + 7);
        const kris = await this.kriRepository.find({
            where: [
                { current_status: kri_entity_1.KRIStatus.RED, is_active: true },
                { next_measurement_due: (0, typeorm_2.LessThan)(today), is_active: true },
                { next_measurement_due: (0, typeorm_2.Between)(today, weekFromNow), is_active: true },
            ],
            relations: ['category', 'kri_owner'],
            order: { current_status: 'DESC', next_measurement_due: 'ASC' },
        });
        return kris.map(kri => this.toResponseDto(kri));
    }
    calculateNextMeasurementDate(frequency) {
        const now = new Date();
        const next = new Date(now);
        switch (frequency) {
            case kri_entity_1.MeasurementFrequency.DAILY:
                next.setDate(now.getDate() + 1);
                break;
            case kri_entity_1.MeasurementFrequency.WEEKLY:
                next.setDate(now.getDate() + 7);
                break;
            case kri_entity_1.MeasurementFrequency.MONTHLY:
                next.setMonth(now.getMonth() + 1);
                break;
            case kri_entity_1.MeasurementFrequency.QUARTERLY:
                next.setMonth(now.getMonth() + 3);
                break;
            case kri_entity_1.MeasurementFrequency.ANNUALLY:
                next.setFullYear(now.getFullYear() + 1);
                break;
            default:
                next.setMonth(now.getMonth() + 1);
        }
        return next;
    }
    toResponseDto(kri) {
        var _a, _b;
        const today = new Date();
        let measurementDueStatus = 'on_track';
        if (kri.next_measurement_due) {
            const dueDate = new Date(kri.next_measurement_due);
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue < 0) {
                measurementDueStatus = 'overdue';
            }
            else if (daysUntilDue <= 7) {
                measurementDueStatus = 'due_soon';
            }
        }
        return {
            id: kri.id,
            kri_id: kri.kri_id,
            name: kri.name,
            description: kri.description,
            category_id: kri.category_id,
            category_name: (_a = kri.category) === null || _a === void 0 ? void 0 : _a.name,
            measurement_unit: kri.measurement_unit,
            measurement_frequency: kri.measurement_frequency,
            data_source: kri.data_source,
            calculation_method: kri.calculation_method,
            threshold_green: kri.threshold_green,
            threshold_amber: kri.threshold_amber,
            threshold_red: kri.threshold_red,
            threshold_direction: kri.threshold_direction,
            current_value: kri.current_value,
            current_status: kri.current_status,
            trend: kri.trend,
            kri_owner_id: kri.kri_owner_id,
            owner_name: kri.kri_owner
                ? `${kri.kri_owner.firstName || ''} ${kri.kri_owner.lastName || ''}`.trim()
                : undefined,
            is_active: kri.is_active,
            last_measured_at: this.toISOString(kri.last_measured_at),
            next_measurement_due: this.toISOString(kri.next_measurement_due),
            target_value: kri.target_value,
            baseline_value: kri.baseline_value,
            tags: kri.tags,
            linked_risks_count: ((_b = kri.risk_links) === null || _b === void 0 ? void 0 : _b.length) || 0,
            measurement_due_status: measurementDueStatus,
            created_at: this.toISOString(kri.created_at),
            updated_at: this.toISOString(kri.updated_at),
        };
    }
    toISOString(date) {
        if (!date)
            return undefined;
        if (typeof date === 'string')
            return date;
        if (date instanceof Date)
            return date.toISOString();
        if (typeof date.toISOString === 'function')
            return date.toISOString();
        return undefined;
    }
    toMeasurementResponseDto(measurement) {
        return {
            id: measurement.id,
            kri_id: measurement.kri_id,
            measurement_date: this.toISOString(measurement.measurement_date),
            value: measurement.value,
            status: measurement.status,
            notes: measurement.notes,
            measured_by: measurement.measured_by,
            measurer_name: measurement.measurer
                ? `${measurement.measurer.firstName || ''} ${measurement.measurer.lastName || ''}`.trim()
                : undefined,
            evidence_attachments: measurement.evidence_attachments,
            created_at: this.toISOString(measurement.created_at),
        };
    }
};
exports.KRIService = KRIService;
exports.KRIService = KRIService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kri_entity_1.KRI)),
    __param(1, (0, typeorm_1.InjectRepository)(kri_measurement_entity_1.KRIMeasurement)),
    __param(2, (0, typeorm_1.InjectRepository)(kri_risk_link_entity_1.KRIRiskLink)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], KRIService);
//# sourceMappingURL=kri.service.js.map