import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WeightCardProps {
  currentWeight: number;
  previousWeight?: number;
  targetWeight?: number;
  onPress?: () => void;
}

export const WeightCard: React.FC<WeightCardProps> = ({
  currentWeight,
  previousWeight,
  targetWeight,
  onPress,
}) => {
  // 이전 체중과 비교하여 증감 계산
  const weightDiff = previousWeight ? (currentWeight - previousWeight).toFixed(1) : null;
  const isGain = weightDiff && parseFloat(weightDiff) > 0;
  const isLoss = weightDiff && parseFloat(weightDiff) < 0;
  
  // 목표 체중까지 남은 무게
  const remainingWeight = targetWeight ? (targetWeight - currentWeight).toFixed(1) : null;
  
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 shadow-md border border-gray-100 w-full"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">체중 기록</Text>
        <Text className="text-gray-400 text-xl">{'>'}</Text>
      </View>
      
      <View className="flex-row items-baseline">
        <Text className="text-3xl font-bold">{currentWeight}</Text>
        <Text className="text-xl text-gray-400 ml-1">kg</Text>
        
        {weightDiff && (
          <Text 
            className={`ml-3 ${isGain ? 'text-red-500' : isLoss ? 'text-green-500' : 'text-gray-500'}`}
          >
            {isGain ? '+' : ''}{weightDiff}kg
          </Text>
        )}
      </View>
      
      {targetWeight && (
        <View className="mt-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">목표 체중</Text>
            <Text className="font-medium">{targetWeight}kg</Text>
          </View>
          
          <View className="h-2 bg-gray-100 rounded-full mt-1">
            <View 
              className="h-2 bg-green-400 rounded-full" 
              style={{ 
                width: `${Math.min(Math.max((currentWeight / targetWeight) * 100, 0), 100)}%` 
              }} 
            />
          </View>
          
          <Text className="text-gray-500 text-sm mt-1">
            목표까지 {Math.abs(parseFloat(remainingWeight || '0'))}kg {parseFloat(remainingWeight || '0') > 0 ? '감량' : '증량'} 필요
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default WeightCard; 