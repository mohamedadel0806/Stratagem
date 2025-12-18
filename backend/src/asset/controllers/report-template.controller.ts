import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReportTemplateService } from '../services/report-template.service';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { UpdateReportTemplateDto } from '../dto/update-report-template.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('assets')
@Controller('assets/report-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportTemplateController {
  constructor(private readonly reportTemplateService: ReportTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report template' })
  async create(@Body() dto: CreateReportTemplateDto, @Request() req: any) {
    return this.reportTemplateService.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all report templates' })
  async findAll(@Request() req: any) {
    try {
      return await this.reportTemplateService.findAll(req.user?.id);
    } catch (error: any) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report template by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportTemplateService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a report template' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReportTemplateDto & { versionComment?: string },
    @Request() req: any,
  ) {
    return this.reportTemplateService.update(id, dto, req.user?.id, dto.versionComment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report template' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.reportTemplateService.delete(id);
    return { message: 'Report template deleted successfully' };
  }

  @Post(':id/generate')
  @ApiOperation({ summary: 'Generate and download a report from a template' })
  @ApiResponse({ status: 200, description: 'Report file downloaded' })
  async generateReport(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const { buffer, filename, contentType } = await this.reportTemplateService.generateReport(id);
      
      // Ensure buffer is a proper Buffer instance
      const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
      
      // Set headers before sending
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      
      // Send the buffer
      res.send(fileBuffer);
    } catch (error: any) {
      // Log full error for debugging
      console.error('Error generating report:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        id,
      });
      
      // Return proper error response
      if (!res.headersSent) {
        res.status(error.status || 500).json({
          statusCode: error.status || 500,
          message: error.message || 'Failed to generate report',
          error: error.name || 'Internal Server Error',
        });
      }
    }
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Preview report data without downloading' })
  @ApiResponse({ status: 200, description: 'Report data preview' })
  async previewReport(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const data = await this.reportTemplateService.previewReport(id);
      return {
        data,
        count: data.length,
      };
    } catch (error: any) {
      console.error('Error previewing report:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        id,
      });
      throw error;
    }
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get version history for a template' })
  @ApiResponse({ status: 200, description: 'List of template versions' })
  async getVersionHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportTemplateService.getVersionHistory(id);
  }

  @Post(':id/versions/:versionId/restore')
  @ApiOperation({ summary: 'Restore a template to a previous version' })
  @ApiResponse({ status: 200, description: 'Template restored successfully' })
  async restoreVersion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
    @Request() req: any,
  ) {
    const restored = await this.reportTemplateService.restoreVersion(id, versionId, req.user?.id);
    return {
      message: 'Template restored successfully',
      template: restored,
    };
  }

  @Put(':id/sharing')
  @ApiOperation({ summary: 'Update template sharing settings' })
  @ApiResponse({ status: 200, description: 'Sharing settings updated' })
  async updateSharing(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() sharingDto: {
      isShared?: boolean;
      sharedWithUserIds?: string[];
      sharedWithTeamIds?: string[];
      isOrganizationWide?: boolean;
    },
    @Request() req: any,
  ) {
    const template = await this.reportTemplateService.findOne(id);
    
    // Only owner can update sharing
    if (template.createdById !== req.user?.id) {
      throw new BadRequestException('Only template owner can update sharing settings');
    }

    const updateDto: any = {};
    if (sharingDto.isShared !== undefined) {
      updateDto.isShared = sharingDto.isShared;
    }
    if (sharingDto.sharedWithUserIds !== undefined) {
      updateDto.sharedWithUserIds = sharingDto.sharedWithUserIds;
    }
    if (sharingDto.sharedWithTeamIds !== undefined) {
      updateDto.sharedWithTeamIds = sharingDto.sharedWithTeamIds;
    }
    if (sharingDto.isOrganizationWide !== undefined) {
      updateDto.isOrganizationWide = sharingDto.isOrganizationWide;
    }

    return this.reportTemplateService.update(id, updateDto, req.user?.id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Manually trigger a scheduled report' })
  async sendReport(@Param('id', ParseUUIDPipe) id: string) {
    await this.reportTemplateService.sendScheduledReport(id);
    return { message: 'Report sent successfully' };
  }
}

