import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily analytics' })
  async getDailyStats(@GetUser('id') userId: string, @Query('date') date?: string) {
    return this.analyticsService.getDailyStats(userId, date);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly analytics & charts data' })
  async getWeeklyStats(@GetUser('id') userId: string) {
    return this.analyticsService.getWeeklyStats(userId);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly performance statistics' })
  async getMonthlyStats(@GetUser('id') userId: string) {
    return this.analyticsService.getMonthlyStats(userId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get completed task breakdown by category' })
  async getCategoryBreakdown(@GetUser('id') userId: string) {
    return this.analyticsService.getCategoryBreakdown(userId);
  }

  @Get('discipline-score')
  @ApiOperation({ summary: 'Get overall Discipline Score and formula breakdown' })
  async getDisciplineScore(@GetUser('id') userId: string) {
    return this.analyticsService.getDisciplineScore(userId);
  }
}
