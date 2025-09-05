import { IconSymbol } from '@/components/ui/IconSymbol';
import { NotificationMockup } from '@/components/ui/NotificationMockup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 네비게이션 헤더 숨기기
export const options = {
  headerShown: false,
};

export default function SupplementTimeSettingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedTime, setSelectedTime] = useState('05:30');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [supplementName, setSupplementName] = useState(params.name as string || '영양제');
  const [showNotificationMockup, setShowNotificationMockup] = useState(false);
  const [toggleAnim] = useState(new Animated.Value(0));
  const [inputMode, setInputMode] = useState<'grid' | 'input'>('grid');
  const [timeInput, setTimeInput] = useState('05:30');
  const [inputError, setInputError] = useState('');

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (isNotificationEnabled) {
      // 알림 목업 표시
      setShowNotificationMockup(true);
    } else {
      // 알림이 비활성화된 경우
      Alert.alert(
        '설정 완료',
        `${supplementName}의 복용 시간이 ${selectedTime}으로 설정되었습니다.`,
        [
          {
            text: '확인',
            onPress: () => router.back()
          }
        ]
      );
    }
  };

  const handleNotificationClose = () => {
    setShowNotificationMockup(false);
    router.back();
  };

  const handleToggleNotification = () => {
    const newValue = !isNotificationEnabled;
    setIsNotificationEnabled(newValue);
    
    // 토글 애니메이션
    Animated.timing(toggleAnim, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const validateTimeInput = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const handleTimeInputChange = (text: string) => {
    setTimeInput(text);
    setInputError('');
    
    if (validateTimeInput(text)) {
      setSelectedTime(text);
    }
  };

  const handleTimeInputBlur = () => {
    if (timeInput && !validateTimeInput(timeInput)) {
      setInputError('올바른 시간 형식을 입력해주세요 (HH:MM)');
      setTimeInput(selectedTime);
    } else if (timeInput) {
      setSelectedTime(timeInput);
    }
  };

  const toggleInputMode = () => {
    setInputMode(inputMode === 'grid' ? 'input' : 'grid');
    if (inputMode === 'input') {
      setTimeInput(selectedTime);
    }
  };

  // 시간 옵션 생성
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <View className="flex-1 bg-white">
      {/* 상단 헤더 */}
      <View className="pt-14 px-5 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-1">
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold">
            복용 시간 설정
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {/* 영양제 정보 */}
        <View className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <View className="flex-row items-center mb-2">
            <IconSymbol name="pills" size={20} color="green" />
            <Text className="text-lg font-semibold text-green-700 ml-2">
              {supplementName}
            </Text>
          </View>
          <Text className="text-sm text-green-600">
            매일 복용할 시간을 설정해주세요
          </Text>
        </View>

        {/* 시간 선택 섹션 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">복용 시간 선택</Text>
            <TouchableOpacity
              onPress={toggleInputMode}
              className="px-3 py-1 bg-blue-100 rounded-full"
            >
              <Text className="text-blue-600 text-sm font-medium">
                {inputMode === 'grid' ? '직접 입력' : '그리드 선택'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 현재 선택된 시간 */}
          <View className="mb-4 p-6 bg-gray-100 rounded-lg">
            <Text className="text-center text-3xl font-bold text-green-600 mb-1">
              {selectedTime}
            </Text>
            <Text className="text-center text-sm text-gray-500">
              선택된 복용 시간
            </Text>
          </View>

          {/* 시간 입력 또는 그리드 선택 */}
          {inputMode === 'input' ? (
            <View className="mb-4">
              <TextInput
                value={timeInput}
                onChangeText={handleTimeInputChange}
                onBlur={handleTimeInputBlur}
                placeholder="HH:MM"
                className="w-full p-4 border border-gray-300 rounded-lg text-center text-lg font-medium"
                keyboardType="numeric"
                maxLength={5}
              />
              {inputError ? (
                <Text className="text-red-500 text-sm mt-2 text-center">
                  {inputError}
                </Text>
              ) : null}
            </View>
          ) : (
            <View className="max-h-64">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between">
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setSelectedTime(time)}
                      className={`w-[30%] p-4 m-1 rounded-lg ${
                        selectedTime === time
                          ? 'bg-green-500'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`text-center font-medium ${
                          selectedTime === time ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* 알림 설정 섹션 */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-4">알림 설정</Text>
          
          <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <IconSymbol name="bell" size={20} color="green" />
                <View className="ml-3">
                  <Text className="text-base font-medium">복용 알림 받기</Text>
                  <Text className="text-sm text-gray-500">
                    설정한 시간에 알림을 받습니다
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleToggleNotification}
                className={`w-12 h-6 rounded-full ${
                  isNotificationEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <Animated.View
                  className="w-5 h-5 bg-white rounded-full"
                  style={{
                    transform: [{
                      translateX: toggleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 24]
                      })
                    }]
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 알림 미리보기 */}
        {isNotificationEnabled && (
          <View className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <View className="flex-row items-center mb-2">
              <IconSymbol name="bell.badge" size={20} color="blue" />
              <Text className="text-base font-semibold text-blue-700 ml-2">
                알림 미리보기
              </Text>
            </View>
            <View className="bg-white p-3 rounded-lg border border-blue-100">
              <Text className="text-sm text-gray-600">
                📱 "{supplementName} 복용 시간입니다!"
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                매일 {selectedTime}에 알림이 전송됩니다
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 하단 저장 버튼 */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 py-4 rounded-lg flex-row justify-center items-center"
        >
          <IconSymbol name="checkmark" size={20} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            알림 설정 완료
          </Text>
        </TouchableOpacity>
      </View>

      {/* 알림 목업 */}
      <NotificationMockup
        isVisible={showNotificationMockup}
        supplementName={supplementName}
        scheduledTime={selectedTime}
        onClose={handleNotificationClose}
      />
    </View>
  );
}
