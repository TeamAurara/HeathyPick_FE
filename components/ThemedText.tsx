import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  className?: string;
  lightClassName?: string;
  darkClassName?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  className = '',
  lightClassName = '',
  darkClassName = '',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const themeClass = colorScheme === 'dark' ? darkClassName : lightClassName;
  
  // NativeWind 클래스를 타입별로 매핑
  const typeClasses = {
    default: 'text-base leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-3xl font-bold leading-8',
    subtitle: 'text-xl font-bold',
    link: 'leading-[30px] text-base text-blue-600 dark:text-blue-400',
  };
  
  return (
    <Text
      className={`text-black dark:text-white ${typeClasses[type]} ${className} ${themeClass}`}
      style={style}
      {...rest}
    />
  );
}
