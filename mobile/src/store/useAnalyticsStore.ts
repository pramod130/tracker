import { create } from 'zustand';
import { DisciplineScoreData } from '../types';
import { api } from '../services/api';

interface AnalyticsState {
  weeklyStats: any | null;
  monthlyStats: any | null;
  disciplineScore: DisciplineScoreData | null;
  categoryBreakdown: any[];
  isLoading: boolean;

  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  weeklyStats: null,
  monthlyStats: null,
  disciplineScore: null,
  categoryBreakdown: [],
  isLoading: false,

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const [weekly, monthly, score, categories] = await Promise.all([
        api.get('/analytics/weekly'),
        api.get('/analytics/monthly'),
        api.get('/analytics/discipline-score'),
        api.get('/analytics/categories'),
      ]);

      set({
        weeklyStats: weekly.data || weekly,
        monthlyStats: monthly.data || monthly,
        disciplineScore: score.data || score,
        categoryBreakdown: categories.data || categories,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
