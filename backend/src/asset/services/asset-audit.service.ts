import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AssetAuditLog, AssetType, AuditAction } from '../entities/asset-audit-log.entity';

export interface CreateAuditLogDto {
  assetType: AssetType;
  assetId: string;
  action: AuditAction;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  changedById?: string;
  changeReason?: string;
}

export interface AuditLogQueryDto {
  from?: string | Date;
  to?: string | Date;
  userId?: string;
  action?: AuditAction;
  page?: number;
  limit?: number;
}

@Injectable()
export class AssetAuditService {
  constructor(
    @InjectRepository(AssetAuditLog)
    private auditLogRepository: Repository<AssetAuditLog>,
  ) {}

  async createLog(logData: CreateAuditLogDto): Promise<AssetAuditLog> {
    const log = this.auditLogRepository.create(logData);
    return this.auditLogRepository.save(log);
  }

  async logCreate(
    assetType: AssetType,
    assetId: string,
    userId: string,
    changeReason?: string,
  ): Promise<void> {
    await this.createLog({
      assetType,
      assetId,
      action: AuditAction.CREATE,
      changedById: userId,
      changeReason,
    });
  }

  async logUpdate(
    assetType: AssetType,
    assetId: string,
    changes: Record<string, { old: any; new: any }>,
    userId: string,
    changeReason?: string,
  ): Promise<void> {
    // Log each field change separately
    const logs = Object.entries(changes).map(([fieldName, { old, new: newValue }]) =>
      this.createLog({
        assetType,
        assetId,
        action: AuditAction.UPDATE,
        fieldName,
        oldValue: this.serializeValue(old),
        newValue: this.serializeValue(newValue),
        changedById: userId,
        changeReason,
      }),
    );

    await Promise.all(logs);
  }

  async logDelete(
    assetType: AssetType,
    assetId: string,
    userId: string,
    changeReason?: string,
  ): Promise<void> {
    await this.createLog({
      assetType,
      assetId,
      action: AuditAction.DELETE,
      changedById: userId,
      changeReason,
    });
  }

  async getAuditLogs(
    assetType: AssetType,
    assetId: string,
    query?: AuditLogQueryDto,
  ): Promise<{
    data: AssetAuditLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.changedBy', 'changedBy')
      .where('log.assetType = :assetType', { assetType })
      .andWhere('log.assetId = :assetId', { assetId });

    // Date range filter
    if (query?.from && query?.to) {
      const fromDate = typeof query.from === 'string' ? new Date(query.from) : query.from;
      const toDate = typeof query.to === 'string' ? new Date(query.to) : query.to;
      queryBuilder.andWhere('log.createdAt BETWEEN :from AND :to', {
        from: fromDate,
        to: toDate,
      });
    } else if (query?.from) {
      const fromDate = typeof query.from === 'string' ? new Date(query.from) : query.from;
      queryBuilder.andWhere('log.createdAt >= :from', { from: fromDate });
    } else if (query?.to) {
      const toDate = typeof query.to === 'string' ? new Date(query.to) : query.to;
      queryBuilder.andWhere('log.createdAt <= :to', { to: toDate });
    }

    // User filter
    if (query?.userId) {
      queryBuilder.andWhere('log.changedById = :userId', { userId: query.userId });
    }

    // Action filter
    if (query?.action) {
      queryBuilder.andWhere('log.action = :action', { action: query.action });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const logs = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data: logs,
      total,
      page,
      limit,
    };
  }

  private serializeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
}

