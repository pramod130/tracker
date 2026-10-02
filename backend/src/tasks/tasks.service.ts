import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailySummaryService } from '../daily-summary/daily-summary.service';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private dailySummaryService: DailySummaryService,
    private achievementsService: AchievementsService,
  ) {}

  async getAllTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTodayTasks(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0];

    const tasks = await this.prisma.task.findMany({
      where: { userId, isActive: true },
      include: {
        taskLogs: {
          where: { date: todayStr },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return tasks.map((task) => ({
      ...task,
      isCompletedToday: task.taskLogs.length > 0,
      todayLog: task.taskLogs[0] || null,
    }));
  }

  async get5DayTaskMatrix(userId: string) {
    const today = new Date();
    const days: { date: string; label: string; dayNum: number; isToday: boolean }[] = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const dayName = isToday
        ? 'Today'
        : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();

      days.push({
        date: dateStr,
        label: dayName,
        dayNum,
        isToday,
      });
    }

    const dateList = days.map((d) => d.date);

    const tasks = await this.prisma.task.findMany({
      where: { userId, isActive: true },
      include: {
        taskLogs: {
          where: { date: { in: dateList } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const matrixTasks = tasks.map((task) => {
      const completions: Record<string, boolean> = {};
      dateList.forEach((dateStr) => {
        completions[dateStr] = task.taskLogs.some((log) => log.date === dateStr);
      });

      return {
        ...task,
        isCompletedToday: completions[dateList[4]] || false,
        completions,
      };
    });

    return {
      days,
      tasks: matrixTasks,
    };
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const daysOfWeekVal = Array.isArray(dto.daysOfWeek)
      ? JSON.stringify(dto.daysOfWeek)
      : dto.daysOfWeek || '[]';

    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        type: (dto.type || 'DAILY_HABIT') as any,
        category: (dto.category || 'PERSONAL') as any,
        icon: dto.icon || 'check-circle',
        frequency: (dto.frequency || 'DAILY') as any,
        daysOfWeek: daysOfWeekVal as any,
        targetValue: dto.targetValue || 1.0,
        unit: dto.unit || 'times',
        points: dto.points || 10,
        reminderEnabled: dto.reminderEnabled || false,
        reminderTime: dto.reminderTime || '08:00',
        isActive: true,
      },
    });
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access to task denied');
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.getTaskById(userId, taskId);

    const updateData: any = { ...dto };
    if (Array.isArray(dto.daysOfWeek)) {
      updateData.daysOfWeek = JSON.stringify(dto.daysOfWeek);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTaskById(userId, taskId);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { isActive: false },
    });

    return { message: 'Task deleted successfully' };
  }

  async completeTask(userId: string, taskId: string, customDate?: string) {
    const task = await this.getTaskById(userId, taskId);
    if (!task.isActive) {
      throw new BadRequestException('Task is inactive');
    }

    const dateStr = customDate || new Date().toISOString().split('T')[0];

    // Check if already completed today
    const existingLog = await this.prisma.taskLog.findUnique({
      where: { taskId_date: { taskId, date: dateStr } },
    });

    if (existingLog) {
      return { message: 'Task already completed for this date', taskLog: existingLog };
    }

    // Check before count
    const logsBefore = await this.prisma.taskLog.count({
      where: { userId, date: dateStr },
    });

    const userPrefs = await this.prisma.userPreferences.findUnique({ where: { userId } });
    const dailyMinimum = userPrefs?.dailyMinimum ?? 4;

    // Calculate XP
    let xpEarned = task.points;
    let is4thGoalMetBonus = false;

    if (logsBefore + 1 === dailyMinimum) {
      // Bonus 20 XP for hitting the daily minimum 4 tasks!
      xpEarned += 20;
      is4thGoalMetBonus = true;
    }

    // Execute completion transaction
    const result = await this.prisma.$transaction(async (tx: any) => {
      const taskLog = await tx.taskLog.create({
        data: {
          taskId,
          userId,
          date: dateStr,
          completedAt: new Date(),
          value: task.targetValue,
          xpEarned,
        },
      });

      // Record XP Transaction
      const xpTxDelegate = tx.xPTransaction || tx.xpTransaction;
      if (xpTxDelegate) {
        await xpTxDelegate.create({
          data: {
            userId,
            amount: xpEarned,
            source: 'TASK_COMPLETE',
            description: `Completed task: ${task.title}${is4thGoalMetBonus ? ' (includes +20 Daily Goal Bonus)' : ''}`,
          },
        });
      }

      // Update User total XP and recalculate Level
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalXP: { increment: xpEarned },
        },
      });

      const newLevel = Math.floor(Math.sqrt(updatedUser.totalXP / 50)) + 1;
      if (newLevel !== updatedUser.level) {
        await tx.user.update({
          where: { id: userId },
          data: { level: newLevel },
        });
      }

      return taskLog;
    });

    // Update Daily Summary & Streak
    const updatedSummary = await this.dailySummaryService.recalculateDailySummary(userId, dateStr);

    // Check & Unlock Achievements
    const newlyUnlockedAchievements = await this.achievementsService.checkAndUnlockAchievements(userId);

    const isGoalJustMet = logsBefore < dailyMinimum && updatedSummary.tasksCompleted >= dailyMinimum;

    return {
      success: true,
      message: isGoalJustMet ? '🔥 DAILY GOAL COMPLETE! 4/4 TASKS COMPLETED!' : 'Task completed successfully',
      taskLog: result,
      summary: updatedSummary,
      xpEarned,
      isGoalJustMet,
      unlockedAchievements: newlyUnlockedAchievements,
    };
  }

  async uncompleteTask(userId: string, taskId: string, customDate?: string) {
    await this.getTaskById(userId, taskId);
    const dateStr = customDate || new Date().toISOString().split('T')[0];

    const existingLog = await this.prisma.taskLog.findUnique({
      where: { taskId_date: { taskId, date: dateStr } },
    });

    if (!existingLog) {
      throw new NotFoundException('Task log not found for this date');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.taskLog.delete({
        where: { id: existingLog.id },
      });

      // Deduct XP
      await tx.user.update({
        where: { id: userId },
        data: {
          totalXP: { decrement: existingLog.xpEarned },
        },
      });
    });

    const updatedSummary = await this.dailySummaryService.recalculateDailySummary(userId, dateStr);

    return {
      success: true,
      message: 'Task completion reverted',
      summary: updatedSummary,
    };
  }

  async getTemplates() {
    return this.prisma.taskTemplate.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async addFromTemplate(userId: string, templateId: string) {
    const template = await this.prisma.taskTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.createTask(userId, {
      title: template.title,
      description: template.description,
      type: template.type as any,
      category: template.category as any,
      icon: template.icon,
      points: template.defaultPoints,
      targetValue: template.targetValue,
      unit: template.unit,
    });
  }
}
