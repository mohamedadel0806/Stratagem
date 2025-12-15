import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ComplianceAssessmentService } from '../services/compliance-assessment.service';
import { PhysicalAsset } from '../../asset/entities/physical-asset.entity';
import { InformationAsset } from '../../asset/entities/information-asset.entity';
import { BusinessApplication } from '../../asset/entities/business-application.entity';
import { SoftwareAsset } from '../../asset/entities/software-asset.entity';
import { Supplier } from '../../asset/entities/supplier.entity';
import { AssetType } from '../entities/asset-requirement-mapping.entity';

@Injectable()
export class ComplianceAssessmentScheduler {
  private readonly logger = new Logger(ComplianceAssessmentScheduler.name);

  constructor(
    private readonly assessmentService: ComplianceAssessmentService,
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
  ) {}

  /**
   * Run daily compliance assessments at 2 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleScheduledAssessments() {
    this.logger.log('Starting scheduled compliance assessments...');

    try {
      // Assess all physical assets with compliance requirements
      await this.assessAssetType('physical', this.physicalAssetRepository);

      // Assess all information assets with compliance requirements
      await this.assessAssetType('information', this.informationAssetRepository);

      // Assess all business applications with compliance requirements
      await this.assessAssetType('application', this.businessApplicationRepository);

      // Assess all software assets with compliance requirements
      await this.assessAssetType('software', this.softwareAssetRepository);

      // Assess all suppliers with compliance requirements
      await this.assessAssetType('supplier', this.supplierRepository);

      this.logger.log('Scheduled compliance assessments completed successfully');
    } catch (error) {
      this.logger.error('Error during scheduled compliance assessments:', error);
    }
  }

  /**
   * Assess all assets of a specific type that have compliance requirements
   */
  private async assessAssetType(assetType: AssetType, repository: Repository<any>) {
    this.logger.log(`Assessing ${assetType} assets...`);

    // Find all assets that have compliance requirements (non-null and non-empty)
    // Parse JSON to check if it's a valid non-empty array
    const assets = await repository
      .createQueryBuilder('asset')
      .where('asset.complianceRequirements IS NOT NULL')
      .andWhere("asset.complianceRequirements != '[]'")
      .andWhere("asset.complianceRequirements != ''")
      .andWhere("asset.complianceRequirements != 'null'")
      // Use deletedAt null check instead of legacy isDeleted flag
      .andWhere('asset.deletedAt IS NULL')
      .getMany();

    this.logger.log(`Found ${assets.length} ${assetType} assets with compliance requirements`);

    let successCount = 0;
    let errorCount = 0;

    for (const asset of assets) {
      try {
        await this.assessmentService.assessAsset(assetType, asset.id);
        successCount++;
      } catch (error) {
        this.logger.error(`Failed to assess ${assetType} asset ${asset.id}:`, error);
        errorCount++;
      }
    }

    this.logger.log(
      `Completed ${assetType} assessments: ${successCount} successful, ${errorCount} failed`,
    );
  }

  /**
   * Run assessments for assets that were recently updated (every 6 hours)
   * This catches assets that were modified but haven't been re-assessed yet
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async handleUpdatedAssetsAssessments() {
    this.logger.log('Checking recently updated assets for re-assessment...');

    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    try {
      // This is a simplified version - in production, you might want to track
      // which assets were updated and only re-assess those
      // For now, the daily assessment will catch all assets
      this.logger.log('Updated assets assessment check completed (handled by daily assessment)');
    } catch (error) {
      this.logger.error('Error checking updated assets:', error);
    }
  }
}

