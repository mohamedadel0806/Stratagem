import { IsString, IsEmail, IsOptional, MinLength, IsEnum, Matches } from 'class-validator';
import { SubscriptionTier } from '../../common/entities/tenant.entity';

export class CreateTenantOnboardingDto {
    @IsString()
    @MinLength(2)
    tenantName: string;

    @IsString()
    @MinLength(2)
    @Matches(/^[a-z0-9-]+$/, {
        message: 'Tenant code must only contain lowercase letters, numbers, and hyphens',
    })
    tenantCode: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsString()
    regulatoryScope?: string;

    @IsOptional()
    @IsEnum(SubscriptionTier)
    subscriptionTier?: SubscriptionTier;

    @IsEmail()
    adminEmail: string;

    @IsString()
    @MinLength(2)
    adminFirstName: string;

    @IsString()
    @MinLength(2)
    adminLastName: string;

    @IsString()
    @IsOptional()
    initialBusinessUnitName?: string;

    @IsOptional()
    settings?: {
        theme?: 'light' | 'dark' | 'system';
        locale?: string;
        custom_branding?: boolean;
    };
}
