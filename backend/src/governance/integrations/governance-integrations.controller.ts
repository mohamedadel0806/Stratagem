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
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GovernanceIntegrationsService } from './governance-integrations.service';
import { CreateIntegrationHookDto } from './dto/create-hook.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Governance - Integrations')
@Controller('governance/integrations')
export class GovernanceIntegrationsController {
  constructor(private readonly integrationsService: GovernanceIntegrationsService) {}

  @Post('hooks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new integration hook' })
  create(@Body() dto: CreateIntegrationHookDto, @Request() req) {
    return this.integrationsService.createHook(dto, req.user.id);
  }

  @Get('hooks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all integration hooks' })
  findAll() {
    return this.integrationsService.findAll();
  }

  @Get('hooks/:id/logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent delivery logs for a hook' })
  getLogs(@Param('id') id: string) {
    return this.integrationsService.getLogs(id);
  }

  // PUBLIC WEBHOOK RECEIVER
  @Post('webhook/:secret')
  @Public() // Allow external systems without JWT
  @ApiOperation({ summary: 'Receive external webhook payload' })
  async handleWebhook(
    @Param('secret') secret: string,
    @Body() payload: any,
    @Request() req,
  ) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.integrationsService.handleWebhook(secret, payload, ip);
  }
}


