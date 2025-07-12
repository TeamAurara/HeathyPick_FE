import React from 'react';
import { Text, View } from 'react-native';
import {useSignUpStore} from "@/stores/signup/SignupStore";
import InputWithClearButton from '../common/InputWithClearButton';

// props 인터페이스는 더 이상 필요 없음
// 하지만 기존 코드와의 호환성을 위해 일단 유지
interface NicknameStepProps {
  nickname?: string;
  setNickname?: (text: string) => void;
}

const NicknameStep = ({ }: NicknameStepProps) => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { nickname, setNickname } = useSignUpStore();

  return (
    <View className="w-full">
      <Text className="text-3xl font-bold text-center mb-6 mt-10">
        만나서 반가워요!{'\n'}어떻게 불러드릴까요?
      </Text>
      <Text className="text-green-600 font-medium mb-2 mt-10">닉네임</Text>
      <InputWithClearButton
        value={nickname}
        onChangeText={setNickname}
        placeholder="2~12자로 입력해주세요."
        maxLength={12}
      />
    </View>
  );
};

export default NicknameStep;
