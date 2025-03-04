import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/Button';
import { TEST_QUESTIONS } from '../../data/quizData';
import { Question } from '../../types';
import Speedometer from '../../components/Speedometer';

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

  const handleOptionSelect = (value: number) => {
    if (!currentQuestion) return;
    
    setSelectedOption(value);
    
    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);
    
    // Short delay before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Navigate to results with all answers
        navigation.navigate('TestResult', { 
          testId,
          answers: newAnswers
        });
      }
    }, 300);
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
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={handleBack} 
              style={styles.iconButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.progress}>Question {currentQuestionIndex + 1}/{totalQuestions}</Text>
            
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.iconButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion?.text || ''}</Text>
          </View>
          
          {/* Options Container */}
          <View style={styles.optionsOuterContainer}>
            <View style={styles.optionsContainer}>
              {currentQuestion?.options.map((option, index) => (
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
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  progress: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
    paddingBottom: 32,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minHeight: 56,
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: '#0099CC',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#0099CC',
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