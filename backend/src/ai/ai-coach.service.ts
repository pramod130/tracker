import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AICoachService {
  constructor(private prisma: PrismaService) {}

  async suggestTasks(userId: string, category?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    const targetCategory = category || user?.goalCategory || 'PERSONAL';

    const suggestionsMap: Record<string, any[]> = {
      CAREER: [
        { title: 'Practice 2 coding problems', category: 'CAREER', type: 'DAILY_HABIT', icon: 'code-tags', points: 15 },
        { title: 'Study one interview topic', category: 'CAREER', type: 'DAILY_HABIT', icon: 'book-open', points: 15 },
        { title: 'Work on portfolio project for 60 mins', category: 'CAREER', type: 'DAILY_HABIT', icon: 'laptop', points: 20 },
        { title: 'Update one section of resume or LinkedIn', category: 'CAREER', type: 'ONE_TIME_TODO', icon: 'briefcase', points: 10 },
      ],
      FITNESS: [
        { title: 'Complete 45 min workout', category: 'FITNESS', type: 'DAILY_HABIT', icon: 'dumbbell', points: 15 },
        { title: 'Walk 10,000 steps', category: 'FITNESS', type: 'NUMERICAL_GOAL', targetValue: 10000, unit: 'steps', icon: 'walk', points: 10 },
        { title: '15 mins post-workout stretch', category: 'FITNESS', type: 'DAILY_HABIT', icon: 'human-handsup', points: 10 },
        { title: 'Drink 3L of water', category: 'HEALTH', type: 'NUMERICAL_GOAL', targetValue: 3, unit: 'liters', icon: 'water', points: 10 },
      ],
      LEARNING: [
        { title: 'Read 20 pages of non-fiction', category: 'LEARNING', type: 'DAILY_HABIT', icon: 'book', points: 10 },
        { title: 'Study core technology topic for 60 mins', category: 'LEARNING', type: 'DAILY_HABIT', icon: 'school', points: 15 },
        { title: 'Write summary notes on what you learned', category: 'LEARNING', type: 'DAILY_HABIT', icon: 'note-text', points: 10 },
      ],
      PRODUCTIVITY: [
        { title: 'No social media for 2 hours during focus window', category: 'PRODUCTIVITY', type: 'DAILY_HABIT', icon: 'cellphone-off', points: 15 },
        { title: 'Clean and organize workspace', category: 'PRODUCTIVITY', type: 'DAILY_HABIT', icon: 'broom', points: 10 },
        { title: 'Plan tomorrow top 4 goals before bed', category: 'PRODUCTIVITY', type: 'DAILY_HABIT', icon: 'calendar-check', points: 10 },
      ],
    };

    const suggestions = suggestionsMap[targetCategory] || suggestionsMap['CAREER'];

    return {
      category: targetCategory,
      suggestions,
      aiAdvice: `Based on your ${targetCategory.toLowerCase()} focus, these tasks build maximum consistency toward your Winter Arc.`,
    };
  }

  async getWeeklyCoachInsight(userId: string) {
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const summaries = await this.prisma.dailySummary.findMany({
      where: { userId, date: { in: last7Days } },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const totalCompleted = summaries.reduce((acc, s) => acc + s.tasksCompleted, 0);
    const successfulDays = summaries.filter((s) => s.goalMet).length;
    const avgTasks = Number((totalCompleted / 7).toFixed(1));

    // Analyze day of week performance
    const dayPerformance = summaries.map((s) => ({
      day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }),
      completed: s.tasksCompleted,
      goalMet: s.goalMet,
    }));

    const weakestDay = dayPerformance.find((d) => !d.goalMet)?.day || 'Sunday';

    let summaryInsight = '';
    if (successfulDays >= 6) {
      summaryInsight = `Outstanding momentum! You completed ${totalCompleted} tasks this week across ${successfulDays}/7 days. Your discipline is compounding fast.`;
    } else if (successfulDays >= 4) {
      summaryInsight = `Solid progress with ${totalCompleted} tasks completed. You notice a slight dip on ${weakestDay}s—try scheduling lighter routine tasks on that day to keep your streak unbroken.`;
    } else {
      summaryInsight = `You completed ${totalCompleted} tasks this week. Remember, consistency beats intensity. Pick 4 small, achievable habits for tomorrow to rebuild your streak.`;
    }

    return {
      weeklyTotalTasks: totalCompleted,
      successfulDays,
      averageTasksPerDay: avgTasks,
      currentStreak: user?.currentStreak || 0,
      weakestDay,
      coachInsight: summaryInsight,
    };
  }

  async breakdownGoal(userId: string, goalTitle: string) {
    // Intelligent rule-based goal decomposition engine
    const lower = goalTitle.toLowerCase();
    let subtasks = [];

    if (lower.includes('machine learning') || lower.includes('ai')) {
      subtasks = [
        { title: 'Study linear regression & gradient descent concepts', targetValue: 45, unit: 'mins' },
        { title: 'Practice 1 Scikit-Learn or PyTorch dataset notebook', targetValue: 1, unit: 'notebook' },
        { title: 'Watch 1 Machine Learning lecture/tutorial', targetValue: 1, unit: 'video' },
        { title: 'Train and evaluate baseline classification model', targetValue: 1, unit: 'model' },
      ];
    } else if (lower.includes('fit') || lower.includes('muscle') || lower.includes('weight')) {
      subtasks = [
        { title: '45 mins resistance strength training session', targetValue: 45, unit: 'mins' },
        { title: 'Hit 150g daily protein target', targetValue: 150, unit: 'grams' },
        { title: '10,000 steps daily walk', targetValue: 10000, unit: 'steps' },
        { title: '8 hours quality sleep recovery', targetValue: 8, unit: 'hours' },
      ];
    } else {
      subtasks = [
        { title: `Read background material for ${goalTitle}`, targetValue: 30, unit: 'mins' },
        { title: `Complete hands-on exercise 1 for ${goalTitle}`, targetValue: 1, unit: 'exercise' },
        { title: `Review and summarize key learnings for ${goalTitle}`, targetValue: 1, unit: 'summary' },
        { title: `Practice core technique for ${goalTitle}`, targetValue: 45, unit: 'mins' },
      ];
    }

    return {
      goalTitle,
      suggestedDailyMinimum: 4,
      subtasks,
      recommendation: `Break down "${goalTitle}" into these 4 daily tasks to guarantee hitting your daily Winter Arc minimum.`,
    };
  }
}
