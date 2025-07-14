import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { isAxiosError } from "axios"; // axios 및 isAxiosError 추가
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

// 백엔드 응답 인터페이스 정의
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

// 중복 요청 방지를 위한 클로저 변수
let isProcessingCode = false;
let processedCodes = new Set<string>();

export default function KakaoScreen() {
    const router = useRouter();
    const [showWebView, setShowWebView] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const webViewRef = useRef<WebView>(null);
    // 중복 요청 추적을 위한 상태는 제거하고 클로저 변수로 대체
    const [requestCount, setRequestCount] = useState<number>(0);

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

    // 인증 코드로 백엔드에 요청 보내기
    const getTokenWithCode = async (code: string) => {
        try {
            setIsLoading(true);
            console.log(`⏳ 로딩 상태 시작: ${code.substring(0, 10)}...`);

            // 백엔드 API URL (환경 변수가 없는 경우 기본 URL 사용)
            const apiBaseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
            const backendUrl = `${apiBaseUrl}/auth/kakao`;
            
            console.log(`🌐 백엔드 요청 URL: ${backendUrl}`);
            console.log(`📤 백엔드 요청 데이터: code=${code.substring(0, 10)}..., redirectUri=${REDIRECT_URI}`);
            
            // 백엔드에 인증 코드 전송
            const response = await axios.post<BackendResponse>(
                backendUrl,
                { 
                    code,
                    redirectUri: REDIRECT_URI  // 리다이렉트 URI 추가
                }
            );

            console.log(`📥 백엔드 응답 상태: ${response.status}`);
            console.log(`📦 백엔드 응답 데이터: ${JSON.stringify(response.data, null, 2)}`);

            // 응답 성공 확인
            if (response.data.success) {
                // 토큰 정보 추출
                const { accessToken, refreshToken } = response.data.data.token;
                const { userId, isOnboarded } = response.data.data.user;
                
                // 토큰 저장 (null 체크 추가)
                if (accessToken) {
                    await AsyncStorage.setItem('accessToken', accessToken);
                }
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                }
                
                // 사용자 정보 저장
                if (response.data.data.user) {
                    await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
                    // 사용자 ID 별도 저장 (회원가입에서 사용)
                    if (userId) {
                        await AsyncStorage.setItem('userId', userId.toString());
                    }
                }
                
                console.log("로그인 성공:", accessToken, refreshToken);
                console.log("사용자 ID:", userId);
                
                // 온보딩 여부에 따라 다른 화면으로 이동
                return { 
                    success: true, 
                    isOnboarded,
                    data: response.data.data,
                    userId
                };
            } else {
                console.error("백엔드 응답 실패:", response.data.message);
                setErrorInfo(response.data.message);
                return { 
                    success: false,
                    message: response.data.message
                };
            }
        } catch (error) {
            console.error("로그인 요청 에러:", error);
            if (isAxiosError(error)) {
                const errorMessage = `상태 코드: ${error.response?.status}, 메시지: ${error.message}, 데이터: ${JSON.stringify(error.response?.data)}`;
                console.error(errorMessage);
                setErrorInfo(errorMessage);
            } else {
                setErrorInfo(String(error));
            }
            return { 
                success: false,
                message: isAxiosError(error) ? error.message : String(error)
            };
        } finally {
            setIsLoading(false);
            console.log(`⏳ 로딩 상태 종료`);
        }
    };

    // WebView 내에서 URL 변경 감지
    const handleNavigationStateChange = async (navState: WebViewNavigation) => {
        const { url } = navState;
        console.log(`📌 네비게이션 이벤트 - URL: ${url}`);
        console.log(`📌 네비게이션 타입: ${navState.navigationType}, 로딩 상태: ${navState.loading}`);

        // 인증 코드가 포함된 리다이렉트 URL 확인
        if (url.includes("/auth/kakao/callback") && url.includes("code=")) {
            console.log(`🔎 카카오 콜백 URL 감지: ${url.substring(0, 50)}...`);
            
            // 인증 코드 추출
            const codeMatch = url.match(/code=([^&]+)/);
            if (codeMatch && codeMatch[1]) {
                const code = codeMatch[1];
                console.log(`✅ 인증 코드 추출 성공: ${code.substring(0, 10)}...`);

                // 이미 처리 중인 경우 중복 요청 방지
                if (isProcessingCode) {
                    console.log(`⚠️ 이미 처리 중인 요청이 있습니다.`);
                    return false;
                }

                // 이미 처리한 코드인 경우 중복 요청 방지
                if (processedCodes.has(code)) {
                    console.log(`⚠️ 중복 요청 감지! 이미 처리된 인증 코드: ${code.substring(0, 10)}...`);
                    return false;
                }

                // 처리 시작 표시
                isProcessingCode = true;
                processedCodes.add(code);
                
                console.log(`🔄 인증 코드 처리 시작: ${code.substring(0, 10)}...`);
                
                // 요청 카운트 증가
                setRequestCount(prev => prev + 1);
                console.log(`🔢 인증 코드 요청 카운트: ${requestCount + 1}`);

                // 즉시 WebView 숨기기
                setShowWebView(false);
                console.log("🔍 WebView 숨김 처리");

                try {
                    // 인증 코드로 백엔드에 요청
                    console.log(`🚀 백엔드 요청 시작: ${code.substring(0, 10)}...`);
                    const result = await getTokenWithCode(code);
                    console.log(`🏁 백엔드 요청 완료, 결과: ${result.success ? "성공" : "실패"}`);

                    // 응답 성공 확인
                    if (result.success && result.data) {
                        // 회원가입 화면으로 이동
                        Alert.alert(
                            "카카오 로그인 성공",
                            "회원가입을 진행해주세요.",
                            [
                                {
                                    text: "확인",
                                    onPress: () => router.push("../signup/SignUpScreen")
                                }
                            ]
                        );
                    } else {
                        console.error("백엔드 응답 실패:", result.message || "알 수 없는 오류");
                        setErrorInfo(result.message || "알 수 없는 오류");
                        Alert.alert(
                            "로그인 실패",
                            "로그인 처리 중 오류가 발생했습니다.",
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
                    // 처리 완료 표시 (일정 시간 후에 리셋하여 재시도 가능하게 함)
                    setTimeout(() => {
                        isProcessingCode = false;
                    }, 5000); // 5초 후에 리셋
                }

                // 탐색 중지
                console.log("🛑 WebView 탐색 중지");
                return false;
            } else {
                console.log("⚠️ 인증 코드를 URL에서 찾을 수 없음");
            }
        }
        // 계속 탐색
        return true;
    };

    // WebView 로드 완료 이벤트 핸들러 추가
    const handleLoadEnd = () => {
        console.log("📱 WebView 로드 완료");
    };

    // WebView 로드 시작 이벤트 핸들러 추가
    const handleLoadStart = (event: any) => {
        console.log(`🔄 WebView 로드 시작: ${event.nativeEvent.url}`);
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
                    onLoadEnd={handleLoadEnd}
                    onLoadStart={handleLoadStart}
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
