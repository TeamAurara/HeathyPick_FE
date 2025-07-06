import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SuccessStepProps {
  nickname: string;
  targetWeight: string;
  onMainButtonPress: () => void;
}

const SuccessStep = ({ nickname, targetWeight, onMainButtonPress }: SuccessStepProps) => {
  return (
    <View className="flex-1 items-center justify-between py-4">
      {/* 상단 텍스트 */}
      <View className="items-center mt-20">
        <Text className="text-3xl font-bold text-center mb-2">
          {nickname}님이
        </Text>
        <Text className="text-3xl font-bold text-center">
          {targetWeight}kg이 될 때까지
        </Text>
      </View>

      {/* 중앙 이미지와 텍스트 */}
      <View className="flex-1 w-full flex-grow justify-center items-center my-8">
        <View className="aspect-square w-4/5 bg-green-400 rounded-lg justify-center items-center">
          <Text className="text-2xl text-center text-black font-bold">
            캐릭터 이미지
          </Text>
        </View>
        
        <Text className="text-xl text-center font-medium mt-4">
          힐픽과 함께 힘내봐요!
        </Text>
      </View>

      {/* 하단 버튼 */}
      <View className="items-center w-full mt-4">
        <TouchableOpacity
          onPress={onMainButtonPress}
          className="w-full py-4 rounded-md items-center bg-green-500"
        >
          <Text className="text-base font-medium text-white">
            메인으로 가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuccessStep; 