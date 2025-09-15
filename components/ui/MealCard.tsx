import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FoodItem {
  name: string;
  kcal?: number;
}

interface MealCardProps {
  title: string;
  foodItems?: FoodItem[];
  currentValue?: number;
  maxValue?: number;
  kcal?: number;
  progressColor?: string;
  onPress?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  title,
  foodItems = [],
  currentValue = 0,
  maxValue = 500,
  kcal,
  progressColor = 'bg-green-400',
  onPress,
}) => {
  // 내용이 비어있는지 확인
  const isEmpty = foodItems.length === 0;
  
  // 진행률 계산 (0~100%)
  const progressPercentage = Math.min(Math.max((currentValue / maxValue) * 100, 0), 100);
  
  // kcal 표시 색상 결정 (진행률이 100%를 넘으면 빨간색, 아니면 초록색)
  const kcalColor = progressPercentage >= 100 ? 'text-red-500' : 'text-green-500';

  // 음식 이름 표시 (최대 2개까지)
  const displayFoodItems = () => {
    // 항상 3줄의 높이를 유지하기 위한 뷰
    return (
      <View className="mt-1 h-[72px] justify-start">
        {isEmpty ? (
          <View className="flex-1 justify-center">
            <Text className="text-gray-500 text-center italic">메뉴를 기록해봐요!</Text>
          </View>
        ) : (
          <>
            {/* 최대 2개까지만 표시 */}
            {foodItems.slice(0, 2).map((item, index) => (
              <Text key={index} className="text-gray-500 text-sm" numberOfLines={1} ellipsizeMode="tail">
                • {item.name}
              </Text>
            ))}
            {/* 추가 항목이 있으면 표시, 없으면 빈 공간 유지 */}
            <Text className="text-gray-400 text-xs">
              {foodItems.length > 2 ? `외 ${foodItems.length - 2}개` : ''}
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-100">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold">{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text className="text-gray-400 text-2xl">{isEmpty ? '+' : '>'}</Text>
        </TouchableOpacity>
      </View>
      
      {displayFoodItems()}
      
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