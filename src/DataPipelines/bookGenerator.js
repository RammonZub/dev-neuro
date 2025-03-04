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
 * Generate a book summary with chapters using OpenAI API
 * @param {Object} bookInfo - Basic book information
 * @returns {Object} - Complete book object with chapters
 */
async function generateBookSummary(bookInfo) {
  try {
    const prompt = `
Generate a detailed summary for the book "${bookInfo.title}" by ${bookInfo.author}.

The response should be in JSON format with the following structure:
{
  "title": "${bookInfo.title}",
  "subtitle": "A compelling subtitle for the book",
  "author": "${bookInfo.author}",
  "author_description": "A brief biography of the author (2-3 sentences)",
  "publication_year": "The year the book was published",
  "rating": "A rating out of 5 stars (e.g., '4.5/5')",
  "num_ratings": "An estimated number of ratings (e.g., '2.3k')",
  "abstract": "A 2-3 sentence overview of what the book is about",
  "genres": ["Genre 1", "Genre 2", "Genre 3"],
  "image_url": "A placeholder URL for the book cover",
  "chapters": [
    {
      "title": "Chapter 1 Title",
      "content": ["A paragraph summarizing key points", "Another paragraph with insights"]
    },
    {
      "title": "Chapter 2 Title",
      "content": ["A paragraph summarizing key points", "Another paragraph with insights"]
    },
    {
      "title": "Chapter 3 Title",
      "content": ["A paragraph summarizing key points", "Another paragraph with insights"]
    },
    {
      "title": "Chapter 4 Title",
      "content": ["A paragraph summarizing key points", "Another paragraph with insights"]
    },
    {
      "title": "Chapter 5 Title",
      "content": ["A paragraph summarizing key points", "Another paragraph with insights"]
    }
  ]
}

Make sure the chapters contain unique insights and avoid repetitive language patterns. The total content should be approximately 600 words.
`;

    const response = await client.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a literary expert who creates detailed book summaries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const bookData = JSON.parse(response.data.choices[0].message.content);
    
    // Add additional metadata
    bookData.id = generateUniqueId();
    bookData.index = bookInfo.index || 0;
    bookData.is_self_help = bookInfo.genres?.includes("Self-Help") || false;
    bookData.readingTime = `${Math.floor(Math.random() * 10) + 5} min`;
    
    return bookData;
  } catch (error) {
    console.error(`Error generating summary for ${bookInfo.title}:`, error);
    throw error;
  }
}

/**
 * Generate a unique ID for a book
 */
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Process a list of books and generate summaries
 * @param {Array} booksList - List of books with title and author
 */
async function processBooks(booksList) {
  const results = [];
  
  for (let i = 0; i < booksList.length; i++) {
    console.log(`Processing book ${i+1}/${booksList.length}: ${booksList[i].title}`);
    try {
      const bookData = await generateBookSummary({
        ...booksList[i],
        index: i
      });
      results.push(bookData);
      
      // Add a delay to avoid rate limiting
      if (i < booksList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to process book: ${booksList[i].title}`);
    }
  }
  
  return results;
}

/**
 * Main function to generate book summaries
 */
async function main() {
  // Sample list of books to process
  const books = [
    { title: "Atomic Habits", author: "James Clear", genres: ["Self-Help", "Productivity"] },
    { title: "The Psychology of Money", author: "Morgan Housel", genres: ["Finance", "Psychology"] },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genres: ["Psychology", "Behavioral Economics"] },
    { title: "Deep Work", author: "Cal Newport", genres: ["Self-Help", "Productivity"] },
    { title: "The Power of Now", author: "Eckhart Tolle", genres: ["Spirituality", "Self-Help"] }
  ];
  
  try {
    const processedBooks = await processBooks(books);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../data/books.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedBooks, null, 2));
    
    console.log(`Successfully generated ${processedBooks.length} book summaries.`);
    console.log(`Output saved to: ${outputPath}`);
  } catch (error) {
    console.error("Failed to generate book summaries:", error);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  generateBookSummary,
  processBooks
}; 