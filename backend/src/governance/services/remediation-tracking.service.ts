import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan, MoreThan } from 'typeorm';
import { RemediationTracker, RemediationPriority } from '../findings/entities/remediation-tracker.entity';
import { Finding, FindingStatus } from '../findings/entities/finding.entity';
import {
  RemediationTrackerDto,
  RemediationDashboardDto,
  CreateRemediationTrackerDto,
  UpdateRemediationTrackerDto,
  CompleteRemediationDto,
} from '../dto/remediation-tracker.dto';

@Injectable()
export class RemediationTrackingService {
  private readonly logger = new Logger(RemediationTrackingService.name);

  constructor(
    @InjectRepository(RemediationTracker)
    private readonly trackerRepository: Repository<RemediationTracker>,
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
  ) {}

  async getDashboard(): Promise<RemediationDashboardDto> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const openFindings = await this.findingRepository.count({
      where: {
        status: FindingStatus.OPEN,
        deleted_at: IsNull(),
      },
    });

    const trackers = await this.trackerRepository.find({
      where: {
        completion_date: IsNull(),
      },
      relations: ['finding', 'assigned_to'],
    });

    const critical = trackers
      .filter((t) => t.remediation_priority === RemediationPriority.CRITICAL)
      .slice(0, 10);

    const onTrack = trackers.filter((t) => {
      const daysUntil = Math.ceil(
        (new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntil > 7 && t.progress_percent < 100;
    });

    const atRisk = trackers.filter((t) => {
      const daysUntil = Math.ceil(
        (new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntil > 0 && daysUntil <= 7;
    });

    const overdue = trackers.filter((t) => {
      const daysUntil = Math.ceil(
        (new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntil <= 0 && t.progress_percent < 100;
    });

    const upcoming = trackers
      .filter((t) => {
        const daysUntil = Math.ceil(
          (new Date(t.sla_due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysUntil > 0 && daysUntil <= 14;
      })
      .sort(
        (a, b) =>
          new Date(a.sla_due_date).getTime() - new Date(b.sla_due_date).getTime(),
      )
      .slice(0, 10);

    const completedTrackers = await this.trackerRepository.find({
      where: {
        completion_date: MoreThan(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
      },
    });

    const avgDaysToCompletion =
      completedTrackers.length > 0
        ? Math.round(
            completedTrackers.reduce((sum, t) => sum + (t.days_to_completion || 0), 0) /
              completedTrackers.length,
          )
        : 0;

    const slaMetCount = completedTrackers.filter((t) => t.sla_met).length;
    const slaComplianceRate =
      completedTrackers.length > 0
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

  async createTracker(
    findingId: string,
    data: CreateRemediationTrackerDto,
  ): Promise<RemediationTrackerDto> {
    const finding = await this.findingRepository.findOne({
      where: { id: findingId },
    });
    if (!finding) {
      throw new NotFoundException(`Finding with ID ${findingId} not found`);
    }

    const tracker = this.trackerRepository.create({
      finding_id: findingId,
      remediation_priority: data.remediation_priority || RemediationPriority.MEDIUM,
      sla_due_date: new Date(data.sla_due_date),
      remediation_steps: data.remediation_steps,
      assigned_to_id: data.assigned_to_id,
    });

    const saved = await this.trackerRepository.save(tracker);
    return this.toDto(saved);
  }

  async updateTracker(
    trackerId: string,
    data: UpdateRemediationTrackerDto,
  ): Promise<RemediationTrackerDto> {
    const tracker = await this.trackerRepository.findOne({
      where: { id: trackerId },
      relations: ['finding', 'assigned_to'],
    });
    if (!tracker) {
      throw new NotFoundException(`Tracker with ID ${trackerId} not found`);
    }

    if (data.remediation_priority) tracker.remediation_priority = data.remediation_priority;
    if (data.progress_percent !== undefined) tracker.progress_percent = data.progress_percent;
    if (data.progress_notes) tracker.progress_notes = data.progress_notes;
    if (data.remediation_steps) tracker.remediation_steps = data.remediation_steps;
    if (data.assigned_to_id) tracker.assigned_to_id = data.assigned_to_id;

    const saved = await this.trackerRepository.save(tracker);
    return this.toDto(saved);
  }

  async completeRemediation(
    trackerId: string,
    data: CompleteRemediationDto,
  ): Promise<RemediationTrackerDto> {
    const tracker = await this.trackerRepository.findOne({
      where: { id: trackerId },
      relations: ['finding', 'assigned_to'],
    });
    if (!tracker) {
      throw new NotFoundException(`Tracker with ID ${trackerId} not found`);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const slaDueDate = new Date(tracker.sla_due_date);
    slaDueDate.setUTCHours(0, 0, 0, 0);

    tracker.completion_date = today;
    tracker.completion_notes = data.completion_notes;
    tracker.completion_evidence = data.completion_evidence;
    tracker.progress_percent = 100;

    const daysToCompletion = Math.ceil(
      (today.getTime() - tracker.created_at.getTime()) / (1000 * 60 * 60 * 24),
    );
    tracker.days_to_completion = daysToCompletion;
    tracker.sla_met = today <= slaDueDate;

    const saved = await this.trackerRepository.save(tracker);

    // Update finding status if all linked trackers are complete
    if (tracker.finding_id) {
      await this.updateFindingIfComplete(tracker.finding_id);
    }

    return this.toDto(saved);
  }

  async getTrackersByFinding(findingId: string): Promise<RemediationTrackerDto[]> {
    const trackers = await this.trackerRepository.find({
      where: { finding_id: findingId },
      relations: ['finding', 'assigned_to'],
    });
    return trackers.map((t) => this.toDto(t));
  }

  private async updateFindingIfComplete(findingId: string): Promise<void> {
    const openTrackers = await this.trackerRepository.count({
      where: {
        finding_id: findingId,
        completion_date: IsNull(),
      },
    });

    if (openTrackers === 0) {
      const finding = await this.findingRepository.findOne({ where: { id: findingId } });
      if (finding && finding.status === FindingStatus.IN_PROGRESS) {
        finding.status = FindingStatus.RESOLVED;
        finding.remediation_completed_date = new Date();
        await this.findingRepository.save(finding);
        this.logger.log(`Finding ${findingId} marked as resolved`);
      }
    }
  }

  private toDto(tracker: RemediationTracker): RemediationTrackerDto {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const slaDueDate = new Date(tracker.sla_due_date);
    slaDueDate.setUTCHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil(
      (slaDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    let status: 'on_track' | 'at_risk' | 'overdue' | 'completed' = 'on_track';
    if (tracker.completion_date) {
      status = 'completed';
    } else if (daysUntilDue <= 0) {
      status = 'overdue';
    } else if (daysUntilDue <= 7) {
      status = 'at_risk';
    }

    return {
      id: tracker.id,
      finding_id: tracker.finding_id,
      finding_identifier: tracker.finding?.finding_identifier || '',
      finding_title: tracker.finding?.title || '',
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
}
