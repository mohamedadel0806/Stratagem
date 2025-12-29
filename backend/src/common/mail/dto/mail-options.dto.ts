export interface MailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    context?: Record<string, any>;
    attachments?: any[];
}
