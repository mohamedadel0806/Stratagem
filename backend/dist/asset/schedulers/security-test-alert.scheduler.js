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
var SecurityTestAlertScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityTestAlertScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const security_test_result_entity_1 = require("../entities/security-test-result.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let SecurityTestAlertScheduler = SecurityTestAlertScheduler_1 = class SecurityTestAlertScheduler {
    constructor(testResultRepository, applicationRepository, softwareRepository, notificationService) {
        this.testResultRepository = testResultRepository;
        this.applicationRepository = applicationRepository;
        this.softwareRepository = softwareRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(SecurityTestAlertScheduler_1.name);
    }
    async handleFailedSecurityTestAlerts() {
        this.logger.log('Checking for failed security tests...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const failedTests = await this.testResultRepository
                .createQueryBuilder('test')
                .where('test.testDate >= :thirtyDaysAgo', { thirtyDaysAgo })
                .andWhere('(test.passed = false OR test.severity IN (:...severities))', {
                severities: ['critical', 'high'],
            })
                .getMany();
            for (const test of failedTests) {
                try {
                    let ownerId;
                    let assetName;
                    if (test.assetType === 'application') {
                        const app = await this.applicationRepository.findOne({
                            where: { id: test.assetId },
                            relations: ['owner'],
                        });
                        if (app) {
                            ownerId = app.ownerId;
                            assetName = app.applicationName;
                        }
                    }
                    else {
                        const software = await this.softwareRepository.findOne({
                            where: { id: test.assetId },
                            relations: ['owner'],
                        });
                        if (software) {
                            ownerId = software.ownerId;
                            assetName = software.softwareName;
                        }
                    }
                    if (ownerId) {
                        await this.notificationService.create({
                            userId: ownerId,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: test.severity === 'critical' ? notification_entity_1.NotificationPriority.URGENT : notification_entity_1.NotificationPriority.HIGH,
                            title: 'Security Test Failed',
                            message: `Security test for ${test.assetType} "${assetName}" failed with ${test.severity} severity. Test date: ${test.testDate.toLocaleDateString()}. Findings: ${test.findingsCritical} critical, ${test.findingsHigh} high.`,
                            metadata: {
                                assetType: test.assetType,
                                assetId: test.assetId,
                                testResultId: test.id,
                            },
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`Error sending alert for test ${test.id}: ${error.message}`);
                }
            }
            this.logger.log(`Processed ${failedTests.length} failed security tests`);
        }
        catch (error) {
            this.logger.error(`Error in handleFailedSecurityTestAlerts: ${error.message}`, error.stack);
        }
    }
    async handleOverdueSecurityTestAlerts() {
        this.logger.log('Checking for overdue security tests...');
        try {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const overdueTests = await this.testResultRepository
                .createQueryBuilder('test')
                .where('test.testDate < :oneYearAgo', { oneYearAgo })
                .andWhere('test.retestRequired = :retestRequired', { retestRequired: true })
                .andWhere('(test.retestDate IS NULL OR test.retestDate < :now)', { now: new Date() })
                .getMany();
            for (const test of overdueTests) {
                try {
                    let ownerId;
                    let assetName;
                    if (test.assetType === 'application') {
                        const app = await this.applicationRepository.findOne({
                            where: { id: test.assetId },
                            relations: ['owner'],
                        });
                        if (app) {
                            ownerId = app.ownerId;
                            assetName = app.applicationName;
                        }
                    }
                    else {
                        const software = await this.softwareRepository.findOne({
                            where: { id: test.assetId },
                            relations: ['owner'],
                        });
                        if (software) {
                            ownerId = software.ownerId;
                            assetName = software.softwareName;
                        }
                    }
                    if (ownerId) {
                        await this.notificationService.create({
                            userId: ownerId,
                            type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: 'Security Test Overdue',
                            message: `Security test for ${test.assetType} "${assetName}" is overdue. Last test: ${test.testDate.toLocaleDateString()}. Retest required.`,
                            metadata: {
                                assetType: test.assetType,
                                assetId: test.assetId,
                                testResultId: test.id,
                            },
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`Error sending overdue alert for test ${test.id}: ${error.message}`);
                }
            }
            this.logger.log(`Processed ${overdueTests.length} overdue security tests`);
        }
        catch (error) {
            this.logger.error(`Error in handleOverdueSecurityTestAlerts: ${error.message}`, error.stack);
        }
    }
};
exports.SecurityTestAlertScheduler = SecurityTestAlertScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityTestAlertScheduler.prototype, "handleFailedSecurityTestAlerts", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityTestAlertScheduler.prototype, "handleOverdueSecurityTestAlerts", null);
exports.SecurityTestAlertScheduler = SecurityTestAlertScheduler = SecurityTestAlertScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(security_test_result_entity_1.SecurityTestResult)),
    __param(1, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], SecurityTestAlertScheduler);
//# sourceMappingURL=security-test-alert.scheduler.js.map