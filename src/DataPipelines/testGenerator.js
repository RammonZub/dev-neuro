const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const { performance } = require('perf_hooks');
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
 * Generate a comprehensive psychological test using OpenAI API
 * @param {Object} testInfo - Basic test information
 * @returns {Object} - Complete test object with questions and scoring
 */
async function generateTest(testInfo) {
  const testName = testInfo.title;
  const domain = testInfo.domain;
  
  console.log(`Generating test: ${testName} (${domain})`);
  const startTime = performance.now();
  
  try {
    // Determine the appropriate prompt based on test type
    let prompt = getTestPrompt(testName, domain);
    
    // Make API request to generate test content
    const response = await client.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-1106-preview", // Using the most advanced model for complex test generation
      messages: [
        { 
          role: "system", 
          content: "You are a clinical psychologist with expertise in psychometric test design. You specialize in creating valid and reliable psychological assessments that follow best practices in test construction." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });

    // Extract and parse JSON content
    let quiz;
    try {
      const content = response.data.choices[0].message.content.trim();
      // Handle if the response is wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        content.match(/{[\s\S]*}/);
                        
      if (jsonMatch) {
        const jsonString = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
        quiz = JSON.parse(jsonString);
      } else {
        quiz = JSON.parse(content);
      }
    } catch (parseError) {
      console.error(`Error parsing JSON for ${testName}:`, parseError);
      return null;
    }
    
    // Add required metadata and validate the test
    const processedQuiz = validateAndEnhanceTest(quiz, testInfo);
    
    const endTime = performance.now();
    console.log(`Successfully generated ${testName} test in ${((endTime - startTime) / 1000).toFixed(2)}s`);
    
    return processedQuiz;
  } catch (error) {
    console.error(`Error generating ${testName} test:`, error.message);
    return null;
  }
}

/**
 * Get the appropriate prompt template based on test type
 */
function getTestPrompt(testName, domain) {
  // Base prompt template
  let promptTemplate = `
Create a comprehensive psychological assessment for "${testName}" focused on measuring ${domain}.

The output must be valid JSON in the following format (no explanations outside the JSON):
{
  "metadata": {
    "assessment_type": "${testName}",
    "version": "1.0",
    "normative_data": "A brief description of the normative data source or theoretical framework"
  },
  "items": [
    {
      "id": "Q01",
      "text": "A well-crafted question that measures an aspect of ${domain}",
      "domain": "${domain}",
      "reverse_scored": false,
      "options": [
        {
          "text": "Option A with brief description (4)",
          "value": 4
        },
        {
          "text": "Option B with brief description (3)",
          "value": 3
        },
        {
          "text": "Option C with brief description (2)",
          "value": 2
        },
        {
          "text": "Option D with brief description (1)",
          "value": 1
        },
        {
          "text": "Option E with brief description (0)",
          "value": 0
        }
      ]
    }
    // More items following the same structure...
  ],
  "scoring": {
    "symptom_cutoffs": {
      "domain_name": 12
    },
    "interpretation": [
      {
        "range": [0, 10],
        "result": "Low Level Result",
        "recommendation": "A personalized recommendation for this score range"
      },
      {
        "range": [11, 20],
        "result": "Moderate Level Result",
        "recommendation": "A personalized recommendation for this score range"
      },
      {
        "range": [21, 40],
        "result": "High Level Result",
        "recommendation": "A personalized recommendation for this score range"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
1. Create exactly 20-30 psychologically sound questions that appropriately measure ${domain}.
2. Include at least 2-3 reverse-scored items to detect response patterns.
3. Ensure questions are subtle and don't have obvious "right" answers.
4. Use varied question formats and contexts to comprehensively assess the construct.
5. Structure the assessment to gradually progress from general to more specific aspects.
6. Include multiple relevant domains/dimensions if appropriate for this type of assessment.
7. Create a valid scoring system with appropriate cutoffs and interpretations.
8. All content must be in perfect JSON format without any extra text.
`;

  // Test-specific customizations
  if (testName.toLowerCase().includes('adhd')) {
    promptTemplate += `\nFor ADHD assessment, include items that measure both inattention and hyperactivity/impulsivity domains. Include questions about functioning in different contexts (work, home, social).`;
  } 
  else if (testName.toLowerCase().includes('anxiety')) {
    promptTemplate += `\nFor anxiety assessment, include items measuring physical symptoms, cognitive patterns, and behavioral responses to anxiety. Cover various anxiety contexts.`;
  }
  else if (testName.toLowerCase().includes('iq') || testName.toLowerCase().includes('intelligence')) {
    promptTemplate += `\nFor IQ assessment, include a variety of question types: logical reasoning, pattern recognition, verbal comprehension, numerical reasoning, spatial visualization, and problem-solving.`;
  }
  else if (testName.toLowerCase().includes('emotional intelligence')) {
    promptTemplate += `\nFor emotional intelligence assessment, include items measuring self-awareness, self-regulation, motivation, empathy, and social skills. Balance items between self-perception and interpersonal dimensions.`;
  }
  else if (testName.toLowerCase().includes('temperament') || testName.toLowerCase().includes('personality')) {
    promptTemplate += `\nFor temperament assessment, include items measuring sociability, emotionality, activity level, and attention span/persistence. Consider both behaviors and tendencies across different situations.`;
  }

  return promptTemplate;
}

/**
 * Validate and enhance the generated test with additional metadata
 */
