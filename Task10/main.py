#!/usr/bin/env python
"""
Product Filtering System using OpenAI Function Calling
A console-based application that filters products based on natural language preferences.
"""

import json
import os
import sys
from typing import List, Dict, Any, Optional
from openai import OpenAI

class ProductFilteringSystem:
    def __init__(self, products_file: str = "products.json"):
        """Initialize the product filtering system."""
        self.products_file = products_file
        self.products = self.load_products()
        self.client = None
        
    def load_products(self) -> List[Dict[str, Any]]:
        """Load products from JSON file."""
        try:
            with open(self.products_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: {self.products_file} not found!")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in {self.products_file}")
            sys.exit(1)
    
    def setup_openai_client(self) -> OpenAI:
        """Setup OpenAI client with API key from environment."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("Error: OPENAI_API_KEY environment variable not set!")
            print("Please set your OpenAI API key: export OPENAI_API_KEY='your-api-key-here'")
            sys.exit(1)
        
        return OpenAI(api_key=api_key)
    
    def filter_products(self, category: Optional[str] = None, max_price: Optional[float] = None, 
                       min_rating: Optional[float] = None, in_stock_only: Optional[bool] = None,
                       product_names: Optional[List[str]] = None, limit: Optional[int] = None,
                       sort_by: Optional[str] = None, ascending: Optional[bool] = True) -> List[Dict[str, Any]]:
        """
        Filter products based on the given criteria.
        This function will be called by OpenAI with structured arguments.
        """
        filtered_products = self.products.copy()
        
        # Filter by category
        if category:
            filtered_products = [p for p in filtered_products 
                               if p['category'].lower() == category.lower()]
        
        # Filter by maximum price  
        if max_price is not None:
            filtered_products = [p for p in filtered_products 
                               if p['price'] <= max_price]
        
        # Filter by minimum rating
        if min_rating is not None:
            filtered_products = [p for p in filtered_products 
                               if p['rating'] >= min_rating]
        
        # Filter by stock availability
        if in_stock_only is not None:
            filtered_products = [p for p in filtered_products 
                               if p['in_stock'] == in_stock_only]
        
        # Filter by specific product names (for when user mentions specific products)
        if product_names:
            name_keywords = [name.lower() for name in product_names]
            filtered_products = [p for p in filtered_products 
                               if any(keyword in p['name'].lower() for keyword in name_keywords)]
        
        # Sort products if requested
        if sort_by:
            if sort_by == "price":
                filtered_products.sort(key=lambda x: x['price'], reverse=not ascending)
            elif sort_by == "rating":
                filtered_products.sort(key=lambda x: x['rating'], reverse=not ascending)
            elif sort_by == "name":
                filtered_products.sort(key=lambda x: x['name'].lower(), reverse=not ascending)
        
        # Limit number of results if requested
        if limit and limit > 0:
            filtered_products = filtered_products[:limit]
        
        return filtered_products
    
    def get_function_schema(self) -> Dict[str, Any]:
        """Define the function schema for OpenAI function calling."""
        return {
            "name": "filter_products",
            "description": "Filter products based on user preferences like category, price range, rating, and stock availability",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Product category to filter by (Electronics, Fitness, Kitchen, Books, Clothing)",
                        "enum": ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"]
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price filter (products with price <= this value)"
                    },
                    "min_rating": {
                        "type": "number",
                        "description": "Minimum rating filter (products with rating >= this value)"
                    },
                    "in_stock_only": {
                        "type": "boolean",
                        "description": "Filter to show only products that are in stock"
                    },
                    "product_names": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Specific product names or keywords to search for"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of products to return (e.g., 1 for 'show me one product', 5 for 'show me top 5')"
                    },
                    "sort_by": {
                        "type": "string",
                        "description": "Field to sort by: 'price', 'rating', or 'name'",
                        "enum": ["price", "rating", "name"]
                    },
                    "ascending": {
                        "type": "boolean",
                        "description": "Sort order: true for ascending (lowest first), false for descending (highest first)"
                    }
                },
                "required": []
            }
        }
    
    def search_products(self, user_query: str) -> List[Dict[str, Any]]:
        """Use OpenAI function calling to filter products based on user query."""
        # Initialize OpenAI client if not already done
        if self.client is None:
            self.client = self.setup_openai_client()
            
        # Create system message with context about available products
        categories = list(set(p['category'] for p in self.products))
        price_range = f"${min(p['price'] for p in self.products):.2f} - ${max(p['price'] for p in self.products):.2f}"
        
        system_message = f"""You are a product search assistant. You have access to a product database with the following categories: {', '.join(categories)}.
        Price range: {price_range}
        Rating range: 1.0 - 5.0
        
        CRITICAL RULE: Pay attention to the definite article "THE" - it indicates the user wants exactly ONE specific product!
        
        IMPORTANT: When users make requests, you MUST analyze ALL aspects of their query and call the filter_products function with ALL appropriate parameters:
        
        1. PRICE FILTERING: Always consider price-related terms:
           - "under $X", "below $X", "less than $X" → set max_price to X
           - "cheap", "affordable" → set max_price to a reasonable low value
           - "expensive", "premium" → set min_price if available, or high-end filtering
        
        2. RATING FILTERING: Always consider quality-related terms:
           - "good quality", "high rating", "well-rated" → set min_rating to 4.0 or higher
           - "excellent", "best" → set min_rating to 4.5 or higher
           - "rating above X" → set min_rating to X
        
                 3. STOCK FILTERING: Always consider availability terms:
            - "available", "in stock", "can buy now" → set in_stock_only to true
            - "out of stock", "not available", "only out of stock" → set in_stock_only to false
        
        4. CATEGORY FILTERING: Map user terms to exact categories
        
                 5. NAME FILTERING: For specific product mentions
         
         6. QUANTITY LIMITING: Pay attention to quantity requests:
            - "show me one", "find one", "give me one" → set limit to 1
            - "show me THE [superlative]" (e.g., "show me THE cheapest", "show me THE highest rated") → set limit to 1
            - "top 5", "best 3", "first 10" → set limit to the specified number
            - No specific quantity mentioned → don't set limit (show all matching)
         
         7. SORTING: Consider sorting requests:
            - "cheapest", "lowest price", "THE cheapest" → sort_by="price", ascending=true
            - "most expensive", "highest price", "THE most expensive" → sort_by="price", ascending=false  
            - "lowest rated", "worst rated", "THE lowest rated" → sort_by="rating", ascending=true
            - "highest rated", "best rated", "THE highest rated", "THE best rated" → sort_by="rating", ascending=false
            - "alphabetical" → sort_by="name", ascending=true
            
                     IMPORTANT: When user says "show me THE [superlative]" (using definite article "the"), they want exactly ONE product - always set limit=1.
            
            EXAMPLES:
            - "show me highest rated products" → NO limit (show all)
            - "show me THE highest rated product" → limit=1 (show only one)
            - "find cheapest items" → NO limit (show all)  
            - "find THE cheapest item" → limit=1 (show only one)
            - "lowest rated fitness equipment" → NO limit (show all)
            - "THE lowest rated fitness product" → limit=1 (show only one)
         
         Consider synonyms and related terms (e.g., "phone" → "smartphone", "laptop" → "Gaming Laptop").
         ALWAYS apply ALL relevant filters AND sorting/limiting based on user intent. Do not ignore any criteria.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_query}
                ],
                functions=[self.get_function_schema()],
                function_call="auto"
            )
            
            message = response.choices[0].message
            
            if message.function_call:
                # Parse function call arguments
                function_args = json.loads(message.function_call.arguments)
                
                # Call the filtering function
                filtered_results = self.filter_products(**function_args)
                
                return filtered_results
            else:
                print("I couldn't understand your search criteria. Please try rephrasing your request.")
                return []
                
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return []
    
    def format_results(self, products: List[Dict[str, Any]]) -> str:
        """Format the filtered products for display."""
        if not products:
            return "No products found matching your criteria."
        
        result = f"Filtered Products ({len(products)} found):\n"
        result += "-" * 80 + "\n"
        for i, product in enumerate(products, 1):
            stock_status = "✅ In Stock" if product['in_stock'] else "❌ Out of Stock"
            rating_stars = "⭐" * int(product['rating'])
            result += f"{i:2d}. {product['name']:<35} | ${product['price']:>7.2f} | {rating_stars} ({product['rating']}) | {stock_status}\n"
        result += "-" * 80 + "\n"
        
        return result
    
    def run(self):
        """Main application loop."""
        print("🛍️  Product Filtering System with OpenAI Function Calling")
        print("=" * 60)
        print("Ask me to find products using natural language!")
        print("Examples:")
        print("- 'Find electronics under $100'")
        print("- 'Show me fitness equipment with rating above 4.5'") 
        print("- 'I need kitchen appliances that are in stock'")
        print("- 'Find books under $30 with good ratings'")
        print("\nType 'quit' to exit.\n")
        
        while True:
            try:
                user_input = input("👤 What products are you looking for? ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("Thank you for using the Product Filtering System!")
                    break
                
                if not user_input:
                    print("Please enter a search query.")
                    continue
                
                print("🔍 Searching products...")
                results = self.search_products(user_input)
                print("\n" + self.format_results(results))
                print("-" * 60)
                
            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"An error occurred: {e}")
                continue

def main():
    """Entry point of the application."""
    app = ProductFilteringSystem()
    app.run()

if __name__ == "__main__":
    main() 
