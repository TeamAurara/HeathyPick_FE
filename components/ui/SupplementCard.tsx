import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SupplementCardProps {
  name: string;
  timeToTake: string;
  isTaken: boolean;
  onPress?: () => void;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  name,
  timeToTake,
  isTaken,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-100 flex-row justify-between items-center"
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
  );
};

export default SupplementCard; 