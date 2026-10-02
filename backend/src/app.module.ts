import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { DailySummaryModule } from './daily-summary/daily-summary.module';
import { StreaksModule } from './streaks/streaks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ChallengesModule } from './challenges/challenges.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AICoachModule } from './ai/ai-coach.module';
import { CronModule } from './cron/cron.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TasksModule,
    DailySummaryModule,
    StreaksModule,
    AnalyticsModule,
    AchievementsModule,
    ChallengesModule,
    FriendsModule,
    NotificationsModule,
    AICoachModule,
    CronModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
