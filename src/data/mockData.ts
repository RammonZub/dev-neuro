import { Test, Question, Book, Chapter, TestResult } from '../types';

// Mock Tests Data
export const TESTS: Test[] = [
  {
    id: '1',
    title: 'Emotional Intelligence',
    image: require('../assets/images/main_banner_tests.png'),
    questions: 20,
    duration: 10,
    description: 'Assess your ability to recognize and manage emotions in yourself and others.',
  },
  {
    id: '2',
    title: 'ADHD Assessment',
    image: require('../assets/images/adhd_screening.png'),
    questions: 20,
    duration: 10,
    description: 'Evaluate symptoms related to attention deficit hyperactivity disorder.',
  },
  {
    id: '3',
    title: 'Anxiety Self-check',
    image: require('../assets/images/anxiety_check.png'),
    questions: 20,
    duration: 10,
    description: 'Measure your current anxiety levels and identify potential triggers.',
  },
  {
    id: '4',
    title: 'Temperament Type',
    image: require('../assets/images/Depression_screening.png'),
    questions: 20,
    duration: 10,
    description: 'Discover your personality type and how it influences your behavior.',
  },
  {
    id: '5',
    title: 'IQ Test',
    image: require('../assets/images/Charisma_level.png'),
    questions: 20,
    duration: 10,
    description: 'Assess your cognitive abilities and problem-solving skills.',
  },
];

// Mock Questions Data
export const TEST_QUESTIONS: Record<string, Question[]> = {
  '1': [
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
  ],
  // Add questions for other tests
};

// Mock Test Results
export const TEST_RESULTS: Record<string, TestResult> = {
  '1': {
    overall: 0.2,
    breakdown: [
      { name: 'Inattention', score: 0.2, level: 'Low' },
      { name: 'Hyperactivity', score: 0.5, level: 'Moderate' },
      { name: 'Impulsivity', score: 0.2, level: 'Low' },
    ],
  },
  // Add results for other tests
};

// Mock Books Data
export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'Mindshift',
    author: 'Erwin Raphael McManus',
    image: require('../assets/images/mindshift_cover.png'),
    tags: ['Cognitive Science', 'Psychology', 'IQ Development'],
    chapters: 7,
    duration: 10,
    description: 'Explore how to transform your thinking and unlock your full potential.',
  },
  {
    id: '2',
    title: 'Mindshift',
    author: 'Erwin Raphael McManus',
    image: require('../assets/images/mindshift_cover.png'),
    tags: ['Cognitive Science', 'Psychology'],
    chapters: 7,
    duration: 10,
    description: 'Explore how to transform your thinking and unlock your full potential.',
  },
  {
    id: '3',
    title: 'Mindshift',
    author: 'Erwin Raphael McManus',
    image: require('../assets/images/mindshift_cover.png'),
    tags: ['Cognitive Science', 'Psychology'],
    chapters: 7,
    duration: 10,
    description: 'Explore how to transform your thinking and unlock your full potential.',
  },
  {
    id: '4',
    title: 'Mindshift',
    author: 'Erwin Raphael McManus',
    image: require('../assets/images/mindshift_cover.png'),
    tags: ['Cognitive Science', 'Psychology'],
    chapters: 7,
    duration: 10,
    description: 'Explore how to transform your thinking and unlock your full potential.',
  },
];

// Mock Chapters Data
export const BOOK_CHAPTERS: Record<string, Chapter[]> = {
  '1': [
    {
      id: '1',
      title: 'Intelligence is not fixed but can be developed through consistent practice and the right methods',
      content: [
        'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
        'Recent research has shown that intelligence is far more malleable than previously thought. The brain\'s plasticity allows for continuous growth and adaptation throughout our lives.',
        'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
        'Recent research has shown that intelligence is far more malleable than previously thought. The brain\'s plasticity allows for continuous growth and adaptation throughout our lives.',
        'Pattern recognition and problem-solving abilities are key indicators of cognitive development. Environmental factors play a crucial role in shaping intellectual capacity.',
      ],
    },
    {
      id: '2',
      title: 'The role of neuroplasticity in cognitive development',
      content: [
        'Neuroplasticity refers to the brain\'s ability to reorganize itself by forming new neural connections. This ability continues throughout life but is especially pronounced during development.',
        'Learning new skills creates new neural pathways. The more these pathways are used, the stronger they become, leading to improved performance and retention.',
        'Various factors influence neuroplasticity, including age, environment, lifestyle, and genetics. However, even adults can significantly enhance their cognitive abilities through targeted practice.',
      ],
    },
    // Add more chapters as needed
  ],
  // Add chapters for other books
}; 