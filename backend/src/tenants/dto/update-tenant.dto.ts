import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateTenantDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsString()
    regulatoryScope?: string;

    @IsOptional()
    @IsObject()
    settings?: Record<string, any>;
}
