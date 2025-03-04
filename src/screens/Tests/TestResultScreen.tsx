import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Share, Animated, Easing, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';

import Button from '../../components/Button';
import { calculateTestScore } from '../../data/quizData';
import { saveTestResult } from '../../utils/storage';
import { TESTS, TEST_QUESTIONS } from '../../data/quizData';
import { TestResult as TestResultType } from '../../types';

// Import SVG strings
import { logoSvg, speedometerSvg, speedometerHandSvg } from '../../assets/svgs';

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string; answers: Record<string, number> };
};

type TestResultScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TestResult'>;
type TestResultScreenRouteProp = RouteProp<TestsStackParamList, 'TestResult'>;

const TestResultScreen = () => {
  const navigation = useNavigation<TestResultScreenNavigationProp>();
  const route = useRoute<TestResultScreenRouteProp>();
  const { testId, answers } = route.params;
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [error, setError] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState(false);
  
  // Get test info
  const test = TESTS.find(t => t.id === testId);
  
  // Validate that we have questions for this test
  useEffect(() => {
    const questions = TEST_QUESTIONS[testId];
    if (!questions || questions.length === 0) {
      setError(`No questions found for test ID: ${testId}`);
    }
  }, [testId]);

  // Calculate the test results
  const getResults = () => {
    try {
      // Validate answers against available questions
      const questions = TEST_QUESTIONS[testId];
      if (!questions || questions.length === 0) {
        throw new Error(`No questions found for test ID: ${testId}`);
      }
      
      // Filter out answers for questions that don't exist
      const validAnswers: Record<string, number> = {};
      Object.keys(answers).forEach(questionId => {
        if (questions.some(q => q.id === questionId)) {
          validAnswers[questionId] = answers[questionId];
        }
      });
      
      if (Object.keys(validAnswers).length === 0) {
        throw new Error("No valid answers found");
      }
      
      return calculateTestScore(testId, validAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error calculating score");
      return {
        score: 0,
        interpretation: "Error calculating score",
        recommendation: "Please try taking the test again"
      };
    }
  };
  
  const { score, interpretation, recommendation } = getResults();
  
  // Calculate normalized score (0-1) for the gauge
  const maxPossibleScore = Object.keys(answers).length * 4; // Assuming max score per question is 4
  const normalizedScore = maxPossibleScore > 0 ? score / maxPossibleScore : 0;
  
  // Determine level based on normalized score
  const getLevel = (score: number): string => {
    if (score < 0.3) return 'Low';
    if (score < 0.7) return 'Moderate';
    return 'High';
  };
  
  // Create result object with breakdown for ADHD test
  const result: TestResultType = {
    overall: normalizedScore,
    breakdown: [
      { name: 'Inattention', score: 0.2, level: 'Low' },
      { name: 'Hyperactivity', score: 0.5, level: 'Moderate' },
      { name: 'Impulsivity', score: 0.2, level: 'Low' },
    ],
    interpretation,
    recommendation
  };
  
  // Save result to local storage
  useEffect(() => {
    const saveResult = async () => {
      if (error || savedResult) return;
      
      try {
        // Wrap in a try-catch to prevent unhandled promise rejection
        await saveTestResult(testId, result);
        setSavedResult(true);
        console.log('Test result saved successfully');
      } catch (err) {
        console.error('Failed to save test result:', err);
        // Don't set error state here to avoid disrupting the UI
      }
    };
    
    // Use setTimeout to ensure this runs after component is fully mounted
    const timer = setTimeout(() => {
      saveResult();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [testId, result, error, savedResult]);
  
  // Animate the speedometer hand
  useEffect(() => {
    // Calculate rotation angle based on score (0 to 180 degrees)
    const rotationDegree = normalizedScore * 180;
    
    Animated.timing(rotateAnimation, {
      toValue: rotationDegree,
      duration: 1500,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  }, [normalizedScore, rotateAnimation]);
  
  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['-90deg', '90deg'],
  });
  
  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const handleShare = async () => {
    try {
      const testName = test?.title || 'Test';
      await Share.share({
        message: `I just completed the ${testName} on Neuro App! My result: ${interpretation}`,
        title: `My ${testName} Results`,
      });
    } catch (error) {
      console.error('Error sharing result:', error);
    }
  };

  const handleRetakeTest = () => {
    navigation.replace('TakeTest', { testId });
  };

  const handleFinish = () => {
    navigation.navigate('TestsOverview');
  };

  // If there's an error, show error screen
  if (error) {
    return (
      <ImageBackground 
        source={require('../../assets/images/background_quiz.png')}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button
              title="Go Back"
              onPress={() => navigation.navigate('TestsOverview')}
              style={styles.errorButton}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const resultLevel = getLevel(normalizedScore);

  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleFinish} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <SvgXml xml={logoSvg} width={80} height={20} />
            <View style={styles.placeholder} />
          </View>
          
          <Text style={styles.title}>{test?.title || 'Test'}</Text>
          
          {/* Gauge */}
          <View style={styles.gaugeContainer}>
            <View style={styles.speedometerContainer}>
              <SvgXml xml={speedometerSvg} width={190} height={148} />
              <Animated.View style={[styles.handContainer, animatedStyle]}>
                <SvgXml xml={speedometerHandSvg} width={81} height={94} />
              </Animated.View>
              
              {/* Labels */}
              <View style={styles.gaugeLabels}>
                <Text style={styles.lowLabel}>Low</Text>
                <Text style={styles.highLabel}>High</Text>
              </View>
            </View>
            
            <Text style={[
              styles.resultLevelText,
              resultLevel === 'Low' ? styles.lowLevelText : 
              resultLevel === 'Moderate' ? styles.moderateLevelText : 
              styles.highLevelText
            ]}>
              {resultLevel}
            </Text>
          </View>
          
          {/* Results Card */}
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Results Breakdown</Text>
            
            {result.breakdown.map((item, index) => (
              <View key={index} style={[
                styles.breakdownItem,
                index < result.breakdown.length - 1 && styles.breakdownItemBorder
              ]}>
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
          
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>
                <Text style={styles.shareIcon}>↗</Text> Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.homeButton} onPress={handleFinish}>
              <Text style={styles.homeButtonText}>Return Home</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0099CC',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  speedometerContainer: {
    position: 'relative',
    width: 190,
    height: 148,
    alignItems: 'center',
  },
  handContainer: {
    position: 'absolute',
    bottom: 0,
    left: 93, // Centered
    width: 4, // Thinner hand
    height: 80, // Shorter hand
    transformOrigin: 'bottom center',
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
  },
  lowLabel: {
    color: '#00D087',
    fontWeight: '600',
  },
  highLabel: {
    color: '#FF284C',
    fontWeight: '600',
  },
  resultLevelText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 16,
  },
  lowLevelText: {
    color: '#00D087',
  },
  moderateLevelText: {
    color: '#FFCC00',
  },
  highLevelText: {
    color: '#FF284C',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  breakdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  breakdownName: {
    fontSize: 16,
    color: '#666',
  },
  breakdownScore: {
    fontSize: 16,
    fontWeight: '500',
  },
  lowScore: {
    color: '#0099CC',
  },
  moderateScore: {
    color: '#FFCC00',
  },
  highScore: {
    color: '#FF284C',
  },
  actionsContainer: {
    marginTop: 8,
  },
  shareButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shareButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  shareIcon: {
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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

export default TestResultScreen; 