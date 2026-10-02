import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Flame, BookOpen, Dumbbell, Briefcase, Heart, Sparkles } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { Task } from '../../types';

interface Props {
  task: Task;
  onToggle: (taskId: string) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onToggle }) => {
  const isCompleted = !!task.isCompletedToday;

  const renderCategoryIcon = () => {
    switch (task.category) {
      case 'FITNESS':
        return <Dumbbell size={16} color={Colors.primary} />;
      case 'LEARNING':
        return <BookOpen size={16} color={Colors.primary} />;
      case 'CAREER':
        return <Briefcase size={16} color={Colors.primary} />;
      case 'HEALTH':
      case 'MINDFULNESS':
        return <Heart size={16} color={Colors.primary} />;
      default:
        return <Sparkles size={16} color={Colors.primary} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(task.id)}
      style={[
        styles.card,
        isCompleted && styles.completedCard,
      ]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
          {isCompleted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.title,
              isCompleted && styles.completedTitle,
            ]}
          >
            {task.title}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              {renderCategoryIcon()}
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
            {task.targetValue > 1 && (
              <Text style={styles.targetText}>
                {task.targetValue} {task.unit}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.xpBadge}>
        <Flame size={12} color={Colors.xpGold} />
        <Text style={styles.xpText}>+{task.points} XP</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  completedCard: {
    backgroundColor: '#F5F2FC',
    borderColor: Colors.primaryLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.checkboxBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.checkboxChecked,
    borderColor: Colors.checkboxChecked,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  targetText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.xpGoldGlow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.xpGold,
  },
});
