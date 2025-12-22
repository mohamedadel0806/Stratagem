import { ConfigService } from '@nestjs/config';
export declare class AIService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    getChatCompletion(messages: any[], options?: {
        model?: string;
        temperature?: number;
        max_tokens?: number;
        response_format?: {
            type: 'json_object' | 'text';
        };
    }): Promise<string | null>;
    isAvailable(): boolean;
}
