import React from 'react';
import { ScrollView, Text } from 'react-native';
import BodyInfoInput from '../common/BodyInfoInput';

interface BodyInfoStepProps {
  height: string;
  setHeight: (height: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  targetWeight: string;
  setTargetWeight: (targetWeight: string) => void;
  nickname?: string;
}

const BodyInfoStep = ({ 
  height, 
  setHeight, 
  weight, 
  setWeight, 
  targetWeight, 
  setTargetWeight,
  nickname = '어라라'
}: BodyInfoStepProps) => {
  return (
    <ScrollView 
      className="w-full" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text className="text-3xl font-bold text-center mb-6">
        {nickname}님의{'\n'}키를 알려주세요
      </Text>
      <Text className="text-center text-gray-500 mb-8">
        이제 거의 다 왔어요!
      </Text>
      
      <BodyInfoInput
        label="키"
        value={height}
        onChangeText={setHeight}
        placeholder="지금 몇 cm 인가요?"
        unit="cm"
      />
      
      {height.trim() !== '' && (
        <>
          <BodyInfoInput
            label="몸무게"
            value={weight}
            onChangeText={setWeight}
            placeholder="지금 몇 kg 인가요?"
            unit="kg"
          />
          
          {weight.trim() !== '' && (
            <BodyInfoInput
              label="목표 몸무게"
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="목표 몸무게는 몇 kg인가요?"
              unit="kg"
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default BodyInfoStep; 