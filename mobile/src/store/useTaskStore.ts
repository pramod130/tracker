import { create } from 'zustand';
import { Task, DailySummary, MatrixDay, MatrixTask } from '../types';
import { api } from '../services/api';
import { StorageService } from '../services/storage';

interface TaskState {
  todayTasks: Task[];
  matrixDays: MatrixDay[];
  matrixTasks: MatrixTask[];
  templates: any[];
  summary: DailySummary | null;
  isLoading: boolean;
  isCelebrationVisible: boolean;
  celebrationData: { xp: number; streak: number } | null;

  fetchTodayTasks: () => Promise<void>;
  fetchMatrix: () => Promise<void>;
  toggleMatrixCell: (taskId: string, dateStr: string) => Promise<boolean>;
  fetchTemplates: () => Promise<void>;
  completeTask: (taskId: string, dateStr?: string) => Promise<boolean>;
  uncompleteTask: (taskId: string, dateStr?: string) => Promise<boolean>;
  createTask: (taskData: Partial<Task>) => Promise<boolean>;
  addFromTemplate: (templateId: string) => Promise<boolean>;
  closeCelebration: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  todayTasks: [],
  matrixDays: [],
  matrixTasks: [],
  templates: [],
  summary: null,
  isLoading: false,
  isCelebrationVisible: false,
  celebrationData: null,

  fetchTodayTasks: async () => {
    set({ isLoading: true });
    try {
      const cached = await StorageService.getCachedTodayTasks();
      if (cached.length > 0) set({ todayTasks: cached });

      const res = await api.get('/tasks/today');
      const tasks = res.data || res;

      const summaryRes = await api.get('/daily/today');
      const summary = summaryRes.data || summaryRes;

      await StorageService.setCachedTodayTasks(tasks);
      set({ todayTasks: tasks, summary, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  fetchMatrix: async () => {
    try {
      const res = await api.get('/tasks/matrix');
      const data = res.data || res;
      set({ matrixDays: data.days || [], matrixTasks: data.tasks || [] });
    } catch (e) {
      console.warn('Error fetching 5-day matrix:', e);
    }
  },

  toggleMatrixCell: async (taskId: string, dateStr: string) => {
    const currentTasks = get().matrixTasks;
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return false;

    const isCurrentlyDone = task.completions[dateStr] || false;

    // Optimistic matrix state update
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          completions: {
            ...t.completions,
            [dateStr]: !isCurrentlyDone,
          },
        };
      }
      return t;
    });
    set({ matrixTasks: updatedTasks });

    try {
      const endpoint = isCurrentlyDone
        ? `/tasks/${taskId}/uncomplete`
        : `/tasks/${taskId}/complete`;

      const res = await api.post(endpoint, { date: dateStr });
      const payload = res.data || res;

      if (payload.summary) {
        set({ summary: payload.summary });
      }

      if (!isCurrentlyDone && payload.isGoalJustMet) {
        set({
          isCelebrationVisible: true,
          celebrationData: {
            xp: payload.xpEarned || 40,
            streak: payload.summary?.streakStatus || 1,
          },
        });
      }

      await get().fetchTodayTasks();
      await get().fetchMatrix();
      return true;
    } catch (err) {
      set({ matrixTasks: currentTasks });
      return false;
    }
  },

  fetchTemplates: async () => {
    try {
      const res = await api.get('/tasks/templates');
      set({ templates: res.data || res });
    } catch (e) {
      console.warn('Error fetching task templates:', e);
    }
  },

  completeTask: async (taskId: string, customDate?: string) => {
    // Optimistic UI update
    const previousTasks = get().todayTasks;
    const updatedTasks = previousTasks.map((t) =>
      t.id === taskId ? { ...t, isCompletedToday: true } : t,
    );
    set({ todayTasks: updatedTasks });
    StorageService.setCachedTodayTasks(updatedTasks);

    try {
      const res = await api.post(`/tasks/${taskId}/complete`, { date: customDate });
      const payload = res.data || res;

      if (payload.summary) {
        set({ summary: payload.summary });
      }

      // Trigger Section 6 Celebration modal if 4th task goal just met!
      if (payload.isGoalJustMet) {
        set({
          isCelebrationVisible: true,
          celebrationData: {
            xp: payload.xpEarned || 40,
            streak: payload.summary?.streakStatus || 1,
          },
        });
      }

      await get().fetchTodayTasks();
      await get().fetchMatrix();
      return true;
    } catch (err) {
      // Revert optimistic update & queue for offline retry if offline
      set({ todayTasks: previousTasks });
      await StorageService.enqueueOfflineAction({
        type: 'COMPLETE_TASK',
        taskId,
      });
      return false;
    }
  },

  uncompleteTask: async (taskId: string, customDate?: string) => {
    const previousTasks = get().todayTasks;
    const updatedTasks = previousTasks.map((t) =>
      t.id === taskId ? { ...t, isCompletedToday: false } : t,
    );
    set({ todayTasks: updatedTasks });

    try {
      const res = await api.post(`/tasks/${taskId}/uncomplete`, { date: customDate });
      const payload = res.data || res;
      if (payload.summary) set({ summary: payload.summary });
      await get().fetchTodayTasks();
      await get().fetchMatrix();
      return true;
    } catch (err) {
      set({ todayTasks: previousTasks });
      return false;
    }
  },

  createTask: async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      await get().fetchTodayTasks();
      await get().fetchMatrix();
      return true;
    } catch (e) {
      return false;
    }
  },

  addFromTemplate: async (templateId: string) => {
    try {
      await api.post(`/tasks/templates/${templateId}/add`);
      await get().fetchTodayTasks();
      await get().fetchMatrix();
      return true;
    } catch (e) {
      return false;
    }
  },

  closeCelebration: () => {
    set({ isCelebrationVisible: false, celebrationData: null });
  },
}));

