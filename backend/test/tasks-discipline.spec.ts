describe('Winter Arc Core Discipline Rules & Formula Verification', () => {
  it('should verify 4-task daily minimum success criteria', () => {
    const dailyMinimum = 4;

    const evalSuccess = (completed: number) => completed >= dailyMinimum;

    expect(evalSuccess(0)).toBe(false);
    expect(evalSuccess(1)).toBe(false);
    expect(evalSuccess(2)).toBe(false);
    expect(evalSuccess(3)).toBe(false);
    expect(evalSuccess(4)).toBe(true); // 4/4 = SUCCESS
    expect(evalSuccess(5)).toBe(true); // 5/4 = OVERACHIEVER SUCCESS
    expect(evalSuccess(6)).toBe(true);
  });

  it('should correctly compute Discipline Score using transparent formula', () => {
    const goalSuccessRate = 85.7; // e.g. 6/7 days
    const completionRate = 80.0;
    const currentStreak = 14;
    const streakConsistency = Math.min((currentStreak / 14) * 100, 100);

    const score = Math.round(
      goalSuccessRate * 0.5 + completionRate * 0.3 + streakConsistency * 0.2,
    );

    expect(score).toBe(87);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should calculate weekly average tasks correctly without percentage skew', () => {
    const dailyCompletions = [4, 5, 3, 4, 6, 5, 4]; // Total = 31 tasks in 7 days
    const totalCompleted = dailyCompletions.reduce((a, b) => a + b, 0);
    const weeklyAvg = Number((totalCompleted / 7).toFixed(1));

    expect(totalCompleted).toBe(31);
    expect(weeklyAvg).toBe(4.4);
  });
});
