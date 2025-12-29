import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../common/entities/invitation.entity';
import { User, UserRole } from './entities/user.entity';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class InvitationsService {
    constructor(
        @InjectRepository(Invitation)
        private readonly invitationRepository: Repository<Invitation>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
    ) { }

    async create(email: string, role: UserRole, tenantId: string, invitedBy: string): Promise<Invitation> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Check if a pending invitation already exists
        const pendingInvitation = await this.invitationRepository.findOne({
            where: { email, status: InvitationStatus.PENDING },
        });
        if (pendingInvitation) {
            // Could resend or update, for now just throw
            throw new ConflictException('A pending invitation already exists for this email');
        }

        const token = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

        const invitation = this.invitationRepository.create({
            email,
            role,
            tenantId,
            invitedBy,
            token,
            expiresAt,
            status: InvitationStatus.PENDING,
        });

        const savedInvitation = await this.invitationRepository.save(invitation);

        // Send invitation email
        try {
            await this.mailService.send({
                to: email,
                subject: 'You have been invited to join Stratagem GRC',
                html: `
                    <h1>Welcome to Stratagem GRC</h1>
                    <p>You have been invited to join the platform with the role of <strong>${role}</strong>.</p>
                    <p>Click the link below to accept the invitation and set up your account:</p>
                    <p><a href="${process.env.FRONTEND_URL}/invite/${token}">${process.env.FRONTEND_URL}/invite/${token}</a></p>
                    <p>This invitation will expire in 24 hours.</p>
                `,
            }, tenantId);
        } catch (error) {
            console.error(`Failed to send invitation email to ${email}:`, error);
            // We don't throw here to avoid failing the invitation creation, 
            // but in production we might want to handle this more robustly.
        }

        return savedInvitation;
    }

    async findByToken(token: string): Promise<Invitation> {
        const invitation = await this.invitationRepository.findOne({
            where: { token },
            relations: ['tenant'],
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException(`Invitation is ${invitation.status}`);
        }

        if (new Date() > invitation.expiresAt) {
            invitation.status = InvitationStatus.EXPIRED;
            await this.invitationRepository.save(invitation);
            throw new BadRequestException('Invitation has expired');
        }

        return invitation;
    }

    async accept(token: string): Promise<Invitation> {
        const invitation = await this.findByToken(token);
        invitation.status = InvitationStatus.ACCEPTED;
        return this.invitationRepository.save(invitation);
    }

    async getTenantInvitations(tenantId: string): Promise<Invitation[]> {
        return this.invitationRepository.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
        });
    }

    async revoke(id: string, tenantId: string): Promise<void> {
        const invitation = await this.invitationRepository.findOne({ where: { id, tenantId } });
        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }
        invitation.status = InvitationStatus.REVOKED;
        await this.invitationRepository.save(invitation);
    }
}
