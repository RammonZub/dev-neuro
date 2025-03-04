import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/Button';

// Mock data for test questions
const TEST_QUESTIONS = [
  {
    id: '1',
    question: 'You are invited to a cultural event. What do you do?',
    options: [
      { id: 'a', text: 'Go and enjoy it' },
      { id: 'b', text: 'Go if friends are going' },
      { id: 'c', text: 'Think about it' },
      { id: 'd', text: 'Go if friends are going' },
    ],
  },
  {
    id: '2',
    question: 'How do you handle unexpected changes to your plans?',
    options: [
      { id: 'a', text: 'Adapt quickly and move on' },
      { id: 'b', text: 'Feel frustrated but adjust' },
      { id: 'c', text: 'Struggle to adapt' },
      { id: 'd', text: 'Depends on the situation' },
    ],
  },
  // Add more questions as needed
];

type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string, answers: Record<string, string> };
};

type TakeTestScreenNavigationProp = StackNavigationProp<TestsStackParamList, 'TakeTest'>;
type TakeTestScreenRouteProp = RouteProp<TestsStackParamList, 'TakeTest'>;

const TakeTestScreen = () => {
  const navigation = useNavigation<TakeTestScreenNavigationProp>();
  const route = useRoute<TakeTestScreenRouteProp>();
  const { testId } = route.params;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const currentQuestion = TEST_QUESTIONS[currentQuestionIndex];
  const totalQuestions = TEST_QUESTIONS.length;
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleNext = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOption
      }));
      
      // Move to next question or finish
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Navigate to results
        navigation.navigate('TestResult', { 
          testId, 
          answers: {
            ...answers,
            [currentQuestion.id]: selectedOption
          }
        });
      }
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous answer if available
      const prevQuestionId = TEST_QUESTIONS[currentQuestionIndex - 1].id;
      setSelectedOption(answers[prevQuestionId] || null);
    } else {
      navigation.goBack();
    }
  };
  
  const handleClose = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </Text>
        
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Text 
                style={[
                  styles.optionText,
                  selectedOption === option.id && styles.selectedOptionText
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title={currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
          onPress={handleNext}
          disabled={!selectedOption}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0099CC',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: '#0099CC',
    backgroundColor: '#E6F7FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#0099CC',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextButton: {
    width: '100%',
  },
});

export default TakeTestScreen; 