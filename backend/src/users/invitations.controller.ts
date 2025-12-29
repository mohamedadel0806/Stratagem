import { Controller, Post, Get, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

@Controller('invitations')
export class InvitationsController {
    constructor(
        private readonly invitationsService: InvitationsService,
        private readonly usersService: UsersService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    // @Roles(UserRole.ADMIN) // Should add roles guard later
    create(
        @Body() body: { email: string; role: UserRole },
        @Req() req: any
    ) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.invitationsService.create(body.email, body.role, tenantId, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: any) {
        return this.invitationsService.getTenantInvitations(req.user.tenantId);
    }

    @Get(':token')
    findOne(@Param('token') token: string) {
        return this.invitationsService.findByToken(token);
    }

    @Post(':token/accept')
    async accept(
        @Param('token') token: string,
        @Body() body: { password: string; firstName: string; lastName: string }
    ) {
        const invitation = await this.invitationsService.accept(token);
        await this.usersService.createFromInvitation(
            invitation.email,
            invitation.role,
            invitation.tenantId,
            body.password,
            body.firstName,
            body.lastName
        );
        return { success: true };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    revoke(@Param('id') id: string, @Req() req: any) {
        return this.invitationsService.revoke(id, req.user.tenantId);
    }
}
