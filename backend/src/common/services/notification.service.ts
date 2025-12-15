import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from '../entities/notification.entity';
import { CreateNotificationDto, NotificationResponseDto, NotificationQueryDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Create a new notification
   */
  async create(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = this.notificationRepository.create({
      ...dto,
      priority: dto.priority || NotificationPriority.MEDIUM,
    });
    const saved = await this.notificationRepository.save(notification);
    return this.toResponseDto(saved);
  }

  /**
   * Create notifications for multiple users
   */
  async createBulk(userIds: string[], dto: Omit<CreateNotificationDto, 'userId'>): Promise<void> {
    const notifications = userIds.map(userId => 
      this.notificationRepository.create({
        ...dto,
        userId,
        priority: dto.priority || NotificationPriority.MEDIUM,
      })
    );
    await this.notificationRepository.save(notifications);
  }

  /**
   * Get notifications for a user
   */
  async findByUser(userId: string, query?: NotificationQueryDto): Promise<NotificationResponseDto[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (query?.isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: query.isRead });
    }

    if (query?.type) {
      queryBuilder.andWhere('notification.type = :type', { type: query.type });
    }

    const limit = query?.limit || 50;
    queryBuilder.take(limit);

    const notifications = await queryBuilder.getMany();
    return notifications.map(n => this.toResponseDto(n));
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .getCount();
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification not found`);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await this.notificationRepository.save(notification);
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds: string[], userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: In(notificationIds), userId },
      { isRead: true, readAt: new Date() },
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string, userId: string): Promise<void> {
    const result = await this.notificationRepository.delete({ id: notificationId, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Notification not found`);
    }
  }

  /**
   * Delete old read notifications (cleanup job)
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
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

  // ==================== WORKFLOW-SPECIFIC NOTIFICATION HELPERS ====================

  /**
   * Send approval request notification
   */
  async sendApprovalRequest(
    approverId: string,
    workflowName: string,
    entityType: string,
    entityId: string,
    executionId: string,
  ): Promise<void> {
    await this.create({
      userId: approverId,
      type: NotificationType.WORKFLOW_APPROVAL_REQUIRED,
      priority: NotificationPriority.HIGH,
      title: 'Approval Required',
      message: `You have a pending approval for workflow "${workflowName}"`,
      entityType,
      entityId,
      actionUrl: `/dashboard/workflows/approvals`,
      metadata: { executionId, workflowName },
    });
  }

  /**
   * Send workflow approved notification
   */
  async sendWorkflowApproved(
    userId: string,
    workflowName: string,
    entityType: string,
    entityId: string,
    approverName: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.WORKFLOW_APPROVED,
      priority: NotificationPriority.MEDIUM,
      title: 'Workflow Approved',
      message: `Your "${workflowName}" workflow has been approved by ${approverName}`,
      entityType,
      entityId,
      actionUrl: `/${entityType}s/${entityId}`,
    });
  }

  /**
   * Send workflow rejected notification
   */
  async sendWorkflowRejected(
    userId: string,
    workflowName: string,
    entityType: string,
    entityId: string,
    approverName: string,
    reason?: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.WORKFLOW_REJECTED,
      priority: NotificationPriority.HIGH,
      title: 'Workflow Rejected',
      message: `Your "${workflowName}" workflow has been rejected by ${approverName}${reason ? ': ' + reason : ''}`,
      entityType,
      entityId,
      actionUrl: `/${entityType}s/${entityId}`,
    });
  }

  /**
   * Send task assigned notification
   */
  async sendTaskAssigned(
    userId: string,
    taskTitle: string,
    taskId: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.TASK_ASSIGNED,
      priority: NotificationPriority.MEDIUM,
      title: 'Task Assigned',
      message: `You have been assigned a new task: "${taskTitle}"`,
      entityType: 'task',
      entityId: taskId,
      actionUrl: `/dashboard/tasks/${taskId}`,
    });
  }

  /**
   * Send deadline approaching notification
   */
  async sendDeadlineApproaching(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    daysRemaining: number,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.DEADLINE_APPROACHING,
      priority: daysRemaining <= 3 ? NotificationPriority.URGENT : NotificationPriority.HIGH,
      title: 'Deadline Approaching',
      message: `"${entityName}" is due in ${daysRemaining} day(s)`,
      entityType,
      entityId,
      actionUrl: `/dashboard/${entityType}s/${entityId}`,
    });
  }

  /**
   * Send risk escalated notification
   */
  async sendRiskEscalated(
    userId: string,
    riskTitle: string,
    riskId: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.RISK_ESCALATED,
      priority: NotificationPriority.URGENT,
      title: 'Risk Escalated',
      message: `Risk "${riskTitle}" has been escalated and requires your attention`,
      entityType: 'risk',
      entityId: riskId,
      actionUrl: `/dashboard/risks/${riskId}`,
    });
  }

  /**
   * Send policy published notification
   */
  async sendPolicyPublished(
    userIds: string[],
    policyName: string,
    policyId: string,
    publishedBy: string,
  ): Promise<void> {
    await this.createBulk(userIds, {
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Policy Published',
      message: `Policy "${policyName}" has been published by ${publishedBy}`,
      entityType: 'policy',
      entityId: policyId,
      actionUrl: `/dashboard/policies/${policyId}`,
    });
  }

  /**
   * Send compliance status changed notification
   */
  async sendComplianceStatusChanged(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Compliance Status Changed',
      message: `"${entityName}" compliance status changed from ${oldStatus} to ${newStatus}`,
      entityType,
      entityId,
      actionUrl: `/dashboard/${entityType}s/${entityId}`,
      metadata: { oldStatus, newStatus },
    });
  }

  /**
   * Send control assessment required notification
   */
  async sendControlAssessmentRequired(
    userId: string,
    controlName: string,
    controlId: string,
    dueDate: Date,
  ): Promise<void> {
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: daysUntilDue <= 7 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
      title: 'Control Assessment Required',
      message: `Assessment required for control "${controlName}" (due in ${daysUntilDue} days)`,
      entityType: 'control',
      entityId: controlId,
      actionUrl: `/dashboard/controls/${controlId}`,
      metadata: { dueDate: dueDate.toISOString() },
    });
  }

  /**
   * Send evidence upload requested notification
   */
  async sendEvidenceUploadRequested(
    userId: string,
    controlName: string,
    controlId: string,
    requiredBy: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: NotificationPriority.HIGH,
      title: 'Evidence Upload Required',
      message: `Evidence upload requested for control "${controlName}" by ${requiredBy}`,
      entityType: 'control',
      entityId: controlId,
      actionUrl: `/dashboard/controls/${controlId}/evidence`,
    });
  }

  /**
   * Send evidence review completed notification
   */
  async sendEvidenceReviewCompleted(
    userId: string,
    controlName: string,
    controlId: string,
    status: 'approved' | 'rejected',
    comments?: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: status === 'rejected' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
      title: `Evidence ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Evidence for "${controlName}" has been ${status}${comments ? ': ' + comments : ''}`,
      entityType: 'control',
      entityId: controlId,
      actionUrl: `/dashboard/controls/${controlId}/evidence`,
    });
  }

  /**
   * Send framework gap analysis completed notification
   */
  async sendGapAnalysisCompleted(
    userId: string,
    frameworkName: string,
    frameworkId: string,
    gapCount: number,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Gap Analysis Completed',
      message: `Gap analysis for "${frameworkName}" has been completed with ${gapCount} gaps identified`,
      entityType: 'framework',
      entityId: frameworkId,
      actionUrl: `/dashboard/frameworks/${frameworkId}/gaps`,
      metadata: { gapCount },
    });
  }

  /**
   * Send audit finding notification
   */
  async sendAuditFinding(
    userIds: string[],
    findingTitle: string,
    findingId: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
  ): Promise<void> {
    const priorityMap = {
      low: NotificationPriority.LOW,
      medium: NotificationPriority.MEDIUM,
      high: NotificationPriority.HIGH,
      critical: NotificationPriority.URGENT,
    };

    await this.createBulk(userIds, {
      type: NotificationType.GENERAL,
      priority: priorityMap[severity] || NotificationPriority.MEDIUM,
      title: 'Audit Finding',
      message: `New audit finding: "${findingTitle}" (${severity} severity)`,
      entityType: 'finding',
      entityId: findingId,
      actionUrl: `/dashboard/findings/${findingId}`,
      metadata: { severity },
    });
  }

  /**
   * Send compliance mapping completed notification
   */
  async sendComplianceMappingCompleted(
    userId: string,
    mappingType: string,
    mappingId: string,
    requirementsCount: number,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Compliance Mapping Completed',
      message: `${mappingType} mapping completed with ${requirementsCount} requirements mapped`,
      entityType: 'mapping',
      entityId: mappingId,
      actionUrl: `/dashboard/mappings/${mappingId}`,
      metadata: { requirementsCount },
    });
  }

  private toResponseDto(notification: Notification): NotificationResponseDto {
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
      readAt: notification.readAt?.toISOString(),
    };
  }
}





