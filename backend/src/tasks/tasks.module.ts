import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DailySummaryModule } from '../daily-summary/daily-summary.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [DailySummaryModule, AchievementsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
