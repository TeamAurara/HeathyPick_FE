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
      <Stack.Screen
        name="AddFoodScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodSearchScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 