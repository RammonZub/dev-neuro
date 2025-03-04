import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import FeaturedBookCard from '../../components/FeaturedBookCard';
import BookGridItem from '../../components/BookGridItem';

// Import mock data
import { BOOKS } from '../../data/mockData';

type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

type LearnScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'BooksOverview'>;

const LearnScreen = () => {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  
  // Find the featured book (first book)
  const featuredBook = BOOKS[0];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Books Completed</Text>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressCount}>1/5</Text>
            <ProgressBar 
              progress={0.2} 
              total={BOOKS.length} 
              completed={1} 
              showNumbers={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
        
        {/* Featured Book Card */}
        <FeaturedBookCard
          title={featuredBook.title}
          author={featuredBook.author}
          image={featuredBook.image}
          tags={featuredBook.tags || []}
          onPress={() => navigation.navigate('ReadBook', { bookId: featuredBook.id })}
        />
        
        {/* All Books Section */}
        <Text style={styles.sectionTitle}>All Books</Text>
        
        {/* Grid of Books */}
        <View style={styles.gridContainer}>
          {BOOKS.map(book => (
            <BookGridItem
              key={book.id}
              title={book.title}
              chapters={book.chapters}
              duration={book.duration}
              image={book.image}
              onPress={() => navigation.navigate('ReadBook', { bookId: book.id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0099CC',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 1,
  },
});

export default LearnScreen; 