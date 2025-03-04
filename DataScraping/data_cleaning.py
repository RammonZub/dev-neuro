import json
from typing import List, Dict
import os

def load_data(input_file: str) -> List[Dict]:
    """Load JSON data from file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get("books", [])  # Extract the books list from the JSON structure
    except Exception as e:
        print(f"Error loading data from {input_file}: {e}")
        return []

def remove_duplicates(books: List[Dict]) -> List[Dict]:
    """Remove duplicate books based on title and author"""
    seen = set()
    unique_books = []
    
    for book in books:
        # Create a unique identifier based on title and author
        identifier = (book.get("title", "").lower(), book.get("author", "").lower())
        
        if identifier not in seen:
            seen.add(identifier)
            unique_books.append(book)
    
    return unique_books

def calculate_popularity_score(book: Dict) -> float:
    """Calculate a popularity score based on ratings and number of ratings"""
    try:
        rating = float(book.get("rating", 0)) if book.get("rating", "N/A") != "N/A" else 0
        num_ratings = int(book.get("num_ratings", 0)) if book.get("num_ratings", "N/A") != "N/A" else 0
        
        # Weighted formula: 70% rating, 30% normalized number of ratings
        # Normalize num_ratings by dividing by 100,000 (assuming max ratings around 1M)
        normalized_ratings = min(num_ratings / 100000, 1)  # Cap at 1
        return (rating * 0.7) + (normalized_ratings * 0.3)
    except (ValueError, TypeError):
        return 0

def is_self_help_book(book: Dict) -> bool:
    """Check if a book is a self-help book based on genres"""
    genres = book.get("genres", [])
    return any("self-help" in genre.lower() for genre in genres)

def separate_and_sort_books(books: List[Dict]) -> List[Dict]:
    """Separate books into self-help and others, then sort each category"""
    self_help_books = [book for book in books if is_self_help_book(book)]
    other_books = [book for book in books if not is_self_help_book(book)]
    
    return sort_by_popularity(self_help_books) + sort_by_popularity(other_books)

def sort_by_popularity(books: List[Dict]) -> List[Dict]:
    """Sort books by popularity score"""
    return sorted(
        books,
        key=lambda x: calculate_popularity_score(x),
        reverse=True
    )

def clean_book_data(books: List[Dict]) -> List[Dict]:
    """Clean book data by keeping only required fields and adding index"""
    cleaned_books = []
    for index, book in enumerate(books, start=1):
        cleaned_book = {
            "title": book.get("title", "N/A"),
            "subtitle": book.get("subtitle", "N/A"),
            "author": book.get("author", "N/A"),
            "rating": book.get("rating", "N/A"),
            "num_ratings": book.get("num_ratings", "N/A"),
            "publication_year": book.get("publication_year", "N/A"),
            "abstract": book.get("abstract", "N/A"),
            "image_url": book.get("image_url", "N/A"),
            "genres": book.get("genres", []),
            "author_description": book.get("author_description", "N/A"),
            "source_list": book.get("source_list", "N/A"),
            "index": index,  # Add new index based on popularity order
            "is_self_help": is_self_help_book(book)  # Add self-help flag
        }
        cleaned_books.append(cleaned_book)
    return cleaned_books

def save_data(books: List[Dict], output_file: str):
    """Save data to JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(books)} books to {output_file}")

def process_data(input_file: str, main_output_file: str, top_books_file: str):
    """Main function to process and clean the data"""
    # Load the raw data
    if not os.path.exists(input_file):
        print(f"Input file {input_file} not found!")
        return
    
    # Step 1: Load and remove duplicates
    books = load_data(input_file)
    print(f"Loaded {len(books)} books from {input_file}")
    
    unique_books = remove_duplicates(books)
    print(f"Found {len(unique_books)} unique books after removing duplicates")
    
    # Step 2: Separate and sort books
    sorted_books = separate_and_sort_books(unique_books)
    
    # Step 3: Select top 3000 books
    top_books = sorted_books[:3000]
    
    # Step 4: Clean and save the main data
    cleaned_books = clean_book_data(top_books)
    save_data(cleaned_books, main_output_file)
    
    # Step 5: Manually select the top 5 books
    selected_books = []
    target_titles = [
        "Atomic Habits",
        "12 Rules for Life",
        "Steve Jobs"
    ]
    
    # Find the specified books
    for book in cleaned_books:
        title = book.get("title", "").lower()
        if "atomic habits" in title:
            selected_books.append(book)
        elif "12 rules for life" in title:
            selected_books.append(book)
        elif "steve jobs" in title and "biography" in book.get("genres", []):
            selected_books.append(book)
        if len(selected_books) >= 3:
            break
    
    # Add two more books of similar style
    additional_books = [
        "The Power of Now",
        "Thinking, Fast and Slow"
    ]
    
    for book in cleaned_books:
        title = book.get("title", "").lower()
        if any(additional_title.lower() in title for additional_title in additional_books):
            selected_books.append(book)
        if len(selected_books) >= 5:
            break
    
    # Save the selected books
    save_data(selected_books, top_books_file)

if __name__ == "__main__":
    # Process the data and create two output files
    process_data(
        input_file="goodreads_books_collection.json",
        main_output_file="top_3000_books.json",
        top_books_file="top_5_books.json"
    ) 