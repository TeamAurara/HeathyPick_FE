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
      <Text className="text-3xl font-bold text-center mb-6">
        {nickname}님은{'\n'}평소에...
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        적합한 운동을 추천해 드릴게요!
      </Text>
      <View className="w-full">
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