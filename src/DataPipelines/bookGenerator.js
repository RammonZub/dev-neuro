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
    // Advanced, fine-tuned prompt for unique and high-quality book summaries
    const prompt = `
As a literary expert with deep knowledge of book analysis, your task is to create a comprehensive, unique summary for "${bookInfo.title}" by ${bookInfo.author}.

I need a detailed JSON output with the following structure:
{
  "title": "${bookInfo.title}",
  "subtitle": "A compelling and relevant subtitle that captures the essence of the book",
  "author": "${bookInfo.author}",
  "rating": "A realistic rating out of 5 (e.g., '4.34')",
  "num_ratings": "A realistic number of ratings (e.g., '104854')",
  "publication_year": "The year this book was published",
  "abstract": "A 150-200 word compelling overview of the book that captures its main thesis, approach, and value proposition. This should be written in a professional, publisher-quality style.",
  "image_url": "A valid URL to an image of the book cover (placeholder or actual)",
  "genres": ["Primary Genre", "Secondary Genre", "Tertiary Genre", "Additional Genre", "Additional Genre"],
  "author_description": "A 3-4 sentence biography of the author, highlighting their credentials, background, and notable achievements relevant to the book's subject matter.",
  "source_list": "Best Self Help Books",
  "index": ${bookInfo.index || 0},
  "is_self_help": ${bookInfo.genres?.includes("Self Help") || false},
  "chapters": [
    {
      "chapter_number": 1,
      "title": "Chapter 1 Title - Capturing Key Concept",
      "summary": "A 120-150 word detailed summary of this chapter's core concepts. This should feel like a professional book summary, with specific insights, examples, and takeaways from this section of the book. Write in a tone that matches the book's style.\n\nThe second paragraph should expand on these ideas with additional context or examples, ensuring readers understand the practical applications or theoretical foundations presented in this chapter."
    },
    {
      "chapter_number": 2, 
      "title": "Chapter 2 Title - Next Major Concept",
      "summary": "A distinct summary for this chapter with its own style and approach. Avoid patterns or templated language from other chapters. Include specific concepts and ideas from this section of the book with original phrasing and structure.\n\nThe second paragraph should provide further elaboration that feels unique to this chapter, using varied sentence lengths and structures to maintain a natural, engaging flow."
    },
    {
      "chapter_number": 3,
      "title": "Chapter 3 Title - Another Core Theme",
      "summary": "A summary written with different sentence structures and vocabulary than previous chapters. This text should have its own rhythm and tone while remaining faithful to the book's content and style.\n\nUse specific examples or frameworks from this section of the book, ensuring this does not follow the same pattern as other chapter summaries."
    },
    {
      "chapter_number": 4,
      "title": "Chapter 4 Title - Additional Important Theme",
      "summary": "Begin with a distinctive approach to summarizing this chapter. Consider using a different paragraph structure or narrative technique to ensure uniqueness.\n\nThe second paragraph should complement the first while maintaining the distinct voice established for this chapter summary."
    },
    {
      "chapter_number": 5,
      "title": "Chapter 5 Title - Final Key Concept",
      "summary": "Use a different narrative approach for this chapter summary, perhaps focusing on broader implications or practical applications to distinguish it from earlier summaries.\n\nThe closing paragraph should provide satisfying closure while maintaining the unique style of this particular chapter summary."
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Each chapter summary MUST be unique in tone, sentence structure, and phrasing. Avoid repetitive patterns or templated language across chapters.
2. Total content should be approximately 600 words across all chapter summaries.
3. Chapter titles should reflect actual content from the book, not generic placeholders.
4. Match the writing style to the book's genre and author's voice.
5. Ensure accuracy of information - only include verifiable content from the book.
6. Create content that feels like it was written by a human literary expert, not AI-generated.
7. Use natural language with varied sentence structures, avoiding formulaic writing.
`;

    // Use advanced parameters for optimal results
    const response = await client.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-1106-preview", // Using the most advanced model for highest quality
      messages: [
        { 
          role: "system", 
          content: "You are a professional literary analyst and content creator specializing in book summaries. Your expertise is in creating unique, engaging summaries that capture the essence of books while maintaining distinctive writing styles across different sections."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8, // Higher temperature for greater creativity and uniqueness
      max_tokens: 4000, // Allow sufficient tokens for detailed summaries
      top_p: 0.95, // Slightly narrowed sampling for quality control
      frequency_penalty: 0.5, // Reduce repetition of phrases
      presence_penalty: 0.5 // Encourage diversity in content
    });

    let bookData;
    try {
      bookData = JSON.parse(response.data.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Extract JSON if it's embedded in markdown or other text
      const jsonMatch = response.data.choices[0].message.content.match(/```json\n([\s\S]*?)\n```/) || 
                        response.data.choices[0].message.content.match(/{[\s\S]*}/);
      if (jsonMatch) {
        bookData = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
      } else {
        throw new Error("Could not parse JSON from response");
      }
    }
    
    // Validate and clean the data
    bookData = validateAndCleanBookData(bookData, bookInfo);
    
    return bookData;
  } catch (error) {
    console.error(`Error generating summary for ${bookInfo.title}:`, error);
    throw error;
  }
}

/**
 * Validate and clean the book data to ensure all fields are properly formatted
 */
