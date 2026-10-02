import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Flame, Target, Trophy, TrendingUp, ShieldAlert, Sparkles, Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { Button } from '../components/ui/Button';

interface Props {
  onFinishOnboarding: (selectedCategory: string, templates: string[]) => void;
}

const STEPS = [
  {
    icon: SnowflakeIcon,
    title: 'WINTER ARC',
    subtitle: 'Become stronger, one day at a time.',
    description: 'Transform your mindset through continuous, daily discipline during this focused season of growth.',
  },
  {
    icon: TargetIcon,
    title: 'CORE CHALLENGE',
    subtitle: 'Complete at least 4 meaningful tasks every day.',
    description: 'The foundation of Winter Arc is hitting your daily minimum of 4 completed habits. No excuses.',
  },
  {
    icon: FlameIcon,
    title: 'BUILD STREAKS',
    subtitle: 'Consistency compounds over time.',
    description: 'Protect your streak with Rest Days and Streak Freezes while compounding your discipline daily.',
  },
  {
    icon: ChartIcon,
    title: 'TRACK YOUR GROWTH',
    subtitle: 'Measurable analytics & Discipline Score.',
    description: 'Monitor your weekly averages, category breakdowns, and real-time Discipline Score.',
  },
  {
    icon: RewardIcon,
    title: 'EARN XP & BADGES',
    subtitle: 'Turn effort into level progress.',
    description: 'Level up your discipline operator status with achievements, weekly quests, and streak rewards.',
  },
];

function SnowflakeIcon() {
  return <Sparkles size={48} color={Colors.primary} />;
}
function TargetIcon() {
  return <Target size={48} color={Colors.fire} />;
}
function FlameIcon() {
  return <Flame size={48} color={Colors.fire} fill={Colors.fire} />;
}
function ChartIcon() {
  return <TrendingUp size={48} color={Colors.primary} />;
}
function RewardIcon() {
  return <Trophy size={48} color={Colors.xpGold} />;
}

const CATEGORIES = [
  { id: 'FITNESS', label: 'Fitness & Physical Growth', icon: '🏋️' },
  { id: 'LEARNING', label: 'Learning & Skill Building', icon: '📚' },
  { id: 'CAREER', label: 'Career & Engineering', icon: '💼' },
  { id: 'PRODUCTIVITY', label: 'Productivity & Focus', icon: '⚡' },
  { id: 'HEALTH', label: 'Health & Mindfulness', icon: '🧘' },
];

export const OnboardingScreen: React.FC<Props> = ({ onFinishOnboarding }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('CAREER');

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(5);
    }
  };

  const handleComplete = () => {
    onFinishOnboarding(selectedCategory, []);
  };

  if (stepIndex < STEPS.length) {
    const current = STEPS[stepIndex];
    const Icon = current.icon;

    return (
      <View style={styles.container}>
        <View style={styles.topProgress}>
          {STEPS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.progressDot,
                idx === stepIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.centerContent}>
          <View style={styles.iconCircle}>
            <Icon />
          </View>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
          <Text style={styles.description}>{current.description}</Text>
        </View>

        <View style={styles.bottomBar}>
          <Button
            title={stepIndex === STEPS.length - 1 ? "SETUP YOUR ARC" : "NEXT"}
            onPress={handleNext}
            style={styles.fullWidth}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.setupTitle}>SELECT PRIMARY GOAL</Text>
      <Text style={styles.setupSubtitle}>Choose your main discipline focus for this Winter Arc</Text>

      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => setSelectedCategory(cat.id)}
            style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={[styles.catLabel, isSelected && styles.catLabelSelected]}>
              {cat.label}
            </Text>
            {isSelected && <Check size={20} color={Colors.primary} />}
          </TouchableOpacity>
        );
      })}

      <View style={styles.infoBox}>
        <ShieldAlert size={18} color={Colors.primary} />
        <Text style={styles.infoText}>
          Your Arc will default to a minimum of 4 tasks daily. You can add templates with 1 tap after entering.
        </Text>
      </View>

      <Button
        title="START DAY 1"
        variant="fire"
        onPress={handleComplete}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.cardBorder,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 36,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomBar: {
    paddingBottom: 40,
  },
  fullWidth: {
    width: '100%',
  },
  setupTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  setupSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  catIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  catLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  catLabelSelected: {
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
