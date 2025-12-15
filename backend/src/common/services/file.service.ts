import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { UploadedFile } from '../entities/uploaded-file.entity';

/**
 * FileService: Manages file uploads, storage, and retrieval
 * Supports local file system storage with database metadata tracking
 */
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads';
  private readonly maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50MB default

  constructor(
    @InjectRepository(UploadedFile)
    private fileRepository: Repository<UploadedFile>,
  ) {
    this.ensureUploadDir();
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadedBy: string,
    options?: {
      category?: string;
      entityType?: string;
      entityId?: string;
      description?: string;
    },
  ): Promise<UploadedFile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    try {
      // Calculate checksum
      const checksum = this.calculateChecksum(file.buffer);

      // Generate unique filename
      const ext = path.extname(file.originalname);
      const storedName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(this.uploadDir, storedName);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Create database record
      const uploadedFile = this.fileRepository.create({
        originalName: file.originalname,
        storedName,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy,
        checksum,
        ...options,
      });

      const saved = await this.fileRepository.save(uploadedFile);
      this.logger.log(`File uploaded: ${file.originalname} -> ${storedName}`);
      return saved;
    } catch (error) {
      this.logger.error(`File upload failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Express.Multer.File[],
    uploadedBy: string,
    options?: {
      category?: string;
      entityType?: string;
      entityId?: string;
      description?: string;
    },
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, uploadedBy, options);
        results.push(result);
      } catch (error) {
        this.logger.warn(`Failed to upload file ${file.originalname}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<UploadedFile> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, isArchived: false },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return file;
  }

  /**
   * Get file content as buffer
   */
  async getFileContent(fileId: string): Promise<Buffer> {
    const file = await this.getFile(fileId);
    const filePath = path.join(this.uploadDir, file.storedName);

    try {
      return await fs.readFile(filePath);
    } catch (error) {
      this.logger.error(`Failed to read file: ${error.message}`);
      throw new InternalServerErrorException('Failed to read file');
    }
  }

  /**
   * Get files for an entity
   */
  async getEntityFiles(
    entityType: string,
    entityId: string,
    category?: string,
  ): Promise<UploadedFile[]> {
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

  /**
   * Get files uploaded by a user
   */
  async getUserFiles(userId: string, limit: number = 50): Promise<UploadedFile[]> {
    return this.fileRepository
      .createQueryBuilder('file')
      .where('file.uploadedBy = :userId', { userId })
      .andWhere('file.isArchived = :isArchived', { isArchived: false })
      .orderBy('file.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Delete a file (soft delete)
   */
  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFile(fileId);
    file.isArchived = true;
    await this.fileRepository.save(file);
    this.logger.log(`File archived: ${file.storedName}`);
  }

  /**
   * Permanently delete a file
   */
  async permanentlyDeleteFile(fileId: string): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    try {
      const filePath = path.join(this.uploadDir, file.storedName);
      await fs.unlink(filePath);
      await this.fileRepository.delete(file.id);
      this.logger.log(`File permanently deleted: ${file.storedName}`);
    } catch (error) {
      this.logger.error(`Failed to permanently delete file: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  /**
   * Verify file integrity using checksum
   */
  async verifyFileIntegrity(fileId: string): Promise<boolean> {
    const file = await this.getFile(fileId);
    const filePath = path.join(this.uploadDir, file.storedName);

    try {
      const content = await fs.readFile(filePath);
      const currentChecksum = this.calculateChecksum(content);
      return currentChecksum === file.checksum;
    } catch (error) {
      this.logger.error(`Failed to verify file integrity: ${error.message}`);
      return false;
    }
  }

  /**
   * Get file statistics
   */
  async getStatistics(): Promise<{
    totalFiles: number;
    totalSize: number;
    averageSize: number;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    const [files, stats] = await Promise.all([
      this.fileRepository.find({ where: { isArchived: false } }),
      this.fileRepository
        .createQueryBuilder('file')
        .where('file.isArchived = :isArchived', { isArchived: false })
        .select('COUNT(file.id)', 'count')
        .addSelect('SUM(file.fileSize)', 'totalSize')
        .getRawOne(),
    ]);

    const categoryMap: Record<string, number> = {};
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
      totalFiles: parseInt(stats?.count || '0'),
      totalSize: parseInt(stats?.totalSize || '0'),
      averageSize: parseInt(stats?.count || '0') > 0 ? Math.floor(parseInt(stats?.totalSize || '0') / parseInt(stats?.count || '0')) : 0,
      topCategories,
    };
  }

  /**
   * Clean up orphaned files (files not associated with any entity)
   */
  async cleanupOrphanedFiles(daysOld: number = 7): Promise<number> {
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
      } catch (error) {
        this.logger.warn(`Failed to delete orphaned file ${file.id}: ${error.message}`);
      }
    }

    return deleted;
  }

  /**
   * Calculate SHA256 checksum of file content
   */
  private calculateChecksum(content: Buffer | string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
