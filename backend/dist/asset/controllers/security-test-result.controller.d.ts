import { SecurityTestResultService } from '../services/security-test-result.service';
import { CreateSecurityTestResultDto } from '../dto/create-security-test-result.dto';
import { SecurityTestResultResponseDto } from '../dto/security-test-result-response.dto';
import { User } from '../../users/entities/user.entity';
import { FileService } from '../../common/services/file.service';
export declare class SecurityTestResultController {
    private readonly testResultService;
    private readonly fileService;
    constructor(testResultService: SecurityTestResultService, fileService: FileService);
    create(dto: CreateSecurityTestResultDto, user: User): Promise<SecurityTestResultResponseDto>;
    uploadAndCreate(file: Express.Multer.File, body: any, user: User): Promise<SecurityTestResultResponseDto>;
    findByAsset(assetType: 'application' | 'software', assetId: string): Promise<SecurityTestResultResponseDto[]>;
    findOne(id: string): Promise<SecurityTestResultResponseDto>;
    findFailedTests(days?: string): Promise<SecurityTestResultResponseDto[]>;
    findOverdueTests(): Promise<SecurityTestResultResponseDto[]>;
}
