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
          {questions} Questions · {duration}-{duration + 5} min
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
// Adjust to make items slightly bigger
const itemWidth = (width - 40) / 2; // 40 = padding (16) * 2 + gap between items (8)

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 5, // Increased margin
  },
  imageContainer: {
    width: '100%',
    height: 150, // Increased height ratio
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: 140, // Increased width
    height: 160, // Increased height
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  content: {
    padding: 10, // Increased padding
  },
  title: {
    fontSize: 12, // Increased font size
    fontWeight: '600',
    marginBottom: 4, // Increased margin
    color: '#333',
    textAlign: 'center',
  },
  info: {
    fontSize: 10, // Increased font size
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default TestGridItem; 