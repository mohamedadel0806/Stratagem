import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('governance')
@Controller('governance/policies')
@UseGuards(JwtAuthGuard)
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'Policy')
  create(@Body() createPolicyDto: CreatePolicyDto, @Request() req) {
    return this.policiesService.create(createPolicyDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: PolicyQueryDto) {
    return this.policiesService.findAll(queryDto);
  }

  // Specific routes must come before :id route to avoid route conflicts
  @Get('statistics/publication')
  @ApiOperation({ summary: 'Get policy publication statistics' })
  @ApiResponse({ status: 200, description: 'Publication statistics' })
  async getPublicationStatistics() {
    const stats = await this.policiesService.getPublicationStatistics();
    return stats;
  }

  @Get('reviews/due')
  @ApiOperation({ summary: 'Get policies due for review' })
  @ApiResponse({ status: 200, description: 'List of policies due for review' })
  async getPoliciesDueForReview(@Query('days') days?: number) {
    const daysParam = days ? parseInt(days.toString(), 10) : 0;
    const policies = await this.policiesService.getPoliciesDueForReview(daysParam);
    return { data: policies };
  }

  @Get('reviews/statistics')
  @ApiOperation({ summary: 'Get policy review statistics' })
  @ApiResponse({ status: 200, description: 'Review statistics' })
  async getReviewStatistics() {
    const stats = await this.policiesService.getReviewStatistics();
    return { data: stats };
  }

  @Get('reviews/pending')
  @ApiOperation({ summary: 'Get policies pending review' })
  @ApiResponse({ status: 200, description: 'List of policies pending review' })
  async getPendingReviews(@Query('daysAhead') daysAhead?: number) {
    const days = daysAhead ? parseInt(daysAhead.toString(), 10) : 90;
    const policies = await this.policiesService.getPendingReviews(days);
    return { data: policies };
  }

  @Get('assigned/my')
  @ApiOperation({ summary: 'Get policies assigned to current user' })
  @ApiResponse({ status: 200, description: 'List of assigned policies' })
  async getMyAssignedPolicies(@Request() req) {
    const user = req.user;
    const policies = await this.policiesService.getAssignedPolicies(
      user.id,
      user.role,
      // user.business_unit_id if available
    );
    return { data: policies };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a policy by ID' })
  @ApiResponse({ status: 200, description: 'Policy details' })
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, 'Policy')
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto, @Request() req) {
    return this.policiesService.update(id, updatePolicyDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit(AuditAction.DELETE, 'Policy')
  remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }

  @Post(':id/attachments/upload')
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.UPDATE, 'Policy', { description: 'Uploaded attachment to policy' })
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/policies',
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
      fileFilter: (req, file, cb) => {
        // Allow common document types
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'text/csv',
          'image/jpeg',
          'image/png',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`File type ${file.mimetype} is not allowed`), false);
        }
      },
    }),
  )
  async uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'policies');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExtension = path.extname(file.originalname);
    const fileName = `${timestamp}-${randomString}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Move file from temp location to permanent location
    if (file.path) {
      fs.renameSync(file.path, filePath);
    } else if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    }

    // Add attachment to policy
    const policy = await this.policiesService.findOne(id);
    const attachments = policy.attachments || [];
    attachments.push({
      filename: file.originalname,
      path: `/uploads/policies/${fileName}`,
      upload_date: new Date().toISOString(),
      uploaded_by: req.user.id,
    });

    await this.policiesService.update(
      id,
      { attachments } as any,
      req.user.id,
    );

    return {
      message: 'File uploaded successfully',
      attachment: {
        filename: file.originalname,
        path: `/uploads/policies/${fileName}`,
        upload_date: new Date().toISOString(),
        uploaded_by: req.user.id,
      },
    };
  }

  @Get('attachments/download/:filename')
  async downloadAttachment(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'policies', filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(path.resolve(filePath));
  }

  @Get(':id/workflows')
  async getWorkflowExecutions(@Param('id') id: string) {
    const executions = await this.policiesService.getWorkflowExecutions(id);
    return { data: executions };
  }

  @Get(':id/workflows/pending-approvals')
  async getPendingApprovals(@Param('id') id: string, @Request() req) {
    const approvals = await this.policiesService.getPendingApprovals(id, req.user.id);
    return { data: approvals };
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.PUBLISH, 'Policy')
  async publish(
    @Param('id') id: string,
    @Body() body: {
      assign_to_user_ids?: string[];
      assign_to_role_ids?: string[];
      assign_to_business_unit_ids?: string[];
      notification_message?: string;
    },
    @Request() req,
  ) {
    const policy = await this.policiesService.publish(
      id,
      req.user.id,
      body.assign_to_user_ids,
      body.assign_to_role_ids,
      body.assign_to_business_unit_ids,
      body.notification_message,
    );
    return { data: policy };
  }


  @Post(':id/reviews')
  @ApiOperation({ summary: 'Initiate a policy review' })
  @ApiResponse({ status: 201, description: 'Review initiated successfully' })
  @Audit(AuditAction.APPROVE, 'Policy', { description: 'Initiated policy review' })
  async initiateReview(
    @Param('id') id: string,
    @Body() body: { review_date: string },
    @Request() req,
  ) {
    const reviewDate = new Date(body.review_date);
    const review = await this.policiesService.initiateReview(id, reviewDate, req.user.id);
    return { data: review };
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get review history for a policy' })
  @ApiResponse({ status: 200, description: 'Review history' })
  async getReviewHistory(@Param('id') id: string) {
    const reviews = await this.policiesService.getReviewHistory(id);
    return { data: reviews };
  }

  @Get(':id/reviews/active')
  @ApiOperation({ summary: 'Get active review for a policy' })
  @ApiResponse({ status: 200, description: 'Active review' })
  async getActiveReview(@Param('id') id: string) {
    const review = await this.policiesService.getActiveReview(id);
    return { data: review };
  }

  @Patch('reviews/:reviewId/complete')
  @ApiOperation({ summary: 'Complete a policy review' })
  @ApiResponse({ status: 200, description: 'Review completed successfully' })
  @Audit(AuditAction.APPROVE, 'Policy', { description: 'Completed policy review' })
  async completeReview(
    @Param('reviewId') reviewId: string,
    @Body() body: {
      outcome: string;
      notes?: string;
      review_summary?: string;
      recommended_changes?: string;
      next_review_date?: string;
    },
    @Request() req,
  ) {
    const review = await this.policiesService.completeReview(
      reviewId,
      body.outcome as any,
      req.user.id,
      body.notes,
      body.review_summary,
      body.recommended_changes,
      body.next_review_date ? new Date(body.next_review_date) : undefined,
    );
    return { data: review };
  }

  // ==================== POLICY HIERARCHY ENDPOINTS (Story 2.1) ====================

  @Get('hierarchy/all')
  @ApiOperation({ summary: 'Get all policy hierarchies (root policies with trees)' })
  @ApiResponse({ status: 200, description: 'List of policy hierarchies' })
  async getAllHierarchies(@Query('includeArchived') includeArchived?: string) {
    const result = await this.policiesService.getAllHierarchies(includeArchived === 'true');
    return { data: result };
  }

  @Get('hierarchy/roots')
  @ApiOperation({ summary: 'Get root policies (policies with no parents)' })
  @ApiResponse({ status: 200, description: 'List of root policies' })
  async getRootPolicies(@Query('includeArchived') includeArchived?: string) {
    const result = await this.policiesService.getRootPolicies(includeArchived === 'true');
    return { data: result };
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get complete hierarchy information for a policy' })
  @ApiResponse({ status: 200, description: 'Complete hierarchy information' })
  async getCompleteHierarchy(@Param('id') id: string) {
    const result = await this.policiesService.getCompleteHierarchy(id);
    return { data: result };
  }

  @Get(':id/hierarchy/tree')
  @ApiOperation({ summary: 'Get hierarchy tree for a policy (parent and all descendants)' })
  @ApiResponse({ status: 200, description: 'Hierarchy tree structure' })
  async getHierarchyTree(
    @Param('id') id: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    const result = await this.policiesService.getHierarchyTree(id, includeArchived === 'true');
    return { data: result };
  }

  @Get(':id/hierarchy/parent')
  @ApiOperation({ summary: 'Get parent policy' })
  @ApiResponse({ status: 200, description: 'Parent policy or null if root' })
  async getParent(@Param('id') id: string) {
    const result = await this.policiesService.getParent(id);
    return { data: result };
  }

  @Get(':id/hierarchy/children')
  @ApiOperation({ summary: 'Get immediate child policies' })
  @ApiResponse({ status: 200, description: 'List of child policies' })
  async getChildren(
    @Param('id') id: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    const result = await this.policiesService.getChildren(id, includeArchived === 'true');
    return { data: result };
  }

  @Get(':id/hierarchy/ancestors')
  @ApiOperation({ summary: 'Get all ancestor policies (up to root)' })
  @ApiResponse({ status: 200, description: 'List of ancestor policies' })
  async getAncestors(@Param('id') id: string) {
    const result = await this.policiesService.getAncestors(id);
    return { data: result };
  }

  @Get(':id/hierarchy/descendants')
  @ApiOperation({ summary: 'Get all descendant policies (all children, grandchildren, etc.)' })
  @ApiResponse({ status: 200, description: 'List of descendant policies' })
  async getDescendants(@Param('id') id: string) {
    const result = await this.policiesService.getAllDescendants(id);
    return { data: result };
  }

  @Get(':id/hierarchy/level')
  @ApiOperation({ summary: 'Get hierarchy level of a policy (0 for root)' })
  @ApiResponse({ status: 200, description: 'Hierarchy level number' })
  async getHierarchyLevel(@Param('id') id: string) {
    const level = await this.policiesService.getHierarchyLevel(id);
    return { data: { level } };
  }

  @Get(':id/hierarchy/root')
  @ApiOperation({ summary: 'Get root policy of the hierarchy' })
  @ApiResponse({ status: 200, description: 'Root policy' })
  async getRoot(@Param('id') id: string) {
    const result = await this.policiesService.getRoot(id);
    return { data: result };
  }

  @Patch(':id/hierarchy/parent')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.UPDATE, 'Policy Hierarchy')
  @ApiOperation({ summary: 'Set or update parent policy' })
  async setParentPolicy(
    @Param('id') id: string,
    @Body() body: { parent_policy_id?: string | null; reason?: string },
    @Request() req,
  ) {
    const result = await this.policiesService.setParentPolicy(
      id,
      body.parent_policy_id ?? null,
      req.user.id,
      body.reason,
    );
    return { data: result };
  }

  // ============ Policy Version Endpoints (Story 2.1) ============

  @Get(':id/versions-list')
  @ApiOperation({ summary: 'Get all versions of a policy' })
  @ApiResponse({ status: 200, description: 'List of policy versions' })
  async getVersionsList(@Param('id') id: string) {
    const versions = await this.policiesService.getPolicyVersions(id);
    return { data: versions };
  }

  @Get(':id/versions/latest')
  @ApiOperation({ summary: 'Get the latest version of a policy' })
  @ApiResponse({ status: 200, description: 'Latest policy version' })
  async getLatestVersion(@Param('id') id: string) {
    const version = await this.policiesService.getLatestPolicyVersion(id);
    return { data: version };
  }

  @Post(':id/versions/create')
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'PolicyVersion')
  @ApiOperation({ summary: 'Create a new version of a policy' })
  @ApiResponse({ status: 201, description: 'Version created successfully' })
  async createVersion(
    @Param('id') id: string,
    @Body()
    body: {
      content: string;
      change_summary?: string;
    },
    @Request() req,
  ) {
    const version = await this.policiesService.createVersion(
      id,
      body.content,
      body.change_summary || '',
      req.user.id,
    );
    return { data: version };
  }

  @Post(':id/versions/compare')
  @ApiOperation({ summary: 'Compare two policy versions' })
  @ApiResponse({ status: 200, description: 'Version comparison results' })
  async compareVersions(
    @Param('id') id: string,
    @Body() body: { version1_id: string; version2_id: string },
  ) {
    const comparison = await this.policiesService.comparePolicyVersions(
      body.version1_id,
      body.version2_id,
    );
    return { data: comparison };
  }

  // ============ Policy Approval Endpoints (Story 2.2) ============

  @Get(':id/approvals')
  @ApiOperation({ summary: 'Get all approvals for a policy' })
  @ApiResponse({ status: 200, description: 'List of policy approvals' })
  async getPolicyApprovals(@Param('id') id: string) {
    const approvals = await this.policiesService.getPolicyApprovals(id);
    return { data: approvals };
  }

  @Get(':id/approvals/progress')
  @ApiOperation({ summary: 'Get approval progress for a policy' })
  @ApiResponse({ status: 200, description: 'Approval progress' })
  async getApprovalProgress(@Param('id') id: string) {
    const progress = await this.policiesService.getApprovalProgress(id);
    return { data: progress };
  }

  @Post(':id/approvals/request')
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'PolicyApproval')
  @ApiOperation({ summary: 'Request approvals for a policy' })
  @ApiResponse({ status: 201, description: 'Approvals requested' })
  async requestApprovals(
    @Param('id') id: string,
    @Body() body: { approver_ids: string[] },
  ) {
    const approvals = await this.policiesService.requestApprovals(id, body.approver_ids);
    return { data: approvals };
  }

  @Post('approvals/:approval_id/approve')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.UPDATE, 'PolicyApproval')
  @ApiOperation({ summary: 'Approve a policy' })
  @ApiResponse({ status: 200, description: 'Policy approved' })
  async approvePolicy(
    @Param('approval_id') approvalId: string,
    @Body() body: { comments?: string },
  ) {
    const approval = await this.policiesService.approvePolicy(
      approvalId,
      body.comments,
    );
    return { data: approval };
  }

  @Post('approvals/:approval_id/reject')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.UPDATE, 'PolicyApproval')
  @ApiOperation({ summary: 'Reject a policy approval' })
  @ApiResponse({ status: 200, description: 'Policy rejected' })
  async rejectPolicy(
    @Param('approval_id') approvalId: string,
    @Body() body: { comments?: string },
  ) {
    const approval = await this.policiesService.rejectPolicy(
      approvalId,
      body.comments,
    );
    return { data: approval };
  }

  @Get('approvals/pending/all')
  @ApiOperation({ summary: 'Get all pending approvals' })
  @ApiResponse({ status: 200, description: 'List of pending approvals' })
  async getPendingApprovalsForSystem() {
    const approvals = await this.policiesService.getPendingApprovalsForSystem();
    return { data: approvals };
  }
}

