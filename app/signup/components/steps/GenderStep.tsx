import React from 'react';
import { Text, View } from 'react-native';
import {useSignUpStore} from "@/stores/signup/SignupStore";
import GenderOption from '../common/GenderOption';

interface GenderStepProps {
  gender?: 'male' | 'female' | null;
  setGender?: (gender: 'male' | 'female') => void;
  nickname?: string;
}

const GenderStep = ({}: GenderStepProps) => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { gender, setGender, nickname } = useSignUpStore();

  return (
    <View className="w-full">
      <Text className="text-3xl font-bold text-center mb-6 mt-10">
        {nickname}님의{'\n'}성별은
      </Text>
      <Text className="text-center text-green-400 mb-6 mt-10">
        맞춤형 기록 서비스 제공을 위해 필요해요!
      </Text>
      <View className="flex-row space-x-4 px-4 gap-4">
        <GenderOption
          label="남자"
          selected={gender === 'male'}
          onSelect={() => setGender('male')}
        />
        <GenderOption
          label="여자"
          selected={gender === 'female'}
          onSelect={() => setGender('female')}
        />
      </View>
    </View>
  );
};

export default GenderStep;
