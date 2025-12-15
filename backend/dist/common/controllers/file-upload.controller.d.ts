import { Response } from 'express';
import { FileService } from '../services/file.service';
import { UploadedFile as FileEntity } from '../entities/uploaded-file.entity';
export declare class FileUploadController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, body: any, user: any): Promise<FileEntity>;
    uploadFiles(files: Express.Multer.File[], body: any, user: any): Promise<FileEntity[]>;
    getFile(fileId: string): Promise<FileEntity>;
    downloadFile(fileId: string, res: Response): Promise<void>;
    getEntityFiles(entityType: string, entityId: string, category?: string): Promise<FileEntity[]>;
    getUserFiles(user: any, limit?: string): Promise<FileEntity[]>;
    deleteFile(fileId: string): Promise<void>;
    verifyFileIntegrity(fileId: string): Promise<{
        valid: boolean;
    }>;
    getStatistics(): Promise<any>;
}
