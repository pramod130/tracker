import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { User as UserIcon, Flame, Users, Settings, Bell, Lock } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';

export const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await api.get('/friends');
      setFriends(res.data || res);
    } catch (e) {
      // ignore
    }
  };

  const handleToggleNotifications = (val: boolean) => {
    updateUser({
      preferences: {
        ...(user?.preferences as any),
        notificationsEnabled: val,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Card */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <UserIcon size={36} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.name || 'Operator'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Level {user?.level || 1}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: Colors.fireGlow }]}>
            <Flame size={12} color={Colors.fire} />
            <Text style={[styles.pillText, { color: Colors.fire }]}>
              {user?.currentStreak || 0}d Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{user?.totalXP || 0}</Text>
          <Text style={styles.statLbl}>Total XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{user?.longestStreak || 0}d</Text>
          <Text style={styles.statLbl}>Best Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: Colors.primary }]}>4</Text>
          <Text style={styles.statLbl}>Daily Min</Text>
        </View>
      </View>

      {/* Friends & Social Section */}
      <Text style={styles.sectionHeader}>FRIENDS & DISCIPLINE ALLIES</Text>
      <View style={styles.settingsGroup}>
        {friends.length === 0 ? (
          <View style={styles.emptyFriends}>
            <Users size={20} color={Colors.textMuted} />
            <Text style={styles.emptyFriendsText}>No friends added yet. Share your streak with allies!</Text>
          </View>
        ) : (
          friends.map((f) => (
            <View key={f.friendshipId} style={styles.friendRow}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendInitial}>{f.user.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.friendName}>{f.user.name}</Text>
                <Text style={styles.friendStreak}>🔥 {f.user.currentStreak} Day Streak</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Preferences & Settings */}
      <Text style={styles.sectionHeader}>PREFERENCES & SETTINGS</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Bell size={18} color={Colors.textSecondary} />
            <Text style={styles.settingText}>Daily Reminder Notifications</Text>
          </View>
          <Switch
            value={user?.preferences?.notificationsEnabled ?? true}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: Colors.cardBorder, true: Colors.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Lock size={18} color={Colors.textSecondary} />
            <Text style={styles.settingText}>Privacy Setting</Text>
          </View>
          <Text style={styles.settingVal}>Friends Only</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Settings size={18} color={Colors.textSecondary} />
            <Text style={styles.settingText}>Daily Minimum Target</Text>
          </View>
          <Text style={styles.settingVal}>4 Tasks (Default)</Text>
        </View>
      </View>

      <Button
        title="LOG OUT"
        variant="secondary"
        onPress={logout}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.primary,
  },
  statsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 24,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
  },
  statLbl: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.cardBorder,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
  },
  emptyFriends: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  emptyFriendsText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    flex: 1,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInitial: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontFamily: Fonts.black,
    fontSize: 14,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  friendStreak: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.fire,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
  },
  settingVal: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
});
