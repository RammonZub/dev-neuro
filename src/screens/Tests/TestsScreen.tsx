import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import FeaturedCard from '../../components/FeaturedCard';
import TestGridItem from '../../components/TestGridItem';

// Import mock data
import { TESTS } from '../../data/mockData';

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string };
};

type TestsScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TestsOverview'>;

const TestsScreen = () => {
  const navigation = useNavigation<TestsScreenNavigationProp>();
  
  // Find the Emotional Intelligence test (id: '1')
  const featuredTest = TESTS.find(test => test.id === '1');
  
  // Get the other tests
  const gridTests = TESTS.filter(test => test.id !== '1');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Tests completed</Text>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressCount}>1/5</Text>
            <ProgressBar 
              progress={0.2} 
              total={5} 
              completed={1} 
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

export default TestsScreen; 