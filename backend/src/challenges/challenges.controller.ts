import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of active weekly quests & challenges' })
  async getAllChallenges() {
    return this.challengesService.getAllChallenges();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new group challenge' })
  async createChallenge(@GetUser('id') userId: string, @Body() data: any) {
    return this.challengesService.createChallenge(userId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get challenge details & leaderboard' })
  async getChallengeById(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.challengesService.getChallengeById(id, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a weekly challenge' })
  async joinChallenge(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.challengesService.joinChallenge(id, userId);
  }
}
