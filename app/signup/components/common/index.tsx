import React from 'react';
import { View } from 'react-native';

export { default as ActivityOption } from './ActivityOption';
export { default as BodyInfoInput } from './BodyInfoInput';
export { default as GenderOption } from './GenderOption';
export { default as InputWithClearButton } from './InputWithClearButton';
export { default as StepIndicator } from './StepIndicator';

// 기본 내보내기를 위한 빈 컴포넌트
const CommonComponents: React.FC = () => {
  return <View />;
};

export default CommonComponents; 