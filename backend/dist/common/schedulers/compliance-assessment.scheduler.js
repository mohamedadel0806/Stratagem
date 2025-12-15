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
var ComplianceAssessmentScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceAssessmentScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_assessment_service_1 = require("../services/compliance-assessment.service");
const physical_asset_entity_1 = require("../../asset/entities/physical-asset.entity");
const information_asset_entity_1 = require("../../asset/entities/information-asset.entity");
const business_application_entity_1 = require("../../asset/entities/business-application.entity");
const software_asset_entity_1 = require("../../asset/entities/software-asset.entity");
const supplier_entity_1 = require("../../asset/entities/supplier.entity");
let ComplianceAssessmentScheduler = ComplianceAssessmentScheduler_1 = class ComplianceAssessmentScheduler {
    constructor(assessmentService, physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository) {
        this.assessmentService = assessmentService;
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
        this.logger = new common_1.Logger(ComplianceAssessmentScheduler_1.name);
    }
    async handleScheduledAssessments() {
        this.logger.log('Starting scheduled compliance assessments...');
        try {
            await this.assessAssetType('physical', this.physicalAssetRepository);
            await this.assessAssetType('information', this.informationAssetRepository);
            await this.assessAssetType('application', this.businessApplicationRepository);
            await this.assessAssetType('software', this.softwareAssetRepository);
            await this.assessAssetType('supplier', this.supplierRepository);
            this.logger.log('Scheduled compliance assessments completed successfully');
        }
        catch (error) {
            this.logger.error('Error during scheduled compliance assessments:', error);
        }
    }
    async assessAssetType(assetType, repository) {
        this.logger.log(`Assessing ${assetType} assets...`);
        const assets = await repository
            .createQueryBuilder('asset')
            .where('asset.complianceRequirements IS NOT NULL')
            .andWhere("asset.complianceRequirements != '[]'")
            .andWhere("asset.complianceRequirements != ''")
            .andWhere("asset.complianceRequirements != 'null'")
            .andWhere('asset.deletedAt IS NULL')
            .getMany();
        this.logger.log(`Found ${assets.length} ${assetType} assets with compliance requirements`);
        let successCount = 0;
        let errorCount = 0;
        for (const asset of assets) {
            try {
                await this.assessmentService.assessAsset(assetType, asset.id);
                successCount++;
            }
            catch (error) {
                this.logger.error(`Failed to assess ${assetType} asset ${asset.id}:`, error);
                errorCount++;
            }
        }
        this.logger.log(`Completed ${assetType} assessments: ${successCount} successful, ${errorCount} failed`);
    }
    async handleUpdatedAssetsAssessments() {
        this.logger.log('Checking recently updated assets for re-assessment...');
        const sixHoursAgo = new Date();
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
        try {
            this.logger.log('Updated assets assessment check completed (handled by daily assessment)');
        }
        catch (error) {
            this.logger.error('Error checking updated assets:', error);
        }
    }
};
exports.ComplianceAssessmentScheduler = ComplianceAssessmentScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentScheduler.prototype, "handleScheduledAssessments", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentScheduler.prototype, "handleUpdatedAssetsAssessments", null);
exports.ComplianceAssessmentScheduler = ComplianceAssessmentScheduler = ComplianceAssessmentScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(3, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(4, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [compliance_assessment_service_1.ComplianceAssessmentService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ComplianceAssessmentScheduler);
//# sourceMappingURL=compliance-assessment.scheduler.js.map