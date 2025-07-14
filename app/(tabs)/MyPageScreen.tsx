import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function MyPageScreen() {
    const router = useRouter();

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            // 확인 대화상자 표시
            Alert.alert(
                "로그아웃",
                "정말 로그아웃 하시겠습니까?",
                [
                    {
                        text: "취소",
                        style: "cancel"
                    },
                    {
                        text: "로그아웃",
                        onPress: async () => {
                            // AsyncStorage에서 토큰과 사용자 정보 삭제
                            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userId']);
                            console.log("로그아웃 완료");
                            
                            // 로그인 화면으로 이동
                            router.replace("/login/KakaoScreen");
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.");
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: "마이페이지", headerShown: false }} />
            <View className="flex-1 justify-center items-center bg-purple-500">
                <Text className="text-white text-xl mb-8">마이페이지 화면</Text>
                
                {/* 로그아웃 버튼 */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-white py-3 px-6 rounded-md"
                >
                    <Text className="text-purple-500 font-medium">로그아웃</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
