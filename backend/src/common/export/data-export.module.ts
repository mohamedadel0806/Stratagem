import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataExportService } from './data-export.service';
import { Tenant } from '../entities/tenant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    providers: [DataExportService],
    exports: [DataExportService],
})
export class DataExportModule { }
