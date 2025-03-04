import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';

interface TestGridItemProps {
  title: string;
  image: ImageSourcePropType;
  questions: number;
  duration: number;
  onPress: () => void;
}

const TestGridItem: React.FC<TestGridItemProps> = ({
  title,
  image,
  questions,
  duration,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.info}>
          {questions} Questions · {duration}-{duration + 10} min
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
// Adjust to make items smaller and fit more on screen
const itemWidth = (width - 50) / 2; // 50 = padding (20) * 2 + gap between items (10)

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12, // Reduced margin
  },
  imageContainer: {
    width: '100%',
    height: itemWidth * 0.8, // Reduced height ratio
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 8, // Reduced padding
  },
  title: {
    fontSize: 14, // Smaller font
    fontWeight: '600',
    marginBottom: 2, // Reduced margin
    color: '#333',
  },
  info: {
    fontSize: 10, // Smaller font
    color: '#8E8E93',
  },
});

export default TestGridItem; 