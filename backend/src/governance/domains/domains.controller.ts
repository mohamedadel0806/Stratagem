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
  Query,
} from '@nestjs/common';
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@Controller('governance/domains')
@UseGuards(JwtAuthGuard)
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  @Audit(AuditAction.CREATE, 'ControlDomain')
  create(@Body() createDomainDto: CreateDomainDto, @Request() req) {
    return this.domainsService.create(createDomainDto, req.user.id);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.domainsService.findAll(includeInactive === 'true');
  }

  @Get('hierarchy')
  findHierarchy() {
    return this.domainsService.findHierarchy();
  }

  @Get('statistics')
  getStatistics() {
    return this.domainsService.getDomainStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domainsService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, 'ControlDomain')
  update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto, @Request() req) {
    return this.domainsService.update(id, updateDomainDto, req.user.id);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, 'ControlDomain')
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }
}


