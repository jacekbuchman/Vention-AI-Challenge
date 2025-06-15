# Python Data Validation Library

A robust and type-safe data validation library for Python that provides an intuitive API for validating complex data structures with method chaining support.

## Features

- **Type-safe validators** for primitive types (string, number, boolean, date)
- **Complex type validation** for arrays and objects
- **Method chaining** for combining multiple validation rules
- **Custom error messages** with detailed field path information
- **Optional field support** for flexible validation
- **Nested object validation** with full error reporting
- **Strict mode** for object validation (disallow extra fields)
- **Comprehensive error handling** with detailed validation results

## Installation

No external dependencies required! Simply copy the `validator.py` file to your project.

```bash
# Clone or download the validator.py file
# Import and use in your Python project
```

## Quick Start

```python
from validator import Schema

# Create a simple string validator
name_validator = Schema.string().min_length(2).max_length(50)
result = name_validator.validate("John Doe")

if result.is_valid:
    print("✅ Valid!")
else:
    print("❌ Validation errors:")
    for error in result.errors:
        print(f"  - {error}")
```

## Basic Usage

### String Validation

```python
from validator import Schema

# Basic string validation
validator = Schema.string()
result = validator.validate("hello")  # ✅ Valid

# String with length constraints
validator = Schema.string().min_length(2).max_length(100)
result = validator.validate("Hi")  # ✅ Valid
result = validator.validate("A")   # ❌ Too short

# String with regex pattern
email_validator = Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
result = email_validator.validate("user@example.com")  # ✅ Valid
result = email_validator.validate("invalid-email")    # ❌ Invalid format

# Optional string field
optional_validator = Schema.string().optional()
result = optional_validator.validate(None)  # ✅ Valid (optional)

# Custom error message
validator = Schema.string().pattern(r"^\d{5}$").with_message("Must be a 5-digit postal code")
result = validator.validate("1234")  # ❌ "Must be a 5-digit postal code"
```

### Number Validation

```python
# Basic number validation
validator = Schema.number()
result = validator.validate(42)    # ✅ Valid
result = validator.validate(3.14)  # ✅ Valid

# Number with range constraints
age_validator = Schema.number().integer().min_value(0).max_value(150)
result = age_validator.validate(25)   # ✅ Valid
result = age_validator.validate(-5)  # ❌ Too small
result = age_validator.validate(3.5) # ❌ Not an integer

# Optional number
optional_number = Schema.number().optional()
result = optional_number.validate(None)  # ✅ Valid
```

### Boolean Validation

```python
# Boolean validation
validator = Schema.boolean()
result = validator.validate(True)   # ✅ Valid
result = validator.validate(False)  # ✅ Valid
result = validator.validate(1)      # ❌ Must be boolean
```

### Date Validation

```python
from datetime import datetime

# Date validation (accepts datetime objects and formatted strings)
validator = Schema.date()
result = validator.validate(datetime.now())  # ✅ Valid
result = validator.validate("2023-12-25")    # ✅ Valid (default format: %Y-%m-%d)

# Custom date format
custom_validator = Schema.date().format("%d/%m/%Y")
result = custom_validator.validate("25/12/2023")  # ✅ Valid
result = custom_validator.validate("2023-12-25")  # ❌ Wrong format
```

### Array Validation

```python
# Array of strings
validator = Schema.array(Schema.string())
result = validator.validate(["hello", "world"])  # ✅ Valid
result = validator.validate(["hello", 123])      # ❌ Invalid item type

# Array with length constraints
validator = Schema.array(Schema.string()).min_length(1).max_length(5)
result = validator.validate(["item"])           # ✅ Valid
result = validator.validate([])                 # ❌ Too short
result = validator.validate(["a", "b", "c", "d", "e", "f"])  # ❌ Too long

# Array of numbers with item constraints
validator = Schema.array(Schema.number().min_value(0).max_value(100))
result = validator.validate([10, 20, 30])  # ✅ Valid
result = validator.validate([10, -5, 30])  # ❌ Item -5 is too small

# Nested arrays
validator = Schema.array(Schema.array(Schema.number()))
result = validator.validate([[1, 2], [3, 4]])  # ✅ Valid
```

### Object Validation

```python
# Simple object validation
user_schema = Schema.object({
    "name": Schema.string().min_length(2),
    "age": Schema.number().integer().min_value(0),
    "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
})

valid_user = {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
}

result = user_schema.validate(valid_user)  # ✅ Valid

# Object with optional fields
user_schema = Schema.object({
    "name": Schema.string(),
    "age": Schema.number().optional(),  # Optional field
    "email": Schema.string()
})

minimal_user = {
    "name": "Jane Doe",
    "email": "jane@example.com"
    # age is optional, so it can be omitted
}

result = user_schema.validate(minimal_user)  # ✅ Valid

# Strict mode (disallow extra fields)
strict_schema = Schema.object({
    "name": Schema.string()
}).strict()

result = strict_schema.validate({
    "name": "John",
    "extra_field": "not allowed"
})  # ❌ Extra field not allowed in strict mode
```

## Advanced Usage

### Complex Nested Validation

