import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    defaults: {
        fromEmail: process.env.SMTP_FROM_EMAIL || 'no-reply@stratagem.com',
        fromName: process.env.SMTP_FROM_NAME || 'Stratagem GRC',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
