import { create } from 'zustand';
import { Achievement, Challenge } from '../types';
import { api } from '../services/api';

interface ChallengeState {
  achievements: Achievement[];
  userAchievements: any[];
  challenges: Challenge[];
  isLoading: boolean;

  fetchRewardsData: () => Promise<void>;
  joinChallenge: (id: string) => Promise<boolean>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  achievements: [],
  userAchievements: [],
  challenges: [],
  isLoading: false,

  fetchRewardsData: async () => {
    set({ isLoading: true });
    try {
      const [allAch, userAch, allChal] = await Promise.all([
        api.get('/achievements'),
        api.get('/achievements/user'),
        api.get('/challenges'),
      ]);

      set({
        achievements: allAch.data || allAch,
        userAchievements: userAch.data || userAch,
        challenges: allChal.data || allChal,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  joinChallenge: async (id: string) => {
    try {
      await api.post(`/challenges/${id}/join`);
      await get().fetchRewardsData();
      return true;
    } catch (e) {
      return false;
    }
  },
}));
