import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';

interface BookGridItemProps {
  title: string;
  chapters: number;
  duration: number;
  image: ImageSourcePropType;
  onPress: () => void;
}

const BookGridItem: React.FC<BookGridItemProps> = ({
  title,
  chapters,
  duration,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.cover} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.info}>
          {chapters} Chapters · {duration}-{duration + 10} min
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 50) / 2; // 50 = padding (16) * 2 + gap between items (18)

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    marginBottom: 16,
    alignItems: 'center',
  },
  cover: {
    width: itemWidth,
    height: itemWidth * 1.5,
    marginBottom: 8,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  info: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default BookGridItem; 