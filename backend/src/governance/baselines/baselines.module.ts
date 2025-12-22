import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecureBaseline, BaselineRequirement } from './entities/baseline.entity';
import { BaselinesService } from './baselines.service';
import { BaselinesController } from './baselines.controller';
import { ControlObjective } from '../control-objectives/entities/control-objective.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecureBaseline, BaselineRequirement, ControlObjective]),
  ],
  controllers: [BaselinesController],
  providers: [BaselinesService],
  exports: [BaselinesService],
})
export class BaselinesModule {}


