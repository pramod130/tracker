import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: { targetCount: 'asc' },
    });
  }

  async getUserAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async checkAndUnlockAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        userAchievements: true,
      },
    });

    if (!user) return [];

    const unlockedCodes = new Set(user.userAchievements.map((ua) => ua.achievementId));
    const allAchievements = await this.prisma.achievement.findMany();
    const newlyUnlocked = [];

    // Total tasks completed
    const totalCompletedTasks = await this.prisma.taskLog.count({
      where: { userId },
    });

    // Learning tasks completed
    const learningTasks = await this.prisma.taskLog.count({
      where: {
        userId,
        task: { category: 'LEARNING' },
      },
    });

    // Fitness tasks completed
    const fitnessTasks = await this.prisma.taskLog.count({
      where: {
        userId,
        task: { category: 'FITNESS' },
      },
    });

    // Max daily tasks in a single day
    const maxDailyTasksGroup = await this.prisma.taskLog.groupBy({
      by: ['date'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });
    const maxTasksSingleDay = maxDailyTasksGroup.length > 0 ? maxDailyTasksGroup[0]._count.id : 0;

    for (const ach of allAchievements) {
      if (unlockedCodes.has(ach.id)) continue;

      let shouldUnlock = false;

      switch (ach.code) {
        case 'FIRST_STEP':
          shouldUnlock = totalCompletedTasks >= 1;
          break;
        case 'FIRST_FIRE':
          shouldUnlock = maxTasksSingleDay >= 4;
          break;
        case 'WARRIOR_3DAY':
          shouldUnlock = user.currentStreak >= 3;
          break;
        case 'STREAK_7DAY':
          shouldUnlock = user.currentStreak >= 7;
          break;
        case 'DISCIPLINE_30DAY':
          shouldUnlock = user.currentStreak >= 30;
          break;
        case 'TASKS_100':
          shouldUnlock = totalCompletedTasks >= 100;
          break;
        case 'OVERACHIEVER':
          shouldUnlock = maxTasksSingleDay >= 7;
          break;
        case 'LEARNING_BEAST':
          shouldUnlock = learningTasks >= 50;
          break;
        case 'FITNESS_MODE':
          shouldUnlock = fitnessTasks >= 50;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, ach);
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }

  private async unlockAchievement(userId: string, achievement: any) {
    await this.prisma.$transaction(async (tx: any) => {
      await tx.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      // Award XP
      const xpTxDelegate = tx.xPTransaction || tx.xpTransaction;
      if (xpTxDelegate) {
        await xpTxDelegate.create({
          data: {
            userId,
            amount: achievement.xpReward,
            source: 'ACHIEVEMENT_UNLOCK',
            description: `Unlocked achievement: ${achievement.title}`,
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalXP: { increment: achievement.xpReward },
        },
      });

      // Recalculate level: level = Math.floor(Math.sqrt(totalXP / 50)) + 1
      const newLevel = Math.floor(Math.sqrt(updatedUser.totalXP / 50)) + 1;
      if (newLevel !== updatedUser.level) {
        await tx.user.update({
          where: { id: userId },
          data: { level: newLevel },
        });
      }
    });
  }
}
