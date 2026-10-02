import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreaksService } from '../streaks/streaks.service';

@Injectable()
export class DailySummaryService {
  constructor(
    private prisma: PrismaService,
    private streaksService: StreaksService,
  ) {}

  async getTodaySummary(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.getSummaryForDate(userId, today);
  }

  async getSummaryForDate(userId: string, dateStr: string) {
    let summary = await this.prisma.dailySummary.findUnique({
      where: { userId_date: { userId, date: dateStr } },
    });

    if (!summary) {
      summary = await this.recalculateDailySummary(userId, dateStr);
    }

    return summary;
  }

  async recalculateDailySummary(userId: string, dateStr: string) {
    const userPrefs = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });
    const dailyMinimum = userPrefs?.dailyMinimum ?? 4;

    // Count tasks assigned for this user
    const tasksAssigned = await this.prisma.task.count({
      where: { userId, isActive: true },
    });

    // Count tasks completed on this date
    const taskLogs = await this.prisma.taskLog.findMany({
      where: { userId, date: dateStr },
    });

    const tasksCompleted = taskLogs.length;
    const completionRate = tasksAssigned > 0 ? (tasksCompleted / tasksAssigned) * 100 : 0;
    
    // Core Business Rule 7: goalMet = completedTasks >= dailyMinimum (default 4)
    const goalMet = tasksCompleted >= dailyMinimum;

    const xpEarned = taskLogs.reduce((acc, log) => acc + log.xpEarned, 0);

    // Update streak based on goalMet
    const streak = await this.streaksService.recalculateStreak(userId, dateStr, goalMet);

    const summary = await this.prisma.dailySummary.upsert({
      where: { userId_date: { userId, date: dateStr } },
      update: {
        tasksAssigned,
        tasksCompleted,
        completionRate,
        goalMet,
        xpEarned,
        streakStatus: streak.currentStreak,
      },
      create: {
        userId,
        date: dateStr,
        tasksAssigned,
        tasksCompleted,
        completionRate,
        goalMet,
        xpEarned,
        streakStatus: streak.currentStreak,
      },
    });

    return summary;
  }

  async getHistory(userId: string, limit = 30) {
    return this.prisma.dailySummary.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}
