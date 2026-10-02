import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Shield, Trophy } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface Props {
  currentStreak: number;
  longestStreak: number;
  freezesAvailable?: number;
}

export const StreakBanner: React.FC<Props> = ({
  currentStreak,
  longestStreak,
  freezesAvailable = 1,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.fireIconContainer}>
          <Flame size={24} color={Colors.fire} fill={Colors.fire} />
        </View>
        <View>
          <Text style={styles.streakCount}>{currentStreak} DAY STREAK</Text>
          <Text style={styles.subtitle}>
            {currentStreak > 0 ? 'Keep the fire burning!' : 'Start your streak today'}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statBadge}>
          <Trophy size={12} color={Colors.xpGold} />
          <Text style={styles.statLabel}>BEST: {longestStreak}d</Text>
        </View>

        <View style={styles.freezeBadge}>
          <Shield size={12} color={Colors.primary} />
          <Text style={styles.freezeText}>{freezesAvailable} Freeze</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fireIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.fireGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.xpGold,
  },
  freezeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  freezeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});
