import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { Risk } from '../risk/entities/risk.entity';
import { Policy } from '../governance/policies/entities/policy.entity';
import { Task } from '../common/entities/task.entity';
import { ComplianceRequirement } from '../common/entities/compliance-requirement.entity';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { InformationAsset } from '../asset/entities/information-asset.entity';
import { BusinessApplication } from '../asset/entities/business-application.entity';
import { SoftwareAsset } from '../asset/entities/software-asset.entity';
import { Supplier } from '../asset/entities/supplier.entity';
import { AssetAuditLog } from '../asset/entities/asset-audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Risk,
      Policy,
      Task,
      ComplianceRequirement,
      PhysicalAsset,
      InformationAsset,
      BusinessApplication,
      SoftwareAsset,
      Supplier,
      AssetAuditLog,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

