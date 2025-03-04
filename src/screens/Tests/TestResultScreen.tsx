import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Gauge from '../../components/Gauge';
import Button from '../../components/Button';

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string, answers: Record<string, string> };
};

type TestResultScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TestResult'>;
type TestResultScreenRouteProp = RouteProp<TestsStackParamList, 'TestResult'>;

// Mock test result data
const getTestResults = (testId: string, answers: Record<string, string>) => {
  // In a real app, this would calculate results based on the answers
  return {
    overall: 0.2, // Low score (0-1 scale)
    breakdown: [
      { name: 'Inattention', score: 0.2, level: 'Low' },
      { name: 'Hyperactivity', score: 0.5, level: 'Moderate' },
      { name: 'Impulsivity', score: 0.2, level: 'Low' },
    ]
  };
};

const TestResultScreen = () => {
  const navigation = useNavigation<TestResultScreenNavigationProp>();
  const route = useRoute<TestResultScreenRouteProp>();
  const { testId, answers } = route.params;
  
  const results = getTestResults(testId, answers);
  
  const handleShare = () => {
    // Implement share functionality
    console.log('Share results');
  };
  
  const handleReturnHome = () => {
    navigation.navigate('TestsOverview');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>NEURO</Text>
          <Text style={styles.title}>Autism Screening</Text>
        </View>
        
        <View style={styles.gaugeContainer}>
          <Gauge 
            value={results.overall} 
            size={200}
            strokeWidth={15}
          />
        </View>
        
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Results Breakdown</Text>
          
          {results.breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownName}>{item.name}</Text>
              <Text 
                style={[
                  styles.breakdownScore,
                  item.level === 'Low' ? styles.lowScore : 
                  item.level === 'Moderate' ? styles.moderateScore : 
                  styles.highScore
                ]}
              >
                {item.level}
              </Text>
            </View>
          ))}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  breakdownName: {
    fontSize: 16,
    color: '#333',
  },
  breakdownScore: {
    fontSize: 16,
    fontWeight: '500',
  },
  lowScore: {
    color: '#4CD964',
  },
  moderateScore: {
    color: '#FFCC00',
  },
  highScore: {
    color: '#FF3B30',
  },
  actionsContainer: {
    marginTop: 8,
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

export default TestResultScreen; 