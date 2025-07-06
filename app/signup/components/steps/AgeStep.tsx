import WheelPicker from '@quidone/react-native-wheel-picker';
import React from 'react';
import { Text, View } from 'react-native';

interface AgeStepProps {
  age: number;
  setAge: (age: number) => void;
  nickname?: string;
}

const AgeStep = ({ age, setAge, nickname = '어라라' }: AgeStepProps) => {
  // 나이 옵션 생성 (10-99세)
  const ageData = Array.from({ length: 90 }, (_, i) => ({
    value: i + 10,
    label: `${i + 10}세`
  }));

  return (
    <View className="w-full">
      <Text className="text-3xl font-bold text-center mb-2 mt-10">
        {nickname}님의{'\n'}나이를 알려주세요!
      </Text>
      <Text className="text-center text-green-400 mb-6">
        만 나이를 입력해주세요!
      </Text>
      <View className="items-center py-4">
        <WheelPicker
          data={ageData}
          value={age}
          onValueChanged={({item}) => setAge(item.value)}
          itemHeight={40}
          visibleItemCount={5}
          style={{ width: 150, height: 180 }}
          itemTextStyle={{ fontSize: 24, fontWeight: 'bold' }}
          overlayItemStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
};

export default AgeStep; 