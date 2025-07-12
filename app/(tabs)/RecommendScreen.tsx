import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function RecommendScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "통계", headerShown: false }} />
      <View className="flex-1 justify-center items-center bg-green-500">
        <Text className="text-white text-xl">통계 화면</Text>
      </View>
    </>
  );
}
