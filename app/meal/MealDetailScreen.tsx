import { IconSymbol } from '@/components/ui/IconSymbol';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MealDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type?.toString() || '';
  const date = params.date?.toString() || '';
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    router.back();
  };
  
  // 음식 추가 페이지로 이동
  const goToAddFoodScreen = () => {
    router.push({
      pathname: "/meal/AddFoodScreen",
      params: {
        mealType: type,
        mealDate: date
      }
    });
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
      <View className="pt-14 px-5 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-1">
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1 text-center">기록하기</Text>
          <View style={{ width: 24 }} /> {/* 균형을 맞추기 위한 빈 공간 */}
        </View>
      </View>
      
      {/* 검색창 */}
      <View className="px-5 py-3">
        <View className="flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-500"
            placeholder="음식을 검색해보세요"
            placeholderTextColor="#999"
          />
          <IconSymbol name="magnifyingglass" size={20} color="#999" />
        </View>
      </View>
      
      {/* 중앙 컨텐츠 - 이미지와 텍스트 */}
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center items-center px-5 py-10">
          <View className="items-center">
            <Text className="text-2xl font-bold text-center mb-2">
              오늘 먹은 음식을
            </Text>
            <Text className="text-2xl font-bold text-center mb-10">
              기록해 보아요!
            </Text>
            
            {/* 캐릭터 이미지 */}
            <View className="w-64 h-64 justify-center items-center">
              <Image
                source={require('../../assets/images/image 1595.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* 하단 프로필 및 버튼 */}
      <View className="px-6 py-4 absolute bottom-8 left-0 right-0">
        <TouchableOpacity 
          className="bg-white border border-green-500 py-4 px-6 rounded-lg flex-row items-center justify-center w-full"
          onPress={goToAddFoodScreen}
        >
          <Text className="text-green-500 font-medium text-lg text-center">
            + 음식 추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 