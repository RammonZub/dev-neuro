# Neuro App

A React Native application for mental health assessments and educational content.

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

## Project Structure

```
src/
├── assets/           # Images, fonts, and other static assets
├── components/       # Reusable UI components
├── data/             # Mock data and API functions
├── screens/          # Screen components
│   ├── Tests/        # Test-related screens
│   └── Learn/        # Learn-related screens
├── theme/            # Theme configuration (colors, typography, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/neuro.git
   cd neuro
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Install iOS dependencies:
   ```
   cd ios && pod install && cd ..
   ```

4. Start the Metro bundler:
   ```
   npm start
   # or
   yarn start
   ```

5. Run the app:
   ```
   # For iOS
   npm run ios
   # or
   yarn ios

   # For Android
   npm run android
   # or
   yarn android
   ```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add iOS and Android apps to your Firebase project
3. Download the configuration files:
   - `GoogleService-Info.plist` for iOS
   - `google-services.json` for Android
4. Place the configuration files in their respective directories:
   - iOS: `/ios/Neuro/GoogleService-Info.plist`
   - Android: `/android/app/google-services.json`

## Replicate API Integration

1. Sign up for a Replicate account at [replicate.com](https://replicate.com)
2. Create an API key
3. Add your API key to the Firebase project as a secure environment variable

## License

This project is licensed under the MIT License - see the LICENSE file for details.
