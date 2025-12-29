import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../context/tenant-context.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    constructor(private readonly tenantContextService: TenantContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Tenant ID should be in the user object (appended by JwtStrategy)
        const tenantId = user?.tenantId;

        // For public routes or routes that don't require auth, tenantId might be missing.
        // However, for multi-tenant routes, it must be present.
        // We can allow missing tenantId for now if the route is not protected.

        return new Observable((observer) => {
            this.tenantContextService.run({ tenantId: tenantId || null }, () => {
                next.handle().subscribe({
                    next: (res) => observer.next(res),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
        });
    }
}
