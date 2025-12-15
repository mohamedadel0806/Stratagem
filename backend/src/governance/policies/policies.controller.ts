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
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/v1/governance/policies')
@UseGuards(JwtAuthGuard)
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPolicyDto: CreatePolicyDto, @Request() req) {
    return this.policiesService.create(createPolicyDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: PolicyQueryDto) {
    return this.policiesService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Get(':id/versions')
  async getVersions(@Param('id') id: string) {
    const versions = await this.policiesService.findVersions(id);
    return { data: versions };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto, @Request() req) {
    return this.policiesService.update(id, updatePolicyDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }

  @Post(':id/attachments/upload')
  @HttpCode(HttpStatus.CREATED)
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
}

