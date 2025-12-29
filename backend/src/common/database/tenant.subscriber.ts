import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { TenantContextService } from '../context/tenant-context.service';

/**
 * Subscriber to handle entity-level tenant_id assignment and validation
 */
@EventSubscriber()
export class TenantSubscriber implements EntitySubscriberInterface {
    constructor(
        private readonly tenantContextService: TenantContextService,
    ) { }

    /**
     * Automatically set tenant_id before inserting a new entity
     */
    beforeInsert(event: InsertEvent<any>) {
        const tenantId = this.tenantContextService.getTenantId();

        // If entity doesn't have a tenantId set, and we have one in context, set it
        // This acts as a fallback/safety measure alongside RLS
        if (tenantId && ('tenantId' in event.entity) && !event.entity.tenantId) {
            event.entity.tenantId = tenantId;
        }
    }

    /**
     * Optional: Ensure tenant_id is not changed during updates
     */
    beforeUpdate(event: UpdateEvent<any>) {
        if (!event.entity || !event.databaseEntity) return;

        const tenantId = this.tenantContextService.getTenantId();
        const bypassRLS = this.tenantContextService.shouldBypassRLS();

        // If not bypassing, ensure updated entity hasn't changed the tenant_id
        if (!bypassRLS && tenantId && ('tenantId' in event.entity)) {
            if (event.entity.tenantId && event.entity.tenantId !== event.databaseEntity.tenantId) {
                // In a real scenario, we might throw an error here to prevent cross-tenant movement
                // For now, we just force it back to the original tenantId
                event.entity.tenantId = event.databaseEntity.tenantId;
            }
        }
    }
}
