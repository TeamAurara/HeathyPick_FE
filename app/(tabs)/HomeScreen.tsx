import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = SCREEN_WIDTH >= 768;
const maxContentWidth = isWeb ? 1200 : SCREEN_WIDTH;

// 영양소 카드 컴포넌트
function NutrientCard({ 
  label, 
  value, 
  percent, 
  index 
}: { 
  label: string; 
  value: string; 
  percent: number;
  index: number;
}) {
  const colors = [
    { bg: '#FEF3C7', text: '#D97706', progress: '#FBBF24' }, // 탄수화물 - 노랑
    { bg: '#DBEAFE', text: '#1E40AF', progress: '#60A5FA' }, // 단백질 - 파랑
    { bg: '#FCE7F3', text: '#BE185D', progress: '#F472B6' }, // 지방 - 분홍
    { bg: '#E0E7FF', text: '#4338CA', progress: '#818CF8' }, // 나트륨 - 보라
    { bg: '#D1FAE5', text: '#065F46', progress: '#34D399' }, // 칼륨 - 초록
    { bg: '#FED7AA', text: '#9A3412', progress: '#FB923C' }, // 인 - 주황
  ];

  const color = colors[index % colors.length];

  return (
    <View 
      className="rounded-2xl p-5 mb-3"
      style={{ 
        backgroundColor: color.bg,
        width: isTablet ? '48%' : '100%',
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className={`font-bold ${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: color.text }}>
          {label}
        </Text>
        <Text className={`font-bold ${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: color.text }}>
          {value}
        </Text>
      </View>
      <View 
        className="rounded-full overflow-hidden"
        style={{ 
          height: 10, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <View 
          className="h-full rounded-full"
          style={{ 
            width: `${Math.min(percent * 100, 100)}%`,
            backgroundColor: color.progress,
          }}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  
  // 칼로리 데이터
  const remainingKcal = 1230;
  const totalKcal = 1800;
  const consumedKcal = totalKcal - remainingKcal;
  const percent = consumedKcal / totalKcal;
  
  // 영양소 데이터
  const nutrients = [
    { label: "탄수화물", value: "120g", percent: 0.8 },
    { label: "단백질", value: "80g", percent: 0.7 },
    { label: "지방", value: "50g", percent: 0.6 },
    { label: "나트륨", value: "2.3g", percent: 0.5 },
    { label: "칼륨", value: "3.5g", percent: 0.9 },
    { label: "인", value: "1.2g", percent: 0.4 },
  ];

  // 더 큰 크기로 조정
  const progressSize = isTablet ? 280 : 240;

  // 칼로리 상태에 따른 메시지
  const getCalorieMessage = () => {
    const remainingPercent = remainingKcal / totalKcal;
    if (remainingPercent >= 0.5) return "🍰 초코케이크 하나 더 가능해요!";
    if (remainingPercent >= 0.3) return "🍪 간식 한 가지 더 괜찮아요!";
    if (remainingPercent >= 0.15) return "🍎 과일 한 개 정도 추가 가능!";
    return "⚠️ 칼로리 거의 소진!";
  };

  return (
    <LinearGradient
      colors={["#C6FCD9", "#F9F7B7"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: "홈", headerShown: false }} />
      
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isWeb ? 24 : 20,
          paddingBottom: insets.bottom + 40,
          ...(isWeb && { 
            maxWidth: maxContentWidth, 
            alignSelf: 'center',
            width: '100%'
          })
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 */}
        <View 
          className="pb-8" 
          style={{ 
            paddingTop: insets.top + 16,
            backgroundColor: 'transparent' 
          }}
        >
          <Text className={`text-center font-bold ${isTablet ? 'text-4xl' : 'text-3xl'}`} style={{ color: '#2D5016' }}>
            홈
          </Text>
        </View>

        {/* 칼로리 섹션 - 메인 카드 (더 크게) */}
        <View 
          className="rounded-3xl mb-6"
          style={{
            padding: isTablet ? 32 : 24,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            ...(Platform.OS !== 'web' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }),
            ...(isWeb && {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }),
          }}
        >
          <View className="items-center mb-8">
            <Text className={`font-bold mb-3 ${isTablet ? 'text-3xl' : 'text-2xl'}`} style={{ color: '#1F2937' }}>
              오늘의 칼로리
            </Text>
            <Text className={`${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#6B7280' }}>
              {getCalorieMessage()}
            </Text>
          </View>
          
          {/* 원형 프로그레스 (더 크게) */}
          <View className="items-center justify-center mb-8" style={{ position: 'relative', height: progressSize }}>
            <Svg width={progressSize} height={progressSize} style={{ position: 'absolute' }}>
              <Circle 
                cx={progressSize / 2} 
                cy={progressSize / 2} 
                r={(progressSize - 28) / 2} 
                stroke="#E5E7EB" 
                strokeWidth={18} 
                fill="#fff" 
              />
              <Circle
                cx={progressSize / 2}
                cy={progressSize / 2}
                r={(progressSize - 28) / 2}
                stroke="#5ac845"
                strokeWidth={18}
                fill="none"
                strokeDasharray={2 * Math.PI * ((progressSize - 28) / 2)}
                strokeDashoffset={2 * Math.PI * ((progressSize - 28) / 2) * (1 - percent)}
                strokeLinecap="round"
                rotation="-90"
                origin={`${progressSize / 2},${progressSize / 2}`}
              />
            </Svg>
            <View className="items-center justify-center" style={{ position: 'absolute' }}>
              <Text className={`font-bold ${isTablet ? 'text-7xl' : 'text-6xl'}`} style={{ color: '#059669' }}>
                {remainingKcal.toLocaleString()}
              </Text>
              <Text className={`${isTablet ? 'text-2xl' : 'text-xl'}`} style={{ color: '#6B7280', marginTop: 8 }}>
                kcal 남음
              </Text>
            </View>
          </View>

          {/* 칼로리 상세 정보 (더 크게) */}
          <View 
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#F0FDF4' }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className={`${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#6B7280' }}>
                섭취한 칼로리
              </Text>
              <Text className={`font-bold ${isTablet ? 'text-xl' : 'text-lg'}`} style={{ color: '#059669' }}>
                {consumedKcal.toLocaleString()} kcal
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className={`${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#6B7280' }}>
                목표 칼로리
              </Text>
              <Text className={`font-bold ${isTablet ? 'text-xl' : 'text-lg'}`} style={{ color: '#1F2937' }}>
                {totalKcal.toLocaleString()} kcal
              </Text>
            </View>
          </View>
        </View>

        {/* 영양소 섹션 (더 크게) */}
        <View 
          className="rounded-3xl mb-6"
          style={{
            padding: isTablet ? 32 : 24,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            ...(Platform.OS !== 'web' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }),
            ...(isWeb && {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }),
          }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`font-bold ${isTablet ? 'text-3xl' : 'text-2xl'}`} style={{ color: '#1F2937' }}>
              영양소 현황
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="px-5 py-3 rounded-full"
              style={{ backgroundColor: '#5ac845' }}
            >
              <Text className={`font-semibold ${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#fff' }}>
                상세 보기
              </Text>
            </TouchableOpacity>
          </View>

          {/* 영양소 그리드 */}
          <View 
            className="flex-row flex-wrap"
            style={{ gap: 16 }}
          >
            {nutrients.map((nutrient, index) => (
              <NutrientCard
                key={nutrient.label}
                label={nutrient.label}
                value={nutrient.value}
                percent={nutrient.percent}
                index={index}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 영양소 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/40" 
          onPress={() => setModalVisible(false)}
        >
          <View 
            className="bg-white rounded-t-3xl p-6"
            style={{
              maxHeight: '85%',
              ...(isWeb && {
                maxWidth: 900,
                alignSelf: 'center',
                width: '100%',
                borderRadius: 24,
                marginBottom: 24,
              }),
            }}
          >
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            
            <Text className={`text-center font-bold mb-6 ${isTablet ? 'text-2xl' : 'text-xl'}`} style={{ color: '#1F2937' }}>
              영양소 상세 정보
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                {nutrients.map((nutrient, index) => (
                  <View 
                    key={nutrient.label}
                    className="rounded-2xl p-5"
                    style={{ 
                      width: isTablet ? '48%' : '100%',
                      backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className={`font-bold ${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#1F2937' }}>
                        {nutrient.label}
                      </Text>
                      <Text className={`font-bold ${isTablet ? 'text-lg' : 'text-base'}`} style={{ color: '#059669' }}>
                        {nutrient.value}
                      </Text>
                    </View>
                    <View 
                      className="rounded-full overflow-hidden"
                      style={{ 
                        height: 10, 
                        backgroundColor: '#E5E7EB',
                      }}
                    >
                      <View 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.min(nutrient.percent * 100, 100)}%`,
                          backgroundColor: '#5ac845',
                        }}
                      />
                    </View>
                    <Text className={`mt-2 ${isTablet ? 'text-sm' : 'text-xs'}`} style={{ color: '#6B7280' }}>
                      {Math.round(nutrient.percent * 100)}% 달성
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-6 rounded-2xl p-4"
              style={{ backgroundColor: '#5ac845' }}
            >
              <Text className={`text-center font-bold ${isTablet ? 'text-base' : 'text-sm'}`} style={{ color: '#fff' }}>
                닫기
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
