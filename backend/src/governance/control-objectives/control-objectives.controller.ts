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
import { ControlObjectivesService } from './control-objectives.service';
import { CreateControlObjectiveDto } from './dto/create-control-objective.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/v1/governance/control-objectives')
@UseGuards(JwtAuthGuard)
export class ControlObjectivesController {
  constructor(private readonly controlObjectivesService: ControlObjectivesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateControlObjectiveDto, @Request() req) {
    return this.controlObjectivesService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Query('policy_id') policyId?: string) {
    return this.controlObjectivesService.findAll(policyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlObjectivesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateControlObjectiveDto>, @Request() req) {
    return this.controlObjectivesService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.controlObjectivesService.remove(id);
  }
}




