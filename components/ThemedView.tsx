import { useColorScheme } from '@/hooks/useColorScheme';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  className?: string;
  lightClassName?: string;
  darkClassName?: string;
};

export function ThemedView({ 
  style, 
  className = '', 
  lightClassName = '', 
  darkClassName = '', 
  ...otherProps 
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const themeClass = colorScheme === 'dark' ? darkClassName : lightClassName;
  
  return (
    <View 
      className={`bg-white dark:bg-gray-900 ${className} ${themeClass}`} 
      style={style} 
      {...otherProps} 
    />
  );
}
