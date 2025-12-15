import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceStatusResponseDto } from '../dto/compliance-status-response.dto';
import { CreateFrameworkDto } from '../dto/create-framework.dto';
import { UpdateFrameworkDto } from '../dto/update-framework.dto';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { BulkUpdateRequirementDto } from '../dto/bulk-update-requirement.dto';
import { FrameworkResponseDto } from '../dto/framework-response.dto';
import { RequirementResponseDto } from '../dto/requirement-response.dto';
import { BulkUploadResponseDto } from '../dto/bulk-upload-response.dto';
import { RequirementQueryDto } from '../dto/requirement-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { parseCSVRequirements } from '../utils/csv-parser.util';

@ApiTags('compliance')
@Controller('compliance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get compliance status overview' })
  @ApiResponse({
    status: 200,
    description: 'Compliance status with framework breakdown',
    type: ComplianceStatusResponseDto,
  })
  async getStatus(): Promise<ComplianceStatusResponseDto> {
    return this.complianceService.getStatus();
  }

  // Framework endpoints
  @Get('frameworks')
  @ApiOperation({ summary: 'Get all compliance frameworks' })
  @ApiResponse({ status: 200, description: 'List of frameworks', type: [FrameworkResponseDto] })
  async getFrameworks(): Promise<FrameworkResponseDto[]> {
    return this.complianceService.findAllFrameworks();
  }

  @Get('frameworks/:id')
  @ApiOperation({ summary: 'Get framework by ID' })
  @ApiParam({ name: 'id', description: 'Framework ID' })
  @ApiResponse({ status: 200, description: 'Framework details', type: FrameworkResponseDto })
  @ApiResponse({ status: 404, description: 'Framework not found' })
  async getFramework(@Param('id') id: string): Promise<FrameworkResponseDto> {
    return this.complianceService.findFrameworkById(id);
  }

  @Post('frameworks')
  @ApiOperation({ summary: 'Create a new compliance framework' })
  @ApiResponse({ status: 201, description: 'Framework created successfully', type: FrameworkResponseDto })
  async createFramework(@Body() createDto: CreateFrameworkDto): Promise<FrameworkResponseDto> {
    return this.complianceService.createFramework(createDto);
  }

  @Put('frameworks/:id')
  @ApiOperation({ summary: 'Update a compliance framework' })
  @ApiParam({ name: 'id', description: 'Framework ID' })
  @ApiResponse({ status: 200, description: 'Framework updated successfully', type: FrameworkResponseDto })
  @ApiResponse({ status: 404, description: 'Framework not found' })
  async updateFramework(
    @Param('id') id: string,
    @Body() updateDto: UpdateFrameworkDto,
  ): Promise<FrameworkResponseDto> {
    return this.complianceService.updateFramework(id, updateDto);
  }

  @Delete('frameworks/:id')
  @ApiOperation({ summary: 'Delete a compliance framework' })
  @ApiParam({ name: 'id', description: 'Framework ID' })
  @ApiResponse({ status: 200, description: 'Framework deleted successfully' })
  @ApiResponse({ status: 404, description: 'Framework not found' })
  async deleteFramework(@Param('id') id: string): Promise<{ message: string }> {
    await this.complianceService.deleteFramework(id);
    return { message: 'Framework deleted successfully' };
  }

  // Requirement endpoints
  @Get('requirements')
  @ApiOperation({ summary: 'Get all compliance requirements with filtering and search' })
  @ApiResponse({ status: 200, description: 'List of requirements', type: [RequirementResponseDto] })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getRequirements(@Query() query: RequirementQueryDto): Promise<{ data: RequirementResponseDto[]; total: number; page: number; limit: number }> {
    return this.complianceService.findAllRequirements(query);
  }

  @Get('requirements/:id')
  @ApiOperation({ summary: 'Get requirement by ID' })
  @ApiParam({ name: 'id', description: 'Requirement ID' })
  @ApiResponse({ status: 200, description: 'Requirement details', type: RequirementResponseDto })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async getRequirement(@Param('id') id: string): Promise<RequirementResponseDto> {
    return this.complianceService.findRequirementById(id);
  }

  @Post('requirements')
  @ApiOperation({ summary: 'Create a new compliance requirement' })
  @ApiResponse({ status: 201, description: 'Requirement created successfully', type: RequirementResponseDto })
  async createRequirement(@Body() createDto: CreateRequirementDto): Promise<RequirementResponseDto> {
    return this.complianceService.createRequirement(createDto);
  }

  @Put('requirements/:id')
  @ApiOperation({ summary: 'Update a compliance requirement' })
  @ApiParam({ name: 'id', description: 'Requirement ID' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully', type: RequirementResponseDto })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async updateRequirement(
    @Param('id') id: string,
    @Body() updateDto: UpdateRequirementDto,
  ): Promise<RequirementResponseDto> {
    return this.complianceService.updateRequirement(id, updateDto);
  }

  @Delete('requirements/:id')
  @ApiOperation({ summary: 'Delete a compliance requirement' })
  @ApiParam({ name: 'id', description: 'Requirement ID' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async deleteRequirement(@Param('id') id: string): Promise<{ message: string }> {
    await this.complianceService.deleteRequirement(id);
    return { message: 'Requirement deleted successfully' };
  }

  @Patch('requirements/bulk-update')
  @ApiOperation({ summary: 'Bulk update requirement status' })
  @ApiResponse({ status: 200, description: 'Requirements updated successfully', type: [RequirementResponseDto] })
  async bulkUpdateRequirementStatus(@Body() bulkUpdateDto: BulkUpdateRequirementDto): Promise<{ updated: number; requirements: RequirementResponseDto[] }> {
    return this.complianceService.bulkUpdateRequirementStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
  }

  @Post('frameworks/:id/requirements/upload')
  @ApiOperation({ summary: 'Upload requirements via CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Framework ID' })
  @ApiResponse({ status: 200, description: 'Requirements uploaded successfully', type: BulkUploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadRequirements(
    @Param('id') frameworkId: string,
    @UploadedFile() file: any,
  ): Promise<BulkUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV file');
    }

    try {
      const csvContent = file.buffer.toString('utf-8');
      const requirements = parseCSVRequirements(csvContent);

      if (requirements.length === 0) {
        throw new BadRequestException('CSV file contains no valid requirements');
      }

      // Clear existing requirements and create new ones
      const result = await this.complianceService.bulkCreateRequirements(frameworkId, requirements, true);

      return {
        success: result.errors.length === 0,
        totalRows: requirements.length,
        created: result.created,
        deleted: result.deleted || 0,
        errors: result.errors.length,
        errorMessages: result.errors.length > 0 ? result.errors : undefined,
      };
    } catch (error: any) {
      throw new BadRequestException(`Failed to process CSV: ${error.message}`);
    }
  }
}

