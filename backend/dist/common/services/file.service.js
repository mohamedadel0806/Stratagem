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
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const uploaded_file_entity_1 = require("../entities/uploaded-file.entity");
let FileService = FileService_1 = class FileService {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.logger = new common_1.Logger(FileService_1.name);
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '52428800');
        this.ensureUploadDir();
    }
    async ensureUploadDir() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
        catch (error) {
            this.logger.error(`Failed to create upload directory: ${error.message}`);
        }
    }
    async uploadFile(file, uploadedBy, options) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
        }
        try {
            const checksum = this.calculateChecksum(file.buffer);
            const ext = path.extname(file.originalname);
            const storedName = `${crypto.randomUUID()}${ext}`;
            const filePath = path.join(this.uploadDir, storedName);
            await fs.writeFile(filePath, file.buffer);
            const uploadedFile = this.fileRepository.create(Object.assign({ originalName: file.originalname, storedName, mimeType: file.mimetype, fileSize: file.size, uploadedBy,
                checksum }, options));
            const saved = await this.fileRepository.save(uploadedFile);
            this.logger.log(`File uploaded: ${file.originalname} -> ${storedName}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`File upload failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('File upload failed');
        }
    }
    async uploadFiles(files, uploadedBy, options) {
        const results = [];
        for (const file of files) {
            try {
                const result = await this.uploadFile(file, uploadedBy, options);
                results.push(result);
            }
            catch (error) {
                this.logger.warn(`Failed to upload file ${file.originalname}: ${error.message}`);
            }
        }
        return results;
    }
    async getFile(fileId) {
        const file = await this.fileRepository.findOne({
            where: { id: fileId, isArchived: false },
        });
        if (!file) {
            throw new common_1.BadRequestException('File not found');
        }
        return file;
    }
    async getFileContent(fileId) {
        const file = await this.getFile(fileId);
        const filePath = path.join(this.uploadDir, file.storedName);
        try {
            return await fs.readFile(filePath);
        }
        catch (error) {
            this.logger.error(`Failed to read file: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to read file');
        }
    }
    async getEntityFiles(entityType, entityId, category) {
        const query = this.fileRepository
            .createQueryBuilder('file')
            .where('file.entityType = :entityType', { entityType })
            .andWhere('file.entityId = :entityId', { entityId })
            .andWhere('file.isArchived = :isArchived', { isArchived: false });
        if (category) {
            query.andWhere('file.category = :category', { category });
        }
        return query.orderBy('file.createdAt', 'DESC').getMany();
    }
    async getUserFiles(userId, limit = 50) {
        return this.fileRepository
            .createQueryBuilder('file')
            .where('file.uploadedBy = :userId', { userId })
            .andWhere('file.isArchived = :isArchived', { isArchived: false })
            .orderBy('file.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }
    async deleteFile(fileId) {
        const file = await this.getFile(fileId);
        file.isArchived = true;
        await this.fileRepository.save(file);
        this.logger.log(`File archived: ${file.storedName}`);
    }
    async permanentlyDeleteFile(fileId) {
        const file = await this.fileRepository.findOne({ where: { id: fileId } });
        if (!file) {
            throw new common_1.BadRequestException('File not found');
        }
        try {
            const filePath = path.join(this.uploadDir, file.storedName);
            await fs.unlink(filePath);
            await this.fileRepository.delete(file.id);
            this.logger.log(`File permanently deleted: ${file.storedName}`);
        }
        catch (error) {
            this.logger.error(`Failed to permanently delete file: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to delete file');
        }
    }
    async verifyFileIntegrity(fileId) {
        const file = await this.getFile(fileId);
        const filePath = path.join(this.uploadDir, file.storedName);
        try {
            const content = await fs.readFile(filePath);
            const currentChecksum = this.calculateChecksum(content);
            return currentChecksum === file.checksum;
        }
        catch (error) {
            this.logger.error(`Failed to verify file integrity: ${error.message}`);
            return false;
        }
    }
    async getStatistics() {
        const [files, stats] = await Promise.all([
            this.fileRepository.find({ where: { isArchived: false } }),
            this.fileRepository
                .createQueryBuilder('file')
                .where('file.isArchived = :isArchived', { isArchived: false })
                .select('COUNT(file.id)', 'count')
                .addSelect('SUM(file.fileSize)', 'totalSize')
                .getRawOne(),
        ]);
        const categoryMap = {};
        files.forEach(file => {
            if (file.category) {
                categoryMap[file.category] = (categoryMap[file.category] || 0) + 1;
            }
        });
        const topCategories = Object.entries(categoryMap)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        return {
            totalFiles: parseInt((stats === null || stats === void 0 ? void 0 : stats.count) || '0'),
            totalSize: parseInt((stats === null || stats === void 0 ? void 0 : stats.totalSize) || '0'),
            averageSize: parseInt((stats === null || stats === void 0 ? void 0 : stats.count) || '0') > 0 ? Math.floor(parseInt((stats === null || stats === void 0 ? void 0 : stats.totalSize) || '0') / parseInt((stats === null || stats === void 0 ? void 0 : stats.count) || '0')) : 0,
            topCategories,
        };
    }
    async cleanupOrphanedFiles(daysOld = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const orphaned = await this.fileRepository
            .createQueryBuilder('file')
            .where('file.entityId IS NULL')
            .andWhere('file.createdAt < :cutoffDate', { cutoffDate })
            .getMany();
        let deleted = 0;
        for (const file of orphaned) {
            try {
                await this.permanentlyDeleteFile(file.id);
                deleted++;
            }
            catch (error) {
                this.logger.warn(`Failed to delete orphaned file ${file.id}: ${error.message}`);
            }
        }
        return deleted;
    }
    calculateChecksum(content) {
        return crypto.createHash('sha256').update(content).digest('hex');
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uploaded_file_entity_1.UploadedFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FileService);
//# sourceMappingURL=file.service.js.map