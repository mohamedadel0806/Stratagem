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
exports.InfluencersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const influencers_service_1 = require("./influencers.service");
const create_influencer_dto_1 = require("./dto/create-influencer.dto");
const update_influencer_dto_1 = require("./dto/update-influencer.dto");
const influencer_query_dto_1 = require("./dto/influencer-query.dto");
const review_influencer_dto_1 = require("./dto/review-influencer.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
const sync_1 = require("csv-parse/sync");
let InfluencersController = class InfluencersController {
    constructor(influencersService) {
        this.influencersService = influencersService;
    }
    create(createInfluencerDto, req) {
        return this.influencersService.create(createInfluencerDto, req.user.id);
    }
    findAll(queryDto) {
        return this.influencersService.findAll(queryDto);
    }
    findOne(id) {
        return this.influencersService.findOne(id);
    }
    update(id, updateInfluencerDto, req) {
        return this.influencersService.update(id, updateInfluencerDto, req.user.id);
    }
    remove(id) {
        return this.influencersService.remove(id);
    }
    async uploadDocument(id, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'influencers');
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
        const documentPath = `/uploads/influencers/${fileName}`;
        await this.influencersService.update(id, { source_document_path: documentPath }, req.user.id);
        return {
            message: 'Document uploaded successfully',
            document_path: documentPath,
            filename: file.originalname,
        };
    }
    async downloadDocument(filename, res) {
        const filePath = path.join(process.cwd(), 'uploads', 'influencers', filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.BadRequestException('File not found');
        }
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.sendFile(path.resolve(filePath));
    }
    async getAllTags() {
        return this.influencersService.getAllTags();
    }
    async getTagStatistics() {
        return this.influencersService.getTagStatistics();
    }
    async reviewInfluencer(id, reviewDto, req) {
        return this.influencersService.reviewInfluencer(id, {
            revision_notes: reviewDto.revision_notes,
            next_review_date: reviewDto.next_review_date ? new Date(reviewDto.next_review_date) : undefined,
            review_frequency_days: reviewDto.review_frequency_days,
            impact_assessment: reviewDto.impact_assessment,
        }, req.user.id);
    }
    async getRevisionHistory(id) {
        return this.influencersService.getRevisionHistory(id);
    }
    async importInfluencers(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        let items = [];
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            const csvContent = file.buffer.toString('utf-8');
            items = (0, sync_1.parse)(csvContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
        }
        else if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
            items = JSON.parse(file.buffer.toString('utf-8'));
        }
        else {
            throw new common_1.BadRequestException('Unsupported file type. Please upload CSV or JSON.');
        }
        return this.influencersService.bulkImport(items, req.user.id);
    }
};
exports.InfluencersController = InfluencersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'Influencer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_influencer_dto_1.CreateInfluencerDto, Object]),
    __metadata("design:returntype", void 0)
], InfluencersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [influencer_query_dto_1.InfluencerQueryDto]),
    __metadata("design:returntype", void 0)
], InfluencersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluencersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'Influencer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_influencer_dto_1.UpdateInfluencerDto, Object]),
    __metadata("design:returntype", void 0)
], InfluencersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'Influencer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluencersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-document'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'Influencer', { description: 'Uploaded document to influencer' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        dest: './uploads/influencers',
        limits: { fileSize: 50 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedMimes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
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
], InfluencersController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents/download/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "downloadDocument", null);
__decorate([
    (0, common_1.Get)('tags/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)('tags/statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "getTagStatistics", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.APPROVE, 'Influencer', { description: 'Reviewed influencer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_influencer_dto_1.ReviewInfluencerDto, Object]),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "reviewInfluencer", null);
__decorate([
    (0, common_1.Get)(':id/revisions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "getRevisionHistory", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.IMPORT, 'Influencer', { description: 'Bulk imported influencers' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfluencersController.prototype, "importInfluencers", null);
exports.InfluencersController = InfluencersController = __decorate([
    (0, common_1.Controller)('governance/influencers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [influencers_service_1.InfluencersService])
], InfluencersController);
//# sourceMappingURL=influencers.controller.js.map