import { TestResult } from '../types';

// In-memory storage for when AsyncStorage fails
let memoryStorage: Record<string, string> = {};

// Mock AsyncStorage implementation as fallback
const mockAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    console.log('Using mock storage getItem:', key);
    return memoryStorage[key] || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    console.log('Using mock storage setItem:', key);
    memoryStorage[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    console.log('Using mock storage removeItem:', key);
    delete memoryStorage[key];
  }
};

// Try to import AsyncStorage, use mock if it fails
let AsyncStorage: typeof mockAsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
  // Test if AsyncStorage is working
  AsyncStorage.getItem('test-key').catch(() => {
    console.warn('AsyncStorage test failed, using mock implementation');
    AsyncStorage = mockAsyncStorage;
  });
} catch (error) {
  console.warn('AsyncStorage import failed, using mock implementation');
  AsyncStorage = mockAsyncStorage;
}

const COMPLETED_TESTS_KEY = 'completed_tests';

// Save completed test result
export const saveTestResult = async (testId: string, result: TestResult): Promise<void> => {
  if (!testId || !result) {
    console.warn('Invalid parameters for saveTestResult');
    return;
  }
  
  try {
    // Get existing completed tests
    let completedTests: Record<string, any> = {};
    try {
      const existingData = await AsyncStorage.getItem(COMPLETED_TESTS_KEY);
      if (existingData) {
        completedTests = JSON.parse(existingData);
      }
    } catch (error) {
      console.warn('Error reading from storage, using empty object', error);
    }
    
    // Add or update this test result
    completedTests[testId] = {
      ...result,
      completedAt: new Date().toISOString(),
    };
    
    // Save back to storage
    await AsyncStorage.setItem(COMPLETED_TESTS_KEY, JSON.stringify(completedTests));
    console.log('Test result saved successfully');
  } catch (error) {
    console.error('Error saving test result:', error);
    // Save to memory as fallback
    try {
      const existingData = await mockAsyncStorage.getItem(COMPLETED_TESTS_KEY);
      const completedTests = existingData ? JSON.parse(existingData) : {};
      completedTests[testId] = {
        ...result,
        completedAt: new Date().toISOString(),
      };
      await mockAsyncStorage.setItem(COMPLETED_TESTS_KEY, JSON.stringify(completedTests));
      console.log('Test result saved to memory storage');
    } catch (fallbackError) {
      console.error('Even fallback storage failed:', fallbackError);
    }
  }
};

// Get all completed tests
export const getCompletedTests = async (): Promise<Record<string, TestResult & { completedAt: string }>> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_TESTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting completed tests:', error);
    // Try memory storage as fallback
    try {
      const data = await mockAsyncStorage.getItem(COMPLETED_TESTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (fallbackError) {
      console.error('Even fallback storage failed:', fallbackError);
      return {};
    }
  }
};

// Check if a specific test is completed
export const isTestCompleted = async (testId: string): Promise<boolean> => {
  if (!testId) return false;
  try {
    const completedTests = await getCompletedTests();
    return !!completedTests[testId];
  } catch (error) {
    console.error('Error checking if test is completed:', error);
    return false;
  }
};

// Get the number of completed tests
export const getCompletedTestsCount = async (): Promise<number> => {
  try {
    const completedTests = await getCompletedTests();
    return Object.keys(completedTests).length;
  } catch (error) {
    console.error('Error getting completed tests count:', error);
    return 0;
  }
};

// Clear all completed tests (for testing purposes)
export const clearCompletedTests = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(COMPLETED_TESTS_KEY);
    console.log('Completed tests cleared');
  } catch (error) {
    console.error('Error clearing completed tests:', error);
    // Try memory storage as fallback
    try {
      await mockAsyncStorage.removeItem(COMPLETED_TESTS_KEY);
      console.log('Completed tests cleared from memory storage');
    } catch (fallbackError) {
      console.error('Even fallback storage failed:', fallbackError);
    }
  }
}; 