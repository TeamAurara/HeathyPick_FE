import { Stack } from 'expo-router';
import React from 'react';

export default function MealLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="MealDetailScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 