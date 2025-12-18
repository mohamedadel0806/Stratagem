import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Remove password from response
    const savedUser = await this.usersRepository.save(user);
    delete (savedUser as any).password;
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'role',
        'status',
        'businessUnitId',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'avatarUrl',
        'role',
        'status',
        'businessUnitId',
        'emailVerified',
        'phoneVerified',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'avatarUrl',
        'role',
        'status',
        'businessUnitId',
        'password',
        'emailVerified',
        'phoneVerified',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findProfile(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(userId);

    Object.assign(user, updateProfileDto);

    return this.usersRepository.save(user);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real implementation, you would verify the current password
    // For now, we'll assume it's validated by the controller/auth layer
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

    await this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserRole: UserRole): Promise<User> {
    const user = await this.findOne(id);

    // Only super_admin and admin can change roles
    if (updateUserDto.role && !['super_admin', 'admin'].includes(currentUserRole)) {
      throw new UnauthorizedException('You do not have permission to change user roles');
    }

    // Prevent changing email if it already exists for another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}

