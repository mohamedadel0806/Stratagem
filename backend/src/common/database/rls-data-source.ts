import { DataSource, DataSourceOptions, QueryRunner, ReplicationMode } from 'typeorm';
import { TenantContextService } from '../context/tenant-context.service';
import { RLSQueryRunner } from './rls-query-runner';

/**
 * A DataSource that provides RLSQueryRunner for all queries
 */
export class RLSDataSource extends DataSource {
    constructor(
        options: DataSourceOptions,
        private readonly tenantContextService: TenantContextService,
    ) {
        super(options);
        console.log('[RLSDataSource] Constructor called');
    }

    /**
     * Override createQueryRunner to return our RLS-aware wrapper
     */
    createQueryRunner(mode: ReplicationMode = 'master'): QueryRunner {
        console.log(`[RLSDataSource] createQueryRunner called (mode: ${mode})`);
        const delegate = super.createQueryRunner(mode);
        const rlsQueryRunner = new RLSQueryRunner(delegate, this.tenantContextService);
        return rlsQueryRunner as unknown as QueryRunner;
    }
}
