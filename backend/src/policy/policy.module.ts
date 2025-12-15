import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { PolicyService } from './services/policy.service';
import { PolicyController } from './controllers/policy.controller';
import { MulterModule } from '@nestjs/platform-express';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Policy]),
    MulterModule.register({
      dest: './uploads/policies',
    }),
    forwardRef(() => WorkflowModule),
  ],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}