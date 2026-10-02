import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@winter_arc_access_token',
  REFRESH_TOKEN: '@winter_arc_refresh_token',
  USER_DATA: '@winter_arc_user_data',
  TODAY_TASKS: '@winter_arc_today_tasks',
  OFFLINE_QUEUE: '@winter_arc_offline_queue',
};

export interface OfflineAction {
  id: string;
  type: 'COMPLETE_TASK' | 'UNCOMPLETE_TASK' | 'CREATE_TASK';
  taskId: string;
  payload?: any;
  timestamp: number;
}

export const StorageService = {
  async getTokens() {
    const accessToken = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    const refreshToken = await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    return { accessToken, refreshToken };
  },

  async setTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
  },

  async clearTokens() {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);
  },

  async getCachedUser() {
    const raw = await AsyncStorage.getItem(KEYS.USER_DATA);
    return raw ? JSON.parse(raw) : null;
  },

  async setCachedUser(user: any) {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
  },

  async getCachedTodayTasks() {
    const raw = await AsyncStorage.getItem(KEYS.TODAY_TASKS);
    return raw ? JSON.parse(raw) : [];
  },

  async setCachedTodayTasks(tasks: any[]) {
    await AsyncStorage.setItem(KEYS.TODAY_TASKS, JSON.stringify(tasks));
  },

  async getOfflineQueue(): Promise<OfflineAction[]> {
    const raw = await AsyncStorage.getItem(KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  },

  async enqueueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
    const queue = await this.getOfflineQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    queue.push(newAction);
    await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    return newAction;
  },

  async clearOfflineQueue() {
    await AsyncStorage.removeItem(KEYS.OFFLINE_QUEUE);
  },
};
