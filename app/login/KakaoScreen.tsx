import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import AppLogo from "../../components/ui/AppLogo";
import KakaoLogo from "../../components/ui/KakaoLogo";

interface KakaoOptions {
    clientId: string;
    redirectUri: string;
}

interface KakaoScreenProps {
    onLoginSuccess?: () => void;
}

interface BackendResponse {
    success: boolean;
    code: string;
    message: string;
    data: {
        token: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn: number;
            refreshTokenExpiresIn: number;
        };
        user: {
            userId: number;
            email: string;
            nickname: string;
            profileImageUrl: string;
            gender: string;
            age: number;
            isOnboarded: boolean;
        };
    };
}

export default function KakaoScreen({ onLoginSuccess }: KakaoScreenProps) {
    const router = useRouter();
    const [showWebView, setShowWebView] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const webViewRef = useRef<WebView>(null);
    
    const [isProcessingCode, setIsProcessingCode] = useState(false);
    const [processedCodes] = useState(new Set<string>());

    const REDIRECT_URI = "http://127.0.0.1:8081/auth/kakao/callback";

    const kakaoOpt: KakaoOptions = {
        clientId: process.env.EXPO_PUBLIC_REST_API || "",
        redirectUri: REDIRECT_URI,
    };

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;

    const sendCodeToBackend = async (code: string) => {
        try {
            setIsLoading(true);
            const backendUrl = "https://healthpick.store/api/auth/kakao";
            console.log("🌐 백엔드 요청 URL:", backendUrl);
            console.log("📤 전송할 인증 코드:", code.substring(0, 10) + "...");
            console.log("📋 요청 데이터:", { code });
            
            const response = await axios.post<BackendResponse>(
                backendUrl,
                { code },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                }
            );

            console.log("✅ 백엔드 응답 성공:", JSON.stringify(response.data, null, 2));

            if (response.data.success) {
                const { token, user } = response.data.data;
                console.log("🎉 로그인 성공!");
                console.log("🔑 토큰 정보:", token);
                console.log("👤 사용자 정보:", user);
                return { success: true, userData: user, tokenData: token };
            } else {
                console.error("❌ 백엔드 에러:", response.data.message);
                setErrorInfo(`백엔드 에러: ${response.data.message}`);
                return { success: false };
            }

        } catch (error) {
            console.error("💥 백엔드 요청 에러:", error);
            if (isAxiosError(error)) {
                const errorMessage = `상태 코드: ${error.response?.status}, 메시지: ${error.message}, 데이터: ${JSON.stringify(error.response?.data)}`;
                console.error("📊 상세 에러 정보:", errorMessage);
                setErrorInfo(errorMessage);
                
                if (error.response?.status === 500) {
                    console.error("🔧 500 에러 - 가능한 원인:");
                    console.error("1. 백엔드 서버 내부 오류");
                    console.error("2. 카카오 API 연동 문제");
                    console.error("3. 데이터베이스 연결 문제");
                    console.error("4. 인증 코드가 이미 사용됨");
                }
            } else {
                setErrorInfo(String(error));
            }
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigationStateChange = async (navState: WebViewNavigation) => {
        const { url } = navState;
        console.log("현재 URL:", url);
        console.log("네비게이션 상태:", JSON.stringify(navState, null, 2));

        if (url.includes("/auth/kakao/callback") && url.includes("code=")) {
            const codeMatch = url.match(/code=([^&]+)/);
            if (codeMatch && codeMatch[1]) {
                const code = codeMatch[1];
                console.log("🔍 인증 코드 감지:", code.substring(0, 10) + "...");
                
                if (isProcessingCode) {
                    console.log("⚠️ 이미 처리 중인 요청이 있습니다.");
                    return false;
                }
                
                if (processedCodes.has(code)) {
                    console.log("⚠️ 이미 처리된 인증 코드입니다.");
                    return false;
                }
                
                setIsProcessingCode(true);
                processedCodes.add(code);
                setShowWebView(false);

                try {
                    const result = await sendCodeToBackend(code);

                    if (result.success) {
                        const user = result.userData!;
                        const token = result.tokenData!;

                        try {
                            await AsyncStorage.setItem('userId', user.userId.toString());
                            console.log('userId가 AsyncStorage에 저장되었습니다:', user.userId);
                        } catch (storageError) {
                            console.error('AsyncStorage 저장 오류:', storageError);
                        }

                        try {
                            const storageItems: [string, string][] = [];
                            
                            if (token.accessToken) {
                                storageItems.push(['accessToken', token.accessToken]);
                            }
                            
                            if (token.refreshToken) {
                                storageItems.push(['refreshToken', token.refreshToken]);
                            }
                            
                            storageItems.push(['user', JSON.stringify(user)]);
                            storageItems.push(['userId', user.userId.toString()]);
                            
                            await AsyncStorage.multiSet(storageItems);
                            console.log('토큰과 사용자 정보가 AsyncStorage에 저장되었습니다');
                        } catch (storageError) {
                            console.error('AsyncStorage 저장 오류:', storageError);
                        }

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
                    } else {
                        Alert.alert(
                            "로그인 실패",
                            "서버에서 로그인 처리에 실패했습니다.",
                            [
                                { text: "다시 시도", onPress: () => setShowWebView(true) }
                            ]
                        );
                    }
                } catch (error) {
                    console.error("로그인 처리 중 오류:", error);
                    Alert.alert(
                        "로그인 오류",
                        "로그인 처리 중 오류가 발생했습니다.",
                        [
                            { text: "다시 시도", onPress: () => setShowWebView(true) }
                        ]
                    );
                } finally {
                    setIsProcessingCode(false);
                }

                return false;
            }
        }
        return true;
    };

    const handleError = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        const errorDetails = `
            에러 코드: ${nativeEvent.code}
            설명: ${nativeEvent.description}
            URL: ${nativeEvent.url}
            타겟: ${nativeEvent.target}
            로딩 상태: ${nativeEvent.loading}
            캔고백: ${nativeEvent.canGoBack}
            캔고포워드: ${nativeEvent.canGoForward}
        `;

        console.log("WebView 상세 에러:", errorDetails);
        setErrorInfo(errorDetails);

        if (nativeEvent.url.includes("/auth/kakao/callback") && nativeEvent.description.includes("ERR_CONNECTION_REFUSED")) {
            console.log("예상된 리다이렉트 에러, 무시합니다.");
        } else {
            Alert.alert(
                "로그인 오류",
                `오류가 발생했습니다: ${nativeEvent.description}`,
                [
                    { text: "다시 시도", onPress: () => webViewRef.current?.reload() },
                    { text: "취소", onPress: () => setShowWebView(false) }
                ]
            );
        }
    };

    const handleLogin = () => {
        setErrorInfo(null);
        setIsProcessingCode(false);
        processedCodes.clear();
        setShowWebView(true);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-yellow-400">
                <ActivityIndicator size="large" color="#000" />
                <Text className="mt-4 text-black">로그인 처리 중...</Text>
            </View>
        );
    }

    if (showWebView) {
        return (
            <>
                <WebView
                    ref={webViewRef}
                    source={{ uri: kakaoURL }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onError={handleError}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onHttpError={(e) => {
                        console.log("HTTP 에러:", e.nativeEvent.statusCode, e.nativeEvent.url);
                    }}
                />
                {errorInfo && (
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(255,0,0,0.7)' }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>{errorInfo}</Text>
                    </View>
                )}
            </>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
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