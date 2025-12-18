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
exports.PoliciesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const swagger_1 = require("@nestjs/swagger");
const policies_service_1 = require("./policies.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const update_policy_dto_1 = require("./dto/update-policy.dto");
const policy_query_dto_1 = require("./dto/policy-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PoliciesController = class PoliciesController {
    constructor(policiesService) {
        this.policiesService = policiesService;
    }
    create(createPolicyDto, req) {
        return this.policiesService.create(createPolicyDto, req.user.id);
    }
    findAll(queryDto) {
        return this.policiesService.findAll(queryDto);
    }
    async getPublicationStatistics() {
        const stats = await this.policiesService.getPublicationStatistics();
        return stats;
    }
    async getPoliciesDueForReview(days) {
        const daysParam = days ? parseInt(days.toString(), 10) : 0;
        const policies = await this.policiesService.getPoliciesDueForReview(daysParam);
        return { data: policies };
    }
    async getReviewStatistics() {
        const stats = await this.policiesService.getReviewStatistics();
        return { data: stats };
    }
    async getPendingReviews(daysAhead) {
        const days = daysAhead ? parseInt(daysAhead.toString(), 10) : 90;
        const policies = await this.policiesService.getPendingReviews(days);
        return { data: policies };
    }
    async getMyAssignedPolicies(req) {
        const user = req.user;
        const policies = await this.policiesService.getAssignedPolicies(user.id, user.role);
        return { data: policies };
    }
    findOne(id) {
        return this.policiesService.findOne(id);
    }
    async getVersions(id) {
        const versions = await this.policiesService.findVersions(id);
        return { data: versions };
    }
    update(id, updatePolicyDto, req) {
        return this.policiesService.update(id, updatePolicyDto, req.user.id);
    }
    remove(id) {
        return this.policiesService.remove(id);
    }
    async uploadAttachment(id, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'policies');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex');
        const fileExtension = path.extname(file.originalname);
        const fileName = `${timestamp}-${randomString}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);
        if (file.path) {
            fs.renameSync(file.path, filePath);
        }
        else if (file.buffer) {
            fs.writeFileSync(filePath, file.buffer);
        }
        const policy = await this.policiesService.findOne(id);
        const attachments = policy.attachments || [];
        attachments.push({
            filename: file.originalname,
            path: `/uploads/policies/${fileName}`,
            upload_date: new Date().toISOString(),
            uploaded_by: req.user.id,
        });
        await this.policiesService.update(id, { attachments }, req.user.id);
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
    async downloadAttachment(filename, res) {
        const filePath = path.join(process.cwd(), 'uploads', 'policies', filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.BadRequestException('File not found');
        }
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.sendFile(path.resolve(filePath));
    }
    async getWorkflowExecutions(id) {
        const executions = await this.policiesService.getWorkflowExecutions(id);
        return { data: executions };
    }
    async getPendingApprovals(id, req) {
        const approvals = await this.policiesService.getPendingApprovals(id, req.user.id);
        return { data: approvals };
    }
    async publish(id, body, req) {
        const policy = await this.policiesService.publish(id, req.user.id, body.assign_to_user_ids, body.assign_to_role_ids, body.assign_to_business_unit_ids, body.notification_message);
        return { data: policy };
    }
    async initiateReview(id, body, req) {
        const reviewDate = new Date(body.review_date);
        const review = await this.policiesService.initiateReview(id, reviewDate, req.user.id);
        return { data: review };
    }
    async getReviewHistory(id) {
        const reviews = await this.policiesService.getReviewHistory(id);
        return { data: reviews };
    }
    async getActiveReview(id) {
        const review = await this.policiesService.getActiveReview(id);
        return { data: review };
    }
    async completeReview(reviewId, body, req) {
        const review = await this.policiesService.completeReview(reviewId, body.outcome, req.user.id, body.notes, body.review_summary, body.recommended_changes, body.next_review_date ? new Date(body.next_review_date) : undefined);
        return { data: review };
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_policy_dto_1.CreatePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [policy_query_dto_1.PolicyQueryDto]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics/publication'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy publication statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publication statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getPublicationStatistics", null);
__decorate([
    (0, common_1.Get)('reviews/due'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policies due for review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of policies due for review' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getPoliciesDueForReview", null);
__decorate([
    (0, common_1.Get)('reviews/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy review statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getReviewStatistics", null);
__decorate([
    (0, common_1.Get)('reviews/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policies pending review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of policies pending review' }),
    __param(0, (0, common_1.Query)('daysAhead')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getPendingReviews", null);
__decorate([
    (0, common_1.Get)('assigned/my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policies assigned to current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assigned policies' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getMyAssignedPolicies", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a policy by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getVersions", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_policy_dto_1.UpdatePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/attachments/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        dest: './uploads/policies',
        limits: { fileSize: 50 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
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
            }
            else {
                cb(new common_1.BadRequestException(`File type ${file.mimetype} is not allowed`), false);
            }
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "uploadAttachment", null);
__decorate([
    (0, common_1.Get)('attachments/download/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "downloadAttachment", null);
__decorate([
    (0, common_1.Get)(':id/workflows'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getWorkflowExecutions", null);
__decorate([
    (0, common_1.Get)(':id/workflows/pending-approvals'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a policy review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review initiated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "initiateReview", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review history for a policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getReviewHistory", null);
__decorate([
    (0, common_1.Get)(':id/reviews/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active review for a policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active review' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getActiveReview", null);
__decorate([
    (0, common_1.Patch)('reviews/:reviewId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a policy review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review completed successfully' }),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "completeReview", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map