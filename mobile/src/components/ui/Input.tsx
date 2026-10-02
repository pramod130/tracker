import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<Props> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.missed,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.missed,
    marginTop: 4,
  },
});
