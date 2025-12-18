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
exports.SecurityTestResultService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const security_test_result_entity_1 = require("../entities/security-test-result.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
let SecurityTestResultService = class SecurityTestResultService {
    constructor(testResultRepository, applicationRepository, softwareRepository) {
        this.testResultRepository = testResultRepository;
        this.applicationRepository = applicationRepository;
        this.softwareRepository = softwareRepository;
    }
    async create(dto, userId) {
        let asset;
        if (dto.assetType === 'application') {
            asset = await this.applicationRepository.findOne({
                where: { id: dto.assetId, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (!asset) {
                throw new common_1.NotFoundException(`Application with ID ${dto.assetId} not found`);
            }
        }
        else {
            asset = await this.softwareRepository.findOne({
                where: { id: dto.assetId, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (!asset) {
                throw new common_1.NotFoundException(`Software asset with ID ${dto.assetId} not found`);
            }
        }
        let severity = dto.severity;
        let passed = dto.passed;
        if (!severity || passed === undefined) {
            const critical = dto.findingsCritical || 0;
            const high = dto.findingsHigh || 0;
            if (!severity) {
                if (critical > 0) {
                    severity = 'critical';
                }
                else if (high > 0) {
                    severity = 'high';
                }
                else if ((dto.findingsMedium || 0) > 0) {
                    severity = 'medium';
                }
                else if ((dto.findingsLow || 0) > 0 || (dto.findingsInfo || 0) > 0) {
                    severity = 'low';
                }
                else {
                    severity = 'passed';
                }
            }
            if (passed === undefined) {
                passed = severity === 'passed' || severity === 'low' || severity === 'info';
            }
        }
        const testResult = this.testResultRepository.create({
            assetType: dto.assetType,
            assetId: dto.assetId,
            testType: dto.testType,
            testDate: new Date(dto.testDate),
            status: (dto.status || 'completed'),
            testerName: dto.testerName,
            testerCompany: dto.testerCompany,
            findingsCritical: dto.findingsCritical || 0,
            findingsHigh: dto.findingsHigh || 0,
            findingsMedium: dto.findingsMedium || 0,
            findingsLow: dto.findingsLow || 0,
            findingsInfo: dto.findingsInfo || 0,
            severity: severity,
            overallScore: dto.overallScore,
            passed: passed,
            summary: dto.summary,
            findings: dto.findings,
            recommendations: dto.recommendations,
            reportFileId: dto.reportFileId,
            reportUrl: dto.reportUrl,
            remediationDueDate: dto.remediationDueDate ? new Date(dto.remediationDueDate) : undefined,
            remediationCompleted: false,
            retestRequired: dto.retestRequired || false,
            retestDate: dto.retestDate ? new Date(dto.retestDate) : undefined,
            createdBy: userId,
        });
        const saved = await this.testResultRepository.save(testResult);
        const securityTestResultsData = {
            last_test_date: dto.testDate,
            findings: dto.findings || dto.summary || '',
            severity: severity,
        };
        if (dto.assetType === 'application') {
            await this.applicationRepository.update(dto.assetId, {
                lastSecurityTestDate: new Date(dto.testDate),
                securityTestResults: securityTestResultsData,
            });
        }
        else {
            await this.softwareRepository.update(dto.assetId, {
                lastSecurityTestDate: new Date(dto.testDate),
                securityTestResults: securityTestResultsData,
            });
        }
        return this.toResponseDto(saved);
    }
    async findByAsset(assetType, assetId) {
        const results = await this.testResultRepository.find({
            where: { assetType, assetId },
            order: { testDate: 'DESC' },
            relations: ['createdByUser'],
        });
        return results.map((r) => this.toResponseDto(r));
    }
    async findOne(id) {
        const result = await this.testResultRepository.findOne({
            where: { id },
            relations: ['createdByUser'],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Security test result with ID ${id} not found`);
        }
        return this.toResponseDto(result);
    }
    async findFailedTests(daysThreshold = 30) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
        const results = await this.testResultRepository
            .createQueryBuilder('test')
            .where('test.testDate >= :thresholdDate', { thresholdDate })
            .andWhere('(test.passed = false OR test.severity IN (:...severities))', {
            severities: ['critical', 'high'],
        })
            .orderBy('test.testDate', 'DESC')
            .getMany();
        return results.map((r) => this.toResponseDto(r));
    }
    async findOverdueTests() {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const results = await this.testResultRepository
            .createQueryBuilder('test')
            .where('test.testDate < :oneYearAgo', { oneYearAgo })
            .andWhere('test.retestRequired = :retestRequired', { retestRequired: true })
            .andWhere('(test.retestDate IS NULL OR test.retestDate < :now)', { now: new Date() })
            .orderBy('test.testDate', 'DESC')
            .getMany();
        return results.map((r) => this.toResponseDto(r));
    }
    toResponseDto(result) {
        return {
            id: result.id,
            assetType: result.assetType,
            assetId: result.assetId,
            testType: result.testType,
            testDate: result.testDate,
            status: result.status,
            testerName: result.testerName,
            testerCompany: result.testerCompany,
            findingsCritical: result.findingsCritical,
            findingsHigh: result.findingsHigh,
            findingsMedium: result.findingsMedium,
            findingsLow: result.findingsLow,
            findingsInfo: result.findingsInfo,
            severity: result.severity,
            overallScore: result.overallScore,
            passed: result.passed,
            summary: result.summary,
            findings: result.findings,
            recommendations: result.recommendations,
            reportFileId: result.reportFileId,
            reportUrl: result.reportUrl,
            remediationDueDate: result.remediationDueDate,
            remediationCompleted: result.remediationCompleted,
            retestRequired: result.retestRequired,
            retestDate: result.retestDate,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
};
exports.SecurityTestResultService = SecurityTestResultService;
exports.SecurityTestResultService = SecurityTestResultService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(security_test_result_entity_1.SecurityTestResult)),
    __param(1, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SecurityTestResultService);
//# sourceMappingURL=security-test-result.service.js.map