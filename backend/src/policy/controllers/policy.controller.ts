import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { PolicyService } from '../services/policy.service';
import { PolicyResponseDto } from '../dto/policy-response.dto';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { BulkUpdatePolicyDto } from '../dto/bulk-update-policy.dto';
import { PolicyQueryDto } from '../dto/policy-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('policies')
@Controller('policies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all policies with filtering and search' })
  @ApiResponse({ status: 200, description: 'List of policies', type: [PolicyResponseDto] })
  async findAll(@Query() query: PolicyQueryDto): Promise<{ data: PolicyResponseDto[]; total: number; page: number; limit: number }> {
    return this.policyService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy details', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async findOne(@Param('id') id: string): Promise<PolicyResponseDto> {
    return this.policyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new policy' })
  @ApiResponse({ status: 201, description: 'Policy created successfully', type: PolicyResponseDto })
  async create(
    @Body() createPolicyDto: CreatePolicyDto,
    @CurrentUser() user: User,
  ): Promise<PolicyResponseDto> {
    return this.policyService.create(createPolicyDto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a policy' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy updated successfully', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<PolicyResponseDto> {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a policy' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.policyService.remove(id);
    return { message: 'Policy deleted successfully' };
  }

  @Patch('bulk-update')
  @ApiOperation({ summary: 'Bulk update policy status' })
  @ApiResponse({ status: 200, description: 'Policies updated successfully', type: [PolicyResponseDto] })
  async bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdatePolicyDto): Promise<{ updated: number; policies: PolicyResponseDto[] }> {
    return this.policyService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
  }

  @Post(':id/document')
  @ApiOperation({ summary: 'Upload a document for a policy' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Document uploaded successfully', type: PolicyResponseDto })
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads/policies',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  }))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<PolicyResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'policies');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move file to permanent location with policy ID
    const fileExtension = path.extname(file.originalname);
    const fileName = `${id}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.renameSync(file.path, filePath);

    return this.policyService.uploadDocument(id, {
      ...file,
      path: filePath,
    });
  }

  @Get(':id/document')
  @ApiOperation({ summary: 'Download policy document' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Document file' })
  @ApiResponse({ status: 404, description: 'Policy or document not found' })
  async getDocument(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const policy = await this.policyService.findOne(id);
    
    if (!policy.documentUrl || !policy.documentName) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const filePath = path.join(process.cwd(), 'uploads', 'policies', `${id}${path.extname(policy.documentName)}`);
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Document file not found' });
      return;
    }

    res.setHeader('Content-Type', policy.documentMimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${policy.documentName}"`);
    res.sendFile(path.resolve(filePath));
  }
}

