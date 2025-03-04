# Neuro: Ramon Zubiaga Application 

## Data Generation Approach

### Book Collection (3,000 Books)
After extensive search for a reliable API, I created a custom scraper bot to collect data from Goodreads:
- Scraped over 5,000 books and filtered down to a clean dataset of 3,000 books
- Discovered pagination bypass: While Goodreads restricts pagination for non-signed users, book lists allowed indirect access
- Extracted comprehensive metadata (titles, authors, ratings, genres) with high accuracy

### Generator Pipelines

#### `bookGenerator.js`
- **Prompt Engineering**: Developed a sophisticated prompt that generates unique chapter summaries with varied writing styles
- **Quality Control**: Implemented validation to ensure proper JSON formatting and content uniqueness
- **Structure**: Each book includes title, author, subtitle, abstract, author description, and chapter summaries (~600 words total)
- **Processing**: Added batch processing with configurable options and proper error handling

#### `testGenerator.js`
- **Research-Based Approach**: Conducted in-depth research using Perplexity AI and other sources to identify scientific methods for psychological test design
- **Test Customization**: Implemented domain-specific prompts for different assessment types (ADHD, anxiety, emotional intelligence)
- **Validation**: Created comprehensive validation to ensure test questions follow proper psychological assessment standards
- **Scoring System**: Implemented reverse-scoring and appropriate interpretation ranges based on psychological research

## App Structure

### Core Components
- **Navigation**: React Navigation with tab and stack navigators
- **UI Framework**: Custom components built with React Native core components
- **State Management**: Context API for global state
- **Data Storage**: Local storage with AsyncStorage for progress tracking

### Key Features
- **Book Library**: Browse and read summarized self-help books
- **Psychological Tests**: Take scientifically-designed assessments
- **Progress Tracking**: Track reading progress and test results
- 
- **Share Results**: Social sharing capabilities

### Libraries & Tools
- React Native
- React Navigation
- Firebase Authentication & Firestore
- AsyncStorage
- Axios for API calls
- React Native SVG for vector graphics
- Replicate API for AI integration

## Future Improvements

### Recommended Enhancements
- **UI Refinement**: Further polish the user interface for a more premium feel
- **Expanded Functionality**: Add audiobook integration and note-taking features
- **Improved Book Summaries**: Implement more nuanced chapter generation algorithms
- **User Personalization**: Add customized recommendations based on test results and reading history
- **User Dashboard**: Visualize self-improvement journey

### Market Potential
This application has significant potential in the self-improvement space by uniquely combining:
- Psychological assessments with AI analysis
- Gamified incentives to encourage continued engagement
- Condensed book summaries for efficient knowledge acquisition
- Data-driven insights to personalize the self-improvement journey

## Running the Project

```bash
# Install dependencies
npm install

# Start the Metro bundler
npx react-native start

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## Project Structure
```
src/
├── assets/           # Images, SVGs, and other static assets
├── components/       # Reusable UI components
├── DataPipelines/    # Data generation scripts
├── data/             # JSON data files for books and tests
├── navigation/       # Navigation configuration
├── screens/          # Screen components
│   ├── Learn/        # Book-related screens
│   └── Tests/        # Test-related screens
├── services/         # API and Firebase services
├── styles/           # Global styles and themes
└── utils/            # Utility functions
```

## Features

- **Tests**: Take various mental health assessments and view results
- **Learn**: Read educational content about mental health and cognitive development

## Screens

### Tests
- **Tests Overview**: Display the list of available tests
- **Take Test**: Interactive test-taking experience with multiple-choice questions
- **Test Result**: Detailed results with visual gauge and breakdown

### Learn
- **Books Overview**: Display the list of available books
- **Read Book**: Chapter-by-chapter reading experience
- **Book Result**: Completion screen with reading stats and rating

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

