import json
from typing import List, Dict
import os

def load_data(input_file: str) -> List[Dict]:
    """Load JSON data from file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading data from {input_file}: {e}")
        return []

def remove_duplicates(books: List[Dict]) -> List[Dict]:
    """Remove duplicate books based on title and author"""
    seen = set()
    unique_books = []
    
    for book in books:
        # Create a unique identifier based on title and author
        identifier = (book.get("Title", "").lower(), book.get("Author Name", "").lower())
        
        if identifier not in seen:
            seen.add(identifier)
            unique_books.append(book)
    
    return unique_books

def calculate_popularity_score(book: Dict) -> float:
    """Calculate a popularity score based on ratings and number of ratings"""
    try:
        rating = float(book.get("rating", 0)) if book.get("rating", "N/A") != "N/A" else 0
        num_ratings = int(book.get("num_ratings", 0)) if book.get("num_ratings", "N/A") != "N/A" else 0
        return (rating * 0.7) + (num_ratings * 0.3)
    except (ValueError, TypeError):
        return 0

def sort_by_popularity(books: List[Dict]) -> List[Dict]:
    """Sort books by popularity score"""
    return sorted(
        books,
        key=lambda x: calculate_popularity_score(x),
        reverse=True
    )

def select_top_books(books: List[Dict], self_help_books: List[Dict], limit: int = 3000) -> List[Dict]:
    """Select top books while maintaining all self-help books"""
    # Separate self-help and other books
    other_books = [book for book in books if book['genre'] != 'self-help']
    
    # Sort and select top other books
    top_other_books = sort_by_popularity(other_books)[:limit - len(self_help_books)]
    
    # Combine with all self-help books
    combined_books = self_help_books + top_other_books
    
    # Final sort by popularity
    return sort_by_popularity(combined_books)[:limit]

def clean_book_data(books: List[Dict]) -> List[Dict]:
    """Clean book data by keeping only required fields and adding index"""
    cleaned_books = []
    for index, book in enumerate(books, start=1):
        cleaned_book = {
            "Title": book.get("Title", "N/A"),
            "Image": book.get("Image", "N/A"),
            "Subtitle": book.get("Subtitle", "N/A"),
            "Abstract": book.get("Abstract", "N/A"),
            "Author Name": book.get("Author Name", "N/A"),
            "Author Description": book.get("Author Description", "N/A"),
            "Genres": book.get("Genres", []),
            "Chapters": "N/A",
            "Index": index,  # Add new index based on popularity order
            "rating": book.get("rating", "N/A"),
            "num_ratings": book.get("num_ratings", "N/A"),
            "genre": book.get("genre", "N/A")
        }
        cleaned_books.append(cleaned_book)
    return cleaned_books

def save_cleaned_data(books: List[Dict], output_file: str):
    """Save cleaned data to JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(books)} cleaned books to {output_file}")

def process_data(input_file: str, output_file: str):
    """Main function to process and clean the data"""
    # Load the raw data
    if not os.path.exists(input_file):
        print(f"Input file {input_file} not found!")
        return
    
    with open(input_file, 'r', encoding='utf-8') as f:
        books = json.load(f)
    
    print(f"Loaded {len(books)} books from {input_file}")
    
    # Step 1: Remove duplicates
    unique_books = remove_duplicates(books)
    print(f"Found {len(unique_books)} unique books after removing duplicates")
    
    # Step 2: Separate self-help books
    self_help_books = [book for book in unique_books if book.get("genre", "").lower() == "self-help"]
    other_books = [book for book in unique_books if book.get("genre", "").lower() != "self-help"]
    
    # Step 3: Sort and combine books
    sorted_self_help = sort_by_popularity(self_help_books)
    sorted_other_books = sort_by_popularity(other_books)
    combined_books = sorted_self_help + sorted_other_books
    
    # Step 4: Clean and save the data
    cleaned_books = clean_book_data(combined_books)
    save_cleaned_data(cleaned_books, output_file)

if __name__ == "__main__":
    # Process the temporary file and create a new cleaned file
    process_data(
        input_file="temp_goodreads_books_parallel.json",
        output_file="cleaned_goodreads_books.json"
    ) 