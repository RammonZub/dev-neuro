const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = axios.create({
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a psychological test using OpenAI API
 * @param {Object} testInfo - Basic test information
 * @returns {Object} - Complete test object with questions and scoring
 */
async function generateTest(testInfo) {
  try {
    const prompt = `
Generate a comprehensive psychological test for "${testInfo.title}".

The response should be in JSON format with the following structure:
{
  "metadata": {
    "assessment_type": "${testInfo.title}",
    "version": "1.0",
    "normative_data": "A brief description of the normative data source"
  },
  "items": [
    {
      "id": "Q01",
      "text": "A well-formulated question that assesses a specific aspect of ${testInfo.domain}",
      "domain": "${testInfo.domain}",
      "reverse_scored": false,
      "options": [
        {
          "text": "Option A with description (4)",
          "value": 4
        },
        {
          "text": "Option B with description (3)",
          "value": 3
        },
        {
          "text": "Option C with description (2)",
          "value": 2
        },
        {
          "text": "Option D with description (1)",
          "value": 1
        },
        {
          "text": "Option E with description (0)",
          "value": 0
        }
      ]
    }
  ],
  "scoring": {
    "symptom_cutoffs": {
      "${testInfo.domain.toLowerCase()}": 10
    },
    "interpretation": [
      {
        "range": [0, 10],
        "result": "Low ${testInfo.domain}",
        "recommendation": "A brief recommendation for people scoring in this range"
      },
      {
        "range": [11, 20],
        "result": "Moderate ${testInfo.domain}",
        "recommendation": "A brief recommendation for people scoring in this range"
      },
      {
        "range": [21, 40],
        "result": "High ${testInfo.domain}",
        "recommendation": "A brief recommendation for people scoring in this range"
      }
    ]
  }
}

Create at least 20 questions that are psychologically sound and not obvious in their intent. Include multiple domains if appropriate for this type of assessment. Ensure the scoring system is valid for this type of psychological test.
`;

    const response = await client.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a clinical psychologist who specializes in creating psychological assessments." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const testData = JSON.parse(response.data.choices[0].message.content);
    
    // Add additional metadata
    testData.id = testInfo.id;
    testData.image = testInfo.image;
    testData.questions = testData.items.length;
    testData.duration = Math.ceil(testData.items.length * 0.5); // Estimate 30 seconds per question
    testData.description = testInfo.description;
    
    return testData;
  } catch (error) {
    console.error(`Error generating test for ${testInfo.title}:`, error);
    throw error;
  }
}

/**
 * Process a list of tests and generate complete test objects
 * @param {Array} testsList - List of tests with basic information
 */
async function processTests(testsList) {
  const results = [];
  
  for (let i = 0; i < testsList.length; i++) {
    console.log(`Processing test ${i+1}/${testsList.length}: ${testsList[i].title}`);
    try {
      const testData = await generateTest(testsList[i]);
      results.push(testData);
      
      // Save individual test to its own file
      const fileName = testsList[i].title.toLowerCase().replace(/\s+/g, '_') + '_quiz.json';
      const outputPath = path.join(__dirname, '../data/generated_quizzes', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));
      console.log(`Saved test to: ${outputPath}`);
      
      // Add a delay to avoid rate limiting
      if (i < testsList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to process test: ${testsList[i].title}`);
    }
  }
  
  return results;
}

/**
 * Main function to generate psychological tests
 */
async function main() {
  // Sample list of tests to process
  const tests = [
    { 
      id: '1',
      title: 'Emotional Intelligence Quiz', 
      domain: 'Emotional Intelligence',
      description: 'Assess your ability to recognize and manage emotions in yourself and others.',
      image: '../assets/images/main_banner_tests.png'
    },
    { 
      id: '2',
      title: 'ADHD Assessment', 
      domain: 'Attention',
      description: 'Evaluate symptoms related to attention deficit hyperactivity disorder.',
      image: '../assets/images/adhd_screening.png'
    },
    { 
      id: '3',
      title: 'Anxiety Self-check', 
      domain: 'Anxiety',
      description: 'Measure your current anxiety levels and identify potential triggers.',
      image: '../assets/images/anxiety_check.png'
    },
    { 
      id: '4',
      title: 'Temperament Type', 
      domain: 'Personality',
      description: 'Discover your personality type and how it influences your behavior.',
      image: '../assets/images/Depression_screening.png'
    },
    { 
      id: '5',
      title: 'IQ Test', 
      domain: 'Cognitive Ability',
      description: 'Assess your cognitive abilities and problem-solving skills.',
      image: '../assets/images/Charisma_level.png'
    }
  ];
  
  try {
    const processedTests = await processTests(tests);
    
    // Save test metadata to a single file for the app to use
    const metadataPath = path.join(__dirname, '../data/tests.json');
    const metadata = processedTests.map(test => ({
      id: test.id,
      title: test.metadata.assessment_type,
      image: test.image,
      questions: test.questions,
      duration: test.duration,
      description: test.description,
      metadata: test.metadata
    }));
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log(`Successfully generated ${processedTests.length} psychological tests.`);
    console.log(`Metadata saved to: ${metadataPath}`);
  } catch (error) {
    console.error("Failed to generate psychological tests:", error);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  generateTest,
  processTests
}; 