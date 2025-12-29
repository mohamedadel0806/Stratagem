import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole, UserStatus } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Public()
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Increased for testing
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // Increased for testing
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = {
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
      role: UserRole.USER, // Default role for new registrations
      status: UserStatus.ACTIVE,
    };

    const user = await this.usersService.create(createUserDto);

    // Return user without password
    const { password, ...userWithoutPassword } = user as any;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code during login' })
  async verifyMfa(@Body() body: { userId: string; code: string }) {
    return this.authService.verifyMfa(body.userId, body.code);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate MFA secret and QR code' })
  async setupMfa(@Req() req: any) {
    return this.authService.setupMfa(req.user);
  }

  @Post('mfa/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm and enable MFA' })
  async confirmMfa(@Req() req: any, @Body() body: { code: string }) {
    return this.authService.confirmMfa(req.user.id, body.code);
  }
}

