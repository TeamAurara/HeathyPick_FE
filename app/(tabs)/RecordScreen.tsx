import { Stack } from "expo-router";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RecordScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "기록", headerShown: false }} />
      <View className="flex-1 justify-center items-center bg-orange-500">
        <Text className="text-white text-xl">기록 화면</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 