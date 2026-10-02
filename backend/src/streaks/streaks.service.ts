import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  async getUserStreak(userId: string) {
    let streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.streak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          freezesAvailable: 1,
        },
      });
    }

    return streak;
  }

  async recalculateStreak(userId: string, dateStr: string, goalMet: boolean) {
    const streakRecord = await this.getUserStreak(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return streakRecord;

    const todayDate = new Date(dateStr);
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    let newCurrentStreak = streakRecord.currentStreak;
    let newLongestStreak = streakRecord.longestStreak;
    let lastDate = streakRecord.lastSuccessfulDate;

    if (goalMet) {
      if (lastDate === dateStr) {
        // Already recorded for today
        return streakRecord;
      } else if (lastDate === yesterdayStr) {
        // Consecutive day win
        newCurrentStreak += 1;
      } else if (!lastDate) {
        // First win ever
        newCurrentStreak = 1;
      } else {
        // Missed day(s). Check if streak freeze is enabled & available
        const prefs = await this.prisma.userPreferences.findUnique({ where: { userId } });
        if (prefs?.streakFreezeEnabled && streakRecord.freezesAvailable > 0) {
          let freezeDates: any = streakRecord.freezeUsedDates;
          if (typeof freezeDates === 'string') {
            try { freezeDates = JSON.parse(freezeDates); } catch { freezeDates = []; }
          }
          if (!Array.isArray(freezeDates)) freezeDates = [];
          freezeDates.push(yesterdayStr);

          await this.prisma.streak.update({
            where: { userId },
            data: {
              freezesAvailable: streakRecord.freezesAvailable - 1,
              freezeUsedDates: Array.isArray(streakRecord.freezeUsedDates)
                ? [...streakRecord.freezeUsedDates, yesterdayStr]
                : JSON.stringify(freezeDates) as any,
            },
          });
          newCurrentStreak += 1;
        } else {
          // Reset streak to 1
          newCurrentStreak = 1;
        }
      }

      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
      lastDate = dateStr;

      const updatedStreak = await this.prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastSuccessfulDate: lastDate,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
        },
      });

      return updatedStreak;
    }

    return streakRecord;
  }
}
