import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Query,
  Res,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from '../services/file.service';
import { UploadedFile as FileEntity } from '../entities/uploaded-file.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

/**
 * FileUploadController: API endpoints for file management
 * Handles uploads, downloads, and file metadata operations
 */
@ApiTags('File Management')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class FileUploadController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Upload a single file
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single file' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @CurrentUser() user,
  ): Promise<FileEntity> {
    return this.fileService.uploadFile(file, user.userId, {
      category: body.category,
      entityType: body.entityType,
      entityId: body.entityId,
      description: body.description,
    });
  }

  /**
   * Upload multiple files
   */
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple files' })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @CurrentUser() user,
  ): Promise<FileEntity[]> {
    return this.fileService.uploadFiles(files, user.userId, {
      category: body.category,
      entityType: body.entityType,
      entityId: body.entityId,
      description: body.description,
    });
  }

  /**
   * Get file metadata
   */
  @Get(':fileId')
  @ApiOperation({ summary: 'Get file metadata' })
  async getFile(@Param('fileId') fileId: string): Promise<FileEntity> {
    return this.fileService.getFile(fileId);
  }

  /**
   * Download file
   */
  @Get(':fileId/download')
  @ApiOperation({ summary: 'Download file' })
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.fileService.getFile(fileId);
    const content = await this.fileService.getFileContent(fileId);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(content);
  }

  /**
   * Get files for an entity
   */
  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get files for an entity' })
  async getEntityFiles(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('category') category?: string,
  ): Promise<FileEntity[]> {
    return this.fileService.getEntityFiles(entityType, entityId, category);
  }

  /**
   * Get user's uploaded files
   */
  @Get('user/my-files')
  @ApiOperation({ summary: "Get user's uploaded files" })
  async getUserFiles(
    @CurrentUser() user,
    @Query('limit') limit: string = '50',
  ): Promise<FileEntity[]> {
    return this.fileService.getUserFiles(user.userId, parseInt(limit));
  }

  /**
   * Delete file (soft delete)
   */
  @Delete(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete file (soft delete)' })
  async deleteFile(@Param('fileId') fileId: string): Promise<void> {
    await this.fileService.deleteFile(fileId);
  }

  /**
   * Verify file integrity
   */
  @Get(':fileId/verify')
  @ApiOperation({ summary: 'Verify file integrity' })
  async verifyFileIntegrity(@Param('fileId') fileId: string): Promise<{ valid: boolean }> {
    const valid = await this.fileService.verifyFileIntegrity(fileId);
    return { valid };
  }

  /**
   * Get file statistics
   */
  @Get('stats/summary')
  @ApiOperation({ summary: 'Get file statistics' })
  async getStatistics(): Promise<any> {
    return this.fileService.getStatistics();
  }
}
