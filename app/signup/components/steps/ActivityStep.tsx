import { useSignUpStore } from "@/stores/signup/SignupStore";
import React from 'react';
import { Text, View } from 'react-native';
import ActivityOption from '../common/ActivityOption';

interface ActivityStepProps {
  activityLevel?: string | null;
  setActivityLevel?: (level: string) => void;
  nickname?: string;
}

const ActivityStep = ({}: ActivityStepProps) => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { activityLevel, setActivityLevel, nickname } = useSignUpStore();

  // 운동 선호도 옵션 (백엔드 매핑과 일치하도록 순서 조정)
  const activityOptions = [
    '격한 운동을 많이 해요',    // MOVE_HARD
    '잘 움직여요',             // MOVE_WELL
    '약한 운동을 많이 해요',    // MOVE_LESS
    '몸을 거의 움직이지 않아요'  // MOVE_NONE
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
