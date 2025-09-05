import React, { useState } from 'react';
import { ActivityIndicator, Animated, Text, TouchableOpacity, View } from 'react-native';

interface WeeklySummaryCardProps {
  summary?: string;
  recommendations?: string[];
}

export default function WeeklySummaryCard({ 
  summary, 
  recommendations 
}: WeeklySummaryCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  // 더미 데이터
  const defaultSummary = "확인해본 결과 이번 주는 나트륨량이 평소보다 많아요. 나트륨 섭취를 줄여보세요";
  const defaultRecommendations = [
    "가공식품 섭취를 줄이고 신선한 채소를 더 드셔보세요",
    "국물 요리보다는 구이, 찜 요리를 선택해보세요",
    "식사 전후에 충분한 수분을 섭취해주세요"
  ];

  const summaryText = summary || defaultSummary;
  const recList = recommendations || defaultRecommendations;

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    
    // API 호출 시뮬레이션 (10초 대기)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    setShowSummary(true);
    setIsLoading(false);
    
    // 애니메이션 실행
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-6 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Text className="text-blue-600 font-bold text-sm">AI</Text>
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            이번 주 건강 분석
          </Text>
        </View>
        
        {!showSummary && (
          <TouchableOpacity
            onPress={handleGenerateSummary}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full ${
              isLoading ? 'bg-gray-200' : 'bg-blue-500'
            }`}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="text-blue-600 text-sm font-medium ml-2">
                  분석 중...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-sm font-medium">
                요약 보기
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {showSummary && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View className="bg-blue-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-800 text-base leading-6">
              {summaryText}
            </Text>
          </View>
          
          <View>
            <Text className="text-sm font-medium text-gray-600 mb-2">
              💡 개선 제안
            </Text>
            {recList.map((rec, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-blue-500 mr-2">•</Text>
                <Text className="text-gray-700 text-sm flex-1 leading-5">
                  {rec}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
