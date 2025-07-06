import React from 'react';
import { View } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <View className="w-full flex-row justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        
        return (
          <View 
            key={stepNumber}
            className={`h-1.5 flex-1 mx-0.5 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
            style={index === 0 ? { marginLeft: 0 } : index === totalSteps - 1 ? { marginRight: 0 } : {}}
          />
        );
      })}
    </View>
  );
};

export default StepIndicator; 