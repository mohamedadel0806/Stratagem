import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowTriggerRulesService } from '../services/workflow-trigger-rules.service';
import { CreateWorkflowTriggerRuleDto } from '../dto/create-trigger-rule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('Workflow Rules')
@Controller('workflows/rules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkflowTriggerRulesController {
  constructor(private readonly rulesService: WorkflowTriggerRulesService) { }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a workflow trigger rule' })
  create(@Body() dto: CreateWorkflowTriggerRuleDto, @Request() req) {
    return this.rulesService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflow rules' })
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow rule by ID' })
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update workflow rule' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateWorkflowTriggerRuleDto>, @Request() req) {
    return this.rulesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete workflow rule' })
  remove(@Param('id') id: string) {
    return this.rulesService.remove(id);
  }
}


