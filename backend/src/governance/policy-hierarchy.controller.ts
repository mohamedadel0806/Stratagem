import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PolicyHierarchyService, HierarchyNode } from './services/policy-hierarchy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Governance - Hierarchy')
@Controller('governance/hierarchy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PolicyHierarchyController {
  constructor(private readonly hierarchyService: PolicyHierarchyService) {}

  @Get('policy')
  @ApiOperation({ summary: 'Get policy framework hierarchy' })
  async getPolicyHierarchy(): Promise<HierarchyNode[]> {
    return this.hierarchyService.getPolicyHierarchy();
  }
}


