import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";

// 영양 progress bar 컴포넌트
function NutrientBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <View className="flex-1 items-center mb-4">
      <ThemedText className="text-[15px] font-semibold mb-1">{label}</ThemedText>
      <View className="w-16 h-2 bg-gray-200 rounded-full mb-1 overflow-hidden">
        <View className="h-2 bg-green-400 rounded-full" style={{ width: `${percent * 100}%` }} />
      </View>
      <ThemedText className="text-[15px] font-medium text-gray-700">{value}</ThemedText>
    </View>
  );
}

function getLoginState() {
  // 실제 구현에서는 AsyncStorage, Zustand 등에서 불러와야 함
  // 예시: return localStorage.getItem('isLoggedIn') === 'true';
  return false; // 임시: 항상 로그인 안 된 상태로 가정
}
function getOnboardingState() {
  // 실제 구현에서는 AsyncStorage, Zustand 등에서 불러와야 함
  // 예시: return localStorage.getItem('isOnboarded') === 'true';
  return false; // 임시: 항상 온보딩 안 된 상태로 가정
}

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = getLoginState();
    const isOnboarded = getOnboardingState();
    if (!isLoggedIn) {
      router.replace("/login/KakaoScreen");
    } else if (!isOnboarded) {
      router.replace("/signup/SignUpScreen");
    }
    // 둘 다 true면 홈화면 그대로
  }, []);

  // 예시 데이터
  const remainingKcal = 1230;
  const totalKcal = 1800;
  const percent = remainingKcal / totalKcal;
  const nutrients = [
    { label: "탄수화물", value: "120g", percent: 1 },
    { label: "단백질", value: "120g", percent: 1 },
    { label: "지방", value: "120g", percent: 1 },
    { label: "나트륨", value: "120g", percent: 1 },
    { label: "칼륨", value: "120g", percent: 1 },
    { label: "인", value: "120g", percent: 1 },
  ];

  return (
    <ThemedView className="flex-1 bg-bg-primary">
      <Stack.Screen options={{ title: "홈", headerShown: false }} />
      {/* 상단 헤더 */}
      <View className="pt-12 pb-4 border-b border-gray-100 bg-white">
        <ThemedText className="text-center text-lg font-bold">홈</ThemedText>
      </View>

      {/* 칼로리/그래프 영역 */}
      <View className="px-0 pt-4 pb-2" style={{ backgroundColor: 'transparent' }}>
        <View
          className="mx-4 rounded-3xl"
          style={{
            backgroundColor: 'transparent',
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } },
              android: { elevation: 2 },
            }),
          }}
        >
          {/* 그라데이션 배경 */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            <Svg height="220" width="100%" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#d1f7c4" />
                  <Stop offset="100%" stopColor="#f7f7c4" />
                </LinearGradient>
              </Defs>
              <Circle cx="50%" cy="110" r="110" fill="url(#grad)" />
            </Svg>
          </View>

          <View className="items-center pt-8 pb-6">
            <ThemedText className="text-lg font-bold mb-1">남은 칼로리</ThemedText>
            <ThemedText className="text-xs text-gray-500 mb-4">초코케이크 하나 더 섭취 가능!</ThemedText>
            {/* 원형 프로그레스 */}
            <View className="mb-2">
              <Svg width={140} height={140}>
                <Circle cx={70} cy={70} r={65} stroke="#F3F4F6" strokeWidth={10} fill="white" />
                <Circle
                  cx={70}
                  cy={70}
                  r={65}
                  stroke="#5ac845"
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray={2 * Math.PI * 65}
                  strokeDashoffset={2 * Math.PI * 65 * (1 - percent)}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="70,70"
                />
                <SvgText
                  x="70"
                  y="78"
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill="#222"
                >
                  {remainingKcal}
                </SvgText>
                <SvgText
                  x="70"
                  y="102"
                  textAnchor="middle"
                  fontSize="16"
                  fill="#aaa"
                >
                  kcal
                </SvgText>
              </Svg>
            </View>
          </View>
        </View>
      </View>

      {/* 하단 카드(영양소) */}
      <View className="flex-1 mt-[-32px]">
        <View className="mx-3 bg-white rounded-t-3xl pt-3 pb-8 px-2 shadow-lg">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-4" />
          <View className="flex-row justify-between mb-2">
            {nutrients.slice(0, 3).map((n) => (
              <NutrientBar key={n.label} label={n.label} value={n.value} percent={n.percent} />
            ))}
          </View>
          <View className="flex-row justify-between">
            {nutrients.slice(3, 6).map((n) => (
              <NutrientBar key={n.label} label={n.label} value={n.value} percent={n.percent} />
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
