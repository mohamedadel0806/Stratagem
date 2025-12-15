import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskCategoryService } from '../services/risk-category.service';
import { CreateRiskCategoryDto } from '../dto/category/create-risk-category.dto';
import { UpdateRiskCategoryDto } from '../dto/category/update-risk-category.dto';

@Controller('risk-categories')
@UseGuards(JwtAuthGuard)
export class RiskCategoryController {
  constructor(private readonly categoryService: RiskCategoryService) {}

  @Get()
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @Query('hierarchical') hierarchical?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    
    if (hierarchical === 'true') {
      return this.categoryService.findAllHierarchical(includeInactiveFlag);
    }
    
    return this.categoryService.findAll(includeInactiveFlag);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.categoryService.findByCode(code);
  }

  @Post()
  async create(@Body() createDto: CreateRiskCategoryDto, @Request() req: any) {
    return this.categoryService.create(createDto, req.user?.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRiskCategoryDto,
    @Request() req: any,
  ) {
    return this.categoryService.update(id, updateDto, req.user?.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);
    return { message: 'Risk category deleted successfully' };
  }

  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
    @Request() req: any,
  ) {
    return this.categoryService.toggleActive(id, isActive, req.user?.id);
  }

  @Patch('reorder')
  async reorder(@Body() categoryOrders: { id: string; display_order: number }[]) {
    await this.categoryService.reorder(categoryOrders);
    return { message: 'Categories reordered successfully' };
  }
}

