import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import time
import random
from urllib.parse import urljoin
import ssl
import re

# Configure base settings
BASE_URL = "https://www.goodreads.com"
LIST_URL = "/shelf/show/self-help"
OUTPUT_FILE = "goodreads_self_help_books.json"
REQUEST_DELAY = (1, 3)  # Random delay between requests (seconds)

# Add new constant for max pages
MAX_PAGES = 25

async def fetch_page(session, url):
    """Fetch a page with proper delays and error handling"""
    full_url = urljoin(BASE_URL, url)
    delay = random.uniform(*REQUEST_DELAY)
    await asyncio.sleep(delay)
    
    try:
        # Create a custom SSL context
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        async with session.get(full_url, ssl=ssl_context) as response:
            if response.status == 200:
                return await response.text()
            else:
                print(f"Error {response.status} for {full_url}")
                return None
    except Exception as e:
        print(f"Failed to fetch {full_url}: {e}")
        return None

async def parse_book_list(html):
    """Extract book information from the self-help shelf page"""
    soup = BeautifulSoup(html, 'html.parser')
    books = []
    
    # Find all book elements
    book_elements = soup.select('.elementList')
    
    # If no book elements found, return empty list
    if not book_elements:
        return [], None
    
    for book_element in book_elements:
        try:
            # Extract title and subtitle
            title_element = book_element.select_one('.bookTitle')
            full_title = title_element.text.strip() if title_element else "N/A"
            
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
            
            books.append({
                "title": title,
                "subtitle": subtitle,
                "author": author,
                "rating": "N/A",
                "num_ratings": num_ratings,
                "publication_year": pub_year,
                "url": book_url,
                "abstract": "N/A",
                "image_url": "N/A",
                "genres": []
            })
        except Exception as e:
            print(f"Error parsing book element: {e}")
            continue
    
    # No need to find next page link in HTML
    return books, None

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
            book['abstract'] = abstract_element.text.strip()
        
        # Extract image URL
        image_element = soup.select_one('.ResponsiveImage')
        if image_element and 'src' in image_element.attrs:
            book['image_url'] = image_element['src']
            
        # Extract rating
        rating_element = soup.select_one('.RatingStatistics__rating')
        if rating_element:
            book['rating'] = rating_element.text.strip()
            
        # Extract genres (excluding the "...more" button)
        genres_list = soup.select('[data-testid="genresList"] .Button--tag .Button__labelItem')
        if genres_list:
            book['genres'] = [genre.text.strip() for genre in genres_list 
                            if genre.text.strip().lower() != "...more"]
            
        # Extract author description using the more specific selector
        author_desc_element = soup.select_one('.PageSection .DetailsLayoutRightParagraph .Formatted')
        if author_desc_element:
            # Get the text and clean it up
            description = author_desc_element.text.strip()
            
            # Remove the entire Librarian Note sentence if present
            if "Librarian Note:" in description:
                # Split on "Librarian Note:" and take everything before it
                parts = description.split("Librarian Note:")
                if len(parts) > 1:
                    # Remove everything after "Librarian Note:" including the note itself
                    description = parts[0].strip()
                    # Also remove any trailing sentence that might be left
                    description = description.split("\n\n")[0].strip()
            
            # Remove any extra spaces or newlines
            description = " ".join(description.split())
            book['author_description'] = description
        else:
            book['author_description'] = "N/A"
            
    except Exception as e:
        print(f"Error fetching details for {book['title']}: {e}")
    
    return book

async def save_results(books):
    """Save results to JSON file"""
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(books)} books to {OUTPUT_FILE}")

async def main():
    """Main execution function"""
    start_time = time.time()
    all_books = []
    page_count = 0
    
    async with aiohttp.ClientSession() as session:
        while page_count < MAX_PAGES:
            page_count += 1
            # Construct URL directly
            current_url = f"/shelf/show/self-help?page={page_count}" if page_count > 1 else LIST_URL
            print(f"Fetching page {page_count}: {current_url}")
            
            html = await fetch_page(session, current_url)
            
            if not html:
                print(f"Failed to fetch page {page_count}: {current_url}")
                break
                
            # Parse the page
            books, _ = await parse_book_list(html)
            
            # If no books found, stop scraping
            if not books:
                print("No books found on page, stopping scraping")
                break
                
            all_books.extend(books)
            
            # Add delay between page requests
            await asyncio.sleep(random.uniform(*REQUEST_DELAY))
        
        if all_books:
            # Fetch additional details for each book
            print("Fetching individual book details...")
            all_books = await asyncio.gather(*[fetch_book_details(session, book) for book in all_books])
            
            # Save results
            await save_results(all_books)
            
            # Calculate and print total time
            total_time = time.time() - start_time
            print(f"Scraping completed in {total_time:.2f} seconds")
            print(f"Total books scraped: {len(all_books)}")
            print(f"Total pages scraped: {page_count}")
        else:
            print("No books were scraped")

if __name__ == "__main__":
    asyncio.run(main())