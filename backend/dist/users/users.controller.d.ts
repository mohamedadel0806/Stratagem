import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserData } from '../auth/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    getProfile(user: CurrentUserData): Promise<import("./entities/user.entity").User>;
    updateProfile(user: CurrentUserData, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user.entity").User>;
    changePassword(user: CurrentUserData, changePasswordDto: ChangePasswordDto): Promise<void>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto, user: CurrentUserData): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
