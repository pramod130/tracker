import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleFinishOnboarding = (category: string) => {
    setShowOnboarding(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          showOnboarding ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  onFinishOnboarding={(cat) => {
                    setShowOnboarding(false);
                    props.navigation.navigate('Login');
                  }}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
