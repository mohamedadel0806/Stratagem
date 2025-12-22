import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FrameworksService } from './frameworks.service';
import { CreateFrameworkVersionDto } from './dto/create-framework-version.dto';
import { ImportFrameworkStructureDto } from './dto/import-framework-structure.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';
import { parse } from 'csv-parse/sync';

@Controller('governance/frameworks')
@UseGuards(JwtAuthGuard)
export class FrameworksController {
  constructor(private readonly frameworksService: FrameworksService) {}

  @Post(':id/versions')
  @Audit(AuditAction.CREATE, 'FrameworkVersion', { description: 'Created new framework version' })
  createVersion(
    @Param('id') id: string,
    @Body() createDto: CreateFrameworkVersionDto,
    @Request() req,
  ) {
    return this.frameworksService.createVersion(id, createDto, req.user.id);
  }

  @Get(':id/versions')
  getVersions(@Param('id') id: string) {
    return this.frameworksService.getVersions(id);
  }

  @Get(':id/versions/:version')
  getVersion(@Param('id') id: string, @Param('version') version: string) {
    return this.frameworksService.getVersion(id, version);
  }

  @Post(':id/versions/:version/set-current')
  @Audit(AuditAction.APPROVE, 'FrameworkVersion', { description: 'Set current framework version' })
  setCurrentVersion(
    @Param('id') id: string,
    @Param('version') version: string,
    @Request() req,
  ) {
    return this.frameworksService.setCurrentVersion(id, version, req.user.id);
  }

  @Post(':id/import-structure')
  @Audit(AuditAction.IMPORT, 'ComplianceFramework', { description: 'Imported framework structure' })
  importStructure(
    @Param('id') id: string,
    @Body() importDto: Omit<ImportFrameworkStructureDto, 'framework_id'>,
    @Request() req,
  ) {
    return this.frameworksService.importFrameworkStructure(
      { ...importDto, framework_id: id },
      req.user.id,
    );
  }

  @Post(':id/import-structure-file')
  @UseInterceptors(FileInterceptor('file'))
  @Audit(AuditAction.IMPORT, 'ComplianceFramework', { description: 'Imported framework structure from file' })
  async importStructureFromFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { version?: string; create_version?: string; replace_existing?: string },
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Parse JSON file
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      const structure = JSON.parse(file.buffer.toString('utf-8'));
      return this.frameworksService.importFrameworkStructure(
        {
          framework_id: id,
          structure,
          version: body.version,
          create_version: body.create_version === 'true',
          replace_existing: body.replace_existing === 'true',
        },
        req.user.id,
      );
    }

    // Parse CSV file (basic structure)
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      const structure = await this.parseCSVToStructure(file.buffer);
      return this.frameworksService.importFrameworkStructure(
        {
          framework_id: id,
          structure,
          version: body.version,
          create_version: body.create_version === 'true',
          replace_existing: body.replace_existing === 'true',
        },
        req.user.id,
      );
    }

    throw new BadRequestException('Unsupported file type. Please upload JSON or CSV.');
  }

  @Get(':id/structure')
  getFrameworkWithStructure(@Param('id') id: string) {
    return this.frameworksService.getFrameworkWithStructure(id);
  }

  private async parseCSVToStructure(buffer: Buffer): Promise<{
    domains: Array<{
      name: string;
      categories: Array<{
        name: string;
        requirements: Array<{
          identifier: string;
          title: string;
          text: string;
        }>;
      }>;
    }>;
  }> {
    const csvContent = buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    }) as any[];

    const domains = new Map<string, Map<string, Array<{ identifier: string; title: string; text: string }>>>();

    for (const row of records) {
      const domain = row.domain || row.Domain || 'Default';
      const category = row.category || row.Category || 'Default';
      const identifier = row.identifier || row.Identifier || row.id || '';
      const title = row.title || row.Title || '';
      const text = row.text || row.Text || row.description || row.Description || '';

      if (!domains.has(domain)) {
        domains.set(domain, new Map());
      }

      const categories = domains.get(domain)!;
      if (!categories.has(category)) {
        categories.set(category, []);
      }

      categories.get(category)!.push({ identifier, title, text });
    }

    return {
      domains: Array.from(domains.entries()).map(([domainName, categories]) => ({
        name: domainName,
        categories: Array.from(categories.entries()).map(([categoryName, requirements]) => ({
          name: categoryName,
          requirements,
        })),
      })),
    };
  }
}


