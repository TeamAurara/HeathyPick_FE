import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface FoodBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const FoodBottomSheet: React.FC<FoodBottomSheetProps> = ({ isVisible, onClose, onAdd }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  
  useEffect(() => {
    if (isVisible) {
      // 바텀 시트가 보여질 때 아래에서 위로 슬라이드
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 바텀 시트가 사라질 때 위에서 아래로 슬라이드
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  // 슬라이드 애니메이션 계산
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  // 추가 버튼 핸들러
  const handleAdd = () => {
    onAdd({ name: '음식이름', calories: 300 });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          className="bg-gray-200 rounded-t-3xl"
          style={{ transform: [{ translateY }] }}
        >
          {/* 닫기 버튼 */}
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10" 
            onPress={onClose}
          >
            <Text className="text-2xl font-bold">✕</Text>
          </TouchableOpacity>
          
          {/* 제목 */}
          <View className="pt-6 pb-4 px-5">
            <Text className="text-2xl font-bold text-center">음식이름 (필수)</Text>
          </View>
          
          {/* 음식 이름 입력 */}
          <View className="px-5 pb-4">
            <TextInput
              className="bg-gray-50 rounded-lg p-4 w-full"
              placeholder="음식 이름을 입력하세요"
            />
          </View>
          
          {/* 영양정보 섹션 */}
          <View className="px-5 pb-4">
            <Text className="text-xl font-bold mb-4">영양정보(선택)</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-base mb-1 text-gray-600">칼로리</Text>
                <TextInput
                  className="bg-gray-50 rounded-lg p-3"
                  placeholder="0"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-base mb-1 text-gray-600">탄수화물</Text>
                <TextInput
                  className="bg-gray-50 rounded-lg p-3"
                  placeholder="0"
                />
              </View>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-base mb-1 text-gray-600">단백질</Text>
                <TextInput
                  className="bg-gray-50 rounded-lg p-3"
                  placeholder="0"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-base mb-1 text-gray-600">지방</Text>
                <TextInput
                  className="bg-gray-50 rounded-lg p-3"
                  placeholder="0"
                />
              </View>
            </View>
          </View>
          
          {/* 추가하기 버튼 */}
          <View className="px-5 pb-8">
            <TouchableOpacity 
              className="bg-purple-500 py-4 rounded-lg"
              onPress={handleAdd}
            >
              <Text className="text-white text-center text-lg font-bold">추가하기</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FoodBottomSheet; 