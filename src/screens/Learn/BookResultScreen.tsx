import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';

// Import book data directly from top_5_books.json
import booksData from '../../data/top_5_books.json';

// Logo SVG
const logoSvg = `<svg width="116" height="20" viewBox="0 0 116 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_1_2899" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="116" height="20">
<path d="M9.6 0.791504C14.88 0.791504 19.2 5.1115 19.2 10.3915V19.9915H17.568V10.3915C17.568 5.9995 13.992 2.4235 9.6 2.4235C5.184 2.4235 1.608 5.9995 1.608 10.3915V19.9915H0V10.3915C0 5.1115 4.296 0.791504 9.6 0.791504Z" fill="black"/>
<path d="M24 10.3915C24 5.1115 28.296 0.791504 33.6 0.791504H43.2V2.4235H33.6C29.448 2.4235 26.04 5.5675 25.632 9.5995H43.2V11.2075H25.632C26.04 15.2395 29.448 18.3835 33.6 18.3835H43.2V19.9915H33.6C28.296 19.9915 24 15.6955 24 10.3915Z" fill="black"/>
<path d="M65.568 10.3915V0.791504H67.2V10.3915C67.2 15.6955 62.88 19.9915 57.6 19.9915C52.296 19.9915 48 15.6955 48 10.3915V0.791504H49.608V10.3915C49.608 14.8075 53.184 18.3835 57.6 18.3835C61.992 18.3835 65.568 14.8075 65.568 10.3915Z" fill="black"/>
<path d="M91.2 5.9995C91.2 7.8475 90.216 9.4795 88.752 10.3915C90.216 11.3275 91.2 12.9355 91.2 14.8075V19.9915H89.568V14.8075C89.568 12.8155 87.96 11.2075 85.992 11.2075H73.608V19.9915H72V0.791504H85.992C88.848 0.791504 91.2 3.1435 91.2 5.9995ZM73.608 2.4235V9.5995H85.992C87.96 9.5995 89.568 7.9915 89.568 5.9995C89.568 4.0315 87.96 2.4235 85.992 2.4235H73.608Z" fill="black"/>
<path d="M105.6 0.791504C110.88 0.791504 115.2 5.1115 115.2 10.3915C115.2 15.6955 110.88 19.9915 105.6 19.9915C100.296 19.9915 96 15.6955 96 10.3915C96 5.1115 100.296 0.791504 105.6 0.791504ZM105.6 18.3835C109.992 18.3835 113.568 14.8075 113.568 10.3915C113.568 5.9995 109.992 2.4235 105.6 2.4235C101.184 2.4235 97.608 5.9995 97.608 10.3915C97.608 14.8075 101.184 18.3835 105.6 18.3835ZM106.8 10.3915C106.8 11.0635 106.248 11.6155 105.6 11.6155C104.928 11.6155 104.376 11.0635 104.376 10.3915C104.376 9.7435 104.928 9.1915 105.6 9.1915C106.248 9.1915 106.8 9.7435 106.8 10.3915Z" fill="black"/>
</mask>
<g mask="url(#mask0_1_2899)">
<rect x="-1.39844" y="-2.00928" width="96" height="25" fill="black"/>
<rect x="94.6016" y="-2.00928" width="26" height="29" fill="#2596FF"/>
</g>
</svg>`;

// Process books data
const allBooks = booksData.map((book, index) => ({
  id: (index + 1).toString(),
  ...book
}));

// Shelf SVG
const shelfSvg = `<svg width="134" height="20" viewBox="0 0 134 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.371094 11.1781H133.371V17.321C133.371 18.4255 132.476 19.321 131.371 19.321H2.37109C1.26652 19.321 0.371094 18.4255 0.371094 17.321V11.1781Z" fill="white"/>
<path d="M9.41757 1.57943C10.1734 0.777342 11.2266 0.322632 12.3287 0.322632H121.413C122.515 0.322632 123.569 0.777341 124.325 1.57943L133.371 11.1798H0.371094L9.41757 1.57943Z" fill="#EFEFF1"/>
</svg>`;

type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

type BookResultScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'BookResult'>;
type BookResultScreenRouteProp = RouteProp<LearnStackParamList, 'BookResult'>;

const BookResultScreen = () => {
  const navigation = useNavigation<BookResultScreenNavigationProp>();
  const route = useRoute<BookResultScreenRouteProp>();
  const { bookId } = route.params;
  
  // Find the book
  const book = allBooks.find(b => b.id === bookId);
  
  // Reading stats (simulated)
  const keyPoints = 13;
  const readingTime = 21;
  
  const handleBack = () => {
    navigation.navigate('BooksOverview');
  };
  
  const handleShare = () => {
    // Share functionality would go here
    console.log('Share pressed');
  };
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Book not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <SvgXml xml={logoSvg} width={116} height={20} />
        </View>
        
        {/* Book Result Card */}
        <View style={styles.resultCard}>
          {/* Book Cover with Shelf */}
          <View style={styles.bookCoverContainer}>
            <Image 
              source={{ uri: book.image_url }}
              style={styles.bookCover}
              resizeMode="contain"
            />
            <View style={styles.shelfContainer}>
              <SvgXml xml={shelfSvg} width={134} height={20} />
            </View>
          </View>
          
          {/* Congratulation Text */}
          <Text style={styles.congratsText}>Excellent work! 🎉</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>📋</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{keyPoints} <Text style={styles.statHighlight}>+2</Text></Text>
                <Text style={styles.statLabel}>Key points</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>⏱️</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{readingTime} <Text style={styles.statHighlight}>+11</Text></Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>HOW WAS THIS SUMMARY</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={styles.starIcon}>★</Text>
            ))}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={handleBack}>
            <Text style={styles.homeButtonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 45,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  bookCoverContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    marginTop: -40, // This will make the book "float" above the card
  },
  bookCover: {
    width: 150,
    height: 200,
    borderRadius: 20,
    marginBottom: -10,
  },
  shelfContainer: {
    position: 'absolute',
    bottom: -25,
    zIndex: -1,
  },
  congratsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    marginTop: -8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  statIconContainer: {
    marginRight: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  statHighlight: {
    color: '#0099CC',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  ratingSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  ratingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    fontSize: 24,
    color: '#F5A623',
    marginHorizontal: 3,
  },
  actionsContainer: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 24,
  },
  shareButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  homeButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default BookResultScreen; 