import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SupplementCardProps {
  name: string;
  timeToTake: string;
  isTaken: boolean;
  onPress?: () => void;
  onSchedulePress?: () => void;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  name,
  timeToTake,
  isTaken,
  onPress,
  onSchedulePress,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-100">
      {/* 메인 카드 영역 */}
      <TouchableOpacity 
        className="flex-row justify-between items-center"
        onPress={onPress}
      >
        <View className="flex-row items-center">
          <View className={`w-4 h-4 rounded-full mr-3 ${isTaken ? 'bg-green-500' : 'bg-gray-300'}`} />
          <View>
            <Text className="text-lg font-bold">{name}</Text>
            <Text className="text-gray-500 text-sm">{timeToTake}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <Text className={`mr-2 ${isTaken ? 'text-green-500' : 'text-gray-400'}`}>
            {isTaken ? '복용 완료' : '복용 예정'}
          </Text>
          <Text className="text-gray-400 text-xl">{'>'}</Text>
        </View>
      </TouchableOpacity>

      {/* 복용 예정 버튼 (복용하지 않은 경우에만 표시) */}
      {!isTaken && onSchedulePress && (
        <TouchableOpacity
          onPress={onSchedulePress}
          className="mt-3 py-2 px-4 bg-blue-500 rounded-lg flex-row items-center justify-center"
        >
          <Text className="text-white font-medium text-sm">
            📅 복용 시간 설정
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SupplementCard; 