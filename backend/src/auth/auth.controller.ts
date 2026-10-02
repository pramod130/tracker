import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(@GetUser('id') userId: string, @Body() dto?: RefreshTokenDto) {
    return this.authService.logout(userId, dto?.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset token' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using reset token' })
  async resetPassword(@Body('token') token: string, @Body('password') password: string) {
    return this.authService.resetPassword(token, password);
  }
}
