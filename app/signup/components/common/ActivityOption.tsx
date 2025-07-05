import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ActivityOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const ActivityOption = ({ label, selected, onSelect }: ActivityOptionProps) => {
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

export default ActivityOption; 