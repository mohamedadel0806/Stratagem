import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PolicyExceptionsService } from './policy-exceptions.service';
import { CreatePolicyExceptionDto } from './dto/create-policy-exception.dto';
import { UpdatePolicyExceptionDto } from './dto/update-policy-exception.dto';
import { QueryPolicyExceptionDto } from './dto/query-policy-exception.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - Policy Exceptions')
@Controller('governance/policy-exceptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PolicyExceptionsController {
  constructor(private readonly exceptionsService: PolicyExceptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a policy exception request' })
  @ApiResponse({ status: 201, description: 'Exception created successfully' })
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'PolicyException')
  create(@Body() createPolicyExceptionDto: CreatePolicyExceptionDto, @Request() req) {
    return this.exceptionsService.create(createPolicyExceptionDto, req.user.id, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policy exceptions' })
  @ApiResponse({ status: 200, description: 'List of exceptions' })
  async findAll(@Query() query: QueryPolicyExceptionDto) {
    return this.exceptionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a policy exception by ID' })
  @ApiResponse({ status: 200, description: 'Exception details' })
  async findOne(@Param('id') id: string) {
    return this.exceptionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a policy exception' })
  @ApiResponse({ status: 200, description: 'Exception updated successfully' })
  @Audit(AuditAction.UPDATE, 'PolicyException')
  async update(@Param('id') id: string, @Body() dto: UpdatePolicyExceptionDto, @Request() req) {
    return this.exceptionsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Delete a policy exception' })
  @ApiResponse({ status: 200, description: 'Exception deleted successfully' })
  @Audit(AuditAction.DELETE, 'PolicyException')
  async delete(@Param('id') id: string) {
    await this.exceptionsService.delete(id);
    return { message: 'Exception deleted successfully' };
  }

  @Post(':id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Approve a policy exception' })
  @ApiResponse({ status: 200, description: 'Exception approved successfully' })
  @Audit(AuditAction.APPROVE, 'PolicyException')
  async approve(
    @Param('id') id: string,
    @Body() body: { conditions?: string },
    @Request() req,
  ) {
    return this.exceptionsService.approve(id, req.user.id, body.conditions);
  }

  @Post(':id/reject')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Reject a policy exception' })
  @ApiResponse({ status: 200, description: 'Exception rejected successfully' })
  @Audit(AuditAction.REJECT, 'PolicyException')
  async reject(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.exceptionsService.reject(id, req.user.id, body.reason);
  }
}


