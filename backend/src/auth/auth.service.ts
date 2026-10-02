import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email address is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email.toLowerCase(),
          passwordHash,
          goalCategory: dto.goalCategory || 'PERSONAL',
          difficultyPreference: dto.difficultyPreference || 'NORMAL',
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
        },
      });

      // Create default user preferences with mandatory default minimum 4 tasks
      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          dailyMinimum: 4,
          notificationsEnabled: true,
          motivationalNotifications: true,
          reminderTime: '20:00',
          streakFreezeEnabled: true,
          theme: 'winter_dark',
        },
      });

      // Create default streak entity
      await tx.streak.create({
        data: {
          userId: newUser.id,
          currentStreak: 0,
          longestStreak: 0,
          freezesAvailable: 1,
        },
      });

      return newUser;
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { preferences: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: { include: { preferences: true } } },
    });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      if (storedToken) {
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Delete old refresh token & generate new token pair (rotation)
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const tokens = await this.generateTokens(storedToken.user.id, storedToken.user.email);
    await this.saveRefreshToken(storedToken.user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = storedToken.user;
    return {
      user: safeUser,
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    } else {
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Do not reveal user existence for security
      return { message: 'If account exists, password reset instructions have been sent.' };
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'RESET_PASSWORD' },
      { expiresIn: '15m' },
    );

    return {
      message: 'If account exists, password reset instructions have been sent.',
      resetToken, // In production, this would be emailed
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'RESET_PASSWORD') {
        throw new BadRequestException('Invalid reset token');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { message: 'Password has been reset successfully.' };
    } catch {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'winter_arc_super_secret_jwt_key_2026_discipline',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'winter_arc_super_secret_refresh_jwt_key_2026_discipline',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
}
