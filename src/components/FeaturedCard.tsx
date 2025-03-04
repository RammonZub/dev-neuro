import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';

interface FeaturedCardProps {
  title: string;
  image: ImageSourcePropType;
  questions: number;
  duration: number;
  onPress: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  image,
  questions,
  duration,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {questions} Questions · {duration}-{duration + 10} min
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Let's try</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 270,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 55,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  infoText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 16,
    width: '100%',
  },
  buttonText: {
    color: '#0099CC',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FeaturedCard; 