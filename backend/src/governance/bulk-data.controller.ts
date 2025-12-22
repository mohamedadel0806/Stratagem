import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BulkDataService } from './services/bulk-data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditAction } from '../common/entities/audit-log.entity';
import { parse } from 'csv-parse/sync';

@ApiTags('Governance - Data Management')
@Controller('governance/data')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BulkDataController {
  constructor(private readonly bulkDataService: BulkDataService) {}

  @Post('import/:type')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Audit(AuditAction.IMPORT, 'GovernanceData')
  async importData(
    @Param('type') type: 'policies' | 'controls',
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    let items: any[] = [];
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      const csvContent = file.buffer.toString('utf-8');
      items = parse(csvContent, { columns: true, skip_empty_lines: true, trim: true });
    } else if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      items = JSON.parse(file.buffer.toString('utf-8'));
    } else {
      throw new BadRequestException('Unsupported file type. Please upload CSV or JSON.');
    }

    if (type === 'policies') {
      return this.bulkDataService.importPolicies(items, req.user.id);
    } else if (type === 'controls') {
      return this.bulkDataService.importControls(items, req.user.id);
    }
    
    throw new BadRequestException(`Invalid import type: ${type}`);
  }

  @Get('export/:type')
  @ApiOperation({ summary: 'Export governance data' })
  async exportData(@Query('type') type: 'policies' | 'controls' | 'influencers', @Res() res: Response) {
    const data = await this.bulkDataService.exportEntities(type);
    res.json(data);
  }
}


