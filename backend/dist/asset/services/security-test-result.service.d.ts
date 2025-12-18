import { Repository } from 'typeorm';
import { SecurityTestResult } from '../entities/security-test-result.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { CreateSecurityTestResultDto } from '../dto/create-security-test-result.dto';
import { SecurityTestResultResponseDto } from '../dto/security-test-result-response.dto';
export declare class SecurityTestResultService {
    private testResultRepository;
    private applicationRepository;
    private softwareRepository;
    constructor(testResultRepository: Repository<SecurityTestResult>, applicationRepository: Repository<BusinessApplication>, softwareRepository: Repository<SoftwareAsset>);
    create(dto: CreateSecurityTestResultDto, userId: string): Promise<SecurityTestResultResponseDto>;
    findByAsset(assetType: 'application' | 'software', assetId: string): Promise<SecurityTestResultResponseDto[]>;
    findOne(id: string): Promise<SecurityTestResultResponseDto>;
    findFailedTests(daysThreshold?: number): Promise<SecurityTestResultResponseDto[]>;
    findOverdueTests(): Promise<SecurityTestResultResponseDto[]>;
    private toResponseDto;
}
