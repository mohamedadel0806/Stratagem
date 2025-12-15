import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/audit-log.dto';

/**
 * AuditLogService: Centralized audit logging for all system operations
 * Tracks all changes across workflows, policies, controls, assets, and compliance items
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create an audit log entry
   */
  async log(dto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogRepository.create({
        ...dto,
        timestamp: new Date(),
      });

      const saved = await this.auditLogRepository.save(auditLog);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create audit logs for multiple actions in bulk
   */
  async logBulk(dtos: CreateAuditLogDto[]): Promise<void> {
    if (!dtos || dtos.length === 0) return;

    try {
      const auditLogs = dtos.map(dto =>
        this.auditLogRepository.create({
          ...dto,
          timestamp: new Date(),
        }),
      );
      await this.auditLogRepository.save(auditLogs);
    } catch (error) {
      this.logger.error(`Failed to create bulk audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityLogs(
    entityType: string,
    entityId: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.entityType = :entityType', { entityType })
      .andWhere('audit.entityId = :entityId', { entityId })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserLogs(
    userId: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.userId = :userId', { userId })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get audit logs for a specific action type
   */
  async getActionLogs(
    action: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.action = :action', { action })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get audit logs within a date range
   */
  async getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.timestamp >= :startDate', { startDate })
      .andWhere('audit.timestamp <= :endDate', { endDate })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get combined audit trail for multiple entities
   * Useful for tracking related objects (e.g., workflow and its approvals)
   */
  async getEntityTrail(
    entityType: string,
    entityIds: string[],
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.entityType = :entityType', { entityType })
      .andWhere('audit.entityId IN (:...entityIds)', { entityIds })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get all audit logs (with pagination)
   */
  async getAllLogs(
    skip: number = 0,
    take: number = 50,
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const [logs, total] = await this.auditLogRepository.findAndCount({
      order: { timestamp: 'DESC' },
      skip,
      take,
    });
    return { logs, total };
  }

  /**
   * Search audit logs
   */
  async search(
    query: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.action ILIKE :query', { query: `%${query}%` })
      .orWhere('audit.description ILIKE :query', { query: `%${query}%` })
      .orWhere('audit.entityType ILIKE :query', { query: `%${query}%` })
      .orderBy('audit.timestamp', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Export audit logs to CSV format (returns CSV string)
   */
  async exportToCSV(entityType?: string, entityId?: string): Promise<string> {
    let query = this.auditLogRepository.createQueryBuilder('audit');

    if (entityType && entityId) {
      query = query
        .where('audit.entityType = :entityType', { entityType })
        .andWhere('audit.entityId = :entityId', { entityId });
    }

    const logs = await query.orderBy('audit.timestamp', 'DESC').getMany();

    // CSV Headers
    const headers = ['Timestamp', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Changes', 'Description'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userId || 'SYSTEM',
      log.action,
      log.entityType,
      log.entityId,
      JSON.stringify(log.changes || {}),
      log.description || '',
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Clean up old audit logs (retention policy)
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Cleaned up ${result.affected || 0} old audit logs (older than ${daysToKeep} days)`);
    return result.affected || 0;
  }

  /**
   * Get summary statistics for audit logs
   */
  async getSummary(): Promise<{
    totalLogs: number;
    uniqueUsers: number;
    uniqueActions: number;
    uniqueEntities: number;
    oldestLog: Date;
    newestLog: Date;
  }> {
    const totalLogs = await this.auditLogRepository.count();
    
    const [uniqueUsers, uniqueActions, uniqueEntities, oldest, newest] = await Promise.all([
      this.auditLogRepository
        .createQueryBuilder('audit')
        .select('COUNT(DISTINCT audit.userId)', 'count')
        .getRawOne(),
      this.auditLogRepository
        .createQueryBuilder('audit')
        .select('COUNT(DISTINCT audit.action)', 'count')
        .getRawOne(),
      this.auditLogRepository
        .createQueryBuilder('audit')
        .select('COUNT(DISTINCT audit.entityType)', 'count')
        .getRawOne(),
      this.auditLogRepository
        .createQueryBuilder('audit')
        .select('MIN(audit.timestamp)', 'timestamp')
        .getRawOne(),
      this.auditLogRepository
        .createQueryBuilder('audit')
        .select('MAX(audit.timestamp)', 'timestamp')
        .getRawOne(),
    ]);

    return {
      totalLogs,
      uniqueUsers: parseInt(uniqueUsers?.count || '0'),
      uniqueActions: parseInt(uniqueActions?.count || '0'),
      uniqueEntities: parseInt(uniqueEntities?.count || '0'),
      oldestLog: oldest?.timestamp,
      newestLog: newest?.timestamp,
    };
  }
}
