import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceReport } from './entities/compliance-report.entity';
import { ComplianceReportingService } from './services/compliance-reporting.service';
import { ComplianceReportingController } from './compliance-reporting.controller';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { ControlAssetMapping } from '../unified-controls/entities/control-asset-mapping.entity';
import { User } from '../../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComplianceReport,
      Policy,
      UnifiedControl,
      ControlAssetMapping,
      User,
    ]),
  ],
  controllers: [ComplianceReportingController],
  providers: [ComplianceReportingService],
  exports: [ComplianceReportingService],
})
export class ComplianceReportingModule {}