function validateAndEnhanceTest(quiz, testInfo) {
  // Validate quiz structure
  if (!quiz.metadata || !quiz.items || !quiz.scoring) {
    console.error("Generated quiz is missing required sections");
    return null;
  }
  
  // Check items and fix any issues
  if (!Array.isArray(quiz.items) || quiz.items.length === 0) {
    console.error("Quiz has no items or invalid items array");
    return null;
  }
  
  // Process each item to ensure correct format
  quiz.items = quiz.items.map((item, index) => {
    // Generate ID if missing
    if (!item.id) {
      const prefix = testInfo.domain.substring(0, 2).toUpperCase();
      item.id = `${prefix}${String(index + 1).padStart(2, '0')}`;
    }
    
    // Ensure domain exists
    if (!item.domain) {
      item.domain = testInfo.domain;
    }
    
    // Default reverse_scored to false if not specified
    if (item.reverse_scored === undefined) {
      item.reverse_scored = false;
    }
    
    // Ensure options are in the correct format
    if (Array.isArray(item.options)) {
      if (typeof item.options[0] === 'string') {
        // Convert string options to objects with values
        item.options = item.options.map((text, idx) => ({
          text,
          value: item.reverse_scored ? 4 - idx : idx
        }));
      } else {
        // Clean up option text by removing scoring annotations if present
        item.options = item.options.map(opt => {
          if (typeof opt === 'object' && opt.text) {
            return {
              ...opt,
              text: opt.text.replace(/\s*\(\d+\)$/, '') // Remove (4) style annotations
            };
          }
          return opt;
        });
      }
    } else {
      // Create default options if missing
      item.options = [
        { text: "Strongly Disagree", value: item.reverse_scored ? 4 : 0 },
        { text: "Disagree", value: item.reverse_scored ? 3 : 1 },
        { text: "Neutral", value: item.reverse_scored ? 2 : 2 },
        { text: "Agree", value: item.reverse_scored ? 1 : 3 },
        { text: "Strongly Agree", value: item.reverse_scored ? 0 : 4 }
      ];
    }
    
    return item;
  });
  
  // Add test metadata
  const enhancedQuiz = {
    id: testInfo.id,
    title: testInfo.title,
    image: testInfo.image,
    questions: quiz.items.length,
    duration: Math.ceil(quiz.items.length * 0.5), // Estimate duration (30 seconds per question)
    description: testInfo.description,
    ...quiz
  };
  
  return enhancedQuiz;
}

/**
 * Process a list of tests and generate detailed assessments for each
 */
async function processTests(testsList, options = {}) {
  const {
    outputDir = path.join(__dirname, '../data/generated_quizzes'),
    metadataFile = path.join(__dirname, '../data/tests.json'),
    concurrency = 1,
    delayBetweenRequests = 3000,
    verbose = true
  } = options;
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`Starting test generation for ${testsList.length} psychological assessments...`);
  const generatedTests = [];
  
  // Process tests in batches to respect API rate limits
  for (let i = 0; i < testsList.length; i += concurrency) {
    const batch = testsList.slice(i, i + concurrency);
    
    if (verbose) {
      console.log(`\nProcessing batch ${Math.floor(i/concurrency) + 1}/${Math.ceil(testsList.length/concurrency)} (${batch.length} tests):`);
    }
    
    const batchPromises = batch.map(async (test) => {
      try {
        const generatedTest = await generateTest(test);
        if (generatedTest) {
          // Save individual test file
          const fileName = test.title.toLowerCase().replace(/\s+/g, '_') + '_quiz.json';
          const filePath = path.join(outputDir, fileName);
          
          fs.writeFileSync(filePath, JSON.stringify(generatedTest, null, 2));
          console.log(`Saved ${test.title} test to ${filePath}`);
          
          return generatedTest;
        }
      } catch (error) {
        console.error(`Failed to process test: ${test.title}`, error);
      }
      return null;
    });
    
    // Wait for all tests in the batch to complete
    const batchResults = await Promise.all(batchPromises);
    
    // Add successful results to the collection
    batchResults.filter(Boolean).forEach(test => generatedTests.push(test));
    
    // Delay between batches to respect API rate limits
    if (i + concurrency < testsList.length) {
      if (verbose) {
        console.log(`Waiting ${delayBetweenRequests/1000}s before next batch...`);
      }
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
  
  // Save test metadata if tests were generated
  if (generatedTests.length > 0) {
    // Extract and format metadata for app consumption
    const metadata = generatedTests.map(test => ({
      id: test.id,
      title: test.title,
      image: test.image,
      questions: test.questions,
      duration: test.duration,
      description: test.description,
      metadata: test.metadata
    }));
    
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    console.log(`\nSaved metadata for ${metadata.length} tests to ${metadataFile}`);
  } else {
    console.error("\nNo tests were successfully generated.");
  }
  
  return generatedTests;
}

/**
 * Main function to generate psychological tests
 */
async function main() {
  // Define test information with appropriate domains and descriptions
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
    // Generate tests with custom options
    await processTests(tests, {
      outputDir: path.join(__dirname, '../data/generated_quizzes'),
      metadataFile: path.join(__dirname, '../data/tests.json'),
      concurrency: 1,
      delayBetweenRequests: 3000,
      verbose: true
    });
    
    console.log("All tests generated successfully!");
  } catch (error) {
    console.error("Error in test generation process:", error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  generateTest,
  processTests,
  main
}; 