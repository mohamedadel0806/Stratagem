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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_entity_1 = require("../../risk/entities/risk.entity");
const policy_entity_1 = require("../../governance/policies/entities/policy.entity");
const task_entity_1 = require("../../common/entities/task.entity");
const compliance_requirement_entity_1 = require("../../common/entities/compliance-requirement.entity");
const physical_asset_entity_1 = require("../../asset/entities/physical-asset.entity");
const information_asset_entity_1 = require("../../asset/entities/information-asset.entity");
const business_application_entity_1 = require("../../asset/entities/business-application.entity");
const software_asset_entity_1 = require("../../asset/entities/software-asset.entity");
const supplier_entity_1 = require("../../asset/entities/supplier.entity");
const asset_audit_log_entity_1 = require("../../asset/entities/asset-audit-log.entity");
let DashboardService = class DashboardService {
    constructor(riskRepository, policyRepository, taskRepository, requirementRepository, physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository, auditLogRepository) {
        this.riskRepository = riskRepository;
        this.policyRepository = policyRepository;
        this.taskRepository = taskRepository;
        this.requirementRepository = requirementRepository;
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async getOverview() {
        try {
            const totalRisks = await this.riskRepository.count();
            const activePolicies = await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.PUBLISHED },
            });
            const pendingTasks = await this.taskRepository.count({
                where: { status: task_entity_1.TaskStatus.TODO },
            });
            const totalRequirements = await this.requirementRepository.count();
            const compliantRequirements = await this.requirementRepository.count({
                where: { status: compliance_requirement_entity_1.RequirementStatus.COMPLIANT },
            });
            const complianceScore = totalRequirements > 0
                ? Math.round((compliantRequirements / totalRequirements) * 100 * 10) / 10
                : 0;
            const summary = {
                totalRisks,
                activePolicies,
                complianceScore,
                pendingTasks,
                totalRequirements,
                compliantRequirements,
            };
            const assetStats = await this.getAssetStats();
            const supplierCriticality = await this.getSupplierCriticality();
            return { summary, assetStats, supplierCriticality };
        }
        catch (error) {
            console.error('Error in getOverview:', error);
            throw error;
        }
    }
    async getAssetStats() {
        try {
            const countByType = await this.getAssetCountByType();
            const countByCriticality = await this.getAssetCountByCriticality();
            const assetsWithoutOwner = await this.getAssetsWithoutOwner();
            const recentChanges = await this.getRecentAssetChanges();
            const assetsByComplianceScope = await this.getAssetsByComplianceScope();
            const assetsWithOutdatedSecurityTests = await this.getAssetsWithOutdatedSecurityTests();
            const countByConnectivityStatus = await this.getAssetCountByConnectivityStatus();
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
            };
        }
        catch (error) {
            console.error('Error in getAssetStats:', error);
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
            };
        }
    }
    async getAssetCountByType() {
        try {
            const [physical, information, application, software, supplier] = await Promise.all([
                this.physicalAssetRepository.count({ where: { deletedAt: (0, typeorm_2.IsNull)() } }),
                this.informationAssetRepository.count({ where: { deletedAt: (0, typeorm_2.IsNull)() } }),
                this.businessApplicationRepository.count({ where: { deletedAt: (0, typeorm_2.IsNull)() } }),
                this.softwareAssetRepository.count({ where: { deletedAt: (0, typeorm_2.IsNull)() } }),
                this.supplierRepository.count({ where: { deletedAt: (0, typeorm_2.IsNull)() } }),
            ]);
            return {
                physical,
                information,
                application,
                software,
                supplier,
                total: physical + information + application + software + supplier,
            };
        }
        catch (error) {
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
    async getSupplierCriticality() {
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
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            return criticalityCounts;
        }
        catch (error) {
            console.error('Error in getSupplierCriticality:', error);
            return { critical: 0, high: 0, medium: 0, low: 0 };
        }
    }
    async getAssetCountByCriticality() {
        try {
            const criticalityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
            const physicalCounts = await this.physicalAssetRepository
                .createQueryBuilder('asset')
                .select('asset.criticalityLevel', 'level')
                .addSelect('COUNT(*)', 'count')
                .where('asset.deletedAt IS NULL')
                .groupBy('asset.criticalityLevel')
                .getRawMany();
            physicalCounts.forEach((row) => {
                if (row.level && row.level in criticalityCounts) {
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            const infoCounts = [];
            infoCounts.forEach((row) => {
                if (row.level && row.level in criticalityCounts) {
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            const appCounts = await this.businessApplicationRepository
                .createQueryBuilder('asset')
                .select('asset.criticalityLevel', 'level')
                .addSelect('COUNT(*)', 'count')
                .where('asset.deletedAt IS NULL')
                .groupBy('asset.criticalityLevel')
                .getRawMany();
            appCounts.forEach((row) => {
                if (row.level && row.level in criticalityCounts) {
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            const softwareCounts = [];
            softwareCounts.forEach((row) => {
                if (row.level && row.level in criticalityCounts) {
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            const supplierCounts = await this.supplierRepository
                .createQueryBuilder('asset')
                .select('asset.criticalityLevel', 'level')
                .addSelect('COUNT(*)', 'count')
                .where('asset.deletedAt IS NULL')
                .groupBy('asset.criticalityLevel')
                .getRawMany();
            supplierCounts.forEach((row) => {
                if (row.level && row.level in criticalityCounts) {
                    criticalityCounts[row.level] += parseInt(row.count, 10) || 0;
                }
            });
            return criticalityCounts;
        }
        catch (error) {
            console.error('Error in getAssetCountByCriticality:', error);
            return { critical: 0, high: 0, medium: 0, low: 0 };
        }
    }
    async getAssetsWithoutOwner() {
        try {
            const results = [];
            const physicalAssets = await this.physicalAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)(), ownerId: (0, typeorm_2.IsNull)() },
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
            const infoAssets = await this.informationAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)(), informationOwnerId: (0, typeorm_2.IsNull)() },
                take: 10,
                order: { createdAt: 'DESC' },
            });
            infoAssets.forEach((asset) => {
                results.push({
                    id: asset.id,
                    name: asset.name || 'Unnamed Asset',
                    type: 'information',
                    identifier: asset.id,
                    criticalityLevel: undefined,
                    createdAt: asset.createdAt,
                });
            });
            const appAssets = await this.businessApplicationRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)(), ownerId: (0, typeorm_2.IsNull)() },
                take: 10,
                order: { createdAt: 'DESC' },
            });
            appAssets.forEach((asset) => {
                results.push({
                    id: asset.id,
                    name: asset.applicationName || 'Unnamed Application',
                    type: 'application',
                    identifier: asset.id,
                    criticalityLevel: asset.criticalityLevel,
                    createdAt: asset.createdAt,
                });
            });
            const softwareAssets = await this.softwareAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)(), ownerId: (0, typeorm_2.IsNull)() },
                take: 10,
                order: { createdAt: 'DESC' },
            });
            softwareAssets.forEach((asset) => {
                results.push({
                    id: asset.id,
                    name: asset.softwareName || 'Unnamed Software',
                    type: 'software',
                    identifier: asset.id,
                    criticalityLevel: undefined,
                    createdAt: asset.createdAt,
                });
            });
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return results.slice(0, 10);
        }
        catch (error) {
            console.error('Error in getAssetsWithoutOwner:', error);
            return [];
        }
    }
    async getRecentAssetChanges() {
        try {
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
            const results = [];
            for (const log of recentLogs) {
                let assetName = 'Unknown Asset';
                try {
                    switch (log.assetType) {
                        case asset_audit_log_entity_1.AssetType.PHYSICAL:
                            const physical = await this.physicalAssetRepository.findOne({
                                where: { id: log.assetId },
                            });
                            assetName = (physical === null || physical === void 0 ? void 0 : physical.assetDescription) || 'Deleted Asset';
                            break;
                        case asset_audit_log_entity_1.AssetType.INFORMATION:
                            const info = await this.informationAssetRepository.findOne({
                                where: { id: log.assetId },
                            });
                            assetName = (info === null || info === void 0 ? void 0 : info.name) || 'Deleted Asset';
                            break;
                        case asset_audit_log_entity_1.AssetType.APPLICATION:
                            const app = await this.businessApplicationRepository.findOne({
                                where: { id: log.assetId },
                            });
                            assetName = (app === null || app === void 0 ? void 0 : app.applicationName) || 'Deleted Asset';
                            break;
                        case asset_audit_log_entity_1.AssetType.SOFTWARE:
                            const software = await this.softwareAssetRepository.findOne({
                                where: { id: log.assetId },
                            });
                            assetName = (software === null || software === void 0 ? void 0 : software.softwareName) || 'Deleted Asset';
                            break;
                        case asset_audit_log_entity_1.AssetType.SUPPLIER:
                            const supplier = await this.supplierRepository.findOne({
                                where: { id: log.assetId },
                            });
                            assetName = (supplier === null || supplier === void 0 ? void 0 : supplier.supplierName) || 'Deleted Asset';
                            break;
                    }
                }
                catch (error) {
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
                    changedByName: 'System',
                    createdAt: log.createdAt,
                });
            }
            return results;
        }
        catch (error) {
            console.error('Error in getRecentAssetChanges:', error);
            return [];
        }
    }
    async getAssetsByComplianceScope() {
        try {
            const scopeCounts = {};
            const physicalAssets = await this.physicalAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
                select: ['complianceRequirements'],
            });
            physicalAssets.forEach((asset) => {
                if (asset.complianceRequirements && Array.isArray(asset.complianceRequirements)) {
                    asset.complianceRequirements.forEach((scope) => {
                        if (scope) {
                            scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
                        }
                    });
                }
            });
            const applications = await this.businessApplicationRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
                select: ['complianceRequirements'],
            });
            applications.forEach((app) => {
                if (app.complianceRequirements && Array.isArray(app.complianceRequirements)) {
                    app.complianceRequirements.forEach((scope) => {
                        if (scope) {
                            scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
                        }
                    });
                }
            });
            const infoAssets = await this.informationAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
                select: ['complianceRequirements'],
            });
            infoAssets.forEach((asset) => {
                if (asset.complianceRequirements && Array.isArray(asset.complianceRequirements)) {
                    asset.complianceRequirements.forEach((scope) => {
                        if (scope) {
                            scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
                        }
                    });
                }
            });
            return Object.entries(scopeCounts)
                .map(([scope, count]) => ({ scope, count }))
                .sort((a, b) => b.count - a.count);
        }
        catch (error) {
            console.error('Error in getAssetsByComplianceScope:', error);
            return [];
        }
    }
    async getAssetsWithOutdatedSecurityTests() {
        try {
            const results = [];
            const now = new Date();
            const daysThreshold = 365;
            const applications = await this.businessApplicationRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
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
                }
                else {
                    const lastTest = app.lastSecurityTestDate instanceof Date
                        ? app.lastSecurityTestDate
                        : new Date(app.lastSecurityTestDate);
                    if (isNaN(lastTest.getTime())) {
                        results.push({
                            id: app.id,
                            name: app.applicationName,
                            type: 'application',
                            lastSecurityTestDate: undefined,
                            daysSinceLastTest: undefined,
                        });
                        return;
                    }
                    const daysSince = Math.floor((now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24));
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
            const softwareAssets = await this.softwareAssetRepository.find({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
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
                }
                else {
                    const lastTest = asset.lastSecurityTestDate instanceof Date
                        ? asset.lastSecurityTestDate
                        : new Date(asset.lastSecurityTestDate);
                    if (isNaN(lastTest.getTime())) {
                        results.push({
                            id: asset.id,
                            name: asset.softwareName,
                            type: 'software',
                            lastSecurityTestDate: undefined,
                            daysSinceLastTest: undefined,
                        });
                        return;
                    }
                    const daysSince = Math.floor((now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24));
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
            return results.sort((a, b) => {
                if (!a.daysSinceLastTest && !b.daysSinceLastTest)
                    return 0;
                if (!a.daysSinceLastTest)
                    return 1;
                if (!b.daysSinceLastTest)
                    return -1;
                return b.daysSinceLastTest - a.daysSinceLastTest;
            });
        }
        catch (error) {
            console.error('Error in getAssetsWithOutdatedSecurityTests:', error);
            return [];
        }
    }
    async getAssetCountByConnectivityStatus() {
        try {
            const counts = {
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
                const status = row.status;
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
        }
        catch (error) {
            console.error('Error in getAssetCountByConnectivityStatus:', error);
            return {
                connected: 0,
                disconnected: 0,
                unknown: 0,
            };
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(3, (0, typeorm_1.InjectRepository)(compliance_requirement_entity_1.ComplianceRequirement)),
    __param(4, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(5, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(6, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(7, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(8, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_audit_log_entity_1.AssetAuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map