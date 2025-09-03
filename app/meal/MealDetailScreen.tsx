import { IconSymbol } from '@/components/ui/IconSymbol';
import { Food } from '@/constants/schemas/food';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 네비게이션 헤더 숨기기
export const options = {
  headerShown: false,
};

export default function MealDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [mealData, setMealData] = useState<Food[]>([]); // 먹은 음식 데이터
  const [mealType, setMealType] = useState<string>(''); // 식사 타입

  const handleGoBack = () => {
    router.back();
  };



  // 라우터 파라미터에서 식사 타입과 날짜 가져오기
  useEffect(() => {
    if (params.type) {
      setMealType(params.type as string);
    }
  }, [params.type]);

  // "추가하기" 버튼: AddFoodScreen으로 이동
  const goToAddFoodScreen = () => {
    // 필요한 경우 식사 타입/날짜를 전달
    router.push({ pathname: '/meal/AddFoodScreen' });
  };

  const getTitle = () => {
    switch (mealType) {
      case 'breakfast': return '아침';
      case 'lunch':     return '점심';
      case 'dinner':    return '저녁';
      case 'water':     return '물 섭취';
      default:          return '식사';
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 상단 헤더 */}
      <View className="pt-14 px-5 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-1">
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold">
            {getTitle()}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* 안내 문구 영역 (필요 시 유지) */}
      <View className="px-5 py-3" />

      {/* 본문 */}
      <ScrollView className="flex-1">
        {mealData.length === 0 ? (
          <View className="flex-1 justify-center items-center px-5 py-10">
            <Text className="text-2xl font-bold text-center mb-2">
              오늘 먹은 음식을
            </Text>
            <Text className="text-2xl font-bold text-center mb-10">
              기록해 보아요!
            </Text>
            <View className="w-64 h-64 justify-center items-center">
              <Image
                source={require('../../assets/images/image 1595.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
          </View>
        ) : (
          <View className="px-5 py-10">
            {mealData.map((meal: Food, idx: number) => (
              <View key={idx} className="mb-4 p-4 bg-green-50 border border-green-500 shadow-md rounded-lg">
                <Text className="text-lg font-bold mb-2 text-green-600">{meal.menuName}</Text>
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="flame" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">칼로리: {meal.calories} kcal</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="leaf" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">탄수화물: {meal.carbohydrate} g</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="fork.knife" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">단백질: {meal.protein} g</Text>
                </View>
                <View className="flex-row items-center">
                  <IconSymbol name="drop" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">지방: {meal.fat} g</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 하단 버튼: AddFoodScreen으로 이동 */}
      <View className="absolute bottom-8 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={goToAddFoodScreen}
          className="bg-white border border-green-500 py-4 rounded-full flex-row justify-center items-center"
        >
          <Text className="text-green-500 font-medium text-lg">
            + 음식 추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}