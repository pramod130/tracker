import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  navigation: any;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    setLocalError('');
    if (!name || !email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setLocalError('Please enter a valid email address (e.g. user@gmail.com)');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    await register(name, email, password);
  };

  const displayError = localError || error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={20} color={Colors.textSecondary} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>JOIN THE ARC</Text>
        <Text style={styles.subtitle}>Create your Winter Arc discipline profile</Text>
      </View>

      {displayError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBanner}>{displayError}</Text>
        </View>
      ) : null}

      <Input
        label="Full Name"
        placeholder="Alex Mercer"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Email Address"
        placeholder="user@gmail.com"
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
        title="CREATE ACCOUNT & START ARC"
        variant="fire"
        onPress={handleRegister}
        loading={isLoading}
        style={{ marginTop: 12 }}
      />
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  header: {
    marginBottom: 24,
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
});
