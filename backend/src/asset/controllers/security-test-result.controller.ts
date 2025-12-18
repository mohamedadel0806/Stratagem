import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SecurityTestResultService } from '../services/security-test-result.service';
import { CreateSecurityTestResultDto } from '../dto/create-security-test-result.dto';
import { SecurityTestResultResponseDto } from '../dto/security-test-result-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { FileService } from '../../common/services/file.service';

@ApiTags('Security Test Results')
@Controller('assets/security-tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SecurityTestResultController {
  constructor(
    private readonly testResultService: SecurityTestResultService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new security test result' })
  @ApiResponse({ status: 201, description: 'Security test result created', type: SecurityTestResultResponseDto })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async create(
    @Body() dto: CreateSecurityTestResultDto,
    @CurrentUser() user: User,
  ): Promise<SecurityTestResultResponseDto> {
    return this.testResultService.create(dto, user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload security test report and create test result' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        assetType: {
          type: 'string',
          enum: ['application', 'software'],
        },
        assetId: { type: 'string' },
        testType: { type: 'string' },
        testDate: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Test result created with uploaded file', type: SecurityTestResultResponseDto })
  async uploadAndCreate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @CurrentUser() user: User,
  ): Promise<SecurityTestResultResponseDto> {
    if (!file) {
      throw new Error('File is required');
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml',
      'text/xml',
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed. Allowed types: PDF, CSV, XLS, XLSX, XML`);
    }

    // Upload file
    const uploadedFile = await this.fileService.uploadFile(file, user.id, {
      category: 'security_test_report',
      entityType: body.assetType,
      entityId: body.assetId,
      description: `Security test report for ${body.assetType} ${body.assetId}`,
    });

    // Create test result with file reference
    const dto: CreateSecurityTestResultDto = {
      assetType: body.assetType,
      assetId: body.assetId,
      testType: body.testType,
      testDate: body.testDate,
      status: body.status,
      testerName: body.testerName,
      testerCompany: body.testerCompany,
      findingsCritical: body.findingsCritical ? parseInt(body.findingsCritical) : undefined,
      findingsHigh: body.findingsHigh ? parseInt(body.findingsHigh) : undefined,
      findingsMedium: body.findingsMedium ? parseInt(body.findingsMedium) : undefined,
      findingsLow: body.findingsLow ? parseInt(body.findingsLow) : undefined,
      findingsInfo: body.findingsInfo ? parseInt(body.findingsInfo) : undefined,
      severity: body.severity,
      overallScore: body.overallScore ? parseFloat(body.overallScore) : undefined,
      passed: body.passed === 'true' || body.passed === true,
      summary: body.summary,
      findings: body.findings,
      recommendations: body.recommendations,
      reportFileId: uploadedFile.id,
      reportUrl: `/api/v1/files/${uploadedFile.id}/download`,
      remediationDueDate: body.remediationDueDate,
      retestRequired: body.retestRequired === 'true' || body.retestRequired === true,
      retestDate: body.retestDate,
    };

    return this.testResultService.create(dto, user.id);
  }

  @Get('asset/:assetType/:assetId')
  @ApiOperation({ summary: 'Get all security test results for an asset' })
  @ApiResponse({ status: 200, description: 'List of security test results', type: [SecurityTestResultResponseDto] })
  async findByAsset(
    @Param('assetType', new ParseEnumPipe(['application', 'software'])) assetType: 'application' | 'software',
    @Param('assetId') assetId: string,
  ): Promise<SecurityTestResultResponseDto[]> {
    return this.testResultService.findByAsset(assetType, assetId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific security test result' })
  @ApiResponse({ status: 200, description: 'Security test result', type: SecurityTestResultResponseDto })
  @ApiResponse({ status: 404, description: 'Test result not found' })
  async findOne(@Param('id') id: string): Promise<SecurityTestResultResponseDto> {
    return this.testResultService.findOne(id);
  }

  @Get('reports/failed')
  @ApiOperation({ summary: 'Get failed security tests' })
  @ApiResponse({ status: 200, description: 'List of failed tests', type: [SecurityTestResultResponseDto] })
  async findFailedTests(@Query('days') days?: string): Promise<SecurityTestResultResponseDto[]> {
    const daysThreshold = days ? parseInt(days) : 30;
    return this.testResultService.findFailedTests(daysThreshold);
  }

  @Get('reports/overdue')
  @ApiOperation({ summary: 'Get overdue security tests requiring retest' })
  @ApiResponse({ status: 200, description: 'List of overdue tests', type: [SecurityTestResultResponseDto] })
  async findOverdueTests(): Promise<SecurityTestResultResponseDto[]> {
    return this.testResultService.findOverdueTests();
  }
}

