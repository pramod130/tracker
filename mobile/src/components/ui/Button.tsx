import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'fire' | 'dark';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'fire':
        return { backgroundColor: Colors.fire };
      case 'dark':
        return { backgroundColor: Colors.darkViolet };
      case 'secondary':
        return { backgroundColor: '#EAE5F4', borderWidth: 1, borderColor: Colors.cardBorder };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary };
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return Colors.textPrimary;
      case 'outline':
        return Colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24, // Pill shape from reference image
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    letterSpacing: 0.5,
  },
});
