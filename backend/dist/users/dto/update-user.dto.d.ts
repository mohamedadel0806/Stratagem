import { UserRole, UserStatus } from '../entities/user.entity';
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    role?: UserRole;
    status?: UserStatus;
}
