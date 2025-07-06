import React from 'react';
import { Text, View } from 'react-native';
import GenderOption from '../common/GenderOption';

interface GenderStepProps {
  gender: 'male' | 'female' | null;
  setGender: (gender: 'male' | 'female') => void;
  nickname?: string;
}

const GenderStep = ({ gender, setGender, nickname = '어라라' }: GenderStepProps) => {
  return (
    <View className="w-full">
      <Text className="text-3xl font-bold text-center mb-6">
        {nickname}님의{'\n'}성별은
      </Text>
      <Text className="text-center text-gray-500 mb-6">
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