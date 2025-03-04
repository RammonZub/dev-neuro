import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface GaugeProps {
  value: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  label?: string;
  labelSize?: number;
  lowColor?: string;
  mediumColor?: string;
  highColor?: string;
  style?: object;
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  size = 150,
  strokeWidth = 10,
  label,
  labelSize = 24,
  lowColor = '#4CD964',
  mediumColor = '#FFCC00',
  highColor = '#FF3B30',
  style
}) => {
  // Ensure value is between 0 and 1
  const clampedValue = Math.min(Math.max(value, 0), 1);
  
  // Calculate the color based on the value
  const getColor = () => {
    if (clampedValue < 0.33) return lowColor;
    if (clampedValue < 0.66) return mediumColor;
    return highColor;
  };
  
  // Get the label text based on the value
  const getLabelText = () => {
    if (label) return label;
    if (clampedValue < 0.33) return 'Low';
    if (clampedValue < 0.66) return 'Moderate';
    return 'High';
  };
  
  // Calculate the coordinates for the gauge
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate the angle for the gauge (180 degrees = π radians)
  const startAngle = Math.PI;
  const endAngle = 0;
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (angleRange * clampedValue);
  
  // Calculate the coordinates for the gauge needle
  const needleX = center + radius * Math.cos(currentAngle);
  const needleY = center + radius * Math.sin(currentAngle);
  
  // Create the path for the gauge background (semi-circle)
  const createArc = (start: number, end: number) => {
    const largeArcFlag = end - start <= Math.PI ? 0 : 1;
    
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };
  
  const backgroundArc = createArc(startAngle, endAngle);
  
  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size / 2 + strokeWidth / 2} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        {/* Background gradient sections */}
        <Path
          d={createArc(startAngle, startAngle + angleRange / 3)}
          stroke={lowColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Path
          d={createArc(startAngle + angleRange / 3, startAngle + 2 * angleRange / 3)}
          stroke={mediumColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Path
          d={createArc(startAngle + 2 * angleRange / 3, endAngle)}
          stroke={highColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Needle */}
        <Path
          d={`M ${center} ${center} L ${needleX} ${needleY}`}
          stroke="#333333"
          strokeWidth={2}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={strokeWidth / 2}
          fill="#333333"
        />
      </Svg>
      
      <Text style={[styles.label, { color: getColor(), fontSize: labelSize }]}>
        {getLabelText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
  },
});

export default Gauge; 