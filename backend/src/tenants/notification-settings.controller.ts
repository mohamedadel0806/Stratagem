import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
import { MailService } from '../common/mail/mail.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('tenants/:tenantId/notification-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NotificationSettingsController {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly mailService: MailService,
    ) { }

    @Get()
    async getSettings(@Param('tenantId') tenantId: string) {
        return this.tenantsService.getNotificationSettings(tenantId);
    }

    @Patch()
    async updateSettings(
        @Param('tenantId') tenantId: string,
        @Body() dto: UpdateNotificationSettingsDto,
        @Request() req: any,
    ) {
        return this.tenantsService.updateNotificationSettings(tenantId, dto, req.user.id);
    }

    @Post('test')
    async testConnection(
        @Param('tenantId') tenantId: string,
        @Body() dto: UpdateNotificationSettingsDto,
    ) {
        if (!dto.smtpConfig) {
            throw new Error('SMTP configuration is required for testing');
        }

        // Verify connection
        await this.mailService.verifyConnection(dto.smtpConfig);

        // Send a test email
        await this.mailService.send({
            to: dto.smtpConfig.fromEmail,
            subject: 'Stratagem GRC - SMTP Test Email',
            html: `
                <h1>SMTP Configuration Test Successful</h1>
                <p>This is a test email sent from Stratagem GRC to verify your SMTP settings.</p>
                <p>If you received this, your configuration is correct!</p>
            `,
        }, tenantId);

        return { success: true, message: 'Test email sent successfully' };
    }
}
