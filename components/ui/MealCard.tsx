import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MealCardProps {
  title: string;
  description?: string;
  currentValue?: number;
  maxValue?: number;
  kcal?: number;
  progressColor?: string;
  onPress?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  title,
  description = '-',
  currentValue = 0,
  maxValue = 500,
  kcal,
  progressColor = 'bg-green-400',
  onPress,
}) => {
  // 내용이 비어있는지 확인 (description이 '-'이거나 없을 때)
  const isEmpty = !description || description === '-';
  
  // 진행률 계산 (0~100%)
  const progressPercentage = Math.min(Math.max((currentValue / maxValue) * 100, 0), 100);
  
  // kcal 표시 색상 결정 (진행률이 100%를 넘으면 빨간색, 아니면 초록색)
  const kcalColor = progressPercentage >= 100 ? 'text-red-500' : 'text-green-500';

  return (
    <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold">{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text className="text-gray-400 text-2xl">{isEmpty ? '+' : '>'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text className="text-gray-500 mt-1">{description}</Text>
      
      <View className="h-2 bg-gray-100 rounded-full mt-3">
        <View 
          className={`h-2 ${progressColor} rounded-full`} 
          style={{ width: `${progressPercentage}%` }} 
        />
      </View>
      
      <View className="flex-row justify-end mt-1">
        <Text className="text-gray-400">{maxValue}</Text>
      </View>
      
      {kcal !== undefined && (
        <Text className={`${kcalColor} text-3xl font-bold mt-4`}>
          {kcal}<Text className="text-gray-300 text-xl">kcal</Text>
        </Text>
      )}
    </View>
  );
};

export default MealCard; 