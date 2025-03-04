import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Mock data for book chapters
const BOOK_CHAPTERS = [
  {
    id: '1',
    title: 'Intelligence is not fixed but can be developed through consistent practice and the right methods',
    content: [
      'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
      'Recent research has shown that intelligence is far more malleable than previously thought. The brain\'s plasticity allows for continuous growth and adaptation throughout our lives.',
      'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
      'Recent research has shown that intelligence is far more malleable than previously thought. The brain\'s plasticity allows for continuous growth and adaptation throughout our lives.',
      'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
    ],
  },
  {
    id: '2',
    title: 'The role of neuroplasticity in cognitive development',
    content: [
      'Neuroplasticity refers to the brain\'s ability to reorganize itself by forming new neural connections. This ability continues throughout life but is especially pronounced during development.',
      'Learning new skills creates new neural pathways. The more these pathways are used, the stronger they become, leading to improved performance and retention.',
      'Various factors influence neuroplasticity, including age, environment, lifestyle, and genetics. However, even adults can significantly enhance their cognitive abilities through targeted practice.',
    ],
  },
  // Add more chapters as needed
];

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
  const totalChapters = BOOK_CHAPTERS.length;
  const currentChapter = BOOK_CHAPTERS[currentChapterIndex];
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };
  
  const handleNext = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    } else {
      // Navigate to book result when finished
      navigation.navigate('BookResult', { bookId });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.chapterTitle}>Chapter {String(currentChapterIndex + 1).padStart(2, '0')}</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{currentChapter.title}</Text>
        
        {currentChapter.content.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            onPress={handlePrevious}
            disabled={currentChapterIndex === 0}
            style={[
              styles.paginationButton,
              currentChapterIndex === 0 && styles.disabledButton
            ]}
          >
            <Text style={styles.paginationButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>
            {String(currentChapterIndex + 1).padStart(2, '0')}/{String(totalChapters).padStart(2, '0')}
          </Text>
          
          <TouchableOpacity 
            onPress={handleNext}
            style={styles.paginationButton}
          >
            <Text style={styles.paginationButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0099CC',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066CC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    lineHeight: 32,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  spacer: {
    height: 40,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 18,
    color: '#0099CC',
  },
  paginationText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default ReadBookScreen; 