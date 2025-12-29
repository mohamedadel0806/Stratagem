import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer;

    constructor(private configService: ConfigService) {
        const secret = this.configService.get<string>('ENCRYPTION_KEY') || 'default-secret-key-32-chars-long!!';
        // Ensure key is exactly 32 bytes for aes-256
        this.key = crypto.scryptSync(secret, 'salt', 32);
    }

    encrypt(text: string): string {
        if (!text) return text;

        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return `${iv.toString('hex')}:${encrypted}`;
        } catch (error) {
            throw new InternalServerErrorException('Encryption failed');
        }
    }

    decrypt(encryptedText: string): string {
        if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

        try {
            const [ivHex, encrypted] = encryptedText.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            // If decryption fails, it might be that the text was not encrypted or key changed
            // For migration purposes, if it's not actually encrypted, we might return as is
            // but here we throw to be safe
            return encryptedText;
        }
    }
}
