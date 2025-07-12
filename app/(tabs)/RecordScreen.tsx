import CalendarIcon from '@/components/ui/CalendarIcon';
import { Stack } from "expo-router";
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function RecordScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };
  
  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  // 다음 날짜로 이동
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "기록", headerShown: false }} />
      
      {/* 상단 헤더 부분 */}
      <View className="pt-12 pb-4 px-4">
        <Text className="text-center text-2xl font-bold">기록</Text>
        
        {/* 달력 아이콘 */}
        <TouchableOpacity className="absolute right-4 top-12">
          <View className="w-10 h-10 justify-center items-center">
            <CalendarIcon width={28} height={28} />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* 날짜 네비게이션 */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={goToPreviousDay} className="w-10 h-10 justify-center items-center">
          <Text className="text-3xl text-gray-400">&lt;</Text>
        </TouchableOpacity>
        
        <View className="flex-row items-center">
          <Text className="text-2xl font-semibold">{formatDate(currentDate)}</Text>
     
        </View>
        
        <TouchableOpacity onPress={goToNextDay} className="w-10 h-10 justify-center items-center">
          <Text className="text-3xl text-gray-400">&gt;</Text>
        </TouchableOpacity>
      </View>
      
      {/* 메인 콘텐츠 영역 */}
      <View className="flex-1 p-4">
        {/* 여기에 식사 기록 카드 등을 추가할 수 있습니다 */}
        <View className="flex-row flex-wrap justify-between">
          {/* 아침 카드 */}
          <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold">아침</Text>
              <TouchableOpacity>
                <Text className="text-gray-400 text-2xl">&gt;</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 mt-1">빵, 토마토, 치즈</Text>
            <View className="h-2 bg-gray-100 rounded-full mt-3">
              <View className="h-2 bg-green-400 rounded-full w-[70%]" />
            </View>
            <View className="flex-row justify-end mt-1">
              <Text className="text-gray-400">500</Text>
            </View>
            <Text className="text-green-500 text-3xl font-bold mt-4">300<Text className="text-gray-300 text-xl">kcal</Text></Text>
          </View>
          
          {/* 점심 카드 */}
          <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold">점심</Text>
              <TouchableOpacity>
                <Text className="text-gray-400 text-2xl">&gt;</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 mt-1">스파게티</Text>
            <View className="h-2 bg-gray-100 rounded-full mt-3">
              <View className="h-2 bg-red-400 rounded-full w-full" />
            </View>
            <View className="flex-row justify-end mt-1">
              <Text className="text-gray-400">500</Text>
            </View>
            <Text className="text-red-500 text-3xl font-bold mt-4">800<Text className="text-gray-300 text-xl">kcal</Text></Text>
          </View>
          
          {/* 저녁 카드 */}
          <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold">저녁</Text>
              <TouchableOpacity>
                <Text className="text-gray-400 text-2xl">+</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 mt-1">-</Text>
            <View className="h-2 bg-gray-100 rounded-full mt-3">
              <View className="h-2 bg-green-400 rounded-full w-[5%]" />
            </View>
            <View className="flex-row justify-end mt-1">
              <Text className="text-gray-400">500</Text>
            </View>
          </View>
          
          {/* 물 섭취 카드 */}
          <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold">물 섭취</Text>
              <TouchableOpacity>
                <Text className="text-gray-400 text-2xl">+</Text>
              </TouchableOpacity>
            </View>
            <View className="h-2 bg-gray-100 rounded-full mt-3">
              <View className="h-2 bg-green-400 rounded-full w-[5%]" />
            </View>
            <View className="flex-row justify-end mt-1">
              <Text className="text-gray-400">200</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
