import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmailDistributionListService } from '../services/email-distribution-list.service';
import { CreateEmailDistributionListDto } from '../dto/create-email-distribution-list.dto';
import { UpdateEmailDistributionListDto } from '../dto/update-email-distribution-list.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('assets')
@Controller('assets/email-distribution-lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailDistributionListController {
  constructor(private readonly distributionListService: EmailDistributionListService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new email distribution list' })
  async create(@Body() dto: CreateEmailDistributionListDto, @Request() req: any) {
    return this.distributionListService.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all email distribution lists' })
  async findAll() {
    return this.distributionListService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an email distribution list by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.distributionListService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an email distribution list' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmailDistributionListDto,
  ) {
    return this.distributionListService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an email distribution list' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.distributionListService.delete(id);
    return { message: 'Email distribution list deleted successfully' };
  }
}