```python
# Define nested object schemas
address_schema = Schema.object({
    "street": Schema.string().min_length(1),
    "city": Schema.string().min_length(1),
    "postal_code": Schema.string().pattern(r"^\d{5}$").with_message("Postal code must be 5 digits"),
    "country": Schema.string().min_length(2)
})

user_schema = Schema.object({
    "id": Schema.string().pattern(r"^\d+$"),
    "name": Schema.string().min_length(2).max_length(50),
    "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
    "age": Schema.number().integer().min_value(0).max_value(150).optional(),
    "is_active": Schema.boolean(),
    "tags": Schema.array(Schema.string()).min_length(1),
    "address": address_schema.optional(),  # Nested object
    "metadata": Schema.object({}).optional()  # Any object structure
})

# Test data
user_data = {
    "id": "12345",
    "name": "John Doe", 
    "email": "john@example.com",
    "age": 30,
    "is_active": True,
    "tags": ["developer", "python"],
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "postal_code": "12345",
        "country": "USA"
    },
    "metadata": {"role": "admin", "department": "IT"}
}

result = user_schema.validate(user_data)

if result.is_valid:
    print("✅ User data is valid!")
else:
    print("❌ Validation errors:")
    for error in result.errors:
        print(f"  - {error}")
```

### Error Handling and Field Paths

The library provides detailed error messages with field paths for easy debugging:

```python
# Invalid nested data
invalid_data = {
    "name": "J",  # Too short
    "email": "invalid-email",  # Invalid format
    "tags": ["developer", 123],  # Invalid tag type
    "address": {
        "street": "123 Main St",
        "city": "Anytown", 
        "postal_code": "1234",  # Invalid format
        "country": "US"
    }
}

result = user_schema.validate(invalid_data)

# Error messages will include field paths:
# - name: String must be at least 2 characters long
# - email: String does not match required pattern
# - tags[1]: Must be a string
# - address.postal_code: Postal code must be 5 digits
```

### Custom Validation Messages

```python
# Set custom error messages for better user experience
validator = Schema.object({
    "username": Schema.string()
        .min_length(3)
        .max_length(20)
        .pattern(r"^[a-zA-Z0-9_]+$")
        .with_message("Username must be 3-20 characters and contain only letters, numbers, and underscores"),
    
    "password": Schema.string()
        .min_length(8)
        .pattern(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]")
        .with_message("Password must be at least 8 characters with uppercase, lowercase, number, and special character"),
    
    "age": Schema.number()
        .integer()
        .min_value(13)
        .max_value(120)
        .with_message("Age must be between 13 and 120")
})
```

## Running the Library

### Basic Example

Create a file called `example.py`:

```python
from validator import Schema

# Define schema
user_schema = Schema.object({
    "name": Schema.string().min_length(2),
    "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
    "age": Schema.number().integer().min_value(0).optional()
})

# Test data
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}

# Validate
result = user_schema.validate(user_data)

if result.is_valid:
    print("✅ Validation successful!")
    print("User data is valid and ready to process.")
else:
    print("❌ Validation failed:")
    for error in result.errors:
        print(f"  - {error}")
```

Run the example:

```bash
python example.py
```

### Testing the Library

Run the comprehensive test suite:

```bash
# Run all tests
python test_validator.py

# Run tests with verbose output
python -m unittest test_validator -v

# Run specific test class
python -m unittest test_validator.TestStringValidator -v
```

### Generate Test Coverage Report

```bash
# Install coverage tool (if not already installed)
pip install coverage

# Run tests with coverage
coverage run test_validator.py

# Generate coverage report
coverage report -m

# Generate HTML coverage report
coverage html
```

## API Reference

### Schema Class

Static factory methods for creating validators:

- `Schema.string()` → `StringValidator`
- `Schema.number()` → `NumberValidator` 
- `Schema.boolean()` → `BooleanValidator`
- `Schema.date()` → `DateValidator`
- `Schema.array(item_validator)` → `ArrayValidator`
- `Schema.object(schema_dict)` → `ObjectValidator`

### Base Validator Methods

All validators inherit these methods:

- `.optional()` - Mark field as optional (allows None/missing)
- `.with_message(message)` - Set custom error message
- `.validate(value, field_path="")` - Validate a value

### StringValidator Methods

- `.min_length(length)` - Set minimum string length
- `.max_length(length)` - Set maximum string length
- `.pattern(regex)` - Set regex pattern (string or compiled regex)

### NumberValidator Methods

- `.min_value(value)` - Set minimum numeric value
- `.max_value(value)` - Set maximum numeric value
- `.integer()` - Restrict to integers only

### DateValidator Methods

- `.format(date_format)` - Set expected date format (default: "%Y-%m-%d")

### ArrayValidator Methods

- `.min_length(length)` - Set minimum array length
- `.max_length(length)` - Set maximum array length

### ObjectValidator Methods

- `.strict()` - Enable strict mode (disallow extra fields)

### ValidationResult

Result object returned by validation:

- `.is_valid` (bool) - Whether validation passed
- `.errors` (List[str]) - List of error messages
- `.add_error(error)` - Add an error message

## Examples Directory

Check out the `examples/` directory for more usage examples:

- `basic_validation.py` - Simple validation examples
- `complex_schemas.py` - Advanced nested validation
- `custom_messages.py` - Custom error message examples
- `api_validation.py` - REST API request validation example

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for your changes
4. Ensure all tests pass (`python test_validator.py`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### v1.0.0
- Initial release
- Complete validation library with all primitive and complex types
- Comprehensive test suite with >90% coverage
- Full documentation and examples 