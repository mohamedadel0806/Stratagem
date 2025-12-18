import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GlobalAssetSearchService } from '../services/global-asset-search.service';
import {
  GlobalAssetSearchQueryDto,
  GlobalAssetSearchResponseDto,
} from '../dto/global-asset-search.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GlobalAssetSearchController {
  constructor(private readonly globalAssetSearchService: GlobalAssetSearchService) {}

  @Get('search')
  @ApiOperation({ summary: 'Global search across all asset types' })
  @ApiResponse({
    status: 200,
    description: 'Search results across all asset types',
    type: GlobalAssetSearchResponseDto,
  })
  @ApiQuery({ name: 'q', required: false, description: 'Search query string' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by asset type', enum: ['physical', 'information', 'application', 'software', 'supplier', 'all'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'criticality', required: false, description: 'Filter by criticality level' })
  @ApiQuery({ name: 'businessUnit', required: false, description: 'Filter by business unit' })
  async search(@Query() query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto> {
    return this.globalAssetSearchService.search(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets (unified view)' })
  @ApiResponse({
    status: 200,
    description: 'List of all assets across all types',
    type: GlobalAssetSearchResponseDto,
  })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by asset type', enum: ['physical', 'information', 'application', 'software', 'supplier', 'all'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'criticality', required: false, description: 'Filter by criticality level' })
  @ApiQuery({ name: 'businessUnit', required: false, description: 'Filter by business unit' })
  async findAll(@Query() query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto> {
    // Use the same search service but without search term
    return this.globalAssetSearchService.search({
      ...query,
      q: undefined, // No search term for unified view
    });
  }
}









