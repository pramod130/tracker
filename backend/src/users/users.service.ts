import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        streaks: true,
        userAchievements: {
          include: { achievement: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, data: any) {
    const { name, profileImage, goalCategory, difficultyPreference, preferences } = data;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(profileImage !== undefined && { profileImage }),
        ...(goalCategory && { goalCategory }),
        ...(difficultyPreference && { difficultyPreference }),
      },
      include: { preferences: true, streaks: true },
    });

    if (preferences) {
      await this.prisma.userPreferences.update({
        where: { userId },
        data: preferences,
      });
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Account and associated data deleted successfully' };
  }

  async getPreferences(userId: string) {
    const prefs = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });
    if (!prefs) {
      // Fallback create default preferences if somehow missing
      return this.prisma.userPreferences.create({
        data: { userId, dailyMinimum: 4 },
      });
    }
    return prefs;
  }

  async updatePreferences(userId: string, data: any) {
    return this.prisma.userPreferences.update({
      where: { userId },
      data,
    });
  }
}
