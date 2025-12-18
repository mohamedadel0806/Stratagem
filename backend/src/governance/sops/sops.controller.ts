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
import { SOPsService } from './sops.service';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPQueryDto } from './dto/sop-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Governance - SOPs')
@Controller('api/v1/governance/sops')
@UseGuards(JwtAuthGuard)
export class SOPsController {
  constructor(private readonly sopsService: SOPsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOP' })
  @ApiResponse({ status: 201, description: 'SOP created successfully' })
  create(@Body() createSOPDto: CreateSOPDto, @Request() req) {
    return this.sopsService.create(createSOPDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOPs with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of SOPs' })
  findAll(@Query() queryDto: SOPQueryDto) {
    return this.sopsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SOP by ID' })
  @ApiResponse({ status: 200, description: 'SOP details' })
  @ApiResponse({ status: 404, description: 'SOP not found' })
  findOne(@Param('id') id: string) {
    return this.sopsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SOP' })
  @ApiResponse({ status: 200, description: 'SOP updated successfully' })
  @ApiResponse({ status: 404, description: 'SOP not found' })
  update(@Param('id') id: string, @Body() updateSOPDto: UpdateSOPDto, @Request() req) {
    return this.sopsService.update(id, updateSOPDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a SOP (soft delete)' })
  @ApiResponse({ status: 204, description: 'SOP deleted successfully' })
  @ApiResponse({ status: 404, description: 'SOP not found' })
  remove(@Param('id') id: string) {
    return this.sopsService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a SOP and optionally assign to users/roles' })
  @ApiResponse({ status: 200, description: 'SOP published successfully' })
  @ApiResponse({ status: 404, description: 'SOP not found' })
  publish(
    @Param('id') id: string,
    @Body() body: { assign_to_user_ids?: string[]; assign_to_role_ids?: string[] },
    @Request() req,
  ) {
    return this.sopsService.publish(
      id,
      req.user.id,
      body.assign_to_user_ids,
      body.assign_to_role_ids,
    );
  }

  @Get('my-assigned')
  @ApiOperation({ summary: 'Get SOPs assigned to the current user' })
  @ApiResponse({ status: 200, description: 'List of assigned SOPs' })
  getMyAssignedSOPs(@Query() queryDto: SOPQueryDto, @Request() req) {
    return this.sopsService.getAssignedSOPs(req.user.id, queryDto);
  }

  @Get('statistics/publication')
  @ApiOperation({ summary: 'Get SOP publication statistics' })
  @ApiResponse({ status: 200, description: 'Publication statistics' })
  getPublicationStatistics() {
    return this.sopsService.getPublicationStatistics();
  }
}
