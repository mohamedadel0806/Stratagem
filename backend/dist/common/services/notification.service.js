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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationService = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(dto) {
        const notification = this.notificationRepository.create(Object.assign(Object.assign({}, dto), { priority: dto.priority || notification_entity_1.NotificationPriority.MEDIUM }));
        const saved = await this.notificationRepository.save(notification);
        return this.toResponseDto(saved);
    }
    async createBulk(userIds, dto) {
        const notifications = userIds.map(userId => this.notificationRepository.create(Object.assign(Object.assign({}, dto), { userId, priority: dto.priority || notification_entity_1.NotificationPriority.MEDIUM })));
        await this.notificationRepository.save(notifications);
    }
    async findByUser(userId, query) {
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .orderBy('notification.createdAt', 'DESC');
        if ((query === null || query === void 0 ? void 0 : query.isRead) !== undefined) {
            queryBuilder.andWhere('notification.isRead = :isRead', { isRead: query.isRead });
        }
        if (query === null || query === void 0 ? void 0 : query.type) {
            queryBuilder.andWhere('notification.type = :type', { type: query.type });
        }
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 50;
        queryBuilder.take(limit);
        const notifications = await queryBuilder.getMany();
        return notifications.map(n => this.toResponseDto(n));
    }
    async getUnreadCount(userId) {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .andWhere('notification.isRead = :isRead', { isRead: false })
            .getCount();
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification not found`);
        }
        notification.isRead = true;
        notification.readAt = new Date();
        await this.notificationRepository.save(notification);
    }
    async markMultipleAsRead(notificationIds, userId) {
        await this.notificationRepository.update({ id: (0, typeorm_2.In)(notificationIds), userId }, { isRead: true, readAt: new Date() });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
    async delete(notificationId, userId) {
        const result = await this.notificationRepository.delete({ id: notificationId, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Notification not found`);
        }
    }
    async cleanupOldNotifications(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const result = await this.notificationRepository
            .createQueryBuilder()
            .delete()
            .where('isRead = true')
            .andWhere('createdAt < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
    async sendApprovalRequest(approverId, workflowName, entityType, entityId, executionId) {
        await this.create({
            userId: approverId,
            type: notification_entity_1.NotificationType.WORKFLOW_APPROVAL_REQUIRED,
            priority: notification_entity_1.NotificationPriority.HIGH,
            title: 'Approval Required',
            message: `You have a pending approval for workflow "${workflowName}"`,
            entityType,
            entityId,
            actionUrl: `/dashboard/workflows/approvals`,
            metadata: { executionId, workflowName },
        });
    }
    async sendWorkflowApproved(userId, workflowName, entityType, entityId, approverName) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.WORKFLOW_APPROVED,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Workflow Approved',
            message: `Your "${workflowName}" workflow has been approved by ${approverName}`,
            entityType,
            entityId,
            actionUrl: `/${entityType}s/${entityId}`,
        });
    }
    async sendWorkflowRejected(userId, workflowName, entityType, entityId, approverName, reason) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.WORKFLOW_REJECTED,
            priority: notification_entity_1.NotificationPriority.HIGH,
            title: 'Workflow Rejected',
            message: `Your "${workflowName}" workflow has been rejected by ${approverName}${reason ? ': ' + reason : ''}`,
            entityType,
            entityId,
            actionUrl: `/${entityType}s/${entityId}`,
        });
    }
    async sendTaskAssigned(userId, taskTitle, taskId) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.TASK_ASSIGNED,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Task Assigned',
            message: `You have been assigned a new task: "${taskTitle}"`,
            entityType: 'task',
            entityId: taskId,
            actionUrl: `/dashboard/tasks/${taskId}`,
        });
    }
    async sendDeadlineApproaching(userId, entityType, entityId, entityName, daysRemaining) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
            priority: daysRemaining <= 3 ? notification_entity_1.NotificationPriority.URGENT : notification_entity_1.NotificationPriority.HIGH,
            title: 'Deadline Approaching',
            message: `"${entityName}" is due in ${daysRemaining} day(s)`,
            entityType,
            entityId,
            actionUrl: `/dashboard/${entityType}s/${entityId}`,
        });
    }
    async sendRiskEscalated(userId, riskTitle, riskId) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.RISK_ESCALATED,
            priority: notification_entity_1.NotificationPriority.URGENT,
            title: 'Risk Escalated',
            message: `Risk "${riskTitle}" has been escalated and requires your attention`,
            entityType: 'risk',
            entityId: riskId,
            actionUrl: `/dashboard/risks/${riskId}`,
        });
    }
    async sendPolicyPublished(userIds, policyName, policyId, publishedBy) {
        await this.createBulk(userIds, {
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Policy Published',
            message: `Policy "${policyName}" has been published by ${publishedBy}`,
            entityType: 'policy',
            entityId: policyId,
            actionUrl: `/dashboard/policies/${policyId}`,
        });
    }
    async sendComplianceStatusChanged(userId, entityType, entityId, entityName, oldStatus, newStatus) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Compliance Status Changed',
            message: `"${entityName}" compliance status changed from ${oldStatus} to ${newStatus}`,
            entityType,
            entityId,
            actionUrl: `/dashboard/${entityType}s/${entityId}`,
            metadata: { oldStatus, newStatus },
        });
    }
    async sendControlAssessmentRequired(userId, controlName, controlId, dueDate) {
        const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: daysUntilDue <= 7 ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Control Assessment Required',
            message: `Assessment required for control "${controlName}" (due in ${daysUntilDue} days)`,
            entityType: 'control',
            entityId: controlId,
            actionUrl: `/dashboard/controls/${controlId}`,
            metadata: { dueDate: dueDate.toISOString() },
        });
    }
    async sendEvidenceUploadRequested(userId, controlName, controlId, requiredBy) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.HIGH,
            title: 'Evidence Upload Required',
            message: `Evidence upload requested for control "${controlName}" by ${requiredBy}`,
            entityType: 'control',
            entityId: controlId,
            actionUrl: `/dashboard/controls/${controlId}/evidence`,
        });
    }
    async sendEvidenceReviewCompleted(userId, controlName, controlId, status, comments) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: status === 'rejected' ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
            title: `Evidence ${status === 'approved' ? 'Approved' : 'Rejected'}`,
            message: `Evidence for "${controlName}" has been ${status}${comments ? ': ' + comments : ''}`,
            entityType: 'control',
            entityId: controlId,
            actionUrl: `/dashboard/controls/${controlId}/evidence`,
        });
    }
    async sendGapAnalysisCompleted(userId, frameworkName, frameworkId, gapCount) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Gap Analysis Completed',
            message: `Gap analysis for "${frameworkName}" has been completed with ${gapCount} gaps identified`,
            entityType: 'framework',
            entityId: frameworkId,
            actionUrl: `/dashboard/frameworks/${frameworkId}/gaps`,
            metadata: { gapCount },
        });
    }
    async sendAuditFinding(userIds, findingTitle, findingId, severity) {
        const priorityMap = {
            low: notification_entity_1.NotificationPriority.LOW,
            medium: notification_entity_1.NotificationPriority.MEDIUM,
            high: notification_entity_1.NotificationPriority.HIGH,
            critical: notification_entity_1.NotificationPriority.URGENT,
        };
        await this.createBulk(userIds, {
            type: notification_entity_1.NotificationType.GENERAL,
            priority: priorityMap[severity] || notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Audit Finding',
            message: `New audit finding: "${findingTitle}" (${severity} severity)`,
            entityType: 'finding',
            entityId: findingId,
            actionUrl: `/dashboard/findings/${findingId}`,
            metadata: { severity },
        });
    }
    async sendComplianceMappingCompleted(userId, mappingType, mappingId, requirementsCount) {
        await this.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Compliance Mapping Completed',
            message: `${mappingType} mapping completed with ${requirementsCount} requirements mapped`,
            entityType: 'mapping',
            entityId: mappingId,
            actionUrl: `/dashboard/mappings/${mappingId}`,
            metadata: { requirementsCount },
        });
    }
    toResponseDto(notification) {
        var _a;
        return {
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            priority: notification.priority,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            entityType: notification.entityType || undefined,
            entityId: notification.entityId || undefined,
            actionUrl: notification.actionUrl || undefined,
            metadata: notification.metadata || undefined,
            createdAt: notification.createdAt.toISOString(),
            readAt: (_a = notification.readAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map