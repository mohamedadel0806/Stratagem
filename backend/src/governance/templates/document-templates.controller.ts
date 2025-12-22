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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentTemplatesService } from './document-templates.service';
import { CreateDocumentTemplateDto } from './dto/create-template.dto';
import { TemplateQueryDto } from './dto/template-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - Document Templates')
@Controller('governance/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentTemplatesController {
  constructor(private readonly templatesService: DocumentTemplatesService) { }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new document template' })
  @Audit(AuditAction.CREATE, 'DocumentTemplate')
  create(@Body() dto: CreateDocumentTemplateDto, @Request() req) {
    return this.templatesService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates with filtering' })
  findAll(@Query() query: TemplateQueryDto) {
    return this.templatesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update template' })
  @Audit(AuditAction.UPDATE, 'DocumentTemplate')
  update(@Param('id') id: string, @Body() dto: Partial<CreateDocumentTemplateDto>, @Request() req) {
    return this.templatesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete template' })
  @Audit(AuditAction.DELETE, 'DocumentTemplate')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}


