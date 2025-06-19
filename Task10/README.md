# Product Filtering System with OpenAI Function Calling

A console-based product search tool that uses OpenAI's function calling capabilities to filter products based on natural language preferences. Instead of writing manual filtering logic, this system leverages AI to understand user intent and automatically apply the appropriate filters.

## Features

- **Natural Language Processing**: Accept search queries in plain English
- **OpenAI Function Calling**: Uses structured function calls to filter products
- **Multiple Filter Types**: Category, price range, rating, stock availability, and product name search
- **Interactive Console Interface**: Easy-to-use command-line interface
- **Structured Output**: Clean, formatted results with product details

## Requirements

- Python 3.7 or higher
- OpenAI API key
- Internet connection for API calls

## Installation

1. **Clone or download the project files**
   ```bash
   # Ensure you have the following files:
   # - main.py
   # - products.json  
   # - requirements.txt
   # - README.md
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your OpenAI API key**
   
   You need to set your OpenAI API key as an environment variable. **Do not hardcode it in the source code.**

   **On Linux/Mac:**
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```

   **On Windows (Command Prompt):**
   ```cmd
   set OPENAI_API_KEY=your-api-key-here
   ```

   **On Windows (PowerShell):**
   ```powershell
   $env:OPENAI_API_KEY="your-api-key-here"
   ```

   **Alternatively, create a `.env` file** (not included in version control):
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## Usage

1. **Run the application**
   ```bash
   python main.py
   ```

2. **Enter your search queries in natural language**
   
   The application will prompt you to enter product search criteria. You can use natural language like:
   - "Find electronics under $100"
   - "Show me fitness equipment with rating above 4.5"
   - "I need kitchen appliances that are in stock"
   - "Find books under $30 with good ratings"
   - "Show me smartphones or headphones"

3. **View results**
   
   The system will display filtered products in a structured format:
   ```
   Filtered Products (2 found):
   1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
   2. Smart Watch - $199.99, Rating: 4.6, In Stock
   ```

4. **Exit the application**
   
   Type `quit`, `exit`, or `q` to close the application, or use `Ctrl+C`.

## How It Works

### OpenAI Function Calling
The application uses OpenAI's function calling feature to:
1. **Analyze** user queries in natural language
2. **Extract** filtering criteria (category, price, rating, etc.)
3. **Structure** the criteria into function parameters
4. **Call** the filtering function with the appropriate arguments

### Function Schema
The system defines a structured function schema that tells OpenAI how to call the filtering function:

```python
{
    "name": "filter_products",
    "description": "Filter products based on user preferences",
    "parameters": {
        "category": "Electronics, Fitness, Kitchen, Books, Clothing",
        "max_price": "Maximum price threshold",
        "min_rating": "Minimum rating threshold", 
        "in_stock_only": "Filter for available products only",
        "product_names": "Specific product keywords to search for"
    }
}
```

### Dataset
The application uses `products.json` which contains product information with the following structure:
```json
{
    "name": "Product Name",
    "category": "Category",
    "price": 99.99,
    "rating": 4.5,
    "in_stock": true
}
```

## Available Categories
- Electronics
- Fitness  
- Kitchen
- Books
- Clothing

## Example Queries

| Query | Expected Behavior |
|-------|------------------|
| "Find cheap electronics" | Filter Electronics category with low max_price |
| "Show me fitness equipment in stock" | Filter Fitness category with in_stock_only=true |
| "Books with good ratings" | Filter Books category with high min_rating |
| "Kitchen appliances under $50" | Filter Kitchen category with max_price=50 |
| "Smart watch or headphones" | Search for products containing these keywords |

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable not set"**
   - Make sure you've set your OpenAI API key as an environment variable
   - Verify the key is correct and active

2. **"products.json not found"**
   - Ensure the `products.json` file is in the same directory as `main.py`

3. **"Error calling OpenAI API"**
   - Check your internet connection
   - Verify your OpenAI API key is valid and has sufficient credits
   - Try again after a moment (API rate limits)

4. **No results found**
   - Try rephrasing your query
   - Check if your criteria are too restrictive
   - Verify the products exist in the dataset

### Debug Tips
- The application will show "🔍 Searching products..." while processing
- Error messages will provide specific details about what went wrong
- Try simpler queries if complex ones aren't working

## Security Notes

- Never commit your OpenAI API key to version control
- Use environment variables or secure configuration files
- The application validates API key presence before making requests
- All API calls are made over HTTPS

## Architecture

The application consists of:
- `ProductFilteringSystem` class: Main application logic
- `filter_products()` method: Core filtering logic called by OpenAI
- `get_function_schema()`: Defines the function structure for OpenAI
- `search_products()`: Handles OpenAI API communication
- `format_results()`: Formats output for display

## Limitations

- Requires active internet connection for API calls
- Limited by OpenAI API rate limits and costs
- Dataset is static (loaded from `products.json`)
- Function calling accuracy depends on query clarity

## License

This project is provided for educational purposes as part of the Vention AI Challenge. 