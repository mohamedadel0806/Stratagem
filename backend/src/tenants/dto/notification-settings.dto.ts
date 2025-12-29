import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SmtpAuthDto {
    @IsString()
    user: string;

    @IsString()
    pass: string;
}

export class UpdateSmtpConfigDto {
    @IsString()
    host: string;

    @IsNumber()
    port: number;

    @IsBoolean()
    secure: boolean;

    @IsObject()
    @ValidateNested()
    @Type(() => SmtpAuthDto)
    auth: SmtpAuthDto;

    @IsString()
    fromEmail: string;

    @IsString()
    fromName: string;
}

export class UpdateNotificationBrandingDto {
    @IsString()
    @IsOptional()
    logoUrl?: string;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    primaryColor?: string;

    @IsString()
    @IsOptional()
    supportEmail?: string;

    @IsString()
    @IsOptional()
    footerText?: string;
}

export class UpdateNotificationSettingsDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateSmtpConfigDto)
    smtpConfig?: UpdateSmtpConfigDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateNotificationBrandingDto)
    notificationBranding?: UpdateNotificationBrandingDto;
}
