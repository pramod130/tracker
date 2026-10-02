import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Award, Trophy, Zap, Sparkles, Lock } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useAuthStore } from '../store/useAuthStore';
import { useChallengeStore } from '../store/useChallengeStore';
import { api } from '../services/api';

export const RewardsScreen = () => {
  const { user } = useAuthStore();
  const { achievements, userAchievements, challenges, isLoading, fetchRewardsData, joinChallenge } =
    useChallengeStore();

  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    fetchRewardsData();
    fetchAICoachInsight();
  }, []);

  const fetchAICoachInsight = async () => {
    try {
      const res = await api.get('/ai/weekly-coach');
      setAiInsight(res.data?.coachInsight || res.coachInsight);
    } catch (e) {
      // ignore
    }
  };

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  const totalXP = user?.totalXP || 0;
  const currentLevel = user?.level || 1;
  const currentLevelXPFloor = Math.pow(currentLevel - 1, 2) * 50;
  const nextLevelXPHeader = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = Math.max(totalXP - currentLevelXPFloor, 0);
  const xpRequiredForNext = Math.max(nextLevelXPHeader - currentLevelXPFloor, 100);
  const levelProgressPct = Math.min((xpInCurrentLevel / xpRequiredForNext) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchRewardsData} tintColor={Colors.primary} />
      }
    >
      <Text style={styles.pageTitle}>REWARDS & QUESTS</Text>
      <Text style={styles.pageSub}>Level progression, badges & weekly challenges</Text>

      {/* Level & XP Progression Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelTitle}>LEVEL {currentLevel}</Text>
            <Text style={styles.levelSub}>Discipline Operator</Text>
          </View>
          <View style={styles.xpPill}>
            <Zap size={14} color={Colors.xpGold} fill={Colors.xpGold} />
            <Text style={styles.xpPillText}>{totalXP} Total XP</Text>
          </View>
        </View>

        {/* Level Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${levelProgressPct}%` }]} />
        </View>

        <View style={styles.levelFooter}>
          <Text style={styles.progressText}>
            {xpInCurrentLevel} / {xpRequiredForNext} XP
          </Text>
          <Text style={styles.remainingText}>
            {nextLevelXPHeader - totalXP} XP to Level {currentLevel + 1}
          </Text>
        </View>
      </View>

      {/* AI Coach Insight Banner */}
      {aiInsight && (
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color={Colors.primary} />
            <Text style={styles.aiTitle}>AI WEEKLY COACH INSIGHT</Text>
          </View>
          <Text style={styles.aiBody}>{aiInsight}</Text>
        </View>
      )}

      {/* Weekly Quests / Challenges */}
      <Text style={styles.sectionHeader}>ACTIVE WEEKLY QUESTS</Text>
      {challenges.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No active quests this week.</Text>
        </View>
      ) : (
        challenges.map((ch) => (
          <View key={ch.id} style={styles.questCard}>
            <View style={styles.questRow}>
              <View style={styles.questIconBox}>
                <Trophy size={20} color={Colors.fire} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.questTitle}>{ch.title}</Text>
                <Text style={styles.questDesc}>{ch.description}</Text>
              </View>
            </View>

            <View style={styles.questFooter}>
              <View style={styles.rewardBadge}>
                <Zap size={12} color={Colors.xpGold} fill={Colors.xpGold} />
                <Text style={styles.rewardBadgeText}>+{ch.xpReward} XP</Text>
              </View>

              <TouchableOpacity
                style={[styles.joinBtn, ch.isJoined && styles.joinedBtn]}
                disabled={ch.isJoined}
                onPress={() => joinChallenge(ch.id)}
              >
                <Text style={[styles.joinBtnText, ch.isJoined && styles.joinedBtnText]}>
                  {ch.isJoined ? 'JOINED' : 'JOIN QUEST'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Achievements Grid */}
      <Text style={styles.sectionHeader}>DISCIPLINE BADGES</Text>
      <View style={styles.achievementsGrid}>
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.has(ach.id);
          return (
            <View
              key={ach.id}
              style={[styles.badgeCard, !isUnlocked && styles.badgeCardLocked]}
            >
              <View style={[styles.badgeIconBox, isUnlocked ? styles.badgeIconUnlocked : styles.badgeIconLocked]}>
                {isUnlocked ? (
                  <Award size={24} color={Colors.xpGold} />
                ) : (
                  <Lock size={20} color={Colors.textMuted} />
                )}
              </View>

              <Text style={styles.badgeTitle} numberOfLines={1}>
                {ach.title}
              </Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>
                {ach.description}
              </Text>

              <View style={styles.badgeReward}>
                <Text style={styles.badgeXp}>+{ach.xpReward} XP</Text>
              </View>
            </View>
          );
        })}
      </View>
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  pageSub: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  levelCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  levelSub: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.xpGoldGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.xpGold,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  levelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  remainingText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  aiCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  aiBody: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  questCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  questRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  questIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.fireGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  questDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.xpGold,
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinedBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  joinBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: Fonts.black,
  },
  joinedBtnText: {
    color: Colors.textMuted,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeIconUnlocked: {
    backgroundColor: Colors.xpGoldGlow,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  badgeIconLocked: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    height: 28,
    marginBottom: 8,
  },
  badgeReward: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeXp: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.xpGold,
  },
});
