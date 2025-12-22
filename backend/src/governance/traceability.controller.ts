import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TraceabilityService, TraceabilityGraph } from './services/traceability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Governance - Traceability')
@Controller('governance/traceability')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Get('graph')
  @ApiOperation({ summary: 'Get governance traceability graph' })
  async getGraph(
    @Query('rootId') rootId?: string,
    @Query('rootType') rootType?: string,
  ): Promise<TraceabilityGraph> {
    return this.traceabilityService.getTraceabilityGraph(rootId, rootType);
  }
}


