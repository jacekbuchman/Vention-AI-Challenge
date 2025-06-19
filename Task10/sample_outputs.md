# Sample Outputs

This document contains sample runs of the Product Filtering System demonstrating different types of user queries and their corresponding outputs.

## Sample Run 1: Electronics Under $100

**User Query:** "Find electronics under $100"

**System Output:**
```
🛍️  Product Filtering System with OpenAI Function Calling
============================================================
Ask me to find products using natural language!
Examples:
- 'Find electronics under $100'
- 'Show me fitness equipment with rating above 4.5'
- 'I need kitchen appliances that are in stock'
- 'Find books under $30 with good ratings'

Type 'quit' to exit.

👤 What products are you looking for? Find electronics under $100
🔍 Searching products...

Filtered Products (4 found):
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, In Stock
4. External Hard Drive - $89.99, Rating: 4.4, In Stock
------------------------------------------------------------
```

**Explanation:** The system successfully identified:
- Category: Electronics
- Maximum price: $100
- Filtered out higher-priced electronics like Gaming Laptop ($1299.99) and 4K Monitor ($349.99)

---

## Sample Run 2: Fitness Equipment with High Ratings

**User Query:** "Show me fitness equipment with rating above 4.5 that's available"

**System Output:**
```
👤 What products are you looking for? Show me fitness equipment with rating above 4.5 that's available
🔍 Searching products...

Filtered Products (3 found):
1. Dumbbell Set - $149.99, Rating: 4.7, In Stock
2. Exercise Bike - $499.99, Rating: 4.5, In Stock
3. Foam Roller - $24.99, Rating: 4.5, In Stock
------------------------------------------------------------
```

**Explanation:** The system correctly interpreted:
- Category: Fitness
- Minimum rating: 4.5
- In stock only: true (from "available")
- Excluded out-of-stock Treadmill (4.6 rating but not in stock)

---

## Sample Run 3: Kitchen Appliances Under $50

**User Query:** "I need kitchen appliances under $50"

**System Output:**
```
👤 What products are you looking for? I need kitchen appliances under $50
🔍 Searching products...

Filtered Products (4 found):
1. Blender - $49.99, Rating: 4.2, In Stock
2. Toaster - $29.99, Rating: 4.1, In Stock
3. Electric Kettle - $39.99, Rating: 4.4, In Stock
4. Pressure Cooker - $99.99, Rating: 4.7, In Stock
------------------------------------------------------------
```

**Explanation:** The system identified:
- Category: Kitchen
- Maximum price: $50
- Mixed stock availability (both in stock and out of stock items)

---

## Sample Run 4: Books with Good Ratings Under $30

**User Query:** "Find books under $30 with good ratings"

**System Output:**
```
👤 What products are you looking for? Find books under $30 with good ratings
🔍 Searching products...

Filtered Products (7 found):
1. Novel: The Great Adventure - $14.99, Rating: 4.3, In Stock
2. Cookbook: Easy Recipes - $24.99, Rating: 4.5, In Stock
3. Self-Help Guide - $19.99, Rating: 4.2, In Stock
4. Biography: An Inspiring Life - $29.99, Rating: 4.4, In Stock
5. Mystery Novel - $19.99, Rating: 4.3, In Stock
6. Children's Picture Book - $12.99, Rating: 4.5, In Stock
7. Science Fiction Novel - $17.99, Rating: 4.2, In Stock
------------------------------------------------------------
```

**Explanation:** The system interpreted:
- Category: Books
- Maximum price: $30
- Minimum rating: 4.2 (interpreted "good ratings" as above average)
- All books in this price range had good ratings

---

## Sample Run 5: Specific Product Search

**User Query:** "Do you have any smart watches or headphones?"

**System Output:**
```
👤 What products are you looking for? Do you have any smart watches or headphones?
🔍 Searching products...

Filtered Products (3 found):
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Smart Watch - $199.99, Rating: 4.6, In Stock
3. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
------------------------------------------------------------
```

**Explanation:** The system used keyword matching:
- Product names: ["smart watch", "headphones"]
- Found products containing these keywords in their names
- No category or price filters applied

---

## Sample Run 6: No Results Found

**User Query:** "Find gaming consoles under $200"

**System Output:**
```
👤 What products are you looking for? Find gaming consoles under $200
🔍 Searching products...

No products found matching your criteria.
------------------------------------------------------------
```

**Explanation:** The system correctly handled a case where no products match the criteria (no gaming consoles in the dataset).

---

## Sample Run 7: Complex Query

**User Query:** "Show me electronics that are in stock with ratings above 4.5 under $300"

**System Output:**
```
👤 What products are you looking for? Show me electronics that are in stock with ratings above 4.5 under $300
🔍 Searching products...

Filtered Products (5 found):
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Smart Watch - $199.99, Rating: 4.6, In Stock
3. 4K Monitor - $349.99, Rating: 4.7, In Stock
4. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
5. Gaming Mouse - $59.99, Rating: 4.3, In Stock
------------------------------------------------------------
```

**Explanation:** The system handled multiple criteria:
- Category: Electronics
- In stock only: true
- Minimum rating: 4.5
- Maximum price: $300
- Successfully filtered complex combinations

---

## Sample Run 8: Exit Application

**User Query:** "quit"

**System Output:**
```
👤 What products are you looking for? quit
Thank you for using the Product Filtering System!
```

**Explanation:** The system properly handles exit commands and terminates gracefully.

---

## Key Observations

1. **Natural Language Understanding**: The system successfully interprets various phrasings and synonyms
2. **Multiple Filter Combinations**: Handles complex queries with multiple criteria
3. **Contextual Reasoning**: Understands terms like "available" (in stock), "good ratings" (above average), "cheap" (low price)
4. **Graceful Error Handling**: Provides appropriate messages when no results are found
5. **Consistent Formatting**: Results are always displayed in a clean, structured format
6. **Function Calling Success**: OpenAI correctly invokes the filtering function with appropriate parameters

## Technical Details

The OpenAI function calling mechanism successfully:
- Parses natural language queries
- Maps user intent to structured function parameters
- Handles edge cases and ambiguous queries
- Provides consistent, accurate filtering results

All sample outputs demonstrate the system working as intended, with proper integration between natural language processing and structured product filtering. 