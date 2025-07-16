import { useSignUpStore } from "@/stores/signup/SignupStore";
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SuccessStepProps {
  nickname?: string;
  targetWeight?: string;
  onMainButtonPress: () => void;
}

const SuccessStep = ({ onMainButtonPress }: SuccessStepProps) => {
  // Zustand 스토어에서 상태 가져오기
  const { nickname, targetWeight } = useSignUpStore();

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
        <View className="aspect-square w-4/5 rounded-lg justify-center items-center">
          <Image
            source={require('../../../../assets/images/image 1595.png')}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
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
