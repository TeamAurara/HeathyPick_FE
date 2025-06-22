import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 앱이 시작될 때 로그인 상태를 확인
  useEffect(() => {
    // 여기서 실제로는 AsyncStorage나 다른 저장소에서 로그인 상태를 확인해야 합니다
    // 지금은 기본값으로 로그아웃 상태로 설정합니다
    setIsLoggedIn(false);
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // 로그인되지 않은 경우 로그인 화면으로 리디렉션
  if (!isLoggedIn) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login/KakaoScreen" />
        </Stack>
        <StatusBar style="auto" />
      </>
    );
  }

  // 로그인된 경우 탭 네비게이션으로 이동
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            // 헤더 타이틀 숨김
            headerTitle: () => null,
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default RootLayout;
