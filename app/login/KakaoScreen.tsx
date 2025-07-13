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

export default function KakaoScreen() {
    const router = useRouter();
    const [showWebView, setShowWebView] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const webViewRef = useRef<WebView>(null);

    // 카카오 개발자 콘솔에 등록한 리다이렉트 URI
    const REDIRECT_URI = "http://127.0.0.1:8081/auth/kakao/callback";

    const kakaoOpt:KakaoOptions  = {
        clientId: process.env.EXPO_PUBLIC_REST_API || "", // 실제 REST API 키
        redirectUri: REDIRECT_URI,
    };

    // 카카오 로그인 페이지 URL 생성
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;

    // 메인 페이지로 이동하는 함수
    const goToMainPage = () => {
        router.replace("/(tabs)/HomeScreen");
    };

    // 인증 코드로 토큰 요청
    const getTokenWithCode = async (code: string) => {
        try {
            setIsLoading(true);

            // 토큰 요청 URL
            const tokenUrl = "https://kauth.kakao.com/oauth/token";

            // axios로 토큰 요청 (JSON 형태로 파라미터 전달)
            const response = await axios.post(
                tokenUrl,
                null, // 본문 데이터 없음
                {
                    params: {
                        grant_type: "authorization_code",
                        client_id: kakaoOpt.clientId,
                        redirect_uri: kakaoOpt.redirectUri,
                        code: code
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }
            );

            console.log("토큰 응답:", JSON.stringify(response.data, null, 2));

            // 토큰 정보 추출
            const { access_token, refresh_token, token_type } = response.data;
            console.log("토큰 정보:", access_token, refresh_token, token_type);
            // 사용자 정보 요청
            await getUserInfo(access_token);

            return true;
        } catch (error) {
            console.error("토큰 요청 에러:", error);
            if (isAxiosError(error)) {
                const errorMessage = `상태 코드: ${error.response?.status}, 메시지: ${error.message}, 데이터: ${JSON.stringify(error.response?.data)}`;
                console.error(errorMessage);
                setErrorInfo(errorMessage);
            } else {
                setErrorInfo(String(error));
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 사용자 정보 요청
    const getUserInfo = async (accessToken: string) => {
        try {
            const userInfoUrl = "https://kapi.kakao.com/v2/user/me";
            const response = await axios.get(userInfoUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });

            console.log("사용자 정보:", JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            console.error("사용자 정보 요청 에러:", error);
            if (isAxiosError(error)) {
                console.error(`상태 코드: ${error.response?.status}, 메시지: ${error.message}`);
            }
            throw error;
        }
    };

    // WebView 내에서 URL 변경 감지
    const handleNavigationStateChange = async (navState: WebViewNavigation) => {
        const { url } = navState;
        console.log("현재 URL:", url);
        console.log("네비게이션 상태:", JSON.stringify(navState, null, 2));

        // 인증 코드가 포함된 리다이렉트 URL 확인
        if (url.includes("/auth/kakao/callback") && url.includes("code=")) {
            // 인증 코드 추출
            const codeMatch = url.match(/code=([^&]+)/);
            if (codeMatch && codeMatch[1]) {
                const code = codeMatch[1];
                console.log("인증 코드:", code);

                // 즉시 WebView 숨기기
                setShowWebView(false);

                try {
                    // 인증 코드로 토큰 요청
                    const success = await getTokenWithCode(code);

                    if (success) {
                        // 성공 알림 표시
                        Alert.alert(
                            "로그인 성공",
                            "카카오 계정으로 로그인되었습니다.",
                            [
                                {
                                    text: "확인",
                                    onPress: () => router.push("../signup/SignUpScreen")
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            "로그인 실패",
                            "토큰을 가져오는 데 실패했습니다.",
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
                }

                // 탐색 중지
                return false;
            }
        }
        // 계속 탐색
        return true;
    };

    // 상세 에러 처리
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

        // 에러가 리다이렉트 URL에서 발생한 것이고 이미 인증 코드를 추출했다면 무시
        if (nativeEvent.url.includes("/auth/kakao/callback") && nativeEvent.description.includes("ERR_CONNECTION_REFUSED")) {
            console.log("예상된 리다이렉트 에러, 무시합니다.");
        } else {
            // 다른 에러는 사용자에게 알림
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

    // WebView가 보이는 경우
    if (showWebView) {
        return (
            <>
                <WebView
                    ref={webViewRef}
                    source={{ uri: kakaoURL }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onError={handleError}
                    incognito={true}
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

    // 로그인 버튼 화면
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

                    {/* 회원가입으로 바로 넘어가는 버튼 */}
                    <TouchableOpacity
                        onPress={() => router.push("../signup/SignUpScreen")}
                        className="mt-4 py-4 px-4 rounded-md flex-row items-center justify-center w-full border border-gray-300"
                    >
                        <Text className="text-gray-700 text-base font-medium">
                            회원가입 바로가기
                        </Text>
                    </TouchableOpacity>

                    {/* 메인 페이지로 바로 이동하는 임시 버튼 */}
                    <TouchableOpacity
                        onPress={goToMainPage}
                        className="mt-4 py-4 px-4 rounded-md flex-row items-center justify-center w-full bg-blue-500"
                    >
                        <Text className="text-white text-base font-medium">
                            메인 페이지로 바로 이동 (임시)
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {errorInfo && (
                <View className="px-6 pb-4">
                    <View className="p-4 bg-red-200 rounded-lg">
                        <Text className="text-red-800 text-xs">{errorInfo}</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
