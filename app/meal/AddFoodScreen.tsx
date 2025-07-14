import { IconSymbol } from '@/components/ui/IconSymbol';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = params.mealType?.toString() || '';
  const mealDate = params.mealDate?.toString() || '';
  
  // 음식 정보 상태
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    router.back();
  };
  
  // 음식 추가 핸들러
  const handleAddFood = () => {
    // 여기에 음식 추가 로직 구현
    console.log('음식 추가:', {
      name: foodName,
      calories,
      carbs,
      protein,
      fat,
      type: mealType,
      date: mealDate
    });
    
    // 추가 후 이전 화면으로 돌아가기
    router.back();
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
          <View className="flex-row items-center justify-center flex-1">
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              className="mr-2"
            />
            <Text className="text-xl font-bold">음식 추가</Text>
          </View>
          <View style={{ width: 24 }} /> {/* 균형을 맞추기 위한 빈 공간 */}
        </View>
      </View>
      
      {/* 입력 폼 */}
      <ScrollView className="flex-1 px-5 py-4">
        {/* 음식 이름 */}
        <View className="mb-6">
          <Text className="text-green-500 font-medium mb-2">음식 이름(필수)</Text>
          <View className="border-b border-green-500 pb-2">
            <TextInput
              value={foodName}
              onChangeText={setFoodName}
              placeholder="ex) 사과, 초코케이크"
              placeholderTextColor="#999"
              className="text-base text-gray-500"
            />
          </View>
        </View>
        
        
        {/* 영양정보 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4 text-green-500">영양정보(선택)</Text>
          
          {/* 칼로리 및 탄수화물 (첫 번째 행) */}
          <View className="flex-row justify-between mb-6">
            {/* 칼로리 */}
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">칼로리(kcal)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="ex) 130"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
            
            {/* 탄수화물 */}
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">탄수화물(g)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="ex) 200"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
          </View>
          
          {/* 단백질 및 지방 (두 번째 행) */}
          <View className="flex-row justify-between mb-6">
            {/* 단백질 */}
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">단백질(g)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="ex) 130"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
            
            {/* 지방 */}
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">지방(g)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  placeholder="ex) 200"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* 하단 버튼 */}
      <View className="px-5 pb-4 mt-4 ">
        <TouchableOpacity
          className="bg-white border border-green-500 py-4 px-6 rounded-lg flex-row items-center justify-center w-full mb-8"
          onPress={handleAddFood}
        >
          <Text className="text-green-500 font-medium text-lg text-center">
            추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 