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
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { EvidenceLinkType } from './entities/evidence-linkage.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Controller('api/v1/governance/evidence')
@UseGuards(JwtAuthGuard)
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateEvidenceDto, @Request() req) {
    return this.evidenceService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.evidenceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateEvidenceDto>, @Request() req) {
    return this.evidenceService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.evidenceService.remove(id);
  }

  @Post(':id/link')
  @HttpCode(HttpStatus.CREATED)
  linkEvidence(
    @Param('id') evidenceId: string,
    @Body() body: { link_type: EvidenceLinkType; linked_entity_id: string; description?: string },
    @Request() req,
  ) {
    return this.evidenceService.linkEvidence(
      evidenceId,
      body.link_type,
      body.linked_entity_id,
      body.description,
      req.user.id,
    );
  }

  @Get('linked/:linkType/:linkedEntityId')
  getLinkedEvidence(@Param('linkType') linkType: EvidenceLinkType, @Param('linkedEntityId') linkedEntityId: string) {
    return this.evidenceService.getLinkedEvidence(linkType, linkedEntityId);
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/evidence',
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
      fileFilter: (req, file, cb) => {
        // Allow common document and image types
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'image/gif',
          'text/plain',
          'text/csv',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`File type ${file.mimetype} is not allowed`), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'evidence');
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
      // If using memory storage, write buffer to file
      fs.writeFileSync(filePath, file.buffer);
    }

    // Calculate file hash
    const fileBuffer = fs.readFileSync(filePath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Extract metadata from body if provided
    const metadata = body.metadata ? JSON.parse(body.metadata) : {};

    return {
      filename: fileName,
      originalName: file.originalname,
      file_path: `/uploads/evidence/${fileName}`,
      file_size: file.size,
      mime_type: file.mimetype,
      file_hash: fileHash,
      ...metadata,
    };
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'evidence', filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(path.resolve(filePath));
  }
}

