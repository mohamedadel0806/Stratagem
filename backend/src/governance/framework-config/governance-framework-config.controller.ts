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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GovernanceFrameworkConfigService } from './governance-framework-config.service';
import { CreateGovernanceFrameworkConfigDto } from './dto/create-governance-framework-config.dto';
import { UpdateGovernanceFrameworkConfigDto } from './dto/update-governance-framework-config.dto';
import { GovernanceFrameworkConfigQueryDto } from './dto/governance-framework-config-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('governance')
@Controller('governance/framework-configs')
@UseGuards(JwtAuthGuard)
export class GovernanceFrameworkConfigController {
  constructor(
    private readonly frameworkConfigService: GovernanceFrameworkConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Create a new governance framework configuration' })
  @ApiResponse({
    status: 201,
    description: 'Framework configuration created successfully',
  })
  create(
    @Body() createFrameworkConfigDto: CreateGovernanceFrameworkConfigDto,
    @Request() req,
  ) {
    return this.frameworkConfigService.create(
      createFrameworkConfigDto,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all governance framework configurations with filtering',
  })
  @ApiResponse({ status: 200, description: 'List of framework configurations' })
  findAll(@Query() queryDto: GovernanceFrameworkConfigQueryDto) {
    return this.frameworkConfigService.findAll(queryDto);
  }

  @Get('by-type/:framework_type')
  @ApiOperation({
    summary: 'Get all framework configurations by framework type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of framework configurations by type',
  })
  findByFrameworkType(@Param('framework_type') frameworkType: string) {
    return this.frameworkConfigService.findByFrameworkType(frameworkType);
  }

  @Get('active/all')
  @ApiOperation({ summary: 'Get all active framework configurations' })
  @ApiResponse({
    status: 200,
    description: 'List of active framework configurations',
  })
  findActiveConfigs() {
    return this.frameworkConfigService.findActiveConfigs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a framework configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Framework configuration details',
  })
  findOne(@Param('id') id: string) {
    return this.frameworkConfigService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Update a framework configuration' })
  @ApiResponse({
    status: 200,
    description: 'Framework configuration updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateFrameworkConfigDto: UpdateGovernanceFrameworkConfigDto,
    @Request() req,
  ) {
    return this.frameworkConfigService.update(
      id,
      updateFrameworkConfigDto,
      req.user.id,
    );
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.UPDATE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Activate a framework configuration' })
  @ApiResponse({ status: 200, description: 'Configuration activated' })
  activate(@Param('id') id: string, @Request() req) {
    return this.frameworkConfigService.activate(id, req.user.id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @Audit(AuditAction.UPDATE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Deactivate a framework configuration' })
  @ApiResponse({ status: 200, description: 'Configuration deactivated' })
  deactivate(@Param('id') id: string, @Request() req) {
    return this.frameworkConfigService.deactivate(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit(AuditAction.DELETE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Soft delete a framework configuration' })
  @ApiResponse({ status: 204, description: 'Configuration deleted' })
  remove(@Param('id') id: string) {
    return this.frameworkConfigService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit(AuditAction.DELETE, 'GovernanceFrameworkConfig')
  @ApiOperation({ summary: 'Hard delete a framework configuration' })
  @ApiResponse({ status: 204, description: 'Configuration hard deleted' })
  hardDelete(@Param('id') id: string) {
    return this.frameworkConfigService.hardDelete(id);
  }
}
