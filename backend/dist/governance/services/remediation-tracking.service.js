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
var RemediationTrackingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemediationTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const remediation_tracker_entity_1 = require("../findings/entities/remediation-tracker.entity");
const finding_entity_1 = require("../findings/entities/finding.entity");
let RemediationTrackingService = RemediationTrackingService_1 = class RemediationTrackingService {
    constructor(trackerRepository, findingRepository) {
        this.trackerRepository = trackerRepository;
        this.findingRepository = findingRepository;
        this.logger = new common_1.Logger(RemediationTrackingService_1.name);
    }
    async getDashboard() {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const openFindings = await this.findingRepository.count({
            where: {
                status: finding_entity_1.FindingStatus.OPEN,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        const trackers = await this.trackerRepository.find({
            where: {
                completion_date: (0, typeorm_2.IsNull)(),
            },
            relations: ['finding', 'assigned_to'],
        });
        const critical = trackers
            .filter((t) => t.remediation_priority === remediation_tracker_entity_1.RemediationPriority.CRITICAL)
            .slice(0, 10);
        const onTrack = trackers.filter((t) => {
            const daysUntil = Math.ceil((new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntil > 7 && t.progress_percent < 100;
        });
        const atRisk = trackers.filter((t) => {
            const daysUntil = Math.ceil((new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntil > 0 && daysUntil <= 7;
        });
        const overdue = trackers.filter((t) => {
            const daysUntil = Math.ceil((new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntil <= 0 && t.progress_percent < 100;
        });
        const upcoming = trackers
            .filter((t) => {
            const daysUntil = Math.ceil((new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntil > 0 && daysUntil <= 14;
        })
            .sort((a, b) => new Date(a.sla_due_date).getTime() - new Date(b.sla_due_date).getTime())
            .slice(0, 10);
        const completedTrackers = await this.trackerRepository.find({
            where: {
                completion_date: (0, typeorm_2.MoreThan)(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
            },
        });
        const avgDaysToCompletion = completedTrackers.length > 0
            ? Math.round(completedTrackers.reduce((sum, t) => sum + (t.days_to_completion || 0), 0) /
                completedTrackers.length)
            : 0;
        const slaMetCount = completedTrackers.filter((t) => t.sla_met).length;
        const slaComplianceRate = completedTrackers.length > 0
            ? Math.round((slaMetCount / completedTrackers.length) * 100)
            : 0;
        return {
            total_open_findings: openFindings,
            findings_on_track: onTrack.length,
            findings_at_risk: atRisk.length,
            findings_overdue: overdue.length,
            average_days_to_completion: avgDaysToCompletion,
            sla_compliance_rate: slaComplianceRate,
            critical_findings: critical.map((t) => this.toDto(t)),
            overdue_findings: overdue.map((t) => this.toDto(t)).slice(0, 10),
            upcoming_due: upcoming.map((t) => this.toDto(t)),
        };
    }
    async createTracker(findingId, data) {
        const finding = await this.findingRepository.findOne({
            where: { id: findingId },
        });
        if (!finding) {
            throw new common_1.NotFoundException(`Finding with ID ${findingId} not found`);
        }
        const tracker = this.trackerRepository.create({
            finding_id: findingId,
            remediation_priority: data.remediation_priority || remediation_tracker_entity_1.RemediationPriority.MEDIUM,
            sla_due_date: new Date(data.sla_due_date),
            remediation_steps: data.remediation_steps,
            assigned_to_id: data.assigned_to_id,
        });
        const saved = await this.trackerRepository.save(tracker);
        return this.toDto(saved);
    }
    async updateTracker(trackerId, data) {
        const tracker = await this.trackerRepository.findOne({
            where: { id: trackerId },
            relations: ['finding', 'assigned_to'],
        });
        if (!tracker) {
            throw new common_1.NotFoundException(`Tracker with ID ${trackerId} not found`);
        }
        if (data.remediation_priority)
            tracker.remediation_priority = data.remediation_priority;
        if (data.progress_percent !== undefined)
            tracker.progress_percent = data.progress_percent;
        if (data.progress_notes)
            tracker.progress_notes = data.progress_notes;
        if (data.remediation_steps)
            tracker.remediation_steps = data.remediation_steps;
        if (data.assigned_to_id)
            tracker.assigned_to_id = data.assigned_to_id;
        const saved = await this.trackerRepository.save(tracker);
        return this.toDto(saved);
    }
    async completeRemediation(trackerId, data) {
        const tracker = await this.trackerRepository.findOne({
            where: { id: trackerId },
            relations: ['finding', 'assigned_to'],
        });
        if (!tracker) {
            throw new common_1.NotFoundException(`Tracker with ID ${trackerId} not found`);
        }
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const slaDueDate = new Date(tracker.sla_due_date);
        slaDueDate.setUTCHours(0, 0, 0, 0);
        tracker.completion_date = today;
        tracker.completion_notes = data.completion_notes;
        tracker.completion_evidence = data.completion_evidence;
        tracker.progress_percent = 100;
        const daysToCompletion = Math.ceil((today.getTime() - tracker.created_at.getTime()) / (1000 * 60 * 60 * 24));
        tracker.days_to_completion = daysToCompletion;
        tracker.sla_met = today <= slaDueDate;
        const saved = await this.trackerRepository.save(tracker);
        if (tracker.finding_id) {
            await this.updateFindingIfComplete(tracker.finding_id);
        }
        return this.toDto(saved);
    }
    async getTrackersByFinding(findingId) {
        const trackers = await this.trackerRepository.find({
            where: { finding_id: findingId },
            relations: ['finding', 'assigned_to'],
        });
        return trackers.map((t) => this.toDto(t));
    }
    async updateFindingIfComplete(findingId) {
        const openTrackers = await this.trackerRepository.count({
            where: {
                finding_id: findingId,
                completion_date: (0, typeorm_2.IsNull)(),
            },
        });
        if (openTrackers === 0) {
            const finding = await this.findingRepository.findOne({ where: { id: findingId } });
            if (finding && finding.status === finding_entity_1.FindingStatus.IN_PROGRESS) {
                finding.status = finding_entity_1.FindingStatus.RESOLVED;
                finding.remediation_completed_date = new Date();
                await this.findingRepository.save(finding);
                this.logger.log(`Finding ${findingId} marked as resolved`);
            }
        }
    }
    toDto(tracker) {
        var _a, _b;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const slaDueDate = new Date(tracker.sla_due_date);
        slaDueDate.setUTCHours(0, 0, 0, 0);
        const daysUntilDue = Math.ceil((slaDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        let status = 'on_track';
        if (tracker.completion_date) {
            status = 'completed';
        }
        else if (daysUntilDue <= 0) {
            status = 'overdue';
        }
        else if (daysUntilDue <= 7) {
            status = 'at_risk';
        }
        return {
            id: tracker.id,
            finding_id: tracker.finding_id,
            finding_identifier: ((_a = tracker.finding) === null || _a === void 0 ? void 0 : _a.finding_identifier) || '',
            finding_title: ((_b = tracker.finding) === null || _b === void 0 ? void 0 : _b.title) || '',
            remediation_priority: tracker.remediation_priority,
            sla_due_date: tracker.sla_due_date instanceof Date
                ? tracker.sla_due_date.toISOString().split('T')[0]
                : typeof tracker.sla_due_date === 'string'
                    ? tracker.sla_due_date
                    : new Date(tracker.sla_due_date).toISOString().split('T')[0],
            remediation_steps: tracker.remediation_steps,
            assigned_to_id: tracker.assigned_to_id,
            assigned_to_name: tracker.assigned_to
                ? `${tracker.assigned_to.firstName} ${tracker.assigned_to.lastName}`
                : undefined,
            progress_percent: tracker.progress_percent,
            progress_notes: tracker.progress_notes,
            completion_date: tracker.completion_date
                ? tracker.completion_date instanceof Date
                    ? tracker.completion_date.toISOString().split('T')[0]
                    : typeof tracker.completion_date === 'string'
                        ? tracker.completion_date
                        : new Date(tracker.completion_date).toISOString().split('T')[0]
                : undefined,
            sla_met: tracker.sla_met,
            days_to_completion: tracker.days_to_completion,
            days_until_due: daysUntilDue,
            status,
            created_at: tracker.created_at.toISOString(),
            updated_at: tracker.updated_at.toISOString(),
        };
    }
};
exports.RemediationTrackingService = RemediationTrackingService;
exports.RemediationTrackingService = RemediationTrackingService = RemediationTrackingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(remediation_tracker_entity_1.RemediationTracker)),
    __param(1, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RemediationTrackingService);
//# sourceMappingURL=remediation-tracking.service.js.map