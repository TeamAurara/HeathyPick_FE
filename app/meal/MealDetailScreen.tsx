import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MealDetailScreen() {
  const router = useRouter();
  const { type, date } = useLocalSearchParams<{ type: string; date: string }>();
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    router.back();
  };
  
  // 저장 버튼 핸들러
  const handleSave = () => {
    console.log('식사 기록 저장');
    router.back();
  };
  
  // 타입에 따른 제목 설정
  const getTitle = () => {
    switch (type) {
      case 'breakfast':
        return '아침';
      case 'lunch':
        return '점심';
      case 'dinner':
        return '저녁';
      case 'water':
        return '물 섭취';
      default:
        return '식사';
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 상단 헤더 */}
      <View className="flex-row items-center pt-14 pb-4 px-5 bg-gray-200">
        <TouchableOpacity onPress={handleGoBack} className="mr-4">
          <Text className="text-2xl font-bold">&lt;</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center mr-8">{getTitle()}</Text>
      </View>
      
      {/* 검색창 */}
      <View className="px-5 py-3">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <IconSymbol name="house.fill" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="오늘 먹은 음식을 기록해 보아요!"
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      {/* 중앙 더미 컴포넌트 */}
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center items-center bg-gray-200 mx-5 my-5 p-10 rounded-lg h-96">
          <Text className="text-lg text-center leading-7">
            오늘 먹은 음식을 기록해 보아요!
          </Text>
        </View>
      </ScrollView>
      
      {/* 하단 버튼 */}
      <View className="absolute bottom-8 right-8">
        <TouchableOpacity 
          className="bg-purple-500 w-15 h-15 rounded-full justify-center items-center shadow-lg"
          style={{ width: 60, height: 60 }} // Tailwind에서 w-15, h-15가 없어서 style 속성으로 추가
          onPress={handleSave}
        >
          <Text className="text-white font-bold">버튼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 