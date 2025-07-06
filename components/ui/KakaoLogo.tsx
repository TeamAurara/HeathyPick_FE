import React from 'react';
import { View } from 'react-native';
import KakaoLogoSvg from '../../assets/images/kakaoLogo.svg';

interface KakaoLogoProps {
  width?: number;
  height?: number;
}

const KakaoLogo: React.FC<KakaoLogoProps> = ({ width = 24, height = 24 }) => {
  return (
    <View>
      <KakaoLogoSvg width={width} height={height} />
    </View>
  );
};

export default KakaoLogo;
