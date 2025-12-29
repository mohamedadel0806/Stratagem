import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { Tenant } from '../../common/entities/tenant.entity';
import { CommonModule } from '../common.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Tenant]),
        CommonModule,
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
