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
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/v1/governance/influencers')
@UseGuards(JwtAuthGuard)
export class InfluencersController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInfluencerDto: CreateInfluencerDto, @Request() req) {
    return this.influencersService.create(createInfluencerDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: InfluencerQueryDto) {
    return this.influencersService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influencersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInfluencerDto: UpdateInfluencerDto, @Request() req) {
    return this.influencersService.update(id, updateInfluencerDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.influencersService.remove(id);
  }

  @Post(':id/upload-document')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/influencers',
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
      fileFilter: (req, file, cb) => {
        // Allow common document types
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
        } else {
          cb(new BadRequestException(`File type ${file.mimetype} is not allowed`), false);
        }
      },
    }),
  )
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'influencers');
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

    // Update influencer with document path
    const documentPath = `/uploads/influencers/${fileName}`;
    await this.influencersService.update(
      id,
      { source_document_path: documentPath } as any,
      req.user.id,
    );

    return {
      message: 'Document uploaded successfully',
      document_path: documentPath,
      filename: file.originalname,
    };
  }

  @Get('documents/download/:filename')
  async downloadDocument(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'influencers', filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(path.resolve(filePath));
  }
}

