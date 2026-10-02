import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Calendar } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTaskStore } from '../../store/useTaskStore';

export const TaskMatrix5Day = () => {
  const { matrixDays, matrixTasks, toggleMatrixCell } = useTaskStore();

  if (!matrixTasks || matrixTasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Calendar size={18} color={Colors.primary} />
          <Text style={styles.cardTitle}>5-DAY WORK MATRIX</Text>
        </View>
        <Text style={styles.cardSubtitle}>
          View & toggle task completion across the last 5 days
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.taskNameHeaderCell}>
              <Text style={styles.headerText}>TASKS</Text>
            </View>
            {matrixDays.map((day) => (
              <View
                key={day.date}
                style={[
                  styles.dayHeaderCell,
                  day.isToday && styles.todayHeaderCell,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabelText,
                    day.isToday && styles.todayLabelText,
                  ]}
                >
                  {day.label.toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.dayNumText,
                    day.isToday && styles.todayNumText,
                  ]}
                >
                  {day.dayNum}
                </Text>
              </View>
            ))}
          </View>

          {/* Task Rows */}
          {matrixTasks.map((task, rowIndex) => {
            const isLastRow = rowIndex === matrixTasks.length - 1;

            return (
              <View
                key={task.id}
                style={[
                  styles.taskRow,
                  !isLastRow && styles.borderBottom,
                ]}
              >
                {/* Task Title & Badge (Y-Axis) */}
                <View style={styles.taskNameCell}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskCategory}>
                    +{task.points} XP
                  </Text>
                </View>

                {/* 5 Day Checkboxes (X-Axis) */}
                {matrixDays.map((day) => {
                  const isChecked = !!task.completions?.[day.date];

                  return (
                    <TouchableOpacity
                      key={day.date}
                      activeOpacity={0.7}
                      style={[
                        styles.gridCell,
                        day.isToday && styles.todayGridCell,
                      ]}
                      onPress={() => toggleMatrixCell(task.id, day.date)}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          isChecked && styles.checkboxBoxChecked,
                        ]}
                      >
                        {isChecked && (
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    flexDirection: 'column',
  },
  table: {
    minWidth: 340,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  taskNameHeaderCell: {
    flex: 2.2,
    paddingLeft: 8,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 8,
  },
  todayHeaderCell: {
    backgroundColor: Colors.primary,
  },
  dayLabelText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textSecondary,
  },
  todayLabelText: {
    color: '#FFFFFF',
  },
  dayNumText: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
  },
  todayNumText: {
    color: '#FFFFFF',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  taskNameCell: {
    flex: 2.2,
    paddingRight: 6,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  taskCategory: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: 1,
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  todayGridCell: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: 8,
  },
  checkboxBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.checkboxBorder,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.checkboxChecked,
    borderColor: Colors.checkboxChecked,
  },
});
