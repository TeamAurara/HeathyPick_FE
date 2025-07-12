import { useSignUpStore } from '@/stores/signup/SignupStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StepIndicator } from './components/common/index';
import { ActivityStep, AgeStep, BodyInfoStep, CKDStep, GenderStep, NicknameStep, SuccessStep } from './components/steps/index';

export default function SignUpScreen() {
  const router = useRouter();
  
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    // 상태
    nickname,
    targetWeight,
    currentStep,
    isCompleted,
    
    // 액션
    prevStep,
    nextStep,
    isCurrentStepValid,
    completeSignUp
  } = useSignUpStore();
  
  const totalSteps = 6; // 총 단계 수
  
  const handleBack = () => {
    if (isCompleted) {
      // 완료 화면에서는 뒤로가기 불가
      return;
    }
    
    if (currentStep > 1) {
      prevStep();
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      nextStep();
    } else {
      // 모든 단계 완료 후 성공 화면으로 전환
      // 여기에서 API 호출을 추가할 수 있습니다
      // const userData = getSignUpData();
      // await api.signup(userData);
      completeSignUp();
    }
  };

  const handleMainButtonPress = () => {
    // 메인 화면으로 이동
    router.replace('/(tabs)/ReportScreen');
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return (
        <SuccessStep 
          onMainButtonPress={handleMainButtonPress}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <NicknameStep />;
      case 2:
        return <GenderStep />;
      case 3:
        return <AgeStep />;
      case 4:
        return <ActivityStep />;
      case 5:
        return <CKDStep />;
      case 6:
        return <BodyInfoStep />;
      default:
        return null;
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
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardOpeningTime={0}
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 140}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* 헤더 영역 - 완료 화면에서는 표시하지 않음 */}
        {!isCompleted && (
          <View className="px-4 pt-12 w-full">
            <TouchableOpacity onPress={handleBack} className="p-2 mb-4">
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="px-4 pt-4">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </View>
          </View>
        )}

        {/* 콘텐츠 영역 */}
        <View className="flex-1 px-6 py-8">
          {renderStepContent()}
        </View>

        {/* 하단 버튼 - 완료 화면에서는 표시하지 않음 */}
        {!isCompleted && (
          <View className="px-6 pb-16 mt-4">
            <TouchableOpacity
              onPress={handleNext}
              className={`w-full py-4 rounded-md items-center ${!isCurrentStepValid() ? 'bg-gray-100' : 'bg-green-500'}`}
              disabled={!isCurrentStepValid()}
            >
              <Text className={`text-base font-medium ${!isCurrentStepValid() ? 'text-gray-400' : 'text-white'}`}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
