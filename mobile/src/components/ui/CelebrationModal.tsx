import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flame, Sparkles, Award } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface Props {
  visible: boolean;
  xpEarned: number;
  currentStreak: number;
  onClose: () => void;
}

export const CelebrationModal: React.FC<Props> = ({
  visible,
  xpEarned,
  currentStreak,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.contentCard}>
          <View style={styles.fireIconContainer}>
            <Flame size={54} color={Colors.fire} fill={Colors.fire} />
          </View>

          <Text style={styles.headline}>DAILY GOAL COMPLETE</Text>
          <Text style={styles.subheadline}>4 / 4 TASKS COMPLETED</Text>

          <View style={styles.rewardBox}>
            <View style={styles.rewardItem}>
              <Award size={18} color={Colors.xpGold} />
              <Text style={styles.rewardText}>+{xpEarned} XP</Text>
            </View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardItem}>
              <Flame size={18} color={Colors.fire} />
              <Text style={styles.rewardText}>{currentStreak} Day Streak</Text>
            </View>
          </View>

          <Text style={styles.quote}>"Another day stronger."</Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Sparkles size={18} color="#000000" />
            <Text style={styles.buttonText}>CONTINUE ARC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 14, 20, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.fire,
    shadowColor: Colors.fire,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  fireIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.fireGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  rewardBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
  },
  rewardDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 16,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: Fonts.black,
    letterSpacing: 1,
  },
});
