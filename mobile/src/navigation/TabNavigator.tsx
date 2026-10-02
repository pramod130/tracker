import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, BarChart2, Award, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.darkViolet,
          borderTopColor: Colors.cardBorderDark,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 10,
          shadowColor: Colors.darkViolet,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: Colors.primaryLight,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          fontFamily: Fonts.extraBold,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="HOME"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CALENDAR"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ANALYTICS"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="REWARDS"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
