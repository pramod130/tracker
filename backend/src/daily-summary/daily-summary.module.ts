import { Module } from '@nestjs/common';
import { DailySummaryService } from './daily-summary.service';
import { DailySummaryController } from './daily-summary.controller';
import { StreaksModule } from '../streaks/streaks.module';

@Module({
  imports: [StreaksModule],
  controllers: [DailySummaryController],
  providers: [DailySummaryService],
  exports: [DailySummaryService],
})
export class DailySummaryModule {}
