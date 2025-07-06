import React from 'react';
import { Text, View } from 'react-native';
import ActivityOption from '../common/ActivityOption';

interface ActivityStepProps {
  activityLevel: string | null;
  setActivityLevel: (level: string) => void;
  nickname?: string;
}

const ActivityStep = ({ activityLevel, setActivityLevel, nickname = '어라라' }: ActivityStepProps) => {
  // 운동 선호도 옵션
  const activityOptions = [
    '격한 운동을 많이 해요',
    '약한 운동을 많이 해요',
    '잘 움직여요',
    '몸을 거의 움직이지 않아요'
  ];

  return (
    <View className="w-full">
      <Text className="text-3xl font-bold text-center mb-6 mt-10">
        {nickname}님은{'\n'}평소에...
      </Text>
    
      <View className="w-full mt-10">
        {activityOptions.map((option) => (
          <ActivityOption
            key={option}
            label={option}
            selected={activityLevel === option}
            onSelect={() => setActivityLevel(option)}
          />
        ))}
      </View>
    </View>
  );
};

export default ActivityStep; 