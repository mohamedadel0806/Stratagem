import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Risk, RiskStatus } from '../../risk/entities/risk.entity';
import { Policy, PolicyStatus } from '../../governance/policies/entities/policy.entity';
import { Task, TaskStatus } from '../../common/entities/task.entity';
import { ComplianceRequirement, RequirementStatus } from '../../common/entities/compliance-requirement.entity';
import { PhysicalAsset, CriticalityLevel as PhysicalCriticality } from '../../asset/entities/physical-asset.entity';
import { InformationAsset } from '../../asset/entities/information-asset.entity';
import { BusinessApplication, CriticalityLevel as AppCriticality } from '../../asset/entities/business-application.entity';
import { SoftwareAsset } from '../../asset/entities/software-asset.entity';
import { Supplier } from '../../asset/entities/supplier.entity';
import { AssetAuditLog, AssetType } from '../../asset/entities/asset-audit-log.entity';
import {
  DashboardOverviewDto,
  DashboardSummaryDto,
  AssetStatsDto,
  AssetCountByTypeDto,
  AssetCountByCriticalityDto,
  AssetWithoutOwnerDto,
  RecentAssetChangeDto,
} from '../dto/dashboard-overview.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(ComplianceRequirement)
    private requirementRepository: Repository<ComplianceRequirement>,
    @InjectRepository(PhysicalAsset)
    private physicalAssetRepository: Repository<PhysicalAsset>,
    @InjectRepository(InformationAsset)
    private informationAssetRepository: Repository<InformationAsset>,
    @InjectRepository(BusinessApplication)
    private businessApplicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareAssetRepository: Repository<SoftwareAsset>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(AssetAuditLog)
    private auditLogRepository: Repository<AssetAuditLog>,
  ) {}

  async getOverview(): Promise<DashboardOverviewDto> {
    try {
      // Get total risks count
      const totalRisks = await this.riskRepository.count();

      // Get active policies count (published status - equivalent to active)
      const activePolicies = await this.policyRepository.count({
        where: { status: PolicyStatus.PUBLISHED },
      });

      // Get pending tasks count
      const pendingTasks = await this.taskRepository.count({
        where: { status: TaskStatus.TODO },
      });

      // Get compliance requirements stats
      const totalRequirements = await this.requirementRepository.count();
      const compliantRequirements = await this.requirementRepository.count({
        where: { status: RequirementStatus.COMPLIANT },
      });

      // Calculate compliance score
      const complianceScore = totalRequirements > 0
        ? Math.round((compliantRequirements / totalRequirements) * 100 * 10) / 10
        : 0;

      const summary: DashboardSummaryDto = {
        totalRisks,
        activePolicies,
        complianceScore,
        pendingTasks,
        totalRequirements,
        compliantRequirements,
      };

      // Get asset statistics
      const assetStats = await this.getAssetStats();

      // Get supplier criticality (dedicated widget)
      const supplierCriticality = await this.getSupplierCriticality();

      return { summary, assetStats, supplierCriticality };
    } catch (error) {
      console.error('Error in getOverview:', error);
      throw error;
    }
  }

  async getAssetStats(): Promise<AssetStatsDto> {
    try {
      // Count by type
      const countByType = await this.getAssetCountByType();

      // Count by criticality (across all asset types)
      const countByCriticality = await this.getAssetCountByCriticality();

      // Assets without owner
      const assetsWithoutOwner = await this.getAssetsWithoutOwner();

      // Recent changes
      const recentChanges = await this.getRecentAssetChanges();

      // Assets by compliance scope
      const assetsByComplianceScope = await this.getAssetsByComplianceScope();

      // Assets with outdated security tests
      const assetsWithOutdatedSecurityTests = await this.getAssetsWithOutdatedSecurityTests();

      // Assets by connectivity status (connected / disconnected / unknown)
      const countByConnectivityStatus = await this.getAssetCountByConnectivityStatus();

      // Supplier criticality (dedicated widget)
      const supplierCriticality = await this.getSupplierCriticality();

      return {
        countByType,
        countByCriticality,
        assetsWithoutOwner,
        recentChanges,
        assetsByComplianceScope,
        assetsWithOutdatedSecurityTests,
        countByConnectivityStatus,
        supplierCriticality,
      } as any; // Type assertion needed due to optional field
    } catch (error) {
      console.error('Error in getAssetStats:', error);
      // Return default stats instead of throwing to prevent breaking the entire overview
      return {
        countByType: {
          physical: 0,
          information: 0,
          application: 0,
          software: 0,
          supplier: 0,
          total: 0,
        },
        countByCriticality: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        assetsWithoutOwner: [],
        recentChanges: [],
        assetsByComplianceScope: [],
        assetsWithOutdatedSecurityTests: [],
        countByConnectivityStatus: {
          connected: 0,
          disconnected: 0,
          unknown: 0,
        },
        supplierCriticality: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      } as any;
    }
  }

  private async getAssetCountByType(): Promise<AssetCountByTypeDto> {
    try {
      const [physical, information, application, software, supplier] = await Promise.all([
        this.physicalAssetRepository.count({ where: { deletedAt: IsNull() } }),
        this.informationAssetRepository.count({ where: { deletedAt: IsNull() } }),
        this.businessApplicationRepository.count({ where: { deletedAt: IsNull() } }),
        this.softwareAssetRepository.count({ where: { deletedAt: IsNull() } }),
        this.supplierRepository.count({ where: { deletedAt: IsNull() } }),
      ]);

      return {
        physical,
        information,
        application,
        software,
        supplier,
        total: physical + information + application + software + supplier,
      };
    } catch (error) {
      console.error('Error in getAssetCountByType:', error);
      return {
        physical: 0,
        information: 0,
        application: 0,
        software: 0,
        supplier: 0,
        total: 0,
      };
    }
  }

  async getSupplierCriticality(): Promise<{ critical: number; high: number; medium: number; low: number }> {
    try {
      const criticalityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

      const supplierCounts = await this.supplierRepository
        .createQueryBuilder('supplier')
        .select('supplier.criticalityLevel', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('supplier.deletedAt IS NULL')
        .groupBy('supplier.criticalityLevel')
        .getRawMany();

      supplierCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      return criticalityCounts;
    } catch (error) {
      console.error('Error in getSupplierCriticality:', error);
      return { critical: 0, high: 0, medium: 0, low: 0 };
    }
  }

  private async getAssetCountByCriticality(): Promise<AssetCountByCriticalityDto> {
    try {
      // Query each asset type for criticality counts and aggregate
      const criticalityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

      // Physical assets
      const physicalCounts = await this.physicalAssetRepository
        .createQueryBuilder('asset')
        .select('asset.criticalityLevel', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('asset.deletedAt IS NULL')
        .groupBy('asset.criticalityLevel')
        .getRawMany();

      physicalCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      // Information assets (note: information assets don't have criticalityLevel in the new schema)
      // Skip criticality count for information assets
      const infoCounts: any[] = [];

      infoCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      // Business applications
      const appCounts = await this.businessApplicationRepository
        .createQueryBuilder('asset')
        .select('asset.criticalityLevel', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('asset.deletedAt IS NULL')
        .groupBy('asset.criticalityLevel')
        .getRawMany();

      appCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      // Software assets (note: software assets don't have criticalityLevel in the new schema)
      // Skip criticality count for software assets
      const softwareCounts: any[] = [];

      softwareCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      // Suppliers
      const supplierCounts = await this.supplierRepository
        .createQueryBuilder('asset')
        .select('asset.criticalityLevel', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('asset.deletedAt IS NULL')
        .groupBy('asset.criticalityLevel')
        .getRawMany();

      supplierCounts.forEach((row) => {
        if (row.level && row.level in criticalityCounts) {
          criticalityCounts[row.level as keyof typeof criticalityCounts] += parseInt(row.count, 10) || 0;
        }
      });

      return criticalityCounts;
    } catch (error) {
      console.error('Error in getAssetCountByCriticality:', error);
      return { critical: 0, high: 0, medium: 0, low: 0 };
    }
  }

  private async getAssetsWithoutOwner(): Promise<AssetWithoutOwnerDto[]> {
    try {
      const results: AssetWithoutOwnerDto[] = [];

      // Physical assets without owner
      const physicalAssets = await this.physicalAssetRepository.find({
        where: { deletedAt: IsNull(), ownerId: IsNull() },
        take: 10,
        order: { createdAt: 'DESC' },
      });

      physicalAssets.forEach((asset) => {
        results.push({
          id: asset.id,
          name: asset.assetDescription || 'Unnamed Asset',
          type: 'physical',
          identifier: asset.uniqueIdentifier || asset.id,
          criticalityLevel: asset.criticalityLevel,
          createdAt: asset.createdAt,
        });
      });

      // Information assets without owner
      const infoAssets = await this.informationAssetRepository.find({
        where: { deletedAt: IsNull(), informationOwnerId: IsNull() },
        take: 10,
        order: { createdAt: 'DESC' },
      });

      infoAssets.forEach((asset) => {
        results.push({
          id: asset.id,
          name: asset.name || 'Unnamed Asset',
          type: 'information',
          identifier: asset.id, // Information assets don't have a separate identifier
          criticalityLevel: undefined, // Information assets don't have criticalityLevel
          createdAt: asset.createdAt,
        });
      });

      // Business applications without owner
      const appAssets = await this.businessApplicationRepository.find({
        where: { deletedAt: IsNull(), ownerId: IsNull() },
        take: 10,
        order: { createdAt: 'DESC' },
      });

      appAssets.forEach((asset) => {
        results.push({
          id: asset.id,
          name: asset.applicationName || 'Unnamed Application',
          type: 'application',
          identifier: asset.id, // Business applications don't have a separate identifier
          criticalityLevel: asset.criticalityLevel,
          createdAt: asset.createdAt,
        });
      });

      // Software assets without owner
      const softwareAssets = await this.softwareAssetRepository.find({
        where: { deletedAt: IsNull(), ownerId: IsNull() },
        take: 10,
        order: { createdAt: 'DESC' },
      });

      softwareAssets.forEach((asset) => {
        results.push({
          id: asset.id,
          name: asset.softwareName || 'Unnamed Software',
          type: 'software',
          identifier: asset.id, // Software assets don't have a separate identifier
          criticalityLevel: undefined, // Software assets don't have criticalityLevel
          createdAt: asset.createdAt,
        });
      });

      // Sort by createdAt and limit to 10
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return results.slice(0, 10);
    } catch (error) {
      console.error('Error in getAssetsWithoutOwner:', error);
      return [];
    }
  }

  private async getRecentAssetChanges(): Promise<RecentAssetChangeDto[]> {
    try {
      // Use query builder with explicit column selection to avoid loading relations
      // and prevent TypeORM from trying to select columns from the users table
      const recentLogs = await this.auditLogRepository
        .createQueryBuilder('log')
        .select([
          'log.id',
          'log.assetType',
          'log.assetId',
          'log.action',
          'log.fieldName',
          'log.oldValue',
          'log.newValue',
          'log.changedById',
          'log.changeReason',
          'log.createdAt',
        ])
        .orderBy('log.createdAt', 'DESC')
        .take(15)
        .getMany();

      // Get asset names for each log entry
      const results: RecentAssetChangeDto[] = [];

      for (const log of recentLogs) {
        let assetName = 'Unknown Asset';

        try {
          switch (log.assetType) {
            case AssetType.PHYSICAL:
              const physical = await this.physicalAssetRepository.findOne({
                where: { id: log.assetId },
              });
              assetName = physical?.assetDescription || 'Deleted Asset';
              break;
            case AssetType.INFORMATION:
              const info = await this.informationAssetRepository.findOne({
                where: { id: log.assetId },
              });
              assetName = info?.name || 'Deleted Asset';
              break;
            case AssetType.APPLICATION:
              const app = await this.businessApplicationRepository.findOne({
                where: { id: log.assetId },
              });
              assetName = app?.applicationName || 'Deleted Asset';
              break;
            case AssetType.SOFTWARE:
              const software = await this.softwareAssetRepository.findOne({
                where: { id: log.assetId },
              });
              assetName = software?.softwareName || 'Deleted Asset';
              break;
            case AssetType.SUPPLIER:
              const supplier = await this.supplierRepository.findOne({
                where: { id: log.assetId },
              });
              assetName = supplier?.supplierName || 'Deleted Asset';
              break;
          }
        } catch (error) {
          console.error(`Error fetching asset name for ${log.assetType} ${log.assetId}:`, error);
          assetName = 'Unknown Asset';
        }

        results.push({
          id: log.id,
          assetType: log.assetType,
          assetId: log.assetId,
          assetName,
          action: log.action,
          fieldName: log.fieldName,
          // For now, skip resolving the full user to avoid selecting
          // non-existent columns from the users table.
          changedByName: 'System',
          createdAt: log.createdAt,
        });
      }

      return results;
    } catch (error) {
      console.error('Error in getRecentAssetChanges:', error);
      // Return empty array instead of throwing to prevent breaking the entire overview
      return [];
    }
  }

  private async getAssetsByComplianceScope(): Promise<Array<{ scope: string; count: number }>> {
    try {
      const scopeCounts: Record<string, number> = {};

      // Get compliance requirements from physical assets
      const physicalAssets = await this.physicalAssetRepository.find({
        where: { deletedAt: IsNull() },
        select: ['complianceRequirements'],
      });

      physicalAssets.forEach((asset) => {
        if (asset.complianceRequirements && Array.isArray(asset.complianceRequirements)) {
          asset.complianceRequirements.forEach((scope: string) => {
            if (scope) {
              scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
            }
          });
        }
      });

      // Get compliance requirements from business applications
      const applications = await this.businessApplicationRepository.find({
        where: { deletedAt: IsNull() },
        select: ['complianceRequirements'],
      });

      applications.forEach((app) => {
        if (app.complianceRequirements && Array.isArray(app.complianceRequirements)) {
          app.complianceRequirements.forEach((scope: string) => {
            if (scope) {
              scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
            }
          });
        }
      });

      // Get compliance requirements from information assets
      const infoAssets = await this.informationAssetRepository.find({
        where: { deletedAt: IsNull() },
        select: ['complianceRequirements'],
      });

      infoAssets.forEach((asset) => {
        if (asset.complianceRequirements && Array.isArray(asset.complianceRequirements)) {
          asset.complianceRequirements.forEach((scope: string) => {
            if (scope) {
              scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
            }
          });
        }
      });

      return Object.entries(scopeCounts)
        .map(([scope, count]) => ({ scope, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error in getAssetsByComplianceScope:', error);
      return [];
    }
  }

  private async getAssetsWithOutdatedSecurityTests(): Promise<
    Array<{
      id: string;
      name: string;
      type: string;
      lastSecurityTestDate?: Date;
      daysSinceLastTest?: number;
    }>
  > {
    try {
      const results: Array<{
        id: string;
        name: string;
        type: string;
        lastSecurityTestDate?: Date;
        daysSinceLastTest?: number;
      }> = [];

      const now = new Date();
      const daysThreshold = 365; // Consider outdated if more than 1 year old

      // Check business applications
      const applications = await this.businessApplicationRepository.find({
        where: { deletedAt: IsNull() },
        select: ['id', 'applicationName', 'lastSecurityTestDate'],
      });

      applications.forEach((app) => {
        if (!app.lastSecurityTestDate) {
          results.push({
            id: app.id,
            name: app.applicationName,
            type: 'application',
            lastSecurityTestDate: undefined,
            daysSinceLastTest: undefined,
          });
        } else {
          const lastTest =
            app.lastSecurityTestDate instanceof Date
              ? app.lastSecurityTestDate
              : new Date(app.lastSecurityTestDate as any);

          if (isNaN(lastTest.getTime())) {
            // Bad or unparsable date, treat as "no test date"
            results.push({
              id: app.id,
              name: app.applicationName,
              type: 'application',
              lastSecurityTestDate: undefined,
              daysSinceLastTest: undefined,
            });
            return;
          }

          const daysSince = Math.floor(
            (now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (daysSince > daysThreshold) {
            results.push({
              id: app.id,
              name: app.applicationName,
              type: 'application',
              lastSecurityTestDate: lastTest,
              daysSinceLastTest: daysSince,
            });
          }
        }
      });

      // Check software assets
      const softwareAssets = await this.softwareAssetRepository.find({
        where: { deletedAt: IsNull() },
        select: ['id', 'softwareName', 'lastSecurityTestDate'],
      });

      softwareAssets.forEach((asset) => {
        if (!asset.lastSecurityTestDate) {
          results.push({
            id: asset.id,
            name: asset.softwareName,
            type: 'software',
            lastSecurityTestDate: undefined,
            daysSinceLastTest: undefined,
          });
        } else {
          const lastTest =
            asset.lastSecurityTestDate instanceof Date
              ? asset.lastSecurityTestDate
              : new Date(asset.lastSecurityTestDate as any);

          if (isNaN(lastTest.getTime())) {
            // Bad or unparsable date, treat as "no test date"
            results.push({
              id: asset.id,
              name: asset.softwareName,
              type: 'software',
              lastSecurityTestDate: undefined,
              daysSinceLastTest: undefined,
            });
            return;
          }

          const daysSince = Math.floor(
            (now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (daysSince > daysThreshold) {
            results.push({
              id: asset.id,
              name: asset.softwareName,
              type: 'software',
              lastSecurityTestDate: lastTest,
              daysSinceLastTest: daysSince,
            });
          }
        }
      });

      // Sort by days since last test (most outdated first)
      return results.sort((a, b) => {
        if (!a.daysSinceLastTest && !b.daysSinceLastTest) return 0;
        if (!a.daysSinceLastTest) return 1;
        if (!b.daysSinceLastTest) return -1;
        return b.daysSinceLastTest - a.daysSinceLastTest;
      });
    } catch (error) {
      console.error('Error in getAssetsWithOutdatedSecurityTests:', error);
      return [];
    }
  }

  private async getAssetCountByConnectivityStatus(): Promise<{
    connected: number;
    disconnected: number;
    unknown: number;
  }> {
    try {
      const counts: { [key: string]: number } = {
        connected: 0,
        disconnected: 0,
        unknown: 0,
      };

      const rows = await this.physicalAssetRepository
        .createQueryBuilder('asset')
        .select('asset.connectivityStatus', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('asset.deletedAt IS NULL')
        .groupBy('asset.connectivityStatus')
        .getRawMany();

      rows.forEach((row) => {
        const status = row.status as string | null;
        const count = parseInt(row.count, 10) || 0;
        if (status && counts.hasOwnProperty(status)) {
          counts[status] += count;
        }
      });

      return {
        connected: counts.connected || 0,
        disconnected: counts.disconnected || 0,
        unknown: counts.unknown || 0,
      };
    } catch (error) {
      console.error('Error in getAssetCountByConnectivityStatus:', error);
      return {
        connected: 0,
        disconnected: 0,
        unknown: 0,
      };
    }
  }
}

