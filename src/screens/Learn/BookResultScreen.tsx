import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/Button';

type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

type BookResultScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'BookResult'>;
type BookResultScreenRouteProp = RouteProp<LearnStackParamList, 'BookResult'>;

// Mock book data
const getBookData = (bookId: string) => {
  return {
    id: bookId,
    title: 'Mindshift',
    author: 'Erwin Raphael McManus',
    image: require('../../assets/images/mindshift_cover.png'),
    keyPoints: 13,
    readingTime: 21,
  };
};

const BookResultScreen = () => {
  const navigation = useNavigation<BookResultScreenNavigationProp>();
  const route = useRoute<BookResultScreenRouteProp>();
  const { bookId } = route.params;
  
  const bookData = getBookData(bookId);
  const [rating, setRating] = useState(4);
  
  const handleShare = () => {
    // Implement share functionality
    console.log('Share book results');
  };
  
  const handleReturnHome = () => {
    navigation.navigate('BooksOverview');
  };
  
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>NEURO</Text>
        
        <View style={styles.bookContainer}>
          <Image 
            source={bookData.image} 
            style={styles.bookCover} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.congratsText}>Excellent work! ⭐</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookData.keyPoints}</Text>
            <Text style={styles.statLabel}>Key points</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookData.readingTime}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>HOW WAS THIS SUMMARY</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <Text style={[
                  styles.starIcon,
                  star <= rating ? styles.filledStar : styles.emptyStar
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Share"
            onPress={handleShare}
            variant="outline"
            style={styles.shareButton}
            icon={<Text style={styles.shareIcon}>↗</Text>}
          />
          
          <Button
            title="Return Home"
            onPress={handleReturnHome}
            style={styles.homeButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  bookContainer: {
    width: 120,
    height: 180,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookCover: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0099CC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: 28,
  },
  filledStar: {
    color: '#FFCC00',
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  shareButton: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    marginRight: 8,
    fontSize: 16,
    color: '#0099CC',
  },
  homeButton: {
    marginBottom: 8,
  },
});

export default BookResultScreen; 