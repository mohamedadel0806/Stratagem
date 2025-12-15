import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private usersService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    validateUser(userId: string): Promise<User | null>;
}
