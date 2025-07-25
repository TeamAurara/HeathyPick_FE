import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

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
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          console.log('userData', userData);
          console.log('자동 로그인 성공:', userData.nickname);
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
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
