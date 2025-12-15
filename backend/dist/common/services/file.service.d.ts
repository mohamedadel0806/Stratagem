import { Repository } from 'typeorm';
import { UploadedFile } from '../entities/uploaded-file.entity';
export declare class FileService {
    private fileRepository;
    private readonly logger;
    private readonly uploadDir;
    private readonly maxFileSize;
    constructor(fileRepository: Repository<UploadedFile>);
    private ensureUploadDir;
    uploadFile(file: Express.Multer.File, uploadedBy: string, options?: {
        category?: string;
        entityType?: string;
        entityId?: string;
        description?: string;
    }): Promise<UploadedFile>;
    uploadFiles(files: Express.Multer.File[], uploadedBy: string, options?: {
        category?: string;
        entityType?: string;
        entityId?: string;
        description?: string;
    }): Promise<UploadedFile[]>;
    getFile(fileId: string): Promise<UploadedFile>;
    getFileContent(fileId: string): Promise<Buffer>;
    getEntityFiles(entityType: string, entityId: string, category?: string): Promise<UploadedFile[]>;
    getUserFiles(userId: string, limit?: number): Promise<UploadedFile[]>;
    deleteFile(fileId: string): Promise<void>;
    permanentlyDeleteFile(fileId: string): Promise<void>;
    verifyFileIntegrity(fileId: string): Promise<boolean>;
    getStatistics(): Promise<{
        totalFiles: number;
        totalSize: number;
        averageSize: number;
        topCategories: Array<{
            category: string;
            count: number;
        }>;
    }>;
    cleanupOrphanedFiles(daysOld?: number): Promise<number>;
    private calculateChecksum;
}
