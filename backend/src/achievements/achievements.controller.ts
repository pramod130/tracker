import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system achievements' })
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user unlocked achievements' })
  async getUserAchievements(@GetUser('id') userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }
}
