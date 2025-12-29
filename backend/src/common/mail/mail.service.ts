import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './dto/mail-options.dto';
import { Tenant } from '../../common/entities/tenant.entity';
import { EncryptionService } from '../../common/services/encryption.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporters = new Map<string, nodemailer.Transporter>();

    constructor(
        private configService: ConfigService,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        private encryptionService: EncryptionService,
    ) { }

    /**
     * Send an email with tenant-specific SMTP support and global fallback.
     */
    async send(options: MailOptions, tenantId?: string): Promise<void> {
        try {
            const transporter = await this.getTransporter(tenantId);
            const { fromEmail, fromName } = await this.getSenderInfo(tenantId);

            const mailOptions: nodemailer.SendMailOptions = {
                from: `"${fromName}" <${fromEmail}>`,
                to: Array.isArray(options.to) ? options.to.join(',') : options.to,
                subject: options.subject,
                text: options.text,
                html: options.html || options.text, // Fallback to text if html is missing
                attachments: options.attachments,
            };

            await transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to ${mailOptions.to} with subject: ${mailOptions.subject} (Tenant: ${tenantId || 'Global'})`);
        } catch (error) {
            this.logger.error(`Failed to send email (Tenant: ${tenantId || 'Global'}):`, error.message);
            throw error;
        }
    }

    /**
     * Verify SMTP connection for a specific configuration.
     */
    async verifyConnection(config: any): Promise<boolean> {
        const password = this.encryptionService.decrypt(config.auth.pass);
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.auth.user,
                pass: password,
            },
        });

        try {
            await transporter.verify();
            return true;
        } catch (error) {
            this.logger.error(`SMTP Connection verification failed:`, error.message);
            throw error;
        }
    }

    /**
     * Get or create a transporter for a specific tenant or the global default.
     */
    private async getTransporter(tenantId?: string): Promise<nodemailer.Transporter> {
        if (tenantId) {
            if (this.transporters.has(tenantId)) {
                return this.transporters.get(tenantId);
            }

            const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
            if (tenant?.smtpConfig) {
                const password = this.encryptionService.decrypt(tenant.smtpConfig.auth.pass);
                const transporter = nodemailer.createTransport({
                    host: tenant.smtpConfig.host,
                    port: tenant.smtpConfig.port,
                    secure: tenant.smtpConfig.secure,
                    auth: {
                        user: tenant.smtpConfig.auth.user,
                        pass: password,
                    },
                });
                this.transporters.set(tenantId, transporter);
                return transporter;
            }
        }

        const globalKey = 'global';
        if (this.transporters.has(globalKey)) {
            return this.transporters.get(globalKey);
        }

        const config = this.configService.get('mail');
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth.user ? config.auth : undefined,
        });
        this.transporters.set(globalKey, transporter);
        return transporter;
    }

    /**
     * Get sender information (From Email/Name) for a specific tenant or the global default.
     */
    private async getSenderInfo(tenantId?: string) {
        const globalConfig = this.configService.get('mail');
        let fromEmail = globalConfig.defaults.fromEmail;
        let fromName = globalConfig.defaults.fromName;

        if (tenantId) {
            const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
            if (tenant) {
                if (tenant.smtpConfig?.fromEmail) {
                    fromEmail = tenant.smtpConfig.fromEmail;
                }
                if (tenant.notificationBranding?.companyName) {
                    fromName = tenant.notificationBranding.companyName;
                } else if (tenant.smtpConfig?.fromName) {
                    fromName = tenant.smtpConfig.fromName;
                } else {
                    fromName = tenant.name;
                }
            }
        }

        return { fromEmail, fromName };
    }
}
