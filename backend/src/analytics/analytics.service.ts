import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDailyStats(userId: string, dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    const userPrefs = await this.prisma.userPreferences.findUnique({ where: { userId } });
    const dailyMinimum = userPrefs?.dailyMinimum ?? 4;

    const summary = await this.prisma.dailySummary.findUnique({
      where: { userId_date: { userId, date: targetDate } },
    });

    const tasksAssigned = summary?.tasksAssigned ?? 0;
    const tasksCompleted = summary?.tasksCompleted ?? 0;

    return {
      date: targetDate,
      tasksAssigned,
      tasksCompleted,
      dailyMinimum,
      goalMet: tasksCompleted >= dailyMinimum,
      completionRate: tasksAssigned > 0 ? (tasksCompleted / tasksAssigned) * 100 : 0,
      xpEarned: summary?.xpEarned ?? 0,
    };
  }

  async getWeeklyStats(userId: string) {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const summaries = await this.prisma.dailySummary.findMany({
      where: {
        userId,
        date: { in: dates },
      },
    });

    const summaryMap = new Map(summaries.map((s) => [s.date, s]));

    let totalCompleted = 0;
    let totalAssigned = 0;
    let successfulDays = 0;
    const dailyChart = dates.map((date) => {
      const s = summaryMap.get(date);
      const completed = s?.tasksCompleted ?? 0;
      const assigned = s?.tasksAssigned ?? 0;
      totalCompleted += completed;
      totalAssigned += assigned;
      if (s?.goalMet) successfulDays++;

      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { date, dayName, completed, assigned, goalMet: s?.goalMet ?? false };
    });

    const weeklyAverageTasks = Number((totalCompleted / 7).toFixed(1));
    const goalSuccessRate = Number(((successfulDays / 7) * 100).toFixed(1));
    const completionRate = totalAssigned > 0 ? Number(((totalCompleted / totalAssigned) * 100).toFixed(1)) : 0;

    return {
      weeklyAverageTasks,
      totalCompleted,
      successfulDays,
      totalDays: 7,
      goalSuccessRate,
      completionRate,
      dailyChart,
    };
  }

  async getMonthlyStats(userId: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const summaries = await this.prisma.dailySummary.findMany({
      where: {
        userId,
        date: { startsWith: monthPrefix },
      },
    });

    let totalCompleted = 0;
    let totalAssigned = 0;
    let successfulDays = 0;
    let missedDays = 0;
    let totalXP = 0;

    summaries.forEach((s) => {
      totalCompleted += s.tasksCompleted;
      totalAssigned += s.tasksAssigned;
      totalXP += s.xpEarned;
      if (s.goalMet) {
        successfulDays++;
      } else {
        missedDays++;
      }
    });

    const monthlyAverageTasks = Number((totalCompleted / daysInMonth).toFixed(1));
    const completionPercentage = totalAssigned > 0 ? Number(((totalCompleted / totalAssigned) * 100).toFixed(1)) : 0;
    const successRate = Number(((successfulDays / daysInMonth) * 100).toFixed(1));

    // Category breakdown for current month
    const categoryBreakdown = await this.getCategoryBreakdown(userId);

    // Weekly average trends (last 4 weeks)
    const weeklyTrends = await this.getFourWeekTrend(userId);

    return {
      monthName: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalCompleted,
      totalAssigned,
      monthlyAverageTasks,
      successfulDays,
      missedDays,
      daysInMonth,
      completionPercentage,
      successRate,
      totalXP,
      categoryBreakdown,
      weeklyTrends,
    };
  }

  async getCategoryBreakdown(userId: string) {
    const logs = await this.prisma.taskLog.findMany({
      where: { userId },
      include: { task: true },
    });

    const categoryCounts: Record<string, number> = {};
    logs.forEach((log) => {
      const cat = log.task.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  }

  async getFourWeekTrend(userId: string) {
    const result = [];
    const today = new Date();

    for (let week = 3; week >= 0; week--) {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (week * 7 + 6));
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() - (week * 7));

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const summaries = await this.prisma.dailySummary.findMany({
        where: {
          userId,
          date: { gte: startStr, lte: endStr },
        },
      });

      const completed = summaries.reduce((acc, s) => acc + s.tasksCompleted, 0);
      const avg = Number((completed / 7).toFixed(1));

      result.push({
        label: `Week ${4 - week}`,
        avgTasks: avg,
        totalCompleted: completed,
      });
    }

    return result;
  }

  async getDisciplineScore(userId: string) {
    const weekly = await this.getWeeklyStats(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const goalSuccessRate = weekly.goalSuccessRate; // 0 - 100
    const completionRate = weekly.completionRate;   // 0 - 100
    
    // Streak consistency score: 100 if streak >= 14, proportional otherwise
    const streak = user?.currentStreak || 0;
    const streakConsistency = Math.min((streak / 14) * 100, 100);

    /**
     * DISCIPLINE SCORE FORMULA (Section 12):
     * disciplineScore = (goalSuccessRate * 0.5) + (completionRate * 0.3) + (streakConsistency * 0.2)
     */
    const disciplineScore = Math.round(
      goalSuccessRate * 0.5 + completionRate * 0.3 + streakConsistency * 0.2,
    );

    return {
      disciplineScore: Math.min(Math.max(disciplineScore, 0), 100),
      components: {
        goalSuccessRate,
        completionRate,
        streakConsistency: Math.round(streakConsistency),
        currentStreak: streak,
      },
      formula: 'disciplineScore = (goalSuccessRate * 0.5) + (completionRate * 0.3) + (streakConsistency * 0.2)',
    };
  }
}
