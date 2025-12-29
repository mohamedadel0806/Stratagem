import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
    tenantId: string | null;
    bypassRLS?: boolean;
}

@Injectable()
export class TenantContextService {
    private static readonly storage = new AsyncLocalStorage<TenantContext>();

    run(context: TenantContext, callback: () => any) {
        return TenantContextService.storage.run(context, callback);
    }

    getTenantId(): string | null {
        return TenantContextService.storage.getStore()?.tenantId || null;
    }

    shouldBypassRLS(): boolean {
        return !!TenantContextService.storage.getStore()?.bypassRLS;
    }
}
