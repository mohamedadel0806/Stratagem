import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SecurityTestResult } from '../entities/security-test-result.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { CreateSecurityTestResultDto } from '../dto/create-security-test-result.dto';
import { SecurityTestResultResponseDto } from '../dto/security-test-result-response.dto';

@Injectable()
export class SecurityTestResultService {
  constructor(
    @InjectRepository(SecurityTestResult)
    private testResultRepository: Repository<SecurityTestResult>,
    @InjectRepository(BusinessApplication)
    private applicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareRepository: Repository<SoftwareAsset>,
  ) {}

  async create(
    dto: CreateSecurityTestResultDto,
    userId: string,
  ): Promise<SecurityTestResultResponseDto> {
    // Verify asset exists
    let asset;
    if (dto.assetType === 'application') {
      asset = await this.applicationRepository.findOne({
        where: { id: dto.assetId, deletedAt: IsNull() },
      });
      if (!asset) {
        throw new NotFoundException(`Application with ID ${dto.assetId} not found`);
      }
    } else {
      asset = await this.softwareRepository.findOne({
        where: { id: dto.assetId, deletedAt: IsNull() },
      });
      if (!asset) {
        throw new NotFoundException(`Software asset with ID ${dto.assetId} not found`);
      }
    }

    // Determine severity and passed status if not provided
    let severity = dto.severity;
    let passed = dto.passed;
    
    if (!severity || passed === undefined) {
      const critical = dto.findingsCritical || 0;
      const high = dto.findingsHigh || 0;
      
      if (!severity) {
        if (critical > 0) {
          severity = 'critical' as any;
        } else if (high > 0) {
          severity = 'high' as any;
        } else if ((dto.findingsMedium || 0) > 0) {
          severity = 'medium' as any;
        } else if ((dto.findingsLow || 0) > 0 || (dto.findingsInfo || 0) > 0) {
          severity = 'low' as any;
        } else {
          severity = 'passed' as any;
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
      status: (dto.status || 'completed') as any,
      testerName: dto.testerName,
      testerCompany: dto.testerCompany,
      findingsCritical: dto.findingsCritical || 0,
      findingsHigh: dto.findingsHigh || 0,
      findingsMedium: dto.findingsMedium || 0,
      findingsLow: dto.findingsLow || 0,
      findingsInfo: dto.findingsInfo || 0,
      severity: severity as any,
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

    // Update asset's last security test date
    const securityTestResultsData = {
      last_test_date: dto.testDate,
      findings: dto.findings || dto.summary || '',
      severity: severity,
    };

    if (dto.assetType === 'application') {
      await this.applicationRepository.update(dto.assetId, {
        lastSecurityTestDate: new Date(dto.testDate),
        securityTestResults: securityTestResultsData as any,
      });
    } else {
      await this.softwareRepository.update(dto.assetId, {
        lastSecurityTestDate: new Date(dto.testDate),
        securityTestResults: securityTestResultsData as any,
      });
    }

    return this.toResponseDto(saved);
  }

  async findByAsset(
    assetType: 'application' | 'software',
    assetId: string,
  ): Promise<SecurityTestResultResponseDto[]> {
    const results = await this.testResultRepository.find({
      where: { assetType, assetId },
      order: { testDate: 'DESC' },
      relations: ['createdByUser'],
    });

    return results.map((r) => this.toResponseDto(r));
  }

  async findOne(id: string): Promise<SecurityTestResultResponseDto> {
    const result = await this.testResultRepository.findOne({
      where: { id },
      relations: ['createdByUser'],
    });

    if (!result) {
      throw new NotFoundException(`Security test result with ID ${id} not found`);
    }

    return this.toResponseDto(result);
  }

  async findFailedTests(daysThreshold: number = 30): Promise<SecurityTestResultResponseDto[]> {
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

  async findOverdueTests(): Promise<SecurityTestResultResponseDto[]> {
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

  private toResponseDto(result: SecurityTestResult): SecurityTestResultResponseDto {
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
}



