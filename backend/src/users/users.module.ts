import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Tenant } from '../common/entities/tenant.entity';
import { Invitation } from '../common/entities/invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { DataExportModule } from '../common/export/data-export.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invitation, Tenant]),
    DataExportModule,
  ],
  controllers: [UsersController, InvitationsController],
  providers: [UsersService, InvitationsService],
  exports: [UsersService, InvitationsService, TypeOrmModule],
})
export class UsersModule { }