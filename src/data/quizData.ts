import { Test, Question, QuestionOption, ScoringRules } from '../types';

// Import quiz data
import iqQuiz from './generated_quizzes/iq_quiz.json';
import adhdQuiz from './generated_quizzes/adhd_quiz.json';
import anxietyQuiz from './generated_quizzes/anxiety_quiz.json';
import temperamentQuiz from './generated_quizzes/temperament_quiz.json';
import emotionalIntelligenceQuiz from './generated_quizzes/emotional_intelligence_quiz.json';

// Quiz images
const quizImages = {
  iq: require('../assets/images/Charisma_level.png'),
  adhd: require('../assets/images/adhd_screening.png'),
  anxiety: require('../assets/images/anxiety_check.png'),
  temperament: require('../assets/images/Depression_screening.png'),
  emotional_intelligence: require('../assets/images/main_banner_tests.png'),
};

// Transform quiz data to match our types
const transformQuestions = (items: any[]): Question[] => {
  return items.map(item => ({
    id: item.id,
    text: item.text,
    domain: item.domain,
    reverse_scored: item.reverse_scored,
    options: Array.isArray(item.options) 
      ? item.options.map((opt: any, index: number): QuestionOption => {
          if (typeof opt === 'string') {
            // Handle ADHD quiz format
            return {
              text: opt,
              value: item.optionValues[index],
            };
          }
          return {
            text: opt.text,
            value: opt.value,
          };
        })
      : [],
  }));
};

const transformScoringRules = (scoring: any): ScoringRules => {
  return {
    raw_score_ranges: scoring.raw_score_ranges 
      ? {
          below_average: [scoring.raw_score_ranges.below_average[0], scoring.raw_score_ranges.below_average[1]],
          average: [scoring.raw_score_ranges.average[0], scoring.raw_score_ranges.average[1]],
          above_average: [scoring.raw_score_ranges.above_average[0], scoring.raw_score_ranges.above_average[1]],
          superior: [scoring.raw_score_ranges.superior[0], scoring.raw_score_ranges.superior[1]],
        }
      : undefined,
    symptom_cutoffs: scoring.symptom_cutoffs,
    dimension_cutoffs: scoring.dimension_cutoffs,
    interpretation: scoring.interpretation.map((i: any) => ({
      range: [i.range[0], i.range[1]] as [number, number],
      result: i.result,
      recommendation: i.recommendation,
    })),
  };
};

// Quiz metadata
export const TESTS: Test[] = [
  {
    id: '1',
    title: 'Emotional Intelligence',
    image: quizImages.emotional_intelligence,
    questions: emotionalIntelligenceQuiz.items.length,
    duration: 10,
    description: 'Assess your ability to recognize and manage emotions in yourself and others.',
    metadata: emotionalIntelligenceQuiz.metadata,
  },
  {
    id: '2',
    title: 'ADHD Assessment',
    image: quizImages.adhd,
    questions: adhdQuiz.items.length,
    duration: 10,
    description: 'Evaluate symptoms related to attention deficit hyperactivity disorder.',
    metadata: adhdQuiz.metadata,
  },
  {
    id: '3',
    title: 'Anxiety Self-check',
    image: quizImages.anxiety,
    questions: anxietyQuiz.items.length,
    duration: 10,
    description: 'Measure your current anxiety levels and identify potential triggers.',
    metadata: anxietyQuiz.metadata,
  },
  {
    id: '4',
    title: 'Temperament Type',
    image: quizImages.temperament,
    questions: temperamentQuiz.items.length,
    duration: 10,
    description: 'Discover your personality type and how it influences your behavior.',
    metadata: temperamentQuiz.metadata,
  },
  {
    id: '5',
    title: 'IQ Test',
    image: quizImages.iq,
    questions: iqQuiz.items.length,
    duration: 10,
    description: 'Assess your cognitive abilities and problem-solving skills.',
    metadata: iqQuiz.metadata,
  },
];

// Map test IDs to their questions
export const TEST_QUESTIONS: Record<string, Question[]> = {
  '1': transformQuestions(emotionalIntelligenceQuiz.items),
  '2': transformQuestions(adhdQuiz.items),
  '3': transformQuestions(anxietyQuiz.items),
  '4': transformQuestions(temperamentQuiz.items),
  '5': transformQuestions(iqQuiz.items),
};

// Map test IDs to their scoring rules
export const TEST_SCORING: Record<string, ScoringRules> = {
  '1': transformScoringRules(emotionalIntelligenceQuiz.scoring),
  '2': transformScoringRules(adhdQuiz.scoring),
  '3': transformScoringRules(anxietyQuiz.scoring),
  '4': transformScoringRules(temperamentQuiz.scoring),
  '5': transformScoringRules(iqQuiz.scoring),
};

// Calculate test score based on answers and scoring rules
export const calculateTestScore = (
  testId: string,
  answers: Record<string, number>
): { score: number; interpretation: string; recommendation: string } => {
  const questions = TEST_QUESTIONS[testId];
  const scoring = TEST_SCORING[testId];
  
  if (!questions || !scoring) {
    throw new Error('Invalid test ID');
  }

  // Calculate raw score
  let totalScore = 0;
  questions.forEach(question => {
    const answer = answers[question.id];
    if (typeof answer === 'number') {
      // Handle reverse scoring
      totalScore += question.reverse_scored ? (4 - answer) : answer;
    }
  });

  // Find interpretation based on score
  const interpretation = scoring.interpretation.find(
    range => totalScore >= range.range[0] && totalScore <= range.range[1]
  );

  return {
    score: totalScore,
    interpretation: interpretation?.result || 'Score could not be interpreted',
    recommendation: interpretation?.recommendation || 'No recommendation available',
  };
}; 