import React, { useEffect, useState } from 'react';
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native';

interface NotificationMockupProps {
  isVisible: boolean;
  supplementName: string;
  scheduledTime: string;
  onClose: () => void;
}

export const NotificationMockup: React.FC<NotificationMockupProps> = ({
  isVisible,
  supplementName,
  scheduledTime,
  onClose,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isVisible) {
      // 2초 후에 알림 표시
      const timer = setTimeout(() => {
        setShowNotification(true);
        // 페이드 인 애니메이션
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
      fadeAnim.setValue(0);
    }
  }, [isVisible, fadeAnim]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* 알림 시뮬레이션 */}
        {showNotification && (
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="absolute top-12 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xl">💊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  복용 알림
                </Text>
                <Text className="text-sm text-gray-600">
                  {supplementName} 복용 시간입니다!
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {scheduledTime}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotification(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Text className="text-gray-400 text-lg">×</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* 메인 컨텐츠 */}
        <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">🔔</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              알림 설정 완료!
            </Text>
            <Text className="text-gray-600 text-center">
              {supplementName}의 복용 알림이 설정되었습니다.
            </Text>
          </View>

          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              알림 정보
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">영양제:</Text>
              <Text className="font-medium">{supplementName}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">시간:</Text>
              <Text className="font-medium">{scheduledTime}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">반복:</Text>
              <Text className="font-medium">매일</Text>
            </View>
          </View>

          <View className="bg-green-50 rounded-lg p-4 mb-6">
            <Text className="text-sm text-green-700 text-center">
              📱 설정한 시간에 푸시 알림이 전송됩니다
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationMockup;
