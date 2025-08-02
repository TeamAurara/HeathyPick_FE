import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 앱이 시작될 때 로그인 상태를 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // AsyncStorage에서 토큰 확인
        const accessToken = await AsyncStorage.getItem('accessToken');
        const user = await AsyncStorage.getItem('user');
        
        // 토큰과 사용자 정보가 있으면 로그인 상태로 설정
        if (accessToken && user) {
          // 토큰이 존재하면 로그인 상태로 설정
          try {
            const userData = JSON.parse(user);
            setIsLoggedIn(true);
            console.log('userData', userData);
            console.log('자동 로그인 성공:', userData.nickname);
          } catch (error) {
            console.error('사용자 데이터 파싱 오류:', error);
            // 파싱 오류 시 저장된 데이터 삭제
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userId']);
            setIsLoggedIn(false);
            console.log('사용자 데이터 오류로 로그아웃 처리');
          }
        } else {
          setIsLoggedIn(false);
          console.log('로그인 필요');
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (!loaded || isLoading) {
    // 폰트 로딩 또는 로그인 상태 확인 중
    return (
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </QueryClientProvider>
    );
  }

  // 로그인되지 않은 경우 로그인 화면으로 리디렉션
  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login/KakaoScreen" />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    );
  }

  // 로그인된 경우 탭 네비게이션으로 이동
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default RootLayout;
