"""
Goodreads Book Scraper

This script scrapes multiple book lists from Goodreads, including:
1. Best Self Help Books (20 pages)
2. Motivational and Self-Improvement Books (5 pages)
3. Inspiring Books (5 pages)
4. Self Help Books for Smart People (5 pages)
5. 1001 Books You Must Read Before You Die (5 pages)
6. Best Biographies (5 pages)
7. Best History Books (5 pages)
8. I'm glad someone made me read this book (5 pages)

For each book, it collects basic information from the list page and then
visits the individual book page to gather detailed information including
description, genres, publication year, and more.
"""

import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import time
import random
from urllib.parse import urljoin
import ssl
import re
import os
from datetime import datetime

# Configure base settings
BASE_URL = "https://www.goodreads.com"
OUTPUT_FILE = "goodreads_books_collection.json"
REQUEST_DELAY = (1, 3)  # Random delay between requests (seconds)
MAX_CONCURRENT_REQUESTS = 5  # Limit concurrent requests to avoid being blocked

# Define lists to scrape with their page limits
LISTS_TO_SCRAPE = [
    {"url": "/list/show/691.Best_Self_Help_Books", "name": "Best Self Help Books", "pages": 20},
    {"url": "/list/show/7616.Motivational_and_Self_Improvement_Books", "name": "Motivational and Self-Improvement Books", "pages": 5},
    {"url": "/list/show/41846.Inspiring_Books", "name": "Inspiring Books", "pages": 5},
    {"url": "/list/show/89952.Self_Help_Books_for_Smart_People", "name": "Self Help Books for Smart People", "pages": 5},
    {"url": "/list/show/952.1001_Books_You_Must_Read_Before_You_Die", "name": "1001 Books You Must Read Before You Die", "pages": 5},
    {"url": "/list/show/29013.Best_Biographies_", "name": "Best Biographies", "pages": 5},
    {"url": "/list/show/1362.Best_History_Books_", "name": "Best History Books", "pages": 5},
    {"url": "/list/show/1190.I_m_glad_someone_made_me_read_this_book", "name": "I'm glad someone made me read this book", "pages": 5}
]

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
        
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        async with session.get(full_url, ssl=ssl_context, headers=headers) as response:
            if response.status == 200:
                return await response.text()
            else:
                print(f"Error {response.status} for {full_url}")
                return None
    except Exception as e:
        print(f"Failed to fetch {full_url}: {e}")
        return None

async def parse_book_list(html, list_name):
    """Extract book information from the book list page"""
    soup = BeautifulSoup(html, 'html.parser')
    books = []
    
    # Find all book elements - adjust selector for the list page
    book_elements = soup.select('tr[itemtype="http://schema.org/Book"]')
    
    # If no book elements found, return empty list
    if not book_elements:
        print(f"No book elements found in {list_name}. HTML structure might have changed.")
        return [], None
    
    for book_element in book_elements:
        try:
            # Extract title
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
            author_element = book_element.select_one('.authorName')
            author = author_element.text.strip() if author_element else "N/A"
            
            # Extract rating
            rating_element = book_element.select_one('.minirating')
            rating = "N/A"
            num_ratings = "N/A"
            if rating_element:
                rating_text = rating_element.text.strip()
                # Extract rating and number of ratings
                rating_match = re.search(r'(\d+\.\d+)', rating_text)
                if rating_match:
                    rating = rating_match.group(1)
                
                # Extract number of ratings
                num_ratings_match = re.search(r'(\d+,?\d*) ratings', rating_text)
                if num_ratings_match:
                    num_ratings = num_ratings_match.group(1).replace(',', '')
            
            # Extract book URL
            book_url = None
            link_element = book_element.select_one('.bookTitle')
            if link_element and link_element.has_attr('href'):
                book_url = urljoin(BASE_URL, link_element['href'])
            
            books.append({
                "title": title,
                "subtitle": subtitle,
                "author": author,
                "rating": rating,
                "num_ratings": num_ratings,
                "publication_year": "N/A",  # Will be populated from individual page
                "url": book_url,
                "abstract": "N/A",  # Will be populated from individual page
                "image_url": "N/A",  # Will be populated from individual page
                "genres": [],  # Will be populated from individual page
                "source_list": list_name  # Add the source list name
            })
        except Exception as e:
            print(f"Error parsing book element in {list_name}: {e}")
            continue
    
    # Find next page link
    next_page = None
    pagination = soup.select_one('.pagination')
    if pagination:
        next_link = pagination.select_one('a.next_page')
        if next_link and next_link.has_attr('href'):
            next_page = next_link['href']
    
    return books, next_page

async def fetch_book_details(session, book, semaphore):
    """Fetch additional details from individual book page with rate limiting"""
    if not book['url'] or book['url'] == "N/A":
        return book
    
    async with semaphore:  # Use semaphore to limit concurrent requests
        try:
            print(f"Fetching details for: {book['title']}")
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
            
            # Extract publication year
            pub_info = soup.select_one('[data-testid="publicationInfo"]')
            if pub_info:
                pub_text = pub_info.text.strip()
                year_match = re.search(r'(\d{4})', pub_text)
                if year_match:
                    book['publication_year'] = year_match.group(1)
                
            # Extract genres (excluding the "...more" button)
            genres_list = soup.select('[data-testid="genresList"] .Button--tag .Button__labelItem')
            if genres_list:
                book['genres'] = [genre.text.strip() for genre in genres_list 
                                if genre.text.strip().lower() != "...more"]
                
            # Extract author description
            author_desc_element = soup.select_one('.PageSection .DetailsLayoutRightParagraph .Formatted')
            if author_desc_element:
                # Get the text and clean it up
                description = author_desc_element.text.strip()
                
                # Remove the entire Librarian Note sentence if present
                if "Librarian Note:" in description:
                    parts = description.split("Librarian Note:")
                    if len(parts) > 1:
                        description = parts[0].strip()
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
    # Create a metadata object
    metadata = {
        "total_books": len(books),
        "scrape_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "lists_scraped": [list_info["name"] for list_info in LISTS_TO_SCRAPE]
    }
    
    # Create the final data structure
    data = {
        "metadata": metadata,
        "books": books
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(books)} books to {OUTPUT_FILE}")

async def scrape_list(session, list_info, semaphore):
    """Scrape a single list with the specified number of pages"""
    list_url = list_info["url"]
    list_name = list_info["name"]
    max_pages = list_info["pages"]
    
    all_books = []
    page_count = 0
    current_url = list_url
    
    print(f"\n=== Starting to scrape: {list_name} ===")
    
    while current_url and page_count < max_pages:
        page_count += 1
        print(f"\n=== Fetching {list_name} - page {page_count}/{max_pages} ===")
        print(f"URL: {BASE_URL}{current_url}")
        
        html = await fetch_page(session, current_url)
        
        if not html:
            print(f"Failed to fetch page {page_count} for {list_name}")
            break
            
        # Parse the page
        books, next_page_url = await parse_book_list(html, list_name)
        
        # Debugging: Show number of books found on this page
        print(f"Found {len(books)} books on page {page_count}")
        
        # If no books found, stop scraping this list
        if not books:
            print(f"No books found on page {page_count} for {list_name}, stopping scraping")
            break
            
        all_books.extend(books)
        
        # Debugging: Show total books collected so far for this list
        print(f"Total books collected from {list_name}: {len(all_books)}")
        
        # Update current_url for next iteration
        current_url = next_page_url
        
        # Add delay between page requests
        await asyncio.sleep(random.uniform(*REQUEST_DELAY))
    
    print(f"Completed scraping {list_name}: {len(all_books)} books from {page_count} pages")
    return all_books

async def main():
    """Main execution function"""
    start_time = time.time()
    all_books = []
    
    # Create a semaphore to limit concurrent requests
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    
    async with aiohttp.ClientSession() as session:
        # Scrape all lists
        for list_info in LISTS_TO_SCRAPE:
            books = await scrape_list(session, list_info, semaphore)
            all_books.extend(books)
            print(f"Total books collected so far: {len(all_books)}")
        
        if all_books:
            # Fetch additional details for each book
            print("\n=== Fetching individual book details ===")
            print(f"Total books to process: {len(all_books)}")
            
            # Process books in batches to avoid overwhelming the server
            processed_books = []
            batch_size = 50
            for i in range(0, len(all_books), batch_size):
                batch = all_books[i:i+batch_size]
                print(f"Processing batch {i//batch_size + 1}/{(len(all_books) + batch_size - 1)//batch_size}")
                batch_results = await asyncio.gather(*[fetch_book_details(session, book, semaphore) for book in batch])
                processed_books.extend(batch_results)
                print(f"Processed {len(processed_books)}/{len(all_books)} books")
            
            # Save results
            await save_results(processed_books)
            
            # Calculate and print total time
            total_time = time.time() - start_time
            print(f"\n=== Scraping completed ===")
            print(f"Total time: {total_time:.2f} seconds")
            print(f"Total books scraped: {len(processed_books)}")
            print(f"Books saved to: {OUTPUT_FILE}")
        else:
            print("No books were scraped")

if __name__ == "__main__":
    asyncio.run(main())