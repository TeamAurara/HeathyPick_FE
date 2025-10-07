import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

interface KakaoOptions {
  clientId: string;
  redirectUri: string;
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

interface KakaoLoginWebViewProps {
  onLoginSuccess: (user: any, token: any) => void;
  onLoginError: (error: string) => void;
  onClose: () => void;
}

export default function KakaoLoginWebView({
  onLoginSuccess,
  onLoginError,
  onClose,
}: KakaoLoginWebViewProps) {
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const isProcessingCode = useRef(false);
  const processedCodes = useRef(new Set<string>());
  const isLoginCompleted = useRef(false);

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
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      console.log(
        "✅ 백엔드 응답 성공:",
        JSON.stringify(response.data, null, 2)
      );

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
        console.error("-".repeat(30));
        console.error("AXIOS ERROR DETECTED");
        console.error("-".repeat(30));

        if (error.response) {
          // 서버가 2xx 범위를 벗어나는 상태 코드로 응답했습니다.
          console.error("🚨 [Error Response] 서버가 응답했으나 에러가 발생했습니다.");
          console.error(`- Status: ${error.response.status}`)
          console.error(`- Data: ${JSON.stringify(error.response.data, null, 2)}`);
          console.error(`- Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
          const errorMessage = `서버 에러: ${error.response.status}, 메시지: ${error.response.data?.message || error.message}`;
          setErrorInfo(errorMessage);
          onLoginError(errorMessage);

        } else if (error.request) {
          // 요청이 이루어졌으나 응답을 받지 못했습니다.
          // 'error.request'는 브라우저에서는 XMLHttpRequest 인스턴스, node.js에서는 http.ClientRequest 인스턴스입니다.
          console.error("📡 [Error Request] 요청은 보냈으나, 서버로부터 응답이 없습니다.");
          console.error("이 오류는 주로 다음과 같은 경우에 발생합니다:");
          console.error("1. 네트워크 연결 문제 (인터넷 끊김)");
          console.error("2. 백엔드 서버 다운");
          console.error("3. CORS 정책 위반 (웹 환경)");
          console.error("4. 요청 타임아웃 (timeout 설정 확인)");
          console.error("Full request object:", error.request);
          const errorMessage = "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.";
          setErrorInfo(errorMessage);
          onLoginError(errorMessage);
          return { success: false, isNetworkError: true };

        } else {
          // 요청을 설정하는 중에 에러가 발생했습니다.
          console.error("⚙️ [Error Message] 요청 설정 중 에러가 발생했습니다.");
          console.error(`- Message: ${error.message}`);
          const errorMessage = `요청 설정 오류: ${error.message}`;
          setErrorInfo(errorMessage);
          onLoginError(errorMessage);
        }

        console.log(`- Axios Config: ${JSON.stringify(error.config, null, 2)}`);
        console.error("-".repeat(30));

      } else {
        // Axios 에러가 아닌 다른 종류의 에러
        console.error("💥 [Non-Axios Error] 일반 자바스크립트 에러가 발생했습니다.");
        console.error(error);
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
      if (isLoginCompleted.current) {
        console.log("로그인이 이미 완료되었습니다.");
        return false;
      }

      const codeMatch = url.match(/code=([^&]+)/);
      if (codeMatch && codeMatch[1]) {
        const code = codeMatch[1];
        console.log("🔍 인증 코드 감지:", code.substring(0, 10) + "...");

        if (isProcessingCode.current) {
          console.log("⚠️ 이미 처리 중인 요청이 있습니다.");
          return false;
        }

        if (processedCodes.current.has(code)) {
          console.log("⚠️ 이미 처리된 인증 코드입니다.");
          return false;
        }

        isLoginCompleted.current = true;
        isProcessingCode.current = true;
        processedCodes.current.add(code);

        try {
          const result = await sendCodeToBackend(code);

          if (result.success) {
            const user = result.userData!;
            const token = result.tokenData!;

            try {
              await AsyncStorage.setItem("userId", user.userId.toString());
              console.log(
                "userId가 AsyncStorage에 저장되었습니다:",
                user.userId
              );
            } catch (storageError) {
              console.error("AsyncStorage 저장 오류:", storageError);
            }

            try {
              const storageItems: [string, string][] = [];

              if (token.accessToken) {
                storageItems.push(["accessToken", token.accessToken]);
              }

              if (token.refreshToken) {
                storageItems.push(["refreshToken", token.refreshToken]);
              }

              storageItems.push(["user", JSON.stringify(user)]);
              storageItems.push(["userId", user.userId.toString()]);

              await AsyncStorage.multiSet(storageItems);
              console.log("토큰과 사용자 정보가 AsyncStorage에 저장되었습니다");
            } catch (storageError) {
              console.error("AsyncStorage 저장 오류:", storageError);
            }

            onLoginSuccess(user, token);
          } else {
            // 에러 처리는 sendCodeToBackend 내부에서 이미 수행되었으므로
            // 여기서는 추가적인 에러 메시지 호출이 필요 없습니다.
            console.log("로그인 실패. 상세 에러는 sendCodeToBackend에서 출력됩니다.");
          }
        } catch (error) {
          console.error("로그인 처리 중 오류:", error);
          onLoginError("로그인 처리 중 오류가 발생했습니다.");
        } finally {
          isProcessingCode.current = false;
        }

        return false;
      }
    }
    return true;
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;

    if (
      nativeEvent.url.includes("/auth/kakao/callback") &&
      nativeEvent.description.includes("ERR_CONNECTION_REFUSED")
    ) {
      console.log("예상된 리다이렉트 에러, 무시합니다.");
      return;
    }

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
    onLoginError(`오류가 발생했습니다: ${nativeEvent.description}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-yellow-400">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-black">로그인 처리 중...</Text>
      </View>
    );
  }

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
          console.log(
            "HTTP 에러:",
            e.nativeEvent.statusCode,
            e.nativeEvent.url
          );
        }}
        renderError={(errorDomain, errorCode, errorDesc) => {
          return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
        }}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.includes("/auth/kakao/callback")) {
            return true;
          }
          return true;
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <ActivityIndicator size="large" color="#FEE500" />
          </View>
        )}
        onLoadEnd={() => {
          console.log("WebView 로딩 완료");
        }}
      />
      {errorInfo && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 10,
            backgroundColor: "rgba(255,0,0,0.7)",
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>{errorInfo}</Text>
        </View>
      )}
    </>
  );
}
