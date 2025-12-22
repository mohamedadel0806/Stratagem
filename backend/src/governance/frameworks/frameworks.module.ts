import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrameworksService } from './frameworks.service';
import { FrameworksController } from './frameworks.controller';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
import { FrameworkRequirement } from '../unified-controls/entities/framework-requirement.entity';
import { FrameworkVersion } from './entities/framework-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplianceFramework, FrameworkRequirement, FrameworkVersion]),
  ],
  controllers: [FrameworksController],
  providers: [FrameworksService],
  exports: [FrameworksService],
})
export class FrameworksModule {}


