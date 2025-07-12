import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import "../../global.css";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeIconColor = '#22c55e'; // green-500 색상

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeIconColor,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="ReportScreen"
        options={{
          title: '홈',
          headerTitle: '홈',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="RecommendScreen"
        options={{
          title: '통계',
          headerTitle: '통계',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="RecordScreen"
        options={{
          title: '기록',
          headerTitle: '기록',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pencil" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MyPageScreen"
        options={{
          title: '마이페이지',
          headerTitle: '마이페이지',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
