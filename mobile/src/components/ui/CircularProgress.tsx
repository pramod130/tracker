import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface Props {
  size?: number;
  strokeWidth?: number;
  current: number;
  target?: number;
}

export const CircularProgress: React.FC<Props> = ({
  size = 160,
  strokeWidth = 12,
  current,
  target = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((current / target) * 100, 0), 100);
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  const isGoalMet = current >= target;
  const innerSize = size - strokeWidth * 2 - 12;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.cardBorder}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isGoalMet ? Colors.fire : Colors.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Inner Content Box (strictly constrained inside circle bounds) */}
      <View
        style={[
          styles.content,
          { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        ]}
      >
        <Text style={styles.countText}>
          {current} <Text style={styles.targetText}>/ {target}</Text>
        </Text>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        <Text
          style={[styles.label, isGoalMet && styles.goalMetLabel]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {isGoalMet ? 'GOAL ACHIEVED 🔥' : 'DAILY TASKS'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
  },
  targetText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginTop: 1,
  },
  label: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 3,
    textAlign: 'center',
  },
  goalMetLabel: {
    color: Colors.fire,
  },
});
