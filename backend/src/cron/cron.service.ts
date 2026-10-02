import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { DailySummaryService } from '../daily-summary/daily-summary.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private dailySummaryService: DailySummaryService,
    private notificationsService: NotificationsService,
  ) {}

  // Run at Midnight daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMidnightSummary() {
    this.logger.log('Executing midnight daily summary cron job...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const users = await this.prisma.user.findMany({ select: { id: true } });
    for (const user of users) {
      try {
        await this.dailySummaryService.recalculateDailySummary(user.id, dateStr);
      } catch (err) {
        this.logger.error(`Error calculating summary for user ${user.id}: ${err.message}`);
      }
    }
  }

  // Run daily at 8:00 PM (Streak warning)
  @Cron('0 20 * * *')
  async handleStreakWarnings() {
    this.logger.log('Checking for users needing 8 PM streak reminder...');
    const todayStr = new Date().toISOString().split('T')[0];

    const activeUsers = await this.prisma.user.findMany({
      include: { preferences: true },
    });

    for (const user of activeUsers) {
      if (!user.preferences?.notificationsEnabled) continue;

      const dailyMin = user.preferences.dailyMinimum || 4;
      const todayLogs = await this.prisma.taskLog.count({
        where: { userId: user.id, date: todayStr },
      });

      if (todayLogs < dailyMin) {
        const remaining = dailyMin - todayLogs;
        await this.notificationsService.createNotification(
          user.id,
          '🔥 Keep Your Streak Alive!',
          `You have ${remaining} task${remaining > 1 ? 's' : ''} left to reach your Winter Arc goal today.`,
          'STREAK_WARNING',
        );
      }
    }
  }

  // Run daily at 3:00 AM to clean expired refresh tokens
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanExpiredTokens() {
    this.logger.log('Cleaning expired refresh tokens...');
    const result = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    this.logger.log(`Cleaned ${result.count} expired refresh tokens.`);
  }
}
