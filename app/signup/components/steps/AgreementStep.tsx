import { useSignUpStore } from '@/stores/signup/SignupStore';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface AgreementStepProps {
  nickname?: string;
}

const AgreementStep = ({}: AgreementStepProps) => {
  const { nickname, setAgreementAccepted } = useSignUpStore();
  const [allAgreed, setAllAgreed] = useState(false);
  const [serviceAgreed, setServiceAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  const handleAllAgree = () => {
    const newAllAgreed = !allAgreed;
    setAllAgreed(newAllAgreed);
    setServiceAgreed(newAllAgreed);
    setPrivacyAgreed(newAllAgreed);
    setMarketingAgreed(newAllAgreed);
    setAgreementAccepted(newAllAgreed);
  };

  const handleServiceAgree = () => {
    const newServiceAgreed = !serviceAgreed;
    setServiceAgreed(newServiceAgreed);
    setAgreementAccepted(newServiceAgreed && privacyAgreed);
    
    // 모든 필수 항목이 체크되면 전체 동의도 체크
    if (newServiceAgreed && privacyAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  const handlePrivacyAgree = () => {
    const newPrivacyAgreed = !privacyAgreed;
    setPrivacyAgreed(newPrivacyAgreed);
    setAgreementAccepted(serviceAgreed && newPrivacyAgreed);
    
    // 모든 필수 항목이 체크되면 전체 동의도 체크
    if (serviceAgreed && newPrivacyAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  const handleMarketingAgree = () => {
    const newMarketingAgreed = !marketingAgreed;
    setMarketingAgreed(newMarketingAgreed);
  };

  const openTerms = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
      <Text className="text-3xl font-bold text-center mb-6 mt-10">
        {nickname}님,{'\n'}이용약관에{'\n'}동의해주세요
      </Text>
      
      <Text className="text-center text-gray-500 mb-8">
        서비스 이용을 위해 약관 동의가 필요해요
      </Text>

      <View className="space-y-4">
        {/* 전체 동의 */}
        <TouchableOpacity
          onPress={handleAllAgree}
          className="flex-row items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
        >
          <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
            allAgreed ? 'bg-green-500 border-green-500' : 'border-gray-300'
          }`}>
            {allAgreed && <Text className="text-white text-sm font-bold">✓</Text>}
          </View>
          <Text className="text-lg font-semibold text-gray-800">전체 동의</Text>
        </TouchableOpacity>

        {/* 서비스 이용약관 (필수) */}
        <TouchableOpacity
          onPress={handleServiceAgree}
          className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <View className="flex-row items-center flex-1">
            <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
              serviceAgreed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}>
              {serviceAgreed && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <Text className="text-base text-gray-700">서비스 이용약관</Text>
            <Text className="text-red-500 text-sm ml-1">(필수)</Text>
          </View>
          <TouchableOpacity onPress={() => openTerms('https://example.com/terms')}>
            <Text className="text-blue-500 text-sm">보기</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 개인정보 처리방침 (필수) */}
        <TouchableOpacity
          onPress={handlePrivacyAgree}
          className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <View className="flex-row items-center flex-1">
            <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
              privacyAgreed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}>
              {privacyAgreed && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <Text className="text-base text-gray-700">개인정보 처리방침</Text>
            <Text className="text-red-500 text-sm ml-1">(필수)</Text>
          </View>
          <TouchableOpacity onPress={() => openTerms('https://example.com/privacy')}>
            <Text className="text-blue-500 text-sm">보기</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 마케팅 정보 수신 동의 (선택) */}
        <TouchableOpacity
          onPress={handleMarketingAgree}
          className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <View className="flex-row items-center flex-1">
            <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
              marketingAgreed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}>
              {marketingAgreed && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <Text className="text-base text-gray-700">마케팅 정보 수신 동의</Text>
            <Text className="text-gray-500 text-sm ml-1">(선택)</Text>
          </View>
          <TouchableOpacity onPress={() => openTerms('https://example.com/marketing')}>
            <Text className="text-blue-500 text-sm">보기</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View className="mt-6 p-4 bg-blue-50 rounded-lg">
        <Text className="text-sm text-blue-800 text-center">
          💡 마케팅 정보 수신 동의 시 맞춤형 건강 정보와 서비스 혜택을 받아보실 수 있어요
        </Text>
      </View>
    </ScrollView>
  );
};

export default AgreementStep;
