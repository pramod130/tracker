import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DailySummaryService } from './daily-summary.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Daily Summary')
@ApiBearerAuth()
@Controller('daily')
export class DailySummaryController {
  constructor(private readonly dailySummaryService: DailySummaryService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's summary progress" })
  async getTodaySummary(@GetUser('id') userId: string) {
    return this.dailySummaryService.getTodaySummary(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get historical daily summaries' })
  async getHistory(@GetUser('id') userId: string, @Query('limit') limit?: number) {
    return this.dailySummaryService.getHistory(userId, limit ? Number(limit) : 30);
  }

  @Get(':date')
  @ApiOperation({ summary: 'Get summary for a specific date (YYYY-MM-DD)' })
  async getSummaryForDate(@GetUser('id') userId: string, @Param('date') date: string) {
    return this.dailySummaryService.getSummaryForDate(userId, date);
  }
}
