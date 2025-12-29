export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromEmail: string;
    fromName: string;
}

export interface NotificationBranding {
    logoUrl?: string;
    companyName?: string;
    primaryColor?: string;
    supportEmail?: string;
    footerText?: string;
}
