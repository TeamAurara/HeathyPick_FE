import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function MyPageScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "마이페이지", headerShown: false }} />
            <View className="flex-1 justify-center items-center bg-purple-500">
                <Text className="text-white text-xl">마이페이지 화면</Text>
            </View>
        </>
    );
}
