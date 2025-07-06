import React from 'react';
import { View } from 'react-native';
import LogoSvg from '../../assets/images/Logo.svg';

interface AppLogoProps {
  width?: number;
  height?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ width = 150, height = 140 }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <LogoSvg width={width} height={height} />
    </View>
  );
};

export default AppLogo;
