import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
    private readonly logger = new Logger('Performance');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                const duration = Date.now() - now;

                const message = `${method} ${url} ${statusCode} - ${duration}ms`;

                if (duration > 500) {
                    this.logger.warn(`SLOW REQUEST: ${message}`);
                } else {
                    this.logger.log(message);
                }
            }),
        );
    }
}
