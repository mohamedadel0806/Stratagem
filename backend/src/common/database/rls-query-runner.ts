import {
    QueryRunner,
} from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TenantContextService } from '../context/tenant-context.service';

/**
 * A QueryRunner wrapper that injects Postgres session variables for RLS
 * Using a Proxy to delegate all methods to the internal QueryRunner while
 * intercepting the query() method.
 */
export class RLSQueryRunner {
    private variablesSet = false;

    constructor(
        private readonly delegate: QueryRunner,
        private readonly tenantContextService: TenantContextService,
    ) {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (prop in target) {
                    const value = Reflect.get(target, prop, receiver);
                    if (typeof value === 'function' && (prop === 'query' || prop === 'release' || prop === 'startTransaction')) {
                        return value.bind(target);
                    }
                    return typeof value === 'function' ? value.bind(target) : value;
                }
                const value = Reflect.get(delegate, prop, delegate);
                if (typeof value === 'function') {
                    return async (...args: any[]) => {
                        return value.apply(delegate, args);
                    };
                }
                return value;
            },
            set: (target, prop, value, receiver) => {
                if (prop in target) {
                    return Reflect.set(target, prop, value, receiver);
                }
                return Reflect.set(delegate, prop, value, delegate);
            },
        }) as unknown as RLSQueryRunner;
    }

    get connection() { return this.delegate.connection; }
    get manager() { return this.delegate.manager; }
    get data() { return this.delegate.data; }
    set data(value: any) { (this.delegate as any).data = value; }
    get isReleased() { return this.delegate.isReleased; }
    get isTransactionActive() { return this.delegate.isTransactionActive; }

    async release(): Promise<void> {
        if (!this.delegate.isReleased) {
            try {
                // Reset session variables before returning to pool
                await this.delegate.query(`SET app.tenant_id = ''`);
                await this.delegate.query(`SET app.bypass_rls = 'off'`);
            } catch (err) {
                console.error('[RLSQueryRunner] Error resetting session variables on release', err);
            }
        }
        return this.delegate.release();
    }

    async startTransaction(isolationLevel?: IsolationLevel): Promise<void> {
        await this.delegate.startTransaction(isolationLevel);

        // CRITICAL: Capture the AsyncLocalStorage context NOW, at transaction start
        // This ensures we get the correct tenant context before any connection pool operations
        const tenantId = this.tenantContextService.getTenantId();
        const bypassRLS = this.tenantContextService.shouldBypassRLS();

        // Set RLS context immediately using SET LOCAL (transaction-scoped)
        if (tenantId) {
            await this.delegate.query(`SET LOCAL app.tenant_id = '${tenantId}'`);
        } else {
            await this.delegate.query(`SET LOCAL app.tenant_id = ''`);
        }

        if (bypassRLS) {
            await this.delegate.query(`SET LOCAL app.bypass_rls = 'on'`);
        } else {
            await this.delegate.query(`SET LOCAL app.bypass_rls = 'off'`);
        }

        // Mark as set so we don't redundantly set it on every query
        this.variablesSet = true;
    }

    async commitTransaction(): Promise<void> { return this.delegate.commitTransaction(); }
    async rollbackTransaction(): Promise<void> { return this.delegate.rollbackTransaction(); }

    /**
     * Intercept queries to inject RLS context
     */
    async query(query: string, parameters?: any[], useMap?: boolean): Promise<any> {
        await this.setRLSContext();
        return this.delegate.query(query, parameters, useMap as any);
    }

    private async setRLSContext(): Promise<void> {
        // Ensure we are connected
        if (!this.delegate.isReleased && !(this.delegate as any).connection.isConnected) {
            await this.delegate.connect();
        }

        // If we're in a transaction and variables are already set, skip
        // (they were set at transaction start with the correct context)
        if (this.variablesSet && this.delegate.isTransactionActive) {
            return;
        }

        // For non-transaction queries, get the current context
        const tenantId = this.tenantContextService.getTenantId();
        const bypassRLS = this.tenantContextService.shouldBypassRLS();

        // Use SET (not SET LOCAL) for non-transaction queries
        const setCommand = 'SET';

        if (tenantId) {
            await this.delegate.query(`${setCommand} app.tenant_id = '${tenantId}'`);
        } else {
            await this.delegate.query(`${setCommand} app.tenant_id = ''`);
        }

        if (bypassRLS) {
            await this.delegate.query(`${setCommand} app.bypass_rls = 'on'`);
        } else {
            await this.delegate.query(`${setCommand} app.bypass_rls = 'off'`);
        }
    }
}
