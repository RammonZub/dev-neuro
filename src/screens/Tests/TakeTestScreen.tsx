import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/Button';
import { TEST_QUESTIONS } from '../../data/quizData';

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string; answers: Record<string, number> };
};

type TakeTestScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TakeTest'>;
type TakeTestScreenRouteProp = RouteProp<TestsStackParamList, 'TakeTest'>;

const TakeTestScreen = () => {
  const navigation = useNavigation<TakeTestScreenNavigationProp>();
  const route = useRoute<TakeTestScreenRouteProp>();
  const { testId } = route.params;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [error, setError] = useState<string | null>(null);
  
  const questions = TEST_QUESTIONS[testId] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Check if we have questions for this test
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setError(`No questions found for test ID: ${testId}`);
    }
  }, [testId, questions]);

  // Function to clean option text by removing value/score information
  const cleanOptionText = (text: string): string => {
    return text.replace(/\s*\(\d+\)$/, '')
              .replace(/\s*,.*\(\d+\)$/, '');
  };
  
  const handleOptionSelect = (value: number) => {
    if (!currentQuestion) return;
    
    setSelectedOption(value);
    
    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);
    
    // Animate fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Move to next question or finish
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        // Animate fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        // Navigate to results
        navigation.navigate('TestResult', { 
          testId,
          answers: newAnswers
        });
      }
    });
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous answer if available
      const prevQuestionId = questions[currentQuestionIndex - 1]?.id;
      if (prevQuestionId) {
        setSelectedOption(answers[prevQuestionId] || null);
      }
    } else {
      navigation.goBack();
    }
  };
  
  const handleClose = () => {
    navigation.goBack();
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
            onPress={() => navigation.navigate('TestsOverview')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>Question not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.navigate('TestsOverview')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <ImageBackground 
      source={require('../../assets/images/background_quiz.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.progress}>
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          style={[
            styles.contentContainer,
            { opacity: fadeAnim }
          ]}
        >
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>
          
          {/* Options Container - Centered */}
          <View style={styles.optionsOuterContainer}>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option.value && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option.value && styles.selectedOptionText,
                  ]}>
                    {cleanOptionText(option.text)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    lineHeight: 32,
    textAlign: 'center',
  },
  optionsOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minHeight: 60, // Fixed height for all options
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#0099CC',
    borderColor: '#0099CC',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
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

export default TakeTestScreen; 