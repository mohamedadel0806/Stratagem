import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationRuleService } from '../services/validation-rule.service';
import { CreateValidationRuleDto } from '../dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from '../dto/update-validation-rule.dto';
import { AssetType } from '../entities/validation-rule.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('assets')
@Controller('assets/validation-rules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ValidationRuleController {
  constructor(private readonly validationRuleService: ValidationRuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new validation rule' })
  async create(@Body() dto: CreateValidationRuleDto, @Request() req: any) {
    return this.validationRuleService.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all validation rules' })
  async findAll(@Query('assetType') assetType?: AssetType) {
    return this.validationRuleService.findAll(assetType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a validation rule by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.validationRuleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a validation rule' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateValidationRuleDto,
  ) {
    return this.validationRuleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a validation rule' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.validationRuleService.delete(id);
    return { message: 'Validation rule deleted successfully' };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate an asset against all applicable rules' })
  async validateAsset(@Body() body: { asset: any; assetType: AssetType }) {
    return this.validationRuleService.validateAsset(body.asset, body.assetType);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test a validation rule with a test value' })
  async testRule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { testValue: any },
  ) {
    return this.validationRuleService.testValidationRule(id, body.testValue);
  }
}

