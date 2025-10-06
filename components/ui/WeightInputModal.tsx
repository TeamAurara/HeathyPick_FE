import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface WeightInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (weight: number) => void;
  currentWeight?: number;
}

export const WeightInputModal: React.FC<WeightInputModalProps> = ({
  isVisible,
  onClose,
  onSave,
  currentWeight = 0,
}) => {
  const [weight, setWeight] = useState(currentWeight.toString());
  
  const handleSave = () => {
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      onSave(weightValue);
      onClose();
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-lg">
            <View className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            <Text className="text-xl font-bold text-center mb-6">체중 기록</Text>
            
            <View className="flex-row items-center justify-center mb-6">
              <TextInput
                className="text-3xl font-semibold text-center border-b-2 border-green-500 w-24 px-2 py-1"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                autoFocus={true}
                selectTextOnFocus={true}
              />
              <Text className="text-2xl ml-2">kg</Text>
            </View>
            
            <View className="flex-row justify-between mb-8">
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

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default WeightInputModal;
