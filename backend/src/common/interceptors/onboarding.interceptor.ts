import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TenantsService } from '../../tenants/tenants.service';

@Injectable()
export class OnboardingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(OnboardingInterceptor.name);

    constructor(private readonly tenantsService: TenantsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Only track for authenticated tenant users
        if (!user || !user.tenantId) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(() => {
                const method = request.method;
                const url = request.url;
                let completedStep: string | null = null;

                // Map successfull actions to onboarding steps
                if (method === 'POST') {
                    if (url.includes('/assets') && !url.includes('/integrations')) {
                        completedStep = 'assets';
                    } else if (url.includes('/assets/integrations')) {
                        completedStep = 'integrations';
                    } else if (url.includes('/invitations')) {
                        completedStep = 'users';
                    } else if (url.includes('/risk-categories') || url.includes('/business-units') || url.includes('/control-domains')) {
                        completedStep = 'lookups';
                    }
                } else if (method === 'PATCH' || method === 'PUT') {
                    if (url.includes('/settings/notifications')) {
                        completedStep = 'notifications';
                    } else if (url.includes('/tenants/') && (request.body.industry || request.body.regulatoryScope)) {
                        completedStep = 'profile';
                    }
                }

                if (completedStep) {
                    this.tenantsService.updateOnboardingProgress(user.tenantId, { completed: completedStep }, user.id)
                        .catch(err => this.logger.error(`Failed to update onboarding progress for step ${completedStep}: ${err.message}`));
                }
            }),
        );
    }
}
