import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'inter-font-styles';
      if (!document.getElementById(styleId)) {
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(`
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          }
        `));
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0B0E14" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
