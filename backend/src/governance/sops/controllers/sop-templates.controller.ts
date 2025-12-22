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
} from '@nestjs/common';
import { SOPTemplatesService } from '../services/sop-templates.service';
import { CreateSOPTemplateDto, UpdateSOPTemplateDto, SOPTemplateQueryDto } from '../dto/sop-template.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditAction } from '../../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Templates')
@Controller('governance/sops/templates')
@UseGuards(JwtAuthGuard)
export class SOPTemplatesController {
  constructor(private readonly templatesService: SOPTemplatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOP template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @Audit(AuditAction.CREATE, 'SOP_TEMPLATE')
  create(@Body() createDto: CreateSOPTemplateDto, @Request() req) {
    return this.templatesService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP templates' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  findAll(@Query() queryDto: SOPTemplateQueryDto) {
    return this.templatesService.findAll(queryDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active SOP templates' })
  @ApiResponse({ status: 200, description: 'List of active templates' })
  getActive() {
    return this.templatesService.getActiveTemplates();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get templates by category' })
  @ApiResponse({ status: 200, description: 'Templates in category' })
  getByCategory(@Param('category') category: string) {
    return this.templatesService.getTemplatesByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by ID' })
  @ApiResponse({ status: 200, description: 'Template details' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_TEMPLATE')
  update(@Param('id') id: string, @Body() updateDto: UpdateSOPTemplateDto, @Request() req) {
    return this.templatesService.update(id, updateDto, req.user.id);
  }

  @Post(':id/clone')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Clone a template' })
  @ApiResponse({ status: 201, description: 'Template cloned successfully' })
  @Audit(AuditAction.CREATE, 'SOP_TEMPLATE')
  clone(
    @Param('id') id: string,
    @Body() body: { new_key: string },
    @Request() req,
  ) {
    return this.templatesService.cloneTemplate(id, body.new_key, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a template' })
  @ApiResponse({ status: 204, description: 'Template deleted successfully' })
  @Audit(AuditAction.DELETE, 'SOP_TEMPLATE')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
