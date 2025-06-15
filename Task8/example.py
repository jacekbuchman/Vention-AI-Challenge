#!/usr/bin/env python3
"""
Example demonstrating the Data Validation Library

This example shows both successful validation and validation failures
to demonstrate the library's capabilities.
"""

from validator import Schema

def main():
    print("🔍 Python Data Validation Library Demo")
    print("=" * 50)
    
    # Define a user schema
    user_schema = Schema.object({
        "id": Schema.string().pattern(r"^\d+$").with_message("ID must be numeric string"),
        "name": Schema.string().min_length(2).max_length(50),
        "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
        "age": Schema.number().integer().min_value(0).max_value(150).optional(),
        "is_active": Schema.boolean(),
        "tags": Schema.array(Schema.string()).min_length(1),
        "address": Schema.object({
            "street": Schema.string().min_length(1),
            "city": Schema.string().min_length(1),
            "postal_code": Schema.string().pattern(r"^\d{5}$").with_message("Postal code must be 5 digits"),
            "country": Schema.string().min_length(2)
        }).optional()
    })
    
    # Test 1: Valid data
    print("\n✅ Test 1: Valid User Data")
    print("-" * 30)
    
    valid_user = {
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
        }
    }
    
    result = user_schema.validate(valid_user)
    if result.is_valid:
        print("🎉 Validation PASSED! User data is valid.")
    else:
        print("❌ Unexpected validation failure:")
        for error in result.errors:
            print(f"  - {error}")
    
    # Test 2: Invalid data with multiple errors
    print("\n❌ Test 2: Invalid User Data")
    print("-" * 30)
    
    invalid_user = {
        "id": "abc123",  # Should be numeric only
        "name": "J",     # Too short (min 2 chars)
        "email": "invalid-email",  # Invalid format
        "age": -5,       # Negative age
        "is_active": "yes",  # Should be boolean
        "tags": [],      # Empty (min 1 item)
        "address": {
            "street": "",  # Empty string
            "city": "Anytown",
            "postal_code": "1234",  # Wrong format (needs 5 digits)
            "country": "US"
        }
    }
    
    result = user_schema.validate(invalid_user)
    if result.is_valid:
        print("🤔 Unexpected validation success!")
    else:
        print(f"📋 Found {len(result.errors)} validation errors:")
        for i, error in enumerate(result.errors, 1):
            print(f"  {i}. {error}")
    
    # Test 3: Minimal valid data (with optional fields)
    print("\n✅ Test 3: Minimal Valid Data")
    print("-" * 30)
    
    minimal_user = {
        "id": "54321",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "is_active": False,
        "tags": ["designer"]
        # age and address are optional
    }
    
    result = user_schema.validate(minimal_user)
    if result.is_valid:
        print("🎉 Validation PASSED! Minimal data is valid.")
    else:
        print("❌ Unexpected validation failure:")
        for error in result.errors:
            print(f"  - {error}")
    
    # Test 4: Demonstrate different validator types
    print("\n🧪 Test 4: Individual Validator Types")
    print("-" * 30)
    
    # String validator
    email_validator = Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    print(f"Email validation - 'user@domain.com': {email_validator.validate('user@domain.com').is_valid}")
    print(f"Email validation - 'invalid-email': {email_validator.validate('invalid-email').is_valid}")
    
    # Number validator
    age_validator = Schema.number().integer().min_value(0).max_value(120)
    print(f"Age validation - 25: {age_validator.validate(25).is_valid}")
    print(f"Age validation - -5: {age_validator.validate(-5).is_valid}")
    
    # Array validator
    tags_validator = Schema.array(Schema.string()).min_length(1).max_length(5)
    print(f"Tags validation - ['python', 'js']: {tags_validator.validate(['python', 'js']).is_valid}")
    print(f"Tags validation - []: {tags_validator.validate([]).is_valid}")
    
    print(f"\n🏁 Demo completed!")
    print("=" * 50)

if __name__ == "__main__":
    main() 