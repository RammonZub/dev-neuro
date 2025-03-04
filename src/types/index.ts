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
  metadata?: TestMetadata;
}

export interface TestMetadata {
  assessment_type: string;
  version: string;
  normative_data: string;
}

export interface Question {
  id: string;
  text: string;
  domain: string;
  reverse_scored: boolean;
  options: QuestionOption[];
}

export interface QuestionOption {
  text: string;
  value: number;
}

export interface TestResult {
  overall: number;
  breakdown: ResultBreakdown[];
  interpretation?: string;
  recommendation?: string;
}

export interface ResultBreakdown {
  name: string;
  score: number;
  level: string;
}

export interface ScoringRules {
  raw_score_ranges?: {
    below_average: [number, number];
    average: [number, number];
    above_average: [number, number];
    superior: [number, number];
  };
  symptom_cutoffs?: {
    [key: string]: number;
  };
  dimension_cutoffs?: {
    [key: string]: number;
  };
  interpretation: {
    range: [number, number];
    result: string;
    recommendation: string;
  }[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  rating: string;
  num_ratings: string;
  publication_year: string;
  abstract: string;
  image_url: string;
  image?: any; // For backward compatibility
  tags?: string[]; // For backward compatibility
  duration?: number; // For backward compatibility
  description?: string; // For backward compatibility
  genres: string[];
  author_description: string;
  source_list: string;
  index: number;
  is_self_help: boolean;
  chapters?: number;
  readingTime?: string;
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