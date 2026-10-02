import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { DailySummaryModule } from '../daily-summary/daily-summary.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ScheduleModule.forRoot(), DailySummaryModule, NotificationsModule],
  providers: [CronService],
})
export class CronModule {}
