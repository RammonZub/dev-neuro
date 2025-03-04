import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Share, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';

import Button from '../../components/Button';
import { calculateTestScore } from '../../data/quizData';
import { saveTestResult } from '../../utils/storage';
import { TESTS, TEST_QUESTIONS } from '../../data/quizData';
import { TestResult as TestResultType } from '../../types';
import SpeedometerSvg from '../../components/SpeedometerSvg';

// Import SVG strings
import { logoSvg } from '../../assets/svgs';

// Define speedometer SVG strings with unique IDs
const speedometerGreenSvg = `<svg width="190" height="148" viewBox="0 0 190 148" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M186.265 117.004C186.265 92.3035 176.453 68.6148 158.987 51.149C141.522 33.6833 117.833 23.8711 93.1327 23.8711C68.4324 23.8711 44.7437 33.6833 27.2779 51.149C9.81217 68.6148 3.72965e-06 92.3035 0 117.004L93.1327 117.004H186.265Z" fill="url(#green_paint0_linear)"/>
<path d="M87.8104 117.668L1.33008 117.003L49.2269 42.4971L87.8104 117.668Z" fill="url(#green_paint1_linear)" fill-opacity="0.34"/>
<path d="M91.8017 115.008L185.6 117.004L135.042 44.4932L91.8017 115.008Z" fill="url(#green_paint2_linear)" fill-opacity="0.34"/>
<path d="M89.1414 119.665L47.2322 39.1715L137.038 41.1669L89.1414 119.665Z" fill="url(#green_paint3_linear)" fill-opacity="0.34"/>
<path d="M0.000206506 117.004C0.000208666 92.3037 9.81238 68.615 27.2782 51.1493C44.7439 33.6835 68.4326 23.8713 93.1329 23.8713C117.833 23.8713 141.522 33.6835 158.988 51.1493C176.453 68.615 186.266 92.3037 186.266 117.004L169.245 117.004C169.245 96.8178 161.226 77.4584 146.952 63.1846C132.679 48.9108 113.319 40.8918 93.1329 40.8918C72.9467 40.8918 53.5873 48.9108 39.3135 63.1846C25.0397 77.4584 17.0207 96.8178 17.0207 117.004L0.000206506 117.004Z" fill="#FF284C"/>
<path d="M0.000206506 117.004C0.000207933 100.678 4.29171 84.6394 12.4445 70.4951C20.5973 56.3508 32.325 44.5981 46.4518 36.4151C60.5787 28.2321 76.6084 23.9064 92.9341 23.8715C109.26 23.8367 125.308 28.0939 139.47 36.2165L131.001 50.9809C119.428 44.3427 106.313 40.8635 92.9704 40.892C79.6284 40.9205 66.5282 44.4557 54.983 51.1432C43.4379 57.8306 33.8536 67.4355 27.1908 78.9948C20.5279 90.5542 17.0207 103.662 17.0207 117.004L0.000206506 117.004Z" fill="#FFC72C"/>
<path d="M0.000206506 117.004C0.000207918 100.85 4.20187 84.9741 12.1925 70.935C20.1832 56.8959 31.688 45.1766 45.5772 36.9281L54.2683 51.5624C42.9174 58.3035 33.5151 67.881 26.9848 79.3544C20.4545 90.8277 17.0207 103.802 17.0207 117.004L0.000206506 117.004Z" fill="#00FFA6"/>
<path d="M97.425 105.873L35.3259 59.0633C32.5152 56.9447 28.5386 57.3931 26.2703 60.0845C23.9119 62.8828 24.2685 67.0633 27.0669 69.4217L86.5304 119.537C90.2218 122.648 95.7363 122.178 98.8473 118.486C102.079 114.652 101.429 108.891 97.425 105.873Z" fill="url(#green_paint4_linear)"/>
<circle cx="92.1125" cy="112.728" r="8.64804" transform="rotate(-51.5787 92.1125 112.728)" fill="url(#green_paint5_radial)"/>
<defs>
<linearGradient id="green_paint0_linear" x1="93.1327" y1="23.8711" x2="93.1327" y2="103.699" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="green_paint1_linear" x1="29.2699" y1="76.424" x2="83.1538" y2="112.347" gradientUnits="userSpaceOnUse">
<stop stop-color="#03BF69"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="green_paint2_linear" x1="153.003" y1="79.0853" x2="99.1193" y2="115.008" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF284C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="green_paint3_linear" x1="96.2555" y1="43.7434" x2="92.0876" y2="108.37" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC72C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="green_paint4_linear" x1="24.8065" y1="62.6178" x2="85.6711" y2="113.914" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<radialGradient id="green_paint5_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(92.1125 112.728) rotate(90) scale(8.64804)">
<stop stop-color="#D9D9D9"/>
<stop offset="1" stop-color="white"/>
</radialGradient>
</defs>
</svg>`;

const speedometerYellowSvg = `<svg width="190" height="147" viewBox="0 0 190 147" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M186.265 116.221C186.265 91.5203 176.453 67.8316 158.987 50.3658C141.522 32.9001 117.833 23.0879 93.1327 23.0879C68.4324 23.0879 44.7437 32.9001 27.2779 50.3658C9.81217 67.8316 3.72965e-06 91.5202 0 116.221L93.1327 116.221H186.265Z" fill="url(#yellow_paint0_linear)"/>
<path d="M87.8104 116.885L1.33008 116.22L49.2269 41.7139L87.8104 116.885Z" fill="url(#yellow_paint1_linear)" fill-opacity="0.34"/>
<path d="M91.8017 114.225L185.6 116.22L135.042 43.71L91.8017 114.225Z" fill="url(#yellow_paint2_linear)" fill-opacity="0.34"/>
<path d="M89.1414 118.881L47.2322 38.3883L137.038 40.3837L89.1414 118.881Z" fill="url(#yellow_paint3_linear)" fill-opacity="0.34"/>
<path d="M0.000206506 116.221C0.000208666 91.5205 9.81238 67.8318 27.2781 50.3661C44.7439 32.9003 68.4326 23.0881 93.1329 23.0881C117.833 23.0881 141.522 32.9003 158.988 50.3661C176.453 67.8318 186.266 91.5205 186.266 116.221L169.245 116.221C169.245 96.0346 161.226 76.6752 146.952 62.4014C132.679 48.1276 113.319 40.1086 93.1329 40.1086C72.9467 40.1086 53.5873 48.1276 39.3135 62.4014C25.0397 76.6752 17.0207 96.0346 17.0207 116.221L0.000206506 116.221Z" fill="#FF284C"/>
<path d="M0.000206506 116.221C0.000207933 99.8951 4.29171 83.8562 12.4445 69.7119C20.5973 55.5676 32.325 43.8149 46.4518 35.6319C60.5787 27.4489 76.6084 23.1232 92.9341 23.0883C109.26 23.0535 125.308 27.3107 139.47 35.4333L131.001 50.1977C119.428 43.5595 106.313 40.0803 92.9704 40.1088C79.6284 40.1373 66.5282 43.6725 54.9831 50.36C43.4379 57.0474 33.8536 66.6523 27.1908 78.2116C20.5279 89.771 17.0207 102.879 17.0207 116.221L0.000206506 116.221Z" fill="#FFC72C"/>
<path d="M0.000206506 116.221C0.000207918 100.067 4.20186 84.1909 12.1925 70.1518C20.1832 56.1127 31.688 44.3934 45.5772 36.1449L54.2683 50.7792C42.9174 57.5203 33.5151 67.0978 26.9848 78.5712C20.4545 90.0445 17.0207 103.019 17.0207 116.221L0.000206506 116.221Z" fill="#00FFA6"/>
<path d="M97.7615 107.444L96.0814 29.6967C96.0054 26.1778 93.1915 23.3324 89.6736 23.2171C86.0159 23.0972 82.9536 25.9651 82.8337 29.6228L80.2863 107.346C80.1281 112.171 83.9113 116.211 88.7362 116.369C93.7477 116.533 97.8698 112.457 97.7615 107.444Z" fill="url(#yellow_paint4_linear)"/>
<path d="M97.7615 107.444L96.0814 29.6967C96.0054 26.1778 93.1915 23.3324 89.6736 23.2171C86.0159 23.0972 82.9536 25.9651 82.8337 29.6228L80.2863 107.346C80.1281 112.171 83.9113 116.211 88.7362 116.369C93.7477 116.533 97.8698 112.457 97.7615 107.444Z" fill="url(#yellow_paint5_linear)"/>
<circle cx="89.1807" cy="107.754" r="8.64804" transform="rotate(0.174731 89.1807 107.754)" fill="url(#yellow_paint6_radial)"/>
<defs>
<linearGradient id="yellow_paint0_linear" x1="93.1327" y1="23.0879" x2="93.1327" y2="102.916" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="yellow_paint1_linear" x1="29.2699" y1="75.6408" x2="83.1538" y2="111.563" gradientUnits="userSpaceOnUse">
<stop stop-color="#03BF69"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="yellow_paint2_linear" x1="153.003" y1="78.3021" x2="99.1193" y2="114.225" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF284C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="yellow_paint3_linear" x1="96.2555" y1="42.9602" x2="92.0876" y2="107.586" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC72C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="yellow_paint4_linear" x1="60.9356" y1="14.5001" x2="57.8457" y2="108.773" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<linearGradient id="yellow_paint5_linear" x1="60.9356" y1="14.5001" x2="57.8457" y2="108.773" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<radialGradient id="yellow_paint6_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(89.1807 107.754) rotate(90) scale(8.64804)">
<stop stop-color="#D9D9D9"/>
<stop offset="1" stop-color="white"/>
</radialGradient>
</defs>
</svg>`;

