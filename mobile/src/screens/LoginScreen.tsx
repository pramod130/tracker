import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, ArrowRight, Zap } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  navigation: any;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, demoLogin, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter both email address and password');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    await login(email, password);
  };

  const handleDemoLogin = async () => {
    setLocalError('');
    await demoLogin();
  };

  const displayError = localError || error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Sparkles size={28} color={Colors.primary} />
        </View>
        <Text style={styles.title}>WINTER ARC</Text>
        <Text style={styles.subtitle}>Welcome back, Discipline Operator</Text>
      </View>

      {displayError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBanner}>{displayError}</Text>
          {displayError.toLowerCase().includes('invalid') && (
            <Text style={styles.errorHint}>
              Account not found? Click <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>Sign Up</Text> below to register your email, or use 1-Tap Demo Login.
            </Text>
          )}
        </View>
      ) : null}

      <Input
        label="Email Address"
        placeholder="alex@winterarc.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="LOG IN"
        onPress={handleLogin}
        loading={isLoading}
        style={{ marginTop: 8 }}
      />

      {/* 1-Tap Demo Login */}
      <TouchableOpacity
        style={styles.demoButton}
        activeOpacity={0.8}
        onPress={handleDemoLogin}
        disabled={isLoading}
      >
        <Zap size={16} color={Colors.xpGold} fill={Colors.xpGold} />
        <Text style={styles.demoButtonText}>1-TAP DEMO LOGIN (ALEX MERCER)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchRow}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.switchText}>Don't have an account?</Text>
        <Text style={styles.switchLink}>Sign Up <ArrowRight size={14} color={Colors.primary} /></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorBanner: {
    color: Colors.missed,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  errorHint: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 6,
    textAlign: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    textDecorationLine: 'underline',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.xpGoldGlow,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  demoButtonText: {
    color: Colors.xpGold,
    fontSize: 12,
    fontWeight: '900',
    fontFamily: Fonts.black,
    letterSpacing: 0.5,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  switchLink: {
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
    fontSize: 14,
  },
});
