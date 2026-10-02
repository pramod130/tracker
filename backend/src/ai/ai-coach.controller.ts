import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AICoachService } from './ai-coach.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('AI Coach')
@ApiBearerAuth()
@Controller('ai')
export class AICoachController {
  constructor(private readonly aiCoachService: AICoachService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Get smart task suggestions based on user goals' })
  async suggestTasks(@GetUser('id') userId: string, @Query('category') category?: string) {
    return this.aiCoachService.suggestTasks(userId, category);
  }

  @Get('weekly-coach')
  @ApiOperation({ summary: 'Get AI weekly coach performance breakdown and insight' })
  async getWeeklyCoachInsight(@GetUser('id') userId: string) {
    return this.aiCoachService.getWeeklyCoachInsight(userId);
  }

  @Post('breakdown')
  @ApiOperation({ summary: 'Break down a complex goal into 4 daily tasks' })
  async breakdownGoal(@GetUser('id') userId: string, @Body('goalTitle') goalTitle: string) {
    return this.aiCoachService.breakdownGoal(userId, goalTitle);
  }
}
