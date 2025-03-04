import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import FeaturedCard from '../../components/FeaturedCard';
import TestGridItem from '../../components/TestGridItem';

// Import data
import { TESTS } from '../../data/quizData';
import { getCompletedTestsCount } from '../../utils/storage';

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string };
};

type TestsScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TestsOverview'>;

const TestsScreen = () => {
  const navigation = useNavigation<TestsScreenNavigationProp>();
  const [completedTests, setCompletedTests] = useState(0);
  
  // Find the Emotional Intelligence test (id: '1')
  const featuredTest = TESTS.find(test => test.id === '1');
  
  // Get the other tests
  const gridTests = TESTS.filter(test => test.id !== '1');

  // Load completed tests count
  useEffect(() => {
    const loadCompletedTests = async () => {
      const count = await getCompletedTestsCount();
      setCompletedTests(count);
    };
    
    loadCompletedTests();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Tests completed</Text>
            <View style={styles.progressBarContainer}>
              <Text style={styles.progressCount}>{completedTests}/{TESTS.length}</Text>
              <ProgressBar 
                progress={TESTS.length > 0 ? completedTests / TESTS.length : 0} 
                total={TESTS.length} 
                completed={completedTests} 
                showNumbers={false}
                style={{ flex: 1 }}
              />
            </View>
          </View>
          
          {/* Featured Test Card */}
          {featuredTest && (
            <FeaturedCard
              title={`Learn about your\nemotional intelligence`}
              image={featuredTest.image}
              questions={featuredTest.questions}
              duration={featuredTest.duration}
              onPress={() => navigation.navigate('TakeTest', { testId: featuredTest.id })}
            />
          )}
          
          {/* All Tests Section */}
          <Text style={styles.sectionTitle}>All tests</Text>
          
          {/* Grid of Tests */}
          <View style={styles.gridContainer}>
            {gridTests.map(test => (
              <TestGridItem
                key={test.id}
                title={test.title}
                image={test.image}
                questions={test.questions}
                duration={test.duration}
                onPress={() => navigation.navigate('TakeTest', { testId: test.id })}
              />
            ))}
          </View>
        </ScrollView>
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

export default TestsScreen; 