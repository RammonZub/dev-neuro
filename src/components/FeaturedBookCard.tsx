import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface FeaturedBookCardProps {
  title: string;
  author: string;
  image: ImageSourcePropType;
  tags: string[];
  onPress: () => void;
}

// Shelf SVG component
const ShelfSvg = () => (
  <Svg width="134" height="20" viewBox="0 0 134 20" fill="none">
    <Path d="M0.371094 11.1781H133.371V17.321C133.371 18.4255 132.476 19.321 131.371 19.321H2.37109C1.26652 19.321 0.371094 18.4255 0.371094 17.321V11.1781Z" fill="white"/>
    <Path d="M9.41757 1.57943C10.1734 0.777342 11.2266 0.322632 12.3287 0.322632H121.413C122.515 0.322632 123.569 0.777341 124.325 1.57943L133.371 11.1798H0.371094L9.41757 1.57943Z" fill="#EFEFF1"/>
  </Svg>
);

const FeaturedBookCard: React.FC<FeaturedBookCardProps> = ({
  title,
  author,
  image,
  tags,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <View style={styles.bookCoverContainer}>
          <View style={styles.shelfContainer}>
            <ShelfSvg />
          </View>
          <Image source={image} style={styles.bookCover} resizeMode="contain" />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>By {author}</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Start Reading <Text style={styles.arrow}>→</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#0099CC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookCoverContainer: {
    width: 100,
    height: 150,
    marginRight: 16,
    position: 'relative',
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
  shelfContainer: {
    position: 'absolute',
    bottom: -10,
    left: -17,
    width: 134,
    height: 20,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'column', // Vertical alignment
  },
  tag: {
    fontSize: 12,
    color: '#0099CC',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10, // Thinner button
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: 'black', // Black text
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  arrow: {
    fontWeight: 'bold',
  },
});

export default FeaturedBookCard; 