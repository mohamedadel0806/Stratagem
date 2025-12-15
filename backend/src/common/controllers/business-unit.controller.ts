import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BusinessUnitService } from '../services/business-unit.service';
import { BusinessUnit } from '../entities/business-unit.entity';

@ApiTags('Business Units')
@Controller('business-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessUnitController {
  constructor(private readonly businessUnitService: BusinessUnitService) {}

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
}
