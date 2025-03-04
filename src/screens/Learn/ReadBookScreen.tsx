import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/Button';
import booksData from '../../data/top_5_books.json';

// Define types for navigation
type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

type ReadBookScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'ReadBook'>;
type ReadBookScreenRouteProp = RouteProp<LearnStackParamList, 'ReadBook'>;

const ReadBookScreen = () => {
  const navigation = useNavigation<ReadBookScreenNavigationProp>();
  const route = useRoute<ReadBookScreenRouteProp>();
  const { bookId } = route.params;

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Find the book from the JSON data
  const book = booksData.find((book, index) => index.toString() === bookId);

  // If book not found, show error
  useEffect(() => {
    if (!book) {
      setError(`Book with ID ${bookId} not found`);
    } else if (!book.chapters || book.chapters.length === 0) {
      setError(`No chapters found for book: ${book.title}`);
    }
  }, [bookId, book]);

  // Get current chapter and split content into pages
  const currentChapter = book?.chapters?.[currentChapterIndex];
  const chapterContent = currentChapter?.summary?.split('\n\n') || [];
  const totalChapters = book?.chapters?.length || 0;

  const handleNextPage = () => {
    if (currentPageIndex < chapterContent.length - 1) {
      // Move to next page in current chapter
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentChapterIndex < totalChapters - 1) {
      // Move to next chapter
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPageIndex(0);
    } else {
      // Finished the book
      navigation.navigate('BookResult', { bookId });
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      // Move to previous page in current chapter
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      // Move to previous chapter, last page
      const prevChapter = book?.chapters?.[currentChapterIndex - 1];
      const prevChapterContent = prevChapter?.summary?.split('\n\n') || [];
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(prevChapterContent.length - 1);
    }
  };

  const handleClose = () => {
    navigation.navigate('BooksOverview');
  };

  // If there's an error, show error screen
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.navigate('BooksOverview')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!book || !currentChapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((currentChapterIndex * chapterContent.length + currentPageIndex + 1) / 
                    (totalChapters * chapterContent.length)) * 100;

  // Get chapter title safely
  const chapterTitle = 'title' in currentChapter 
    ? currentChapter.title 
    : `Chapter ${currentChapter.chapter_number || (currentChapterIndex + 1)}`;

  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <View style={styles.spacer} />
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Chapter Title */}
          <View style={styles.chapterTitleContainer}>
            <Text style={styles.chapterTitle}>
              {chapterTitle}
            </Text>
          </View>

          {/* Chapter Content */}
          <ScrollView style={styles.contentScrollView}>
            <Text style={styles.contentText}>
              {chapterContent[currentPageIndex]}
            </Text>
          </ScrollView>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentChapterIndex + 1}/{totalChapters} - Page {currentPageIndex + 1}/{chapterContent.length}
            </Text>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[
                styles.navButton, 
                currentChapterIndex === 0 && currentPageIndex === 0 && styles.disabledButton
              ]}
              onPress={handlePreviousPage}
              disabled={currentChapterIndex === 0 && currentPageIndex === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleNextPage}
            >
              <Text style={styles.navButtonText}>
                {currentChapterIndex === totalChapters - 1 && 
                 currentPageIndex === chapterContent.length - 1 
                  ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  spacer: {
    width: 36, // Match the width of the close button for centering
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterTitleContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 12,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  contentScrollView: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099CC',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    width: '80%',
  },
});

export default ReadBookScreen; 