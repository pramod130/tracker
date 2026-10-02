import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { api } from '../services/api';

export const CalendarScreen = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDateSummary, setSelectedDateSummary] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/daily/history');
      setHistory(res.data || res);
    } catch (e) {
      console.warn('Error fetching history:', e);
    }
  };

  const handleSelectDay = async (dateStr: string) => {
    try {
      const res = await api.get(`/daily/${dateStr}`);
      setSelectedDateSummary(res.data || res);
      setIsModalOpen(true);
    } catch (e) {
      console.warn('Error fetching day details:', e);
    }
  };

  const renderCalendarGrid = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const historyMap = new Map(history.map((item) => [item.date, item]));
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<View key={`empty_${i}`} style={styles.dayCellEmpty} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const summary = historyMap.get(dateStr);

      const isFuture = new Date(dateStr) > today;
      let cellColor = Colors.inactive;
      let textColor = '#6E618A';

      if (!isFuture) {
        if (summary?.goalMet) {
          cellColor = Colors.success;
          textColor = '#FFFFFF';
        } else if (summary && summary.tasksCompleted > 0) {
          cellColor = Colors.partial;
          textColor = '#FFFFFF';
        } else if (summary) {
          cellColor = Colors.missed;
          textColor = '#FFFFFF';
        }
      }

      days.push(
        <TouchableOpacity
          key={dateStr}
          disabled={isFuture}
          onPress={() => handleSelectDay(dateStr)}
          style={[styles.dayCell, { backgroundColor: cellColor }]}
        >
          <Text style={[styles.dayNumber, { color: textColor }]}>{day}</Text>
        </TouchableOpacity>,
      );
    }

    return days;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>DISCIPLINE HEATMAP</Text>
      <Text style={styles.pageSub}>Visual completion log for this month</Text>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Successful (4+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.partial }]} />
          <Text style={styles.legendText}>Partial (1-3)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.missed }]} />
          <Text style={styles.legendText}>Missed (0)</Text>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.weekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekHeadText}>{d}</Text>
          ))}
        </View>
        <View style={styles.gridContainer}>{renderCalendarGrid()}</View>
      </View>

      <Modal visible={isModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalDate}>{selectedDateSummary?.date}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>
                  {selectedDateSummary?.tasksCompleted} / 4
                </Text>
                <Text style={styles.statLbl}>Tasks Completed</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: selectedDateSummary?.goalMet ? Colors.success : Colors.missed }]}>
                  {selectedDateSummary?.goalMet ? 'GOAL MET 🔥' : 'MISSED'}
                </Text>
                <Text style={styles.statLbl}>Goal Status</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: Colors.xpGold }]}>
                  +{selectedDateSummary?.xpEarned || 0}
                </Text>
                <Text style={styles.statLbl}>XP Earned</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.closeBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  calendarCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekHeadText: {
    width: '14%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textMuted,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    margin: '0.6%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellEmpty: {
    width: '13%',
    aspectRatio: 1,
    margin: '0.6%',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  modalDate: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLbl: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontFamily: Fonts.black,
    fontSize: 13,
  },
});
