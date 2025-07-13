import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "홈", headerShown: false }} />
      <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className="text-white text-xl">홈 화면</Text>
      </View>
    </>
  );
}