const speedometerRedSvg = `<svg width="190" height="157" viewBox="0 0 190 157" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M186.265 116.221C186.265 91.5203 176.453 67.8316 158.987 50.3658C141.522 32.9001 117.833 23.0879 93.1327 23.0879C68.4324 23.0879 44.7437 32.9001 27.2779 50.3658C9.81217 67.8316 3.72965e-06 91.5202 0 116.221L93.1327 116.221H186.265Z" fill="url(#red_paint0_linear)"/>
<path d="M87.8104 116.885L1.33008 116.22L49.2269 41.7139L87.8104 116.885Z" fill="url(#red_paint1_linear)" fill-opacity="0.34"/>
<path d="M91.8017 114.225L185.6 116.22L135.042 43.71L91.8017 114.225Z" fill="url(#red_paint2_linear)" fill-opacity="0.34"/>
<path d="M89.1414 118.881L47.2322 38.3883L137.038 40.3837L89.1414 118.881Z" fill="url(#red_paint3_linear)" fill-opacity="0.34"/>
<path d="M0.000206506 116.221C0.000208666 91.5205 9.81238 67.8318 27.2781 50.3661C44.7439 32.9003 68.4326 23.0881 93.1329 23.0881C117.833 23.0881 141.522 32.9003 158.988 50.3661C176.453 67.8318 186.266 91.5205 186.266 116.221L169.245 116.221C169.245 96.0346 161.226 76.6752 146.952 62.4014C132.679 48.1276 113.319 40.1086 93.1329 40.1086C72.9467 40.1086 53.5873 48.1276 39.3135 62.4014C25.0397 76.6752 17.0207 96.0346 17.0207 116.221L0.000206506 116.221Z" fill="#FF284C"/>
<path d="M0.000206506 116.221C0.000207933 99.8951 4.29171 83.8562 12.4445 69.7119C20.5973 55.5676 32.325 43.8149 46.4518 35.6319C60.5787 27.4489 76.6084 23.1232 92.9341 23.0883C109.26 23.0535 125.308 27.3107 139.47 35.4333L131.001 50.1977C119.428 43.5595 106.313 40.0803 92.9704 40.1088C79.6284 40.1373 66.5282 43.6725 54.9831 50.36C43.4379 57.0474 33.8536 66.6523 27.1908 78.2116C20.5279 89.771 17.0207 102.879 17.0207 116.221L0.000206506 116.221Z" fill="#FFC72C"/>
<path d="M0.000206506 116.221C0.000207918 100.067 4.20186 84.1909 12.1925 70.1518C20.1832 56.1127 31.688 44.3934 45.5772 36.1449L54.2683 50.7792C42.9174 57.5203 33.5151 67.0978 26.9848 78.5712C20.4545 90.0445 17.0207 103.019 17.0207 116.221L0.000206506 116.221Z" fill="#00FFA6"/>
<path d="M100.68 118.531L170.337 83.9579C173.49 82.3931 174.869 78.6364 173.478 75.4033C172.031 72.0416 168.133 70.4891 164.772 71.9356L93.3385 102.672C88.9041 104.581 86.8561 109.722 88.7642 114.157C90.746 118.762 96.1882 120.761 100.68 118.531Z" fill="url(#red_paint4_linear)"/>
<circle cx="96.9281" cy="110.712" r="8.64804" transform="rotate(65.0158 96.9281 110.712)" fill="url(#red_paint5_radial)"/>
<defs>
<linearGradient id="red_paint0_linear" x1="93.1327" y1="23.0879" x2="93.1327" y2="102.916" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="red_paint1_linear" x1="29.2699" y1="75.6408" x2="83.1538" y2="111.563" gradientUnits="userSpaceOnUse">
<stop stop-color="#03BF69"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="red_paint2_linear" x1="153.003" y1="78.3021" x2="99.1193" y2="114.225" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF284C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="red_paint3_linear" x1="96.2555" y1="42.9602" x2="92.0876" y2="107.586" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC72C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="red_paint4_linear" x1="169.328" y1="45.5018" x2="82.6849" y2="82.7833" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<radialGradient id="red_paint5_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(96.9281 110.712) rotate(90) scale(8.64804)">
<stop stop-color="#D9D9D9"/>
<stop offset="1" stop-color="white"/>
</radialGradient>
</defs>
</svg>`;

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
  
  // Calculate the test score
  const { score, interpretation, recommendation } = useMemo(() => {
    try {
      return calculateTestScore(testId, answers);
    } catch (err) {
      setError(`Error calculating test score: ${err}`);
      return { 
        score: 0, 
        interpretation: 'Error calculating results', 
        recommendation: 'Please try again later' 
      };
    }
  }, [testId, answers]);
  
  // Calculate normalized score (0-1) for the gauge
  const normalizedScore = useMemo(() => {
    const questions = TEST_QUESTIONS[testId];
    if (!questions) return 0;
    
    // Calculate max possible score (assuming max value per question is 4)
    const maxPossibleScore = questions.length * 4;
    return maxPossibleScore > 0 ? score / maxPossibleScore : 0;
  }, [testId, score]);
  
  // Determine level based on normalized score
  const getLevel = (score: number): string => {
    if (score < 0.3) return 'Low';
    if (score < 0.7) return 'Moderate';
    return 'High';
  };
  
  // Get the result level
  const resultLevel = getLevel(normalizedScore);
  
  // Calculate breakdown scores based on question categories
  const calculateBreakdown = () => {
    const questions = TEST_QUESTIONS[testId];
    if (!questions) return [];
    
    // Group questions by category (using domain as category)
    const categories: Record<string, { total: number, count: number }> = {};
    
    questions.forEach((q, index) => {
      const category = q.domain || 'General';
      const answerValue = answers[q.id] || 0;
      
      if (!categories[category]) {
        categories[category] = { total: 0, count: 0 };
      }
      
      categories[category].total += answerValue;
      categories[category].count += 1;
    });
    
    // Calculate average score for each category
    return Object.entries(categories).map(([name, { total, count }]) => {
      const avgScore = count > 0 ? total / count : 0;
      const normalizedCategoryScore = avgScore / 4; // Assuming 4 is max score per question
      return {
        name,
        score: normalizedCategoryScore,
        level: getLevel(normalizedCategoryScore)
      };
    });
  };
  
  // Create result object with breakdown for the test
  const result: TestResultType = {
    overall: normalizedScore,
    breakdown: calculateBreakdown(),
    interpretation,
    recommendation
  };
  
  // Save result to local storage
  const saveResult = async () => {
    try {
      await saveTestResult(testId, result);
      setSavedResult(true);
    } catch (err) {
      console.error('Error saving test result:', err);
      setError('Failed to save your results. Please try again.');
    }
  };
  
  // Save result when component mounts
  useEffect(() => {
    if (testId && result && !error && !savedResult) {
      saveResult();
    }
  }, [testId, result, error, savedResult]);
  
  // Handle sharing results
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just took the ${test?.title} test and got a ${resultLevel} result! Check out the Neuro app to take it yourself.`,
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };
  
  // Handle retaking the test
  const handleRetakeTest = () => {
    navigation.navigate('TakeTest', { testId });
  };
  
  // Handle finishing and going back to tests overview
  const handleFinish = () => {
    navigation.navigate('TestsOverview');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Go Back" onPress={handleFinish} />
          </View>
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <SvgXml xml={logoSvg} width={40} height={40} />
              <Text style={styles.headerTitle}>{test?.title || 'Test'} Results</Text>
            </View>
            
            {/* Gauge */}
            <SpeedometerSvg level={resultLevel} />
            
            {/* Results Card */}
            <View style={styles.resultsCard}>
              <Text style={styles.sectionTitle}>Interpretation</Text>
              <Text style={styles.interpretationText}>{interpretation}</Text>
              
              <Text style={styles.sectionTitle}>Recommendation</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
              
              <Text style={styles.sectionTitle}>Breakdown</Text>
              {result.breakdown.map((item, index) => (
                <View key={index} style={styles.breakdownItem}>
                  <Text style={styles.breakdownName}>{item.name}</Text>
                  <View style={styles.breakdownBarContainer}>
                    <View 
                      style={[
                        styles.breakdownBar, 
                        { width: `${item.score * 100}%` },
                        item.level === 'Low' ? styles.lowBar : 
                        item.level === 'Moderate' ? styles.moderateBar : 
                        styles.highBar
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.breakdownLevel,
                    item.level === 'Low' ? styles.lowLevelText : 
                    item.level === 'Moderate' ? styles.moderateLevelText : 
                    styles.highLevelText
                  ]}>
                    {item.level}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button 
                title="Share Results" 
                onPress={handleShare}
                style={styles.shareButton}
              />
              <Button 
                title="Retake Test" 
                onPress={handleRetakeTest}
                style={styles.retakeButton}
              />
              <Button 
                title="Finish" 
                onPress={handleFinish}
                style={styles.finishButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF284C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  lowLevelText: {
    color: '#00D087',
  },
  moderateLevelText: {
    color: '#FFC72C',
  },
  highLevelText: {
    color: '#FF284C',
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  breakdownItem: {
    marginVertical: 8,
  },
  breakdownName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  breakdownBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 6,
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 4,
  },
  lowBar: {
    backgroundColor: '#00D087',
  },
  moderateBar: {
    backgroundColor: '#FFC72C',
  },
  highBar: {
    backgroundColor: '#FF284C',
  },
  breakdownLevel: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    marginBottom: 40,
  },
  shareButton: {
    marginBottom: 12,
    backgroundColor: '#4285F4',
  },
  retakeButton: {
    marginBottom: 12,
    backgroundColor: '#FFC72C',
  },
  finishButton: {
    backgroundColor: '#00D087',
  },
});

export default TestResultScreen; 