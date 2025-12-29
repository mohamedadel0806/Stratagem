import { SetMetadata } from '@nestjs/common';
import { TenantFeature } from '../constants/tier-config';

export const FEATURE_KEY = 'tenant_feature';
export const RequireFeature = (feature: TenantFeature) => SetMetadata(FEATURE_KEY, feature);
