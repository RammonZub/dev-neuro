import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';
import ProgressBar from '../../components/ProgressBar';

// Import book data directly from top_5_books.json
import booksData from '../../data/top_5_books.json';

// Shelf SVG
const shelfSvg = `<svg width="134" height="20" viewBox="0 0 134 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.371094 11.1781H133.371V17.321C133.371 18.4255 132.476 19.321 131.371 19.321H2.37109C1.26652 19.321 0.371094 18.4255 0.371094 17.321V11.1781Z" fill="white"/>
<path d="M9.41757 1.57943C10.1734 0.777342 11.2266 0.322632 12.3287 0.322632H121.413C122.515 0.322632 123.569 0.777341 124.325 1.57943L133.371 11.1798H0.371094L9.41757 1.57943Z" fill="#EFEFF1"/>
</svg>`;

// Update the Book type to match the structure in top_5_books.json
type Book = typeof booksData[0] & {
  id: string;
  readingTime: string;
};

type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

type BooksScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'BooksOverview'>;

const BooksScreen = () => {
  const navigation = useNavigation<BooksScreenNavigationProp>();
  const [completedBooks, setCompletedBooks] = useState<string[]>(['1']);
  
  // Process books data to include id and extract chapter count
  const allBooks = booksData.map((book, index) => ({
    ...book,
    id: index.toString(),
    // Generate a reading time based on chapters
    readingTime: `${Math.floor(Math.random() * 10) + 5} min`
  }));

  // Featured book is the first book
  const featuredBook = allBooks[0];
  
  // Rest of the books
  const gridBooks = allBooks.slice(1);

  // Calculate progress
  const progress = completedBooks.length / allBooks.length;
  
  const handleBookPress = (bookId: string) => {
    navigation.navigate('ReadBook', { bookId });
  };
  
  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => handleBookPress(item.id)}
    >
      <Image 
        source={{ uri: item.image_url }}
        style={styles.bookCover}
        resizeMode="cover"
      />
      <Text style={styles.bookItemTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookItemDetails}>
        {item.chapters?.length || 0} Chapters · {item.readingTime}
      </Text>
    </TouchableOpacity>
  );

  if (!allBooks.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No books available</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ListHeaderComponent={() => (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.progressText}>Books Completed</Text>
                <View style={styles.progressBarContainer}>
                  <Text style={styles.progressCount}>{completedBooks.length}/{allBooks.length}</Text>
                  <ProgressBar 
                    progress={progress} 
                    total={allBooks.length}
                    completed={completedBooks.length}
                    showNumbers={false}
                    height={8}
                    backgroundColor="#E5E5E5"
                    fillColor="#0099CC"
                  />
                </View>
              </View>
              
              {/* Featured Book Card */}
              <View style={styles.featuredCardContainer}>
                <View style={styles.featuredCard}>
                  <View style={styles.featuredContent}>
                    <View style={styles.bookCoverContainer}>
                      <Image 
                        source={{ uri: featuredBook.image_url }}
                        style={styles.featuredCover}
                        resizeMode="contain"
                      />
                      <View style={styles.shelfContainer}>
                        <SvgXml xml={shelfSvg} width={130} height={20} />
                      </View>
                    </View>
                    <View style={styles.featuredDetails}>
                      <Text style={styles.featuredTitle}>{featuredBook.title}</Text>
                      <Text style={styles.featuredAuthor}>By {featuredBook.author}</Text>
                      <View style={styles.tagsContainer}>
                        {featuredBook.genres.slice(0, 3).map((tag, index) => (
                          <Text key={index} style={styles.tag}>{tag}</Text>
                        ))}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.startReadingButton}
                    onPress={() => handleBookPress(featuredBook.id)}
                  >
                    <Text style={styles.startReadingText}>Start Reading →</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.allBooksTitle}>All Books</Text>
            </>
          )}
          data={gridBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.bookRow}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 25,
  },
  header: {
    marginBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
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
  featuredCardContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuredCard: {
    backgroundColor: '#0099CC',
    borderRadius: 12,
    padding: 20,
  },
  featuredContent: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    position: 'relative',
  },
  bookCoverContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  shelfContainer: {
    position: 'absolute',
    bottom: -22,
    left: -18,
    zIndex: -1,
  },
  featuredCover: {
    width: 90,
    height: 130,
    borderRadius: 10,
    marginRight: 16,
    marginBottom: -10,
  },
  
  featuredDetails: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'left',
  },
  featuredAuthor: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 12,
    textAlign: 'left',
  },
  tagsContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  tag: {
    color: 'white',
    fontSize: 14,
    marginBottom: 2,
    opacity: 0.9,
    fontWeight: '500',
  },
  startReadingButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  startReadingText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  allBooksContainer: {
    flex: 1,
    paddingTop: 8,
  },
  allBooksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    paddingHorizontal: 4,
  },
  bookRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  bookItem: {
    width: '50%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bookCover: {
    width: 150,
    height: 190,
    borderRadius: 10,
    marginBottom: 8,
  },
  bookItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookItemDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default BooksScreen; 