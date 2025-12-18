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
import { StandardsService } from './standards.service';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { StandardQueryDto } from './dto/standard-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Governance - Standards')
@Controller('api/v1/governance/standards')
@UseGuards(JwtAuthGuard)
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new standard' })
  @ApiResponse({ status: 201, description: 'Standard created successfully' })
  create(@Body() createStandardDto: CreateStandardDto, @Request() req) {
    return this.standardsService.create(createStandardDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all standards with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of standards' })
  findAll(@Query() queryDto: StandardQueryDto) {
    return this.standardsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a standard by ID' })
  @ApiResponse({ status: 200, description: 'Standard details' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  findOne(@Param('id') id: string) {
    return this.standardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a standard' })
  @ApiResponse({ status: 200, description: 'Standard updated successfully' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  update(@Param('id') id: string, @Body() updateStandardDto: UpdateStandardDto, @Request() req) {
    return this.standardsService.update(id, updateStandardDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a standard (soft delete)' })
  @ApiResponse({ status: 204, description: 'Standard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Standard not found' })
  remove(@Param('id') id: string) {
    return this.standardsService.remove(id);
  }
}
