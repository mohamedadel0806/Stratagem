import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainsService } from './domains.service';
import { DomainsController } from './domains.controller';
import { ControlDomain } from './entities/domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlDomain])],
  controllers: [DomainsController],
  providers: [DomainsService],
  exports: [DomainsService],
})
export class DomainsModule {}


