import React from 'react';  
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    // Start with base container style
    const containerStyle: ViewStyle[] = [styles.container];
    
    // Add variant styles
    if (variant === 'primary') {
      containerStyle.push(styles.primaryContainer);
    } else if (variant === 'secondary') {
      containerStyle.push(styles.secondaryContainer);
    } else if (variant === 'outline') {
      containerStyle.push(styles.outlineContainer);
    }
    
    // Add size styles
    if (size === 'small') {
      containerStyle.push(styles.smallContainer);
    } else if (size === 'large') {
      containerStyle.push(styles.largeContainer);
    }
    
    // Add disabled style
    if (disabled) {
      containerStyle.push(styles.disabledContainer);
    }
    
    // Add custom style
    if (style) {
      containerStyle.push(style);
    }
    
    return containerStyle;
  };
  
  const getTextStyle = (): TextStyle[] => {
    // Start with base text style
    const textStyleArray: TextStyle[] = [styles.text];
    
    // Add variant text styles
    if (variant === 'primary') {
      textStyleArray.push(styles.primaryText);
    } else if (variant === 'secondary') {
      textStyleArray.push(styles.secondaryText);
    } else if (variant === 'outline') {
      textStyleArray.push(styles.outlineText);
    }
    
    // Add size text styles
    if (size === 'small') {
      textStyleArray.push(styles.smallText);
    } else if (size === 'large') {
      textStyleArray.push(styles.largeText);
    }
    
    // Add disabled text style
    if (disabled) {
      textStyleArray.push(styles.disabledText);
    }
    
    // Add custom text style
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
      
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#0099CC' : 'white'} 
          size="small" 
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryContainer: {
    backgroundColor: '#0099CC',
  },
  secondaryContainer: {
    backgroundColor: '#F2F2F7',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0099CC',
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledContainer: {
    backgroundColor: '#E5E5EA',
    borderColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#333333',
  },
  outlineText: {
    color: '#0099CC',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#8E8E93',
  },
});

export default Button; 