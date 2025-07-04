import { Stack } from 'expo-router';

export default function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="SignUpScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 