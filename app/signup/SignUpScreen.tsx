import { useSignUpStore } from '@/stores/signup/SignupStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StepIndicator } from './components/common/index';
import { ActivityStep, AgeStep, BodyInfoStep, CKDStep, GenderStep, NicknameStep, SuccessStep } from './components/steps/index';

export default function SignUpScreen() {
  const BaseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // 컴포넌트 마운트 시 AsyncStorage에서 userId 가져오기
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('가져온 사용자 ID:', storedUserId);
          
          // BaseUrl과 API 경로 출력
          console.log('BaseUrl:', BaseUrl);
          console.log('전체 API URL:', `${BaseUrl}/users/${storedUserId}/onboarding`);
        } else {
          console.warn('사용자 ID를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('사용자 ID 가져오기 오류:', error);
      }
    };
    
    getUserId();
  }, [BaseUrl]);
  
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
    completeSignUp,
    getSignUpData
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

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      nextStep();
    } else {
      // 모든 단계 완료 후 성공 화면으로 전환
      try {
        setIsLoading(true);
        
        // 회원가입 데이터 가져오기
        const userData = getSignUpData();
        console.log('회원가입 데이터:', userData);
        
        if (!userId) {
          throw new Error('사용자 ID를 찾을 수 없습니다.');
        }
        
        // API URL 출력
        const apiUrl = `${BaseUrl}/users/${userId}/onboarding`;
        console.log('요청 URL:', apiUrl);
        
        // 백엔드 API 호출 - 온보딩 정보 저장
        const response = await axios.post(
          apiUrl, 
          userData
        );
        
        console.log('백엔드 응답:', response.data);
        
        // 성공적으로 회원가입이 완료되면 완료 화면으로 전환
        completeSignUp();
      } catch (error) {
        console.error('회원가입 오류:', error);
        Alert.alert(
          '회원가입 실패',
          '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMainButtonPress = () => {
    // 메인 화면으로 이동
    router.replace('/(tabs)/HomeScreen');
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
      return isLoading ? '처리 중...' : '목표 설정 완료';
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
              className={`w-full py-4 rounded-md items-center ${!isCurrentStepValid() || isLoading ? 'bg-gray-100' : 'bg-green-500'}`}
              disabled={!isCurrentStepValid() || isLoading}
            >
              <Text className={`text-base font-medium ${!isCurrentStepValid() || isLoading ? 'text-gray-400' : 'text-white'}`}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
