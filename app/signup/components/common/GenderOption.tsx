import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface GenderOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const GenderOption = ({ label, selected, onSelect }: GenderOptionProps) => {
  return (
    <TouchableOpacity 
      onPress={onSelect}
      className={`flex-1 py-12 items-center justify-center  rounded-md ${
        selected ? 'border-2 border-green-500 bg-white' : 'bg-gray-100'
      }`}
    >
      <Text className={`text-lg ${selected ? 'text-green-500 font-bold' : 'text-gray-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default GenderOption; 