import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import time
import random
from urllib.parse import urljoin
import ssl
import re
from typing import List, Dict
import os



# Configure base settings
BASE_URL = "https://www.goodreads.com"
OUTPUT_FILE = "goodreads_books_parallel.json"
REQUEST_DELAY = (1, 3)  # Increased delay range
BOOKS_PER_PAGE = 50
MAX_CONCURRENT_REQUESTS = 30  
MAX_RETRIES = 5  # Increased retries
RETRY_DELAY = (2, 5)  # Random delay range for retries
SAVE_INTERVAL = 500  # Save progress every 500 books

# Expanded genre list with book counts
GENRES = {
    "self-help": 1500,
    "motivational": 1000,
    "personal-growth": 1000,
    "self-improvement": 1000,
    "mindfulness": 1000,
    "positive-thinking": 1000,
    "life-coaching": 1000,
    "business": 1000,
    "entrepreneurship": 1000,
    "biographies": 1000,
    "psychology": 1000,
    "mental-health": 1000,
    "cognitive-science": 1000,
    "history": 1000,
    "philosophy": 1000,
    "ethics": 1000,
    "science": 1000,
    "political-science": 1000,
    "technology": 1000,
    "art": 1000,
    "biography": 1000,
    "christian": 1000,
    "classics": 1000,
    "contemporary": 1000,
    "crime": 1000,
    "historical-fiction": 1000,
    "manga": 1000,
    "music": 1000,
    "paranormal": 1000,
    "poetry": 1000,
    "religion": 1000,
    "romance": 1000,
    "science-fiction": 1000,
    "spirituality": 1000,
    "sports": 1000,
    "thriller": 1000,
    "suspense": 1000,
    "leadership": 1000,
    "productivity": 1000,
    "finance": 1000,
    "economics": 1000,
    "education": 1000,
    "health": 1000,
    "fitness": 1000,
    "cooking": 1000,
    "parenting": 1000,
    "relationships": 1000,
    "travel": 1000
}

# Create a semaphore for limiting concurrent requests
semaphore = None

def calculate_delay(error_count):
    """Calculate dynamic delay based on error count"""
    base_delay = random.uniform(*REQUEST_DELAY)
    return base_delay * (1 + error_count * 0.5)  # Increase delay with more errors

async def fetch_page(session, url, retries=MAX_RETRIES, error_count=0):
    """Fetch a page with dynamic delays and exponential backoff"""
    full_url = urljoin(BASE_URL, url)
    
    # Calculate dynamic delay
    delay = calculate_delay(error_count)
    await asyncio.sleep(delay)
    
    for attempt in range(retries):
        try:
            # Create a custom SSL context
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            
            # Use semaphore to limit concurrent requests
            async with semaphore:
                async with session.get(full_url, ssl=ssl_context, timeout=30) as response:
                    if response.status == 200:
                        return await response.text()
                    elif response.status == 404:
                        print(f"Page not found: {full_url}")
                        return None
                    else:
                        print(f"Error {response.status} for {full_url} (attempt {attempt + 1}/{retries})")
                        if attempt < retries - 1:
                            # Exponential backoff
                            await asyncio.sleep(random.uniform(*RETRY_DELAY) * (2 ** attempt))
                        return None
        except Exception as e:
            print(f"Failed to fetch {full_url} (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                # Exponential backoff
                await asyncio.sleep(random.uniform(*RETRY_DELAY) * (2 ** attempt))
    return None

async def fetch_page_with_cache(session, url, cache={}):
    """Fetch a page with caching"""
    if url in cache:
        return cache[url]
    
    result = await fetch_page(session, url)
    if result:
        cache[url] = result
    return result

async def parse_book_list(html, genre) -> List[Dict]:
    """Extract book information from the shelf page"""
    soup = BeautifulSoup(html, 'html.parser')
    books = []
    
    # Find all book elements
    for book_element in soup.select('.elementList'):
        try:
            # Extract title and subtitle
            title_element = book_element.select_one('.bookTitle')
            if not title_element:
                continue
                
            full_title = title_element.text.strip()
            
            # Clean title by removing parentheses content
            full_title = re.sub(r'\s*\([^)]*\)', '', full_title).strip()
            
            # Split title and subtitle
            if ":" in full_title:
                title, subtitle = full_title.split(":", 1)
                title = title.strip()
                subtitle = subtitle.strip()
            else:
                title = full_title
                subtitle = "N/A"
            
            # Clean subtitle by removing parentheses content
            if subtitle != "N/A":
                subtitle = re.sub(r'\s*\([^)]*\)', '', subtitle).strip()
            
            # Extract author
            author_element = book_element.select_one('.authorName span')
            author = author_element.text.strip() if author_element else "N/A"
            
            # Extract number of ratings
            ratings_text = book_element.select_one('.greyText.smallText')
            num_ratings = "N/A"
            if ratings_text:
                ratings_text = ratings_text.text.strip()
                if '—' in ratings_text:
                    num_ratings = ratings_text.split('—')[1].strip().split(' ')[0].replace(',', '')
            
            # Extract publication year
            pub_year = "N/A"
            if ratings_text and 'published' in ratings_text:
                pub_year = ratings_text.split('published')[-1].strip()
            
            # Extract book URL
            book_url = None
            link_element = book_element.select_one('.leftAlignedImage')
            if link_element:
                book_url = urljoin(BASE_URL, link_element['href'])
            
            # Create unique identifier
            unique_id = f"{title.lower()}_{author.lower()}_{genre}"
            
            books.append({
                "unique_id": unique_id,
                "Title": title,
                "Image": "N/A",
                "Subtitle": subtitle,
                "Abstract": "N/A",
                "Author Name": author,
                "Author Description": "N/A",
                "Genres": [],
                "Chapters": "N/A",
                "num_ratings": num_ratings,
                "rating": "N/A",
                "url": book_url,
                "genre": genre
            })
        except Exception as e:
            print(f"Error parsing book element: {e}")
            continue
    
    return books

async def fetch_book_details(session, book):
    """Fetch additional details from individual book page"""
    if not book['url'] or book['url'] == "N/A":
        return book
    
    try:
        html = await fetch_page(session, book['url'])
        if not html:
            return book
            
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extract abstract
        abstract_element = soup.select_one('[data-testid="description"]')
        if abstract_element:
            book['Abstract'] = abstract_element.text.strip()
        
        # Extract image URL
        image_element = soup.select_one('.ResponsiveImage')
        if image_element and 'src' in image_element.attrs:
            book['Image'] = image_element['src']
            
        # Extract rating
        rating_element = soup.select_one('.RatingStatistics__rating')
        if rating_element:
            book['rating'] = rating_element.text.strip()
            
        # Extract genres (excluding the "...more" button)
        genres_list = soup.select('[data-testid="genresList"] .Button--tag .Button__labelItem')
        if genres_list:
            book['Genres'] = [genre.text.strip() for genre in genres_list 
                            if genre.text.strip().lower() != "...more"]
            
        # Extract author description
        author_desc_element = soup.select_one('.PageSection .DetailsLayoutRightParagraph .Formatted')
        if author_desc_element:
            description = author_desc_element.text.strip()
            
            if "Librarian Note:" in description:
                parts = description.split("Librarian Note:")
                if len(parts) > 1:
                    description = parts[0].strip()
                    description = description.split("\n\n")[0].strip()
            
            description = " ".join(description.split())
            book['Author Description'] = description
            
    except Exception as e:
        print(f"Error fetching details for {book['Title']}: {e}")
    
    return book

async def process_page(session, genre, page_num, progress_counter, all_books, cache={}):
    """Process a single page of results with caching"""
    url = f"/shelf/show/{genre}?page={page_num}"
    print(f"Fetching {url}")
    html = await fetch_page_with_cache(session, url, cache)
    
    if not html:
        print(f"Skipping {genre} page {page_num} due to error")
        return []
    
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Check if page contains books
        book_elements = soup.select('.elementList')
        if not book_elements:
            print(f"No books found on {genre} page {page_num}")
            return []
        
        books = await parse_book_list(html, genre)
        
        # Filter out duplicates before processing details
        unique_books = []
        seen_ids = set()
        for book in books:
            if book['unique_id'] not in seen_ids:
                seen_ids.add(book['unique_id'])
                unique_books.append(book)
        
        # Process book details in parallel
        tasks = [fetch_book_details(session, book) for book in unique_books]
        results = await asyncio.gather(*tasks)
        
        # Update progress counter
        progress_counter['processed'] += len(results)
        log_progress(progress_counter['total'], progress_counter['processed'], 
                    progress_counter['start_time'], genre)
        
        # Extend all_books and save periodically
        all_books.extend(results)
        if progress_counter['processed'] % SAVE_INTERVAL == 0:
            save_progress(all_books)
            
        return results
    except Exception as e:
        print(f"Error processing {genre} page {page_num}: {e}")
        return []

def log_progress(total_books: int, processed_books: int, start_time: float, genre: str):
    """Log progress every 50 books with more details"""
    if processed_books % 50 == 0 or processed_books == total_books:
        elapsed_time = time.time() - start_time
        books_per_minute = (processed_books / elapsed_time) * 60 if elapsed_time > 0 else 0
        remaining_books = total_books - processed_books
        estimated_time_remaining = (remaining_books / books_per_minute) if books_per_minute > 0 else 0
        
        print(f"\n{genre.upper()} PROGRESS:")
        print(f"  Processed: {processed_books}/{total_books} books ({(processed_books/total_books)*100:.1f}%)")
        print(f"  Speed: {books_per_minute:.1f} books/min")
        print(f"  Elapsed time: {elapsed_time/60:.1f} minutes")
        print(f"  Estimated time remaining: {estimated_time_remaining:.1f} minutes")
        print("-" * 50)

def save_progress(books: List[Dict], filename=None):
    """Save current progress to a temporary file"""
    if not filename:
        filename = f"temp_{OUTPUT_FILE}"
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(books, f, indent=2, ensure_ascii=False)
        print(f"Progress saved: {len(books)} books to {filename}")
    except Exception as e:
        print(f"Error saving progress: {e}")

async def process_genre(session, genre, max_books, all_books):
    """Process a single genre"""
    genre_start_time = time.time()
    print(f"\nSTARTING GENRE: {genre.upper()}")
    print(f"Books to scrape: {max_books}")
    
    # Initialize progress counter for this genre
    progress_counter = {
        'total': max_books,
        'processed': 0,
        'start_time': genre_start_time
    }
    
    try:
        page_num = 1
        genre_books = []
        seen_ids = set()
        
        while len(genre_books) < max_books:
            print(f"Processing {genre} page {page_num}")
            results = await process_page(session, genre, page_num, progress_counter, all_books)
            
            # Add unique books to genre_books
            for book in results:
                if book['unique_id'] not in seen_ids:
                    seen_ids.add(book['unique_id'])
                    genre_books.append(book)
                    if len(genre_books) >= max_books:
                        break
            
            # Check if we should continue
            if not results or len(results) < BOOKS_PER_PAGE:
                break
                
            page_num += 1
        
        # Print genre statistics
        genre_time = time.time() - genre_start_time
        print(f"\nCOMPLETED GENRE: {genre.upper()}")
        print(f"  Total unique books scraped: {len(genre_books)}")
        print(f"  Time taken: {genre_time/60:.1f} minutes")
        print(f"  Average speed: {(len(genre_books)/genre_time)*60:.1f} books/min")
        print("=" * 50)
        
        return genre_books
    except Exception as e:
        print(f"\nERROR PROCESSING GENRE {genre.upper()}: {e}")
        print(f"Skipping to next genre...")
        print("=" * 50)
        return []

async def main():
    """Main execution function"""
    global semaphore
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    
    start_time = time.time()
    all_books = []
    book_index = 1  # Initialize book index
    
    print(f"\nSTARTING SCRAPER")
    print(f"Total genres to process: {len(GENRES)}")
    print(f"Total books to scrape: {sum(GENRES.values())}")
    print(f"Maximum concurrent requests: {MAX_CONCURRENT_REQUESTS}")
    print(f"Request delay range: {REQUEST_DELAY} seconds")
    print(f"Max retries per request: {MAX_RETRIES}")
    print("=" * 50)
    
    # Create a ClientSession with optimized settings
    conn = aiohttp.TCPConnector(limit=0, ttl_dns_cache=300)
    timeout = aiohttp.ClientTimeout(total=60)
    
    async with aiohttp.ClientSession(connector=conn, timeout=timeout) as session:
        # Process each genre sequentially to avoid overwhelming the server
        for genre, max_books in GENRES.items():
            genre_books = await process_genre(session, genre, max_books, all_books)
            
            # Add index to each book
            for book in genre_books:
                book['index'] = book_index
                book_index += 1
            
            all_books.extend(genre_books)
            
            # Save progress after each genre
            save_progress(all_books)
        
        # Save final results
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_books, f, indent=2, ensure_ascii=False)
        
        # Print final statistics
        total_time = time.time() - start_time
        print(f"\nTOTAL SCRAPING COMPLETED")
        print(f"  Total books processed: {len(all_books)}")
        print(f"  Total time taken: {total_time/60:.1f} minutes")
        print(f"  Overall average speed: {(len(all_books)/total_time)*60:.1f} books/min")
        print(f"  Results saved to: {OUTPUT_FILE}")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main()) 