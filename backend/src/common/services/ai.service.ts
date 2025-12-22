import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private configService: ConfigService) {
    this.logger.warn('AI Service is disabled. OpenAI integration has been removed.');
  }

  async getChatCompletion(
    messages: any[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      response_format?: { type: 'json_object' | 'text' };
    } = {},
  ): Promise<string | null> {
    this.logger.warn('AI Service is not available. OpenAI integration has been removed.');
    return null;
  }

  isAvailable(): boolean {
    return false;
  }
}


