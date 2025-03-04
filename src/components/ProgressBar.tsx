import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  total: number;
  completed: number;
  label?: string;
  showNumbers?: boolean;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  style?: object;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  completed,
  label,
  showNumbers = true,
  height = 8,
  backgroundColor = '#F2F2F7',
  fillColor = '#0099CC',
  style
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.progressContainer, { height, backgroundColor }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${clampedProgress * 100}%`,
              backgroundColor: fillColor 
            }
          ]} 
        />
      </View>
      
      {showNumbers && (
        <View style={styles.numbersContainer}>
          <Text style={styles.completedText}>{completed}</Text>
          <Text style={styles.totalText}>{total}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  progressContainer: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  numbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0099CC',
  },
  totalText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default ProgressBar; 