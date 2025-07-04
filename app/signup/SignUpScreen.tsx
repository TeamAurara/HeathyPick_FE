import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 스텝별 진행 상황을 표시하는 프로그레스 바 컴포넌트
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <View 
        className="h-full bg-green-500" 
        style={{ width: `${progress}%` }} 
      />
    </View>
  );
};

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // 총 단계 수
  const [nickname, setNickname] = useState('');

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 모든 단계 완료 후 메인 화면으로 이동
      router.replace('/(tabs)/ReportScreen');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              만나서 반가워요!{'\n'}어떻게 불러드릴까요?
            </Text>
            <Text className="text-green-600 font-medium mb-2">닉네임</Text>
            <TextInput
              className="w-full border-b border-gray-300 py-2 mb-4"
              placeholder="2~12자로 입력해주세요."
              value={nickname}
              onChangeText={setNickname}
              maxLength={12}
            />
          </View>
        );
      case 2:
        // 두 번째 단계 내용
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              두 번째 단계{'\n'}추가 정보를 입력해주세요
            </Text>
            {/* 여기에 추가 입력 필드 */}
          </View>
        );
      case 3:
        // 세 번째 단계 내용
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              마지막 단계{'\n'}거의 다 왔어요!
            </Text>
            {/* 여기에 추가 입력 필드 */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 영역 */}
      <View className="px-4 py-2">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="mt-2">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </View>
      </View>

      {/* 콘텐츠 영역 */}
      <View className="flex-1 px-6 py-8">
        {renderStepContent()}
      </View>

      {/* 하단 버튼 */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-gray-100 py-4 rounded-md items-center"
          disabled={currentStep === 1 && !nickname.trim()}
        >
          <Text className="text-base font-medium text-gray-800">
            {currentStep === totalSteps ? '완료' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
