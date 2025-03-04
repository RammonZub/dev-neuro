# Neuro Data Generation Pipelines

This directory contains scripts for generating book summaries and psychological tests for the Neuro app.

## Setup

1. Install dependencies:
```bash
npm install axios dotenv
```

2. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Book Generation Pipeline

The `bookGenerator.js` script creates detailed book summaries with chapters for a list of books.

### Features:
- Generates unique book summaries with chapters
- Creates approximately 600 words of content per book
- Includes metadata like ratings, publication year, and genres
- Outputs JSON in the format required by the app

### Usage:

```bash
node src/DataScraping/bookGenerator.js
```

This will:
1. Process the sample list of books defined in the script
2. Generate detailed summaries with chapters for each book
3. Save the results to `src/data/books.json`

### Customizing:

To generate summaries for different books, modify the `books` array in the `main()` function:

```javascript
const books = [
  { title: "Your Book Title", author: "Author Name", genres: ["Genre1", "Genre2"] },
  // Add more books...
];
```

## Test Generation Pipeline

The `testGenerator.js` script creates psychological tests with questions and scoring systems.

### Features:
- Generates psychologically sound questions
- Creates appropriate scoring systems for each test type
- Includes metadata and interpretations for different score ranges
- Outputs JSON in the format required by the app

### Usage:

```bash
node src/DataScraping/testGenerator.js
```

This will:
1. Process the sample list of tests defined in the script
2. Generate detailed test structures with questions and scoring
3. Save individual test files to `src/data/generated_quizzes/`
4. Save test metadata to `src/data/tests.json`

### Customizing:

To generate different tests, modify the `tests` array in the `main()` function:

```javascript
const tests = [
  { 
    id: '1',
    title: 'Your Test Title', 
    domain: 'Test Domain',
    description: 'Test description.',
    image: '../path/to/image.png'
  },
  // Add more tests...
];
```

## Integration with the App

The generated JSON files are ready to be used by the Neuro app:

- Book data: `src/data/books.json`
- Test metadata: `src/data/tests.json`
- Individual tests: `src/data/generated_quizzes/*.json`

These files are imported and used by the app's components to display books, chapters, tests, and results.

## Recommendations for Improvement

1. **Batch Processing**: Add support for processing books/tests in batches to handle larger datasets
2. **Image Generation**: Integrate with image generation APIs to create book covers
3. **Caching**: Implement caching to avoid regenerating existing content
4. **Quality Control**: Add validation to ensure generated content meets quality standards
5. **User Feedback**: Incorporate user feedback to improve generated content over time 