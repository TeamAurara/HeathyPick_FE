import React from 'react';
import { View } from 'react-native';

export { default as ActivityStep } from './ActivityStep';
export { default as AgeStep } from './AgeStep';
export { default as AgreementStep } from './AgreementStep';
export { default as BodyInfoStep } from './BodyInfoStep';
export { default as CKDStep } from './CKDStep';
export { default as GenderStep } from './GenderStep';
export { default as NicknameStep } from './NicknameStep';
export { default as SuccessStep } from './SuccessStep';

// 기본 내보내기를 위한 빈 컴포넌트
const StepComponents: React.FC = () => {
  return <View />;
};

export default StepComponents; 