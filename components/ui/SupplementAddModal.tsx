import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface SupplementAddModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string, timeToTake: string) => void;
}

export const SupplementAddModal: React.FC<SupplementAddModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [supplementName, setSupplementName] = useState('');
  const [timeToTake, setTimeToTake] = useState('');
  const [errors, setErrors] = useState({ name: '', time: '' });

  const validateInputs = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', time: '' };

    if (!supplementName.trim()) {
      newErrors.name = '영양제 이름을 입력해주세요';
      isValid = false;
    }

    if (!timeToTake.trim()) {
      newErrors.time = '복용 시간을 입력해주세요';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave(supplementName, timeToTake);
      resetForm();
    }
  };

  const resetForm = () => {
    setSupplementName('');
    setTimeToTake('');
    setErrors({ name: '', time: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 미리 정의된 복용 시간 옵션
  const timeOptions = [
    '아침 식사 전', '아침 식사 후', 
    '점심 식사 전', '점심 식사 후', 
    '저녁 식사 전', '저녁 식사 후', 
    '취침 전'
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-lg">
            <View className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            <Text className="text-xl font-bold text-center mb-6">영양제 추가</Text>
            
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">영양제 이름</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                placeholder="예: 종합 비타민"
                value={supplementName}
                onChangeText={setSupplementName}
              />
              {errors.name ? <Text className="text-red-500 text-xs mt-1">{errors.name}</Text> : null}
            </View>
            
            <View className="mb-6">
              <Text className="text-sm font-medium mb-1">복용 시간</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                placeholder="예: 아침 식사 후"
                value={timeToTake}
                onChangeText={setTimeToTake}
              />
              {errors.time ? <Text className="text-red-500 text-xs mt-1">{errors.time}</Text> : null}
            </View>
            
            <View className="flex-row flex-wrap mb-6">
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`m-1 py-1 px-3 rounded-full ${
                    timeToTake === option ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  onPress={() => setTimeToTake(option)}
                >
                  <Text className={timeToTake === option ? 'text-white' : 'text-gray-700'}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity 
                className="flex-1 py-3 bg-gray-200 rounded-lg mr-2"
                onPress={handleClose}
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

export default SupplementAddModal;
