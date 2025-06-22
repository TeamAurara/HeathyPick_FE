import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function KakaoScreen() {
    const router = useRouter();

    const handleLogin = () => {
        // 실제 카카오 로그인 로직이 여기에 들어갑니다
        // 지금은 단순히 로그인 성공으로 가정하고 탭 화면으로 이동합니다

        router.replace("/(tabs)/RecommendScreen");
    };

    return (
        <View className="flex-1 justify-center items-center bg-yellow-400">
            <Text className="text-black text-2xl font-bold mb-8">헬시픽</Text>
            <Text className="text-black text-lg mb-10">건강한 식단 추천 서비스</Text>

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-yellow-500 py-4 px-8 rounded-lg"
            >
                <Text className="text-black text-lg font-semibold">카카오로 시작하기</Text>
            </TouchableOpacity>
        </View>
    );
}
