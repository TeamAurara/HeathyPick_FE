import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BodyInfoInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  unit: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const BodyInfoInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  keyboardType = 'numeric',
}: BodyInfoInputProps) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View className="mb-6">
      <Text className="text-green-600 mb-2">{label}</Text>
      <View className="flex-row items-center">
        <View className="flex-1 relative">
          <TextInput
            className="flex-1 border-b border-gray-300 py-3 pr-8"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
          {value.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              className="absolute right-0 top-3"
            >
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <Text className="ml-2 text-gray-500">{unit}</Text>
      </View>
    </View>
  );
};

export default BodyInfoInput; 