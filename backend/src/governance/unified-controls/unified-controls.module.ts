import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedControl } from './entities/unified-control.entity';
import { ControlAssetMapping } from './entities/control-asset-mapping.entity';
import { ControlTest } from './entities/control-test.entity';
import { FrameworkRequirement } from './entities/framework-requirement.entity';
import { FrameworkControlMapping } from './entities/framework-control-mapping.entity';
import { UnifiedControlsService } from './unified-controls.service';
import { UnifiedControlsController } from './unified-controls.controller';
import { ControlAssetMappingService } from './services/control-asset-mapping.service';
import { FrameworkControlMappingService } from './services/framework-control-mapping.service';
import { ControlTestsService } from './services/control-tests.service';
import { ControlTestsController } from './control-tests.controller';
import { AssetControlService } from './services/asset-control.service';
import { AssetControlController } from './asset-control.controller';
import { RiskModule } from '../../risk/risk.module';
import { ControlDomain } from '../domains/entities/domain.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnifiedControl,
      ControlAssetMapping,
      ControlTest,
      FrameworkRequirement,
      FrameworkControlMapping,
      ControlDomain,
    ]),
    forwardRef(() => RiskModule),
    CommonModule,
  ],
  controllers: [UnifiedControlsController, ControlTestsController, AssetControlController],
  providers: [
    UnifiedControlsService,
    ControlAssetMappingService,
    FrameworkControlMappingService,
    ControlTestsService,
    AssetControlService,
  ],
  exports: [
    UnifiedControlsService,
    ControlAssetMappingService,
    FrameworkControlMappingService,
    ControlTestsService,
    AssetControlService,
  ],
})
export class UnifiedControlsModule {}


