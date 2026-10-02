import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Seed Achievements
  const achievements = [
    {
      code: 'FIRST_STEP',
      title: '🌱 First Step',
      description: 'Complete your first task.',
      icon: 'sprout',
      category: 'MILESTONE',
      xpReward: 50,
      targetCount: 1,
    },
    {
      code: 'FIRST_FIRE',
      title: '🔥 First Fire',
      description: 'Complete 4 tasks in one day.',
      icon: 'fire',
      category: 'DAILY_GOAL',
      xpReward: 100,
      targetCount: 1,
    },
    {
      code: 'WARRIOR_3DAY',
      title: '⚔️ 3 Day Warrior',
      description: 'Complete the daily goal for 3 consecutive days.',
      icon: 'sword',
      category: 'STREAK',
      xpReward: 150,
      targetCount: 3,
    },
    {
      code: 'STREAK_7DAY',
      title: '⚡ 7 Day Streak',
      description: 'Complete 7 successful days in a row.',
      icon: 'lightning-bolt',
      category: 'STREAK',
      xpReward: 300,
      targetCount: 7,
    },
    {
      code: 'DISCIPLINE_30DAY',
      title: '🏆 30 Day Discipline',
      description: 'Complete 30 successful days.',
      icon: 'trophy',
      category: 'STREAK',
      xpReward: 1000,
      targetCount: 30,
    },
    {
      code: 'TASKS_100',
      title: '💯 100 Tasks',
      description: 'Complete 100 total tasks.',
      icon: 'check-all',
      category: 'TOTAL',
      xpReward: 500,
      targetCount: 100,
    },
    {
      code: 'OVERACHIEVER',
      title: '🚀 Overachiever',
      description: 'Complete 7+ tasks in a single day.',
      icon: 'rocket',
      category: 'DAILY_GOAL',
      xpReward: 200,
      targetCount: 7,
    },
    {
      code: 'LEARNING_BEAST',
      title: '📚 Learning Beast',
      description: 'Complete 50 learning tasks.',
      icon: 'book-open',
      category: 'CATEGORY',
      xpReward: 400,
      targetCount: 50,
    },
    {
      code: 'FITNESS_MODE',
      title: '🏋️ Fitness Mode',
      description: 'Complete 50 fitness tasks.',
      icon: 'dumbbell',
      category: 'CATEGORY',
      xpReward: 400,
      targetCount: 50,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // Seed Task Templates
  const templates = [
    // Fitness
    {
      title: 'Workout',
      description: 'Complete 45 minutes of strength or cardio exercise',
      category: 'FITNESS' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'dumbbell',
      defaultPoints: 15,
      targetValue: 45,
      unit: 'mins',
    },
    {
      title: '10,000 Steps',
      description: 'Reach daily walking target',
      category: 'FITNESS' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'walk',
      defaultPoints: 10,
      targetValue: 10000,
      unit: 'steps',
    },
    {
      title: 'Stretching Routine',
      description: '15 minutes full body stretching',
      category: 'FITNESS' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'human-handsup',
      defaultPoints: 10,
      targetValue: 15,
      unit: 'mins',
    },
    {
      title: '50 Push-ups',
      description: 'Complete push-up sets throughout the day',
      category: 'FITNESS' as any,
      type: 'NUMERICAL_GOAL' as any,
      icon: 'arm-flex',
      defaultPoints: 15,
      targetValue: 50,
      unit: 'reps',
    },

    // Learning
    {
      title: 'Study 1 Hour',
      description: 'Focused study session on core topic',
      category: 'LEARNING' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'book-open-variant',
      defaultPoints: 15,
      targetValue: 60,
      unit: 'mins',
    },
    {
      title: 'Read 20 Pages',
      description: 'Read non-fiction or educational book',
      category: 'LEARNING' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'book',
      defaultPoints: 10,
      targetValue: 20,
      unit: 'pages',
    },
    {
      title: 'Practice Coding / DSA',
      description: 'Solve 2 problems or build feature',
      category: 'LEARNING' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'code-tags',
      defaultPoints: 20,
      targetValue: 2,
      unit: 'problems',
    },

    // Career
    {
      title: 'Apply for Jobs / Networking',
      description: 'Submit 2 applications or reach out to contacts',
      category: 'CAREER' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'briefcase',
      defaultPoints: 15,
      targetValue: 2,
      unit: 'actions',
    },
    {
      title: 'Build Portfolio Project',
      description: 'Work on personal project for 60 minutes',
      category: 'CAREER' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'laptop',
      defaultPoints: 20,
      targetValue: 60,
      unit: 'mins',
    },

    // Health / Mindfulness
    {
      title: 'Meditation',
      description: '10 minutes mindfulness or breathwork',
      category: 'MINDFULNESS' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'meditation',
      defaultPoints: 10,
      targetValue: 10,
      unit: 'mins',
    },
    {
      title: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      category: 'HEALTH' as any,
      type: 'NUMERICAL_GOAL' as any,
      icon: 'water',
      defaultPoints: 10,
      targetValue: 8,
      unit: 'glasses',
    },
    {
      title: 'Daily Journaling',
      description: 'Reflect on wins, learnings, and gratitude',
      category: 'MINDFULNESS' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'journal',
      defaultPoints: 10,
      targetValue: 1,
      unit: 'entry',
    },

    // Productivity
    {
      title: 'No Social Media for 2 Hours',
      description: 'Uninterrupted deep focus period',
      category: 'PRODUCTIVITY' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'cellphone-off',
      defaultPoints: 15,
      targetValue: 2,
      unit: 'hours',
    },
    {
      title: 'Plan Tomorrow',
      description: 'Review schedule and list top 4 goals',
      category: 'PRODUCTIVITY' as any,
      type: 'DAILY_HABIT' as any,
      icon: 'calendar-check',
      defaultPoints: 10,
      targetValue: 1,
      unit: 'plan',
    },
  ];

  for (const tpl of templates) {
    const existing = await prisma.taskTemplate.findFirst({
      where: { title: tpl.title },
    });
    if (!existing) {
      await prisma.taskTemplate.create({ data: tpl });
    }
  }

  // Seed default weekly challenge
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const existingChallenge = await prisma.challenge.findFirst({
    where: { title: 'Winter Arc Launch Quest' },
  });

  if (!existingChallenge) {
    await prisma.challenge.create({
      data: {
        title: 'Winter Arc Launch Quest',
        description: 'Complete 28 tasks over 7 days to master daily discipline.',
        category: 'PERSONAL' as any,
        targetCount: 28,
        xpReward: 250,
        startDate: new Date(),
        endDate: nextWeek,
        icon: 'fire-circle',
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
