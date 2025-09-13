import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AppLogo from "../../components/ui/AppLogo";
import KakaoLogo from "../../components/ui/KakaoLogo";
import KakaoLoginWebView from "./components/KakaoLoginWebView";

interface KakaoScreenProps {
    onLoginSuccess?: () => void;
}

export default function KakaoScreen({ onLoginSuccess }: KakaoScreenProps) {
    const router = useRouter();
    const [showWebView, setShowWebView] = useState(false);

    const handleLogin = () => {
        setShowWebView(true);
    };

    const handleLoginSuccess = (user: any, token: any) => {
        setShowWebView(false);
        Alert.alert(
            "로그인 성공",
            "카카오 계정으로 로그인되었습니다.",
            [
                {
                    text: "확인",
                    onPress: () => {
                        if (user.isOnboarded) {
                            router.replace("/(tabs)/HomeScreen");
                        } else {
                            router.push("../signup/SignUpScreen");
                        }
                        onLoginSuccess?.();
                    }
                }
            ]
        );
    };

    const handleLoginError = (error: string) => {
        setShowWebView(false);
        Alert.alert(
            "로그인 실패",
            error,
            [
                { text: "다시 시도", onPress: () => setShowWebView(true) },
                { text: "취소", onPress: () => setShowWebView(false) }
            ]
        );
    };

    const handleClose = () => {
        setShowWebView(false);
    };

    if (showWebView) {
        return (
            <KakaoLoginWebView
                onLoginSuccess={handleLoginSuccess}
                onLoginError={handleLoginError}
                onClose={handleClose}
            />
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#55B339]">
            <View className="flex-1 justify-center items-center">
                <View className="flex-1 justify-center items-center">
                    <AppLogo width={240} height={224} />
                </View>

                <View className="w-full px-6 mb-40">
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-[#FEE500] py-4 px-4 rounded-md flex-row items-center justify-center w-full"
                    >
                        <KakaoLogo width={20} height={20} />
                        <Text className="text-[#3C1E1E] text-base font-medium ml-2">
                            카카오로 1초만에 시작하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}