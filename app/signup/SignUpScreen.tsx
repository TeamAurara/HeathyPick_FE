import { useSignUpStore } from "@/stores/signup/SignupStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StepIndicator } from "./components/common/index";
import {
  ActivityStep,
  AgeStep,
  AgreementStep,
  BodyInfoStep,
  CKDStep,
  GenderStep,
  NicknameStep,
  SuccessStep,
} from "./components/steps/index";

interface SignUpScreenProps {
  onOnboardingComplete?: () => void;
}

export default function SignUpScreen({
  onOnboardingComplete,
}: SignUpScreenProps) {
  const BaseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          console.log("가져온 사용자 ID:", storedUserId);

          console.log("BaseUrl:", BaseUrl);
          console.log(
            "전체 API URL:",
            `${BaseUrl}/users/${storedUserId}/onboarding`
          );
        } else {
          console.warn("사용자 ID를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("사용자 ID 가져오기 오류:", error);
      }
    };

    getUserId();
  }, [BaseUrl]);

  const {
    nickname,
    targetWeight,
    currentStep,
    isCompleted,

    prevStep,
    nextStep,
    isCurrentStepValid,
    completeSignUp,
    getSignUpData,
  } = useSignUpStore();

  const totalSteps = 7;

  const handleBack = () => {
    if (isCompleted) {
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
      try {
        setIsLoading(true);

        const userData = getSignUpData();
        console.log("회원가입 데이터:", userData);
        const apiUrl = `${BaseUrl}/users/${userId}/onboarding`;
        console.log("요청 URL:", apiUrl);
        if (!userId) {
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }

        const response = await axios.post(apiUrl, userData);

        console.log("백엔드 응답:", response.data);

        completeSignUp();
      } catch (error) {
        console.error("회원가입 오류:", error);
        Alert.alert(
          "회원가입 실패",
          "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
          [{ text: "확인" }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMainButtonPress = () => {
    if (onOnboardingComplete) onOnboardingComplete();
    else router.replace("/HomeScreen");
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return <SuccessStep onMainButtonPress={handleMainButtonPress} />;
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
      case 7:
        return <AgreementStep />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (currentStep === totalSteps) {
      return isLoading ? "처리 중..." : "회원가입 완료";
    }
    return "다음";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardOpeningTime={0}
        extraScrollHeight={Platform.OS === "ios" ? 120 : 140}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {!isCompleted && (
          <View className="px-4 pt-12 w-full">
            <TouchableOpacity onPress={handleBack} className="p-2 mb-4">
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="px-4 pt-4">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </View>
          </View>
        )}

        <View className="flex-1 px-6 py-8">{renderStepContent()}</View>

        {!isCompleted && (
          <View className="px-6 pb-16 mt-4">
            <TouchableOpacity
              onPress={handleNext}
              className={`w-full py-4 rounded-md items-center ${!isCurrentStepValid() || isLoading ? "bg-gray-100" : "bg-green-500"}`}
              disabled={!isCurrentStepValid() || isLoading}
            >
              <Text
                className={`text-base font-medium ${!isCurrentStepValid() || isLoading ? "text-gray-400" : "text-white"}`}
              >
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
