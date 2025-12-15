import { UserRole, UserStatus } from '../entities/user.entity';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
    role?: UserRole;
    status?: UserStatus;
}
