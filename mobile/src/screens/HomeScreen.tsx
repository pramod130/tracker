import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { Plus, Sparkles, Zap, Flame, Shield, Trophy } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useAuthStore } from '../store/useAuthStore';
import { useTaskStore } from '../store/useTaskStore';
import { CircularProgress } from '../components/ui/CircularProgress';
import { TaskCard } from '../components/ui/TaskCard';
import { TaskMatrix5Day } from '../components/ui/TaskMatrix5Day';
import { CelebrationModal } from '../components/ui/CelebrationModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const HomeScreen = () => {
  const { user } = useAuthStore();
  const {
    todayTasks,
    summary,
    isLoading,
    isCelebrationVisible,
    celebrationData,
    fetchTodayTasks,
    fetchMatrix,
    fetchTemplates,
    templates,
    completeTask,
    uncompleteTask,
    createTask,
    addFromTemplate,
    closeCelebration,
  } = useTaskStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState('10');

  useEffect(() => {
    fetchTodayTasks();
    fetchMatrix();
    fetchTemplates();
  }, []);

  const handleRefresh = async () => {
    await fetchTodayTasks();
    await fetchMatrix();
  };

  const completedCount = todayTasks.filter((t) => t.isCompletedToday).length;
  const dailyMin = user?.preferences?.dailyMinimum || 4;

  const getMotivationalMessage = () => {
    if (completedCount === 0) {
      return 'Start small. One task is enough to begin.';
    } else if (completedCount < dailyMin) {
      return `You're getting closer. ${dailyMin - completedCount} more task${dailyMin - completedCount > 1 ? 's' : ''} to reach your daily goal.`;
    } else if (completedCount === dailyMin) {
      return '🔥 Daily goal complete. You showed up.';
    } else {
      return "You're above today's target. Excellent work, Operator.";
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = todayTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.isCompletedToday) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
    }
  };

  const handleCreateTask = async () => {
    if (!newTitle) return;
    await createTask({
      title: newTitle,
      points: parseInt(newPoints) || 10,
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Top Lavender Pill Header (Matching Reference Image) */}
        <View style={styles.topPillBanner}>
          <Text style={styles.topPillText}>WINTER ARC OPERATOR</Text>
          <View style={styles.xpPill}>
            <Zap size={12} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.xpPillText}>{user?.totalXP || 0} XP</Text>
          </View>
        </View>

        {/* User Greeting */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greeting}>
            GOOD MORNING, {user?.name?.toUpperCase() || 'OPERATOR'}
          </Text>
          <Text style={styles.subGreeting}>Winter Arc Day: 12</Text>
        </View>

        {/* Dual Card Layout from Reference Image: Light Progress Card + Dark Violet Streak Card */}
        <View style={styles.dualCardRow}>
          {/* Light Glassmorphic Progress Card */}
          <View style={styles.progressCard}>
            <CircularProgress current={completedCount} target={dailyMin} size={150} strokeWidth={12} />
            <View style={styles.motivationBanner}>
              <Sparkles size={12} color={Colors.primary} />
              <Text style={styles.motivationText} numberOfLines={2}>
                {getMotivationalMessage()}
              </Text>
            </View>
          </View>

          {/* Deep Violet Dark Card (Reference Image Contrast Widget) */}
          <View style={styles.darkStreakCard}>
            <View style={styles.darkCardHeader}>
              <Flame size={20} color="#FF7675" fill="#FF7675" />
              <Text style={styles.darkCardTitle}>STREAK</Text>
            </View>

            <Text style={styles.darkStreakNumber}>
              {user?.currentStreak || 0} <Text style={styles.darkStreakDays}>DAYS</Text>
            </Text>
            <Text style={styles.darkSubText}>Keep the fire burning!</Text>

            <View style={styles.darkStatDivider} />

            <View style={styles.darkStatRow}>
              <Trophy size={14} color={Colors.xpGold} />
              <Text style={styles.darkStatLabel}>BEST: {user?.longestStreak || 0}d</Text>
            </View>

            <View style={styles.darkStatRow}>
              <Shield size={14} color={Colors.primaryLight} />
              <Text style={styles.darkStatLabel}>1 Freeze Ready</Text>
            </View>
          </View>
        </View>

        {/* 5-Day Work Matrix / Work Done Tick Window */}
        <TaskMatrix5Day />

        {/* Today's Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S TASKS</Text>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.addButtonText}>ADD TASK</Text>
          </TouchableOpacity>
        </View>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks set for today</Text>
            <Text style={styles.emptySub}>Add custom tasks or choose from predefined templates below.</Text>
          </View>
        ) : (
          todayTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
          ))
        )}


        {/* Predefined Templates Quick Bar */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>QUICK ADD TEMPLATES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateScroll}>
          {templates.map((tpl) => (
            <TouchableOpacity
              key={tpl.id}
              style={styles.templateChip}
              onPress={() => addFromTemplate(tpl.id)}
            >
              <Plus size={12} color={Colors.primary} />
              <Text style={styles.templateText}>{tpl.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* 4-Task Daily Goal Celebration Modal */}
      <CelebrationModal
        visible={isCelebrationVisible}
        xpEarned={celebrationData?.xp || 40}
        currentStreak={celebrationData?.streak || 1}
        onClose={closeCelebration}
      />

      {/* Add Custom Task Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>CREATE NEW TASK</Text>
            <Input
              label="Task Title"
              placeholder="e.g., Code for 2 hours"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <Input
              label="XP Points Reward"
              placeholder="10"
              keyboardType="numeric"
              value={newPoints}
              onChangeText={setNewPoints}
            />

            <View style={styles.modalButtons}>
              <Button
                title="CANCEL"
                variant="secondary"
                onPress={() => setIsAddModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="CREATE"
                onPress={handleCreateTask}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  topPillBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  topPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    letterSpacing: 1,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: '#FFFFFF',
  },
  greetingHeader: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  subGreeting: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dualCardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  progressCard: {
    flex: 1.2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  motivationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  motivationText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    flex: 1,
  },
  darkStreakCard: {
    flex: 0.9,
    backgroundColor: Colors.darkViolet,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorderDark,
    justifyContent: 'space-between',
  },
  darkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  darkCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.primaryLight,
    letterSpacing: 1,
  },
  darkStreakNumber: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: '#FFFFFF',
    marginTop: 6,
  },
  darkStreakDays: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primaryLight,
  },
  darkSubText: {
    fontSize: 10,
    color: '#E9D8FD',
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  darkStatDivider: {
    height: 1,
    backgroundColor: Colors.cardBorderDark,
    marginVertical: 8,
  },
  darkStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  darkStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: Fonts.black,
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  templateScroll: {
    gap: 8,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  templateText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});
