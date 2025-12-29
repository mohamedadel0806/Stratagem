import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string;
  iat?: number;
  exp?: number;
}

import { TenantsService } from '../../tenants/tenants.service';
import { TenantStatus } from '../../common/entities/tenant.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private tenantsService: TenantsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Check if tenant is active
    if (payload.tenantId) {
      try {
        const tenant = await this.tenantsService.findOne(payload.tenantId);
        if (tenant.status === TenantStatus.SUSPENDED || tenant.status === TenantStatus.DELETED) {
          throw new UnauthorizedException('Tenant is suspended or deleted');
        }
      } catch (e) {
        // If tenant not found or other error, deny access
        throw new UnauthorizedException('Tenant validation failed');
      }
    }

    return {
      id: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role || 'user',
      tenantId: payload.tenantId,
    };
  }
}

