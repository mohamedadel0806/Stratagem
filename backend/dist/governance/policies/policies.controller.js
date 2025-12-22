"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const swagger_1 = require("@nestjs/swagger");
const policies_service_1 = require("./policies.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const update_policy_dto_1 = require("./dto/update-policy.dto");
const policy_query_dto_1 = require("./dto/policy-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
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
    async getAllHierarchies(includeArchived) {
        const result = await this.policiesService.getAllHierarchies(includeArchived === 'true');
        return { data: result };
    }
    async getRootPolicies(includeArchived) {
        const result = await this.policiesService.getRootPolicies(includeArchived === 'true');
        return { data: result };
    }
    async getCompleteHierarchy(id) {
        const result = await this.policiesService.getCompleteHierarchy(id);
        return { data: result };
    }
    async getHierarchyTree(id, includeArchived) {
        const result = await this.policiesService.getHierarchyTree(id, includeArchived === 'true');
        return { data: result };
    }
    async getParent(id) {
        const result = await this.policiesService.getParent(id);
        return { data: result };
    }
    async getChildren(id, includeArchived) {
        const result = await this.policiesService.getChildren(id, includeArchived === 'true');
        return { data: result };
    }
    async getAncestors(id) {
        const result = await this.policiesService.getAncestors(id);
        return { data: result };
    }
    async getDescendants(id) {
        const result = await this.policiesService.getAllDescendants(id);
        return { data: result };
    }
    async getHierarchyLevel(id) {
        const level = await this.policiesService.getHierarchyLevel(id);
        return { data: { level } };
    }
    async getRoot(id) {
        const result = await this.policiesService.getRoot(id);
        return { data: result };
    }
    async setParentPolicy(id, body, req) {
        var _a;
        const result = await this.policiesService.setParentPolicy(id, (_a = body.parent_policy_id) !== null && _a !== void 0 ? _a : null, req.user.id, body.reason);
        return { data: result };
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'Policy'),
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
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'Policy'),
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
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'Policy'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/attachments/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'Policy', { description: 'Uploaded attachment to policy' }),
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
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.PUBLISH, 'Policy'),
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
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.APPROVE, 'Policy', { description: 'Initiated policy review' }),
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
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.APPROVE, 'Policy', { description: 'Completed policy review' }),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "completeReview", null);
__decorate([
    (0, common_1.Get)('hierarchy/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policy hierarchies (root policies with trees)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of policy hierarchies' }),
    __param(0, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getAllHierarchies", null);
__decorate([
    (0, common_1.Get)('hierarchy/roots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get root policies (policies with no parents)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of root policies' }),
    __param(0, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getRootPolicies", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete hierarchy information for a policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complete hierarchy information' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getCompleteHierarchy", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hierarchy tree for a policy (parent and all descendants)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hierarchy tree structure' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getHierarchyTree", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get parent policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent policy or null if root' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getParent", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/children'),
    (0, swagger_1.ApiOperation)({ summary: 'Get immediate child policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of child policies' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getChildren", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/ancestors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ancestor policies (up to root)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ancestor policies' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getAncestors", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/descendants'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all descendant policies (all children, grandchildren, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of descendant policies' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getDescendants", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/level'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hierarchy level of a policy (0 for root)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hierarchy level number' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getHierarchyLevel", null);
__decorate([
    (0, common_1.Get)(':id/hierarchy/root'),
    (0, swagger_1.ApiOperation)({ summary: 'Get root policy of the hierarchy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Root policy' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Patch)(':id/hierarchy/parent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'Policy Hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Set or update parent policy' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "setParentPolicy", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map