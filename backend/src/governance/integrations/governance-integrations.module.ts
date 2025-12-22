import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceIntegrationHook, GovernanceIntegrationLog } from './entities/integration-hook.entity';
import { GovernanceIntegrationsService } from './governance-integrations.service';
import { GovernanceIntegrationsController } from './governance-integrations.controller';
import { EvidenceModule } from '../evidence/evidence.module';
import { FindingsModule } from '../findings/findings.module';
import { UnifiedControlsModule } from '../unified-controls/unified-controls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GovernanceIntegrationHook, GovernanceIntegrationLog]),
    EvidenceModule,
    FindingsModule,
    UnifiedControlsModule,
  ],
  controllers: [GovernanceIntegrationsController],
  providers: [GovernanceIntegrationsService],
  exports: [GovernanceIntegrationsService],
})
export class GovernanceIntegrationsModule {}


