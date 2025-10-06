import React from 'react';
import { Text, View } from 'react-native';

interface StatsSummaryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
}

export default function StatsSummaryCard({ 
  title, 
  value, 
  unit = '', 
  change, 
  icon 
}: StatsSummaryCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 flex-1 mx-2 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-gray-600">{title}</Text>
        {icon}
      </View>
      
      <View className="flex-row items-baseline">
        <Text className="text-2xl font-bold text-gray-800">
          {value}
        </Text>
        {unit && (
          <Text className="text-sm text-gray-600 ml-1">
            {unit}
          </Text>
        )}
      </View>
      
      {change !== undefined && (
        <View className="flex-row items-center mt-1">
          <Text 
            className={`text-xs font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </Text>
          <Text className="text-xs text-gray-500 ml-1">전주 대비</Text>
        </View>
      )}
    </View>
  );
}
