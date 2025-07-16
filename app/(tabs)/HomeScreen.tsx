import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect, Text as SvgText } from "react-native-svg";

function NutrientBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <View className="flex-1 items-center mb-6 px-1 min-w-[90px]">
      <Text className="text-[15px] font-semibold mb-1 whitespace-nowrap">{label}</Text>
      <View className="w-full h-4 bg-gray-200 rounded-full mb-1 overflow-hidden flex-row items-center">
        <View className="h-4 bg-green-400 rounded-full" style={{ width: `${percent * 100}%` }} />
      </View>
      <Text className="text-xs font-bold text-green-600 mt-1">{value}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const remainingKcal = 1230;
  const totalKcal = 1800;
  const percent = remainingKcal / totalKcal;
  const nutrients = [
    { label: "탄수화물", value: "120g", percent: 0.8 },
    { label: "단백질", value: "120g", percent: 0.7 },
    { label: "지방", value: "120g", percent: 0.6 },
    { label: "나트륨", value: "120g", percent: 0.5 },
    { label: "칼륨", value: "120g", percent: 0.9 },
    { label: "인", value: "120g", percent: 0.4 },
  ];
  const insets = useSafeAreaInsets();
  // 물 섭취 상태
  const [waterAmount, setWaterAmount] = useState(0.25); // 현재 섭취량 (L)
  const waterGoal = 2; // 목표 섭취량 (L)
  const waterPercent = Math.min(waterAmount / waterGoal, 1);

  return (
    <LinearGradient
      colors={["#C6FCD9", "#F9F7B7"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, position: 'relative' }}
    >
      <Stack.Screen options={{ title: "홈", headerShown: false }} />
      {/* 상단 헤더 */}
      <View className="pt-12 pb-4" style={{ backgroundColor: 'transparent' }}>
        <Text className="text-center text-lg font-bold">홈</Text>
      </View>
      {/* 칼로리/그래프 영역 */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent' }}>
        <View className="items-center pt-8 pb-6">
          <Text className="text-lg font-bold mb-1">남은 칼로리</Text>
          <Text className="text-xs text-gray-500 mb-4">초코케이크 하나 더 섭취 가능!</Text>
          {/* 원형 프로그레스 */}
          <View className="mb-2">
            <Svg width={180} height={180}>
              <Circle cx={90} cy={90} r={85} stroke="#F3F4F6" strokeWidth={10} fill="#fff" />
              <Circle
                cx={90}
                cy={90}
                r={85}
                stroke="#5ac845"
                strokeWidth={10}
                fill="none"
                strokeDasharray={2 * Math.PI * 85}
                strokeDashoffset={2 * Math.PI * 85 * (percent - 1)}
                strokeLinecap="round"
                rotation="-90"
                origin="90,90"
              />
              <SvgText
                x="90"
                y="105"
                textAnchor="middle"
                fontSize="40"
                fontWeight="bold"
                fill="#222"
              >
                {remainingKcal.toLocaleString()}
              </SvgText>
              <SvgText
                x="90"
                y="130"
                textAnchor="middle"
                fontSize="18"
                fill="#aaa"
              >
                kcal
              </SvgText>
            </Svg>
          </View>
        </View>
      </View>
      {/* 중앙 물컵 + 섭취량/목표치 */}
      <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 220 }}>
        {/* 목표치 텍스트 (컵 위) */}
        <Text style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginBottom: 12 }}>{waterGoal}L</Text>
        {/* 물컵 SVG */}
        <Svg width={120} height={120} style={{ marginBottom: 12 }}>
          {/* 컵 그림자 */}
          <Ellipse cx={60} cy={114} rx={33} ry={10} fill="#D1FAE5" />
          {/* 컵 손잡이 (오른쪽) */}
          <Path d="M92 55 Q115 75 92 95" stroke="#6EE7B7" strokeWidth={6} fill="none" />
          {/* 컵 외곽 (민트) */}
          <Rect x={30} y={30} width={60} height={75} rx={18} fill="#ECFDF5" stroke="#6EE7B7" strokeWidth={4} />
          {/* 물 채움 (연한 민트) */}
          <Rect x={30} y={105 - 75 * waterPercent} width={60} height={75 * waterPercent} rx={18 * waterPercent} fill="#A7F3D0" />
        </Svg>
        {/* 현재 섭취량 텍스트 (컵 아래) */}
        <Text style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginTop: 8 }}>{waterAmount}L</Text>
      </View>
      {/* 하단 바텀시트 오픈 버튼 - 바텀탭 위에 고정 (SafeArea 반영) */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 52, alignItems: 'center', zIndex: 10 }} pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          style={{ borderRadius: 999, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#6EE7B7', '#A7F3D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 32, paddingVertical: 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text className="font-bold text-base" style={{ color: '#fff' }}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* 바텀시트(모달) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable className="flex-1 bg-black/30" onPress={() => setModalVisible(false)}>
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-4" />
            <Text className="text-center text-lg font-bold mb-6">영양소 정보</Text>
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
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
