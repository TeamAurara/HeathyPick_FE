import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface InputWithClearButtonProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const InputWithClearButton = ({
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType = 'default',
}: InputWithClearButtonProps) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View className="relative w-full">
      <TextInput
        className="w-full border-b border-gray-300 py-2 pr-8"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="absolute right-0 top-2"
        >
          <Ionicons name="close-circle" size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputWithClearButton; 