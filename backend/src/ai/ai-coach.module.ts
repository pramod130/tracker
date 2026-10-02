import { Module } from '@nestjs/common';
import { AICoachService } from './ai-coach.service';
import { AICoachController } from './ai-coach.controller';

@Module({
  controllers: [AICoachController],
  providers: [AICoachService],
  exports: [AICoachService],
})
export class AICoachModule {}
