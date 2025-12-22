import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finding } from './entities/finding.entity';
import { RemediationTracker } from './entities/remediation-tracker.entity';
import { FindingsService } from './findings.service';
import { FindingsController } from './findings.controller';
import { RiskModule } from '../../risk/risk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Finding, RemediationTracker]),
    RiskModule,
  ],
  controllers: [FindingsController],
  providers: [FindingsService],
  exports: [FindingsService],
})
export class FindingsModule {}


