import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationsService = {
  async requestPermissions() {
    if (Platform.OS === 'web') return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleDailyReminder(hour = 20, minute = 0) {
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Winter Arc Daily Goal Check',
        body: 'Check your progress! Complete at least 4 daily tasks to keep your streak burning.',
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  },
};
