// Navigation Types
export type RootStackParamList = {
  Tests: undefined;
  Learn: undefined;
};

export type TestsStackParamList = {
  TestsOverview: undefined;
  TakeTest: { testId: string };
  TestResult: { testId: string, answers: Record<string, string> };
};

export type LearnStackParamList = {
  BooksOverview: undefined;
  ReadBook: { bookId: string };
  BookResult: { bookId: string };
};

// Data Models
export interface Test {
  id: string;
  title: string;
  image: any; // Replace with proper type when assets are available
  questions: number;
  duration: number;
  description?: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
}

export interface TestResult {
  overall: number; // 0 to 1
  breakdown: ResultBreakdown[];
}

export interface ResultBreakdown {
  name: string;
  score: number; // 0 to 1
  level: 'Low' | 'Moderate' | 'High';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image: any; // Replace with proper type when assets are available
  tags?: string[];
  chapters: number;
  duration: number;
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string[];
}

export interface BookResult {
  keyPoints: number;
  readingTime: number;
  rating?: number;
} 