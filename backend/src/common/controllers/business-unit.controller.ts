import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BusinessUnitService } from '../services/business-unit.service';
import { BusinessUnit } from '../entities/business-unit.entity';
import { CreateBusinessUnitDto } from '../dto/create-business-unit.dto';
import { UpdateBusinessUnitDto } from '../dto/update-business-unit.dto';

@ApiTags('Business Units')
@Controller('business-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessUnitController {
  constructor(private readonly businessUnitService: BusinessUnitService) { }

  @Get()
  @ApiOperation({ summary: 'Get all business units' })
  @ApiResponse({
    status: 200,
    description: 'List of business units',
    type: [BusinessUnit],
  })
  async findAll(): Promise<BusinessUnit[]> {
    return this.businessUnitService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business unit by ID' })
  @ApiResponse({
    status: 200,
    description: 'Business unit details',
    type: BusinessUnit,
  })
  async findOne(@Param('id') id: string): Promise<BusinessUnit> {
    return this.businessUnitService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new business unit' })
  async create(@Body() createDto: CreateBusinessUnitDto) {
    return this.businessUnitService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business unit' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBusinessUnitDto) {
    return this.businessUnitService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business unit (soft delete)' })
  async remove(@Param('id') id: string) {
    await this.businessUnitService.remove(id);
    return { success: true };
  }
}



