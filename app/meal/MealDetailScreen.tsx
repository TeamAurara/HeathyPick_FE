import { IconSymbol } from '@/components/ui/IconSymbol';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMealStore } from '../../stores/mealStore';

// 네비게이션 헤더 숨기기
export const options = {
  headerShown: false,
};

export default function MealDetailScreen() {
  const router = useRouter();
  const { mealType: type, mealDate: date, mealData } = useMealStore();

  const handleGoBack = () => {
    router.back();
  };

  type MealDataType = {
    name: string;
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };

  const goToAddFoodScreen = () => {
    router.push('/meal/AddFoodScreen');
  };

  const getTitle = () => {
    switch (type) {
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
            {mealData.map((meal: MealDataType, idx: number) => (
              <View key={idx} className="mb-4 p-4 bg-green-50 border border-green-500 shadow-md rounded-lg">
                <Text className="text-lg font-bold mb-2 text-green-600">{meal.name}</Text>
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="flame" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">칼로리: {meal.calories} kcal</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="leaf" size={16} color="green" />
                  <Text className="text-sm text-gray-700 ml-2">탄수화물: {meal.carbs} g</Text>
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

      {/* 하단 버튼 */}
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