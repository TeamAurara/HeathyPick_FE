import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { StepIndicator } from './components/common/index';
import { ActivityStep, AgeStep, BodyInfoStep, GenderStep, NicknameStep } from './components/steps/index';

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // 총 단계 수
  
  // 사용자 정보 상태
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  
  // 신체 정보
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
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
        return <NicknameStep nickname={nickname} setNickname={setNickname} />;
      case 2:
        return <GenderStep gender={gender} setGender={setGender} nickname={nickname} />;
      case 3:
        return <AgeStep age={age} setAge={setAge} nickname={nickname} />;
      case 4:
        return <ActivityStep 
          activityLevel={activityLevel} 
          setActivityLevel={setActivityLevel} 
          nickname={nickname} 
        />;
      case 5:
        return <BodyInfoStep 
          height={height} 
          setHeight={setHeight} 
          weight={weight} 
          setWeight={setWeight} 
          targetWeight={targetWeight} 
          setTargetWeight={setTargetWeight} 
          nickname={nickname} 
        />;
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
      case 3:
        return age < 10 || age > 99;
      case 4:
        return activityLevel === null;
      case 5:
        return !height.trim() || !weight.trim() || !targetWeight.trim();
      default:
        return false;
    }
  };

  // 마지막 단계에서 버튼 텍스트 변경
  const getButtonText = () => {
    if (currentStep === totalSteps) {
      return '목표 설정 완료';
    }
    return '다음';
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
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