function validateAndCleanBookData(bookData, originalInfo) {
  // Ensure all required fields exist
  const requiredFields = ['title', 'subtitle', 'author', 'abstract', 'genres', 'chapters'];
  for (const field of requiredFields) {
    if (!bookData[field]) {
      bookData[field] = field === 'genres' ? [] : field === 'chapters' ? [] : 'Not available';
    }
  }
  
  // Ensure proper structure for chapters
  if (bookData.chapters && Array.isArray(bookData.chapters)) {
    bookData.chapters = bookData.chapters.map((chapter, index) => ({
      chapter_number: chapter.chapter_number || index + 1,
      title: chapter.title || `Chapter ${index + 1}`,
      summary: chapter.summary || 'No summary available'
    }));
  } else {
    bookData.chapters = [];
  }
  
  // Set default values for missing fields
  bookData.rating = bookData.rating || '4.0';
  bookData.num_ratings = bookData.num_ratings || '1000';
  bookData.publication_year = bookData.publication_year || '2023';
  bookData.image_url = bookData.image_url || `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(bookData.title)}`;
  bookData.author_description = bookData.author_description || `Author of ${bookData.title} and other works.`;
  bookData.source_list = bookData.source_list || 'Best Self Help Books';
  bookData.index = bookData.index || originalInfo.index || 0;
  bookData.is_self_help = bookData.is_self_help || originalInfo.genres?.includes("Self Help") || false;
  
  return bookData;
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
 * @param {Object} options - Configuration options
 */
async function processBooks(booksList, options = {}) {
  const {
    outputFile = path.join(__dirname, '../data/top_5_books.json'),
    concurrency = 1,
    delayBetweenRequests = 2000,
    verbose = true
  } = options;
  
  console.log(`Starting book generation for ${booksList.length} books...`);
  const results = [];
  
  // Process books in batches to respect API rate limits
  for (let i = 0; i < booksList.length; i += concurrency) {
    const batch = booksList.slice(i, i + concurrency);
    if (verbose) {
      console.log(`\nProcessing batch ${Math.floor(i/concurrency) + 1}/${Math.ceil(booksList.length/concurrency)} (${batch.length} books):`);
    }
    
    const batchPromises = batch.map(async (book, batchIndex) => {
      try {
        if (verbose) {
          console.log(`- [${i + batchIndex + 1}/${booksList.length}] Generating summary for "${book.title}" by ${book.author}...`);
        }
        
        const startTime = Date.now();
        const bookData = await generateBookSummary({
          ...book,
          index: i + batchIndex
        });
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        if (verbose) {
          console.log(`  ✓ Completed in ${duration}s: "${book.title}" (${bookData.chapters.length} chapters, ${countWords(bookData)} words)`);
        }
        
        return bookData;
      } catch (error) {
        console.error(`  ✗ Failed: "${book.title}": ${error.message}`);
        return null;
      }
    });
    
    // Wait for all books in the batch to be processed
    const batchResults = await Promise.all(batchPromises);
    
    // Filter out failed requests and add successful ones to results
    batchResults.filter(Boolean).forEach(book => results.push(book));
    
    // Wait between batches to respect API rate limits
    if (i + concurrency < booksList.length) {
      if (verbose) {
        console.log(`Waiting ${delayBetweenRequests/1000}s before next batch...`);
      }
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
  
  // Save results to file
  if (results.length > 0) {
    // Create directory if it doesn't exist
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\nSuccessfully generated ${results.length} book summaries.`);
    console.log(`Output saved to: ${outputFile}`);
  } else {
    console.error("\nNo book summaries were successfully generated.");
  }
  
  return results;
}

/**
 * Count total words in a book summary
 */
function countWords(book) {
  let words = 0;
  if (book.abstract) {
    words += book.abstract.split(/\s+/).length;
  }
  if (book.chapters && Array.isArray(book.chapters)) {
    book.chapters.forEach(chapter => {
      if (chapter.summary) {
        words += chapter.summary.split(/\s+/).length;
      }
    });
  }
  return words;
}

/**
 * Main function to generate book summaries
 */
async function main() {
  // Define a diverse list of book titles and authors to process
  // This selection covers various self-help topics and popular literature
  const books = [
    { 
      title: "Atomic Habits", 
      author: "James Clear", 
      genres: ["Self Help", "Productivity", "Psychology"]
    },
    { 
      title: "12 Rules for Life", 
      author: "Jordan B. Peterson", 
      genres: ["Self Help", "Philosophy", "Psychology"]
    },
    { 
      title: "Thinking, Fast and Slow", 
      author: "Daniel Kahneman", 
      genres: ["Psychology", "Behavioral Economics", "Self Help"]
    },
    { 
      title: "The Power of Now", 
      author: "Eckhart Tolle", 
      genres: ["Spirituality", "Self Help", "Philosophy"]
    },
    { 
      title: "48 Laws Of Confidence", 
      author: "Ricky St Julien II", 
      genres: ["Self Help", "Psychology", "Personal Development"]
    }
  ];
  
  try {
    // Process books with custom options
    await processBooks(books, {
      outputFile: path.join(__dirname, '../data/top_5_books.json'),
      concurrency: 1,
      delayBetweenRequests: 3000,
      verbose: true
    });
  } catch (error) {
    console.error("Failed to generate book summaries:", error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  generateBookSummary,
  processBooks,
  main
}; 