import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MfaService {
    async generateSecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(
            user.email,
            'Stratagem GRC',
            secret,
        );

        return {
            secret,
            otpauthUrl,
        };
    }

    async generateQrCodeDataURL(otpauthUrl: string) {
        return toDataURL(otpauthUrl);
    }

    verifyCode(code: string, secret: string): boolean {
        return authenticator.verify({
            token: code,
            secret,
        });
    }

    generateRecoveryCodes(): string[] {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
        }
        return codes;
    }
}
