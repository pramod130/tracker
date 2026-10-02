import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useAnalyticsStore } from '../store/useAnalyticsStore';

export const AnalyticsScreen = () => {
  const {
    weeklyStats,
    monthlyStats,
    disciplineScore,
    categoryBreakdown,
    isLoading,
    fetchAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchAnalytics} tintColor={Colors.primary} />
      }
    >
      <Text style={styles.pageTitle}>ANALYTICS ENGINE</Text>
      <Text style={styles.pageSub}>Measurable performance metrics & score</Text>

      {/* Discipline Score Highlight Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreTitle}>DISCIPLINE SCORE</Text>
          <Text style={styles.scoreValue}>
            {disciplineScore?.disciplineScore ?? 0}%
          </Text>
          <Text style={styles.scoreFormula}>
            Formula: (GoalSuccess × 50%) + (Completion × 30%) + (Streak × 20%)
          </Text>
        </View>
        <View style={styles.scoreBadgeCircle}>
          <ShieldCheck size={36} color={Colors.primary} />
        </View>
      </View>

      {/* Weekly Performance Stats Grid */}
      <Text style={styles.sectionHeader}>WEEKLY PERFORMANCE</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Text style={styles.statNum}>{weeklyStats?.weeklyAverageTasks ?? 0}</Text>
          <Text style={styles.statLabel}>Avg Tasks / Day</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statNum}>{weeklyStats?.successfulDays ?? 0} / 7</Text>
          <Text style={styles.statLabel}>Goal Met Days</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statNum}>{weeklyStats?.completionRate ?? 0}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      {/* 7-Day Completion Bar Visual */}
      <Text style={styles.sectionHeader}>TASKS PER DAY (LAST 7 DAYS)</Text>
      <View style={styles.chartCard}>
        <View style={styles.barChartRow}>
          {weeklyStats?.dailyChart?.map((item: any) => {
            const barHeight = Math.min((item.completed / 6) * 100, 100);
            return (
              <View key={item.date} style={styles.barCol}>
                <Text style={styles.barValue}>{item.completed}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${barHeight}%` },
                      item.goalMet ? styles.barGoalMet : styles.barPartial,
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.dayName}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Category Breakdown */}
      <Text style={styles.sectionHeader}>CATEGORY BREAKDOWN</Text>
      <View style={styles.categoryCard}>
        {categoryBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>No categorised task logs recorded yet.</Text>
        ) : (
          categoryBreakdown.map((cat) => (
            <View key={cat.category} style={styles.catRow}>
              <Text style={styles.catName}>{cat.category}</Text>
              <View style={styles.catTrack}>
                <View
                  style={[
                    styles.catFill,
                    { width: `${Math.min((cat.count / 20) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.catCount}>{cat.count}</Text>
            </View>
          ))
        )}
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
  scoreCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 24,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  scoreFormula: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  scoreBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statTile: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 24,
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: Colors.primaryGlow,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barGoalMet: {
    backgroundColor: Colors.fire,
  },
  barPartial: {
    backgroundColor: Colors.primary,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginTop: 6,
  },
  categoryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  catName: {
    width: 90,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  catTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.primaryGlow,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  catCount: {
    width: 24,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.primary,
    textAlign: 'right',
  },
});
