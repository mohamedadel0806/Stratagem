import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MfaService } from './mfa.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../users/entities/user.entity';
import { Tenant, TenantStatus } from '../common/entities/tenant.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { TenantContextService } from '../common/context/tenant-context.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private tenantContextService: TenantContextService,
    private mfaService: MfaService,
  ) { }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.tenantContextService.run({ tenantId: null, bypassRLS: true }, () =>
      this.usersRepository.findOne({
        where: { email: loginDto.email },
        select: ['id', 'email', 'firstName', 'lastName', 'password', 'role', 'status', 'tenantId', 'mfaEnabled', 'mfaSecret'],
      })
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Check if tenant is active (FR-1.2: Tenant Suspension)
    if (user.tenantId) {
      const tenant = await this.tenantsService.findOne(user.tenantId);

      if (tenant.status === TenantStatus.SUSPENDED) {
        const reason = tenant.suspensionReason ? `: ${tenant.suspensionReason}` : '';
        throw new UnauthorizedException(`Your organization's account has been suspended${reason}. Please contact support for assistance.`);
      }

      if (tenant.status === TenantStatus.DELETED) {
        throw new UnauthorizedException('Your organization\'s account has been deleted. Please contact support if you believe this is an error.');
      }
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Handle MFA
    if (user.mfaEnabled) {
      // In a real app, we should issue a temporary mfaToken.
      // For now, we'll return a special status and the user ID (encrypted if possible)
      return {
        mfaRequired: true,
        userId: user.id,
      } as any;
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.tenantContextService.run({ tenantId: null, bypassRLS: true }, () =>
      this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'tenantId'],
      })
    );
  }

  async verifyMfa(userId: string, code: string): Promise<LoginResponseDto> {
    const user = await this.tenantContextService.run({ tenantId: null, bypassRLS: true }, () =>
      this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'tenantId', 'mfaEnabled', 'mfaSecret'],
      })
    );

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      throw new UnauthorizedException('MFA not enabled or user not found');
    }

    const isValid = this.mfaService.verifyCode(code, user.mfaSecret);
    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async setupMfa(user: User) {
    const { secret, otpauthUrl } = await this.mfaService.generateSecret(user);
    const qrCode = await this.mfaService.generateQrCodeDataURL(otpauthUrl);

    // TEMPORARILY save secret to user (but don't enable MFA yet)
    await this.usersRepository.update(user.id, { mfaSecret: secret, mfaEnabled: false });

    return {
      secret,
      qrCode,
    };
  }

  async confirmMfa(userId: string, code: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'mfaSecret']
    });

    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    const isValid = this.mfaService.verifyCode(code, user.mfaSecret);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersRepository.update(userId, { mfaEnabled: true });

    const recoveryCodes = this.mfaService.generateRecoveryCodes();
    await this.usersRepository.update(userId, { mfaRecoveryCodes: recoveryCodes });

    return {
      success: true,
      recoveryCodes,
    };
  }
}

