import { Ionicons } from '@expo/vector-icons';
import WheelPicker from '@quidone/react-native-wheel-picker';
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

// 운동 선호도 옵션 컴포넌트
const ActivityOption = ({ 
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
      className={`w-full py-4 mb-3 items-center justify-center rounded-md ${
        selected ? 'border-2 border-green-500 bg-white' : 'bg-gray-100'
      }`}
    >
      <Text className={`text-base ${selected ? 'text-green-500 font-bold' : 'text-gray-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// 신체 정보 입력 필드 컴포넌트
const BodyInfoInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  keyboardType = 'numeric',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  unit: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}) => {
  return (
    <View className="mb-8">
      <Text className="text-green-600 mb-2">{label}</Text>
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 border-b border-gray-300 py-2"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
        <Text className="ml-2 text-gray-500">{unit}</Text>
      </View>
    </View>
  );
};

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // 총 단계 수
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  
  // 신체 정보
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
  // 나이 옵션 생성 (10-99세)
  const ageData = Array.from({ length: 90 }, (_, i) => ({
    value: i + 10,
    label: `${i + 10}세`
  }));

  // 운동 선호도 옵션
  const activityOptions = [
    '격한 운동을 많이 해요',
    '약한 운동을 많이 해요',
    '잘 움직여요',
    '몸을 거의 움직이지 않아요'
  ];

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
        // 나이 선택 화면
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              어라라님의{'\n'}나이는
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              맞춤형 건강 관리를 위해 필요해요!
            </Text>
            <View className="items-center border-t border-b border-gray-200 py-4">
              <WheelPicker
                data={ageData}
                value={age}
                onValueChanged={({item}) => setAge(item.value)}
                itemHeight={40}
                visibleItemCount={5}
                style={{ width: 150, height: 180 }}
                itemTextStyle={{ fontSize: 24, fontWeight: 'bold' }}
                overlayItemStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 8
                }}
              />
            </View>
          </View>
        );
      case 4:
        // 운동 선호도 선택 화면
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              어라라님은{'\n'}평소에...
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
      case 5:
        // 신체 정보 입력 화면 (키, 몸무게, 목표 몸무게)
        return (
          <View className="w-full">
            <Text className="text-3xl font-bold text-center mb-6">
              어라라님의{'\n'}키를 알려주세요
            </Text>
            <Text className="text-center text-gray-500 mb-8">
              이제 거의 다 왔어요!
            </Text>
            
            <BodyInfoInput
              label="키"
              value={height}
              onChangeText={setHeight}
              placeholder="지금 몇 cm 인가요?"
              unit="cm"
            />
            
            {height.trim() !== '' && (
              <>
                <BodyInfoInput
                  label="몸무게"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="지금 몇 kg 인가요?"
                  unit="kg"
                />
                
                {weight.trim() !== '' && (
                  <BodyInfoInput
                    label="목표 몸무게"
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    placeholder="목표 몸무게는 몇 kg인가요?"
                    unit="kg"
                  />
                )}
              </>
            )}
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
