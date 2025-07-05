import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 스텝 인디케이터 컴포넌트 - 5개의 막대 형태
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <View className="w-full flex-row justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        
        return (
          <View 
            key={stepNumber}
            className={`h-1.5 flex-1 mx-0.5 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
            style={index === 0 ? { marginLeft: 0 } : index === totalSteps - 1 ? { marginRight: 0 } : {}}
          />
        );
      })}
    </View>
  );
};

// 성별 선택 옵션 컴포넌트
const GenderOption = ({ 
  label, 
  selected, 
  onSelect 
}: { 
  label: string; 
  selected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <TouchableOpacity 
      onPress={onSelect}
      className={`flex-1 py-12 items-center justify-center rounded-md ${
        selected ? 'border-2 border-green-500 bg-white' : 'bg-gray-100'
      }`}
    >
      <Text className={`text-lg ${selected ? 'text-green-500 font-bold' : 'text-gray-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // 총 단계 수
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

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
        // 성별 선택 화면
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              어라라님의{'\n'}성별은
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              맞춤형 기록 서비스 제공을 위해 필요해요!
            </Text>
            <View className="flex-row space-x-4">
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
      case 4:
        // 네 번째 단계 내용
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              네 번째 단계{'\n'}조금만 더 입력해주세요
            </Text>
            {/* 여기에 추가 입력 필드 */}
          </View>
        );
      case 5:
        // 다섯 번째 단계 내용
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              완료 단계{'\n'}모든 정보가 입력되었습니다
            </Text>
            {/* 여기에 추가 입력 필드 */}
          </View>
        );
      default:
        return null;
    }
  };

  // 현재 단계에 따른 다음 버튼 활성화 여부 결정
  const isNextButtonDisabled = () => {
    switch (currentStep) {
      case 1:
        return !nickname.trim();
      case 2:
        return gender === null;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 영역 */}
      <View className="px-4 pt-6">
        <TouchableOpacity onPress={handleBack} className="p-2 mb-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="px-4">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
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
          className={`w-full py-4 rounded-md items-center ${isNextButtonDisabled() ? 'bg-gray-100' : 'bg-green-500'}`}
          disabled={isNextButtonDisabled()}
        >
          <Text className={`text-base font-medium ${isNextButtonDisabled() ? 'text-gray-400' : 'text-white'}`}>
            {currentStep === totalSteps ? '완료' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
