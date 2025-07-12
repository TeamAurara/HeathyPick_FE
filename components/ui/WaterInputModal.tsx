import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface WaterInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  currentAmount?: number;
}

export const WaterInputModal: React.FC<WaterInputModalProps> = ({
  isVisible,
  onClose,
  onSave,
  currentAmount = 0,
}) => {
  const [waterAmount, setWaterAmount] = useState(currentAmount.toString());
  
  const handleSave = () => {
    const amount = parseFloat(waterAmount);
    if (!isNaN(amount) && amount >= 0) {
      onSave(amount);
      onClose();
    }
  };
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 rounded-xl p-5 shadow-lg">
            <Text className="text-xl font-bold text-center mb-6">물 섭취량 입력</Text>
            
            <View className="flex-row items-center justify-center mb-6">
              <TextInput
                className="text-3xl font-semibold text-center border-b-2 border-green-500 w-24 px-2 py-1"
                keyboardType="decimal-pad"
                value={waterAmount}
                onChangeText={setWaterAmount}
                autoFocus={true}
                selectTextOnFocus={true}
              />
              <Text className="text-2xl ml-2">L</Text>
            </View>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="flex-1 py-3 bg-gray-200 rounded-lg mr-2"
                onPress={onClose}
              >
                <Text className="text-center font-medium">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 bg-green-500 rounded-lg ml-2"
                onPress={handleSave}
              >
                <Text className="text-center font-medium text-white">저장</Text>
              </TouchableOpacity>
            </View>
            
            {/* 빠른 선택 버튼 */}
            <View className="flex-row justify-between mt-4">
              {[0.2, 0.5, 1.0, 1.5, 2.0].map((amount) => (
                <TouchableOpacity 
                  key={amount}
                  className="py-2 px-3 bg-green-100 rounded-full"
                  onPress={() => setWaterAmount(amount.toString())}
                >
                  <Text className="text-green-700">{amount}L</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default WaterInputModal; 