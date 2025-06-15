"""
Comprehensive Unit Tests for Data Validation Library

Tests cover all validator types, edge cases, and error scenarios
to ensure robust validation functionality.
"""

import unittest
import re
from datetime import datetime
from validator import (
    Schema, ValidationError, ValidationResult,
    StringValidator, NumberValidator, BooleanValidator,
    DateValidator, ArrayValidator, ObjectValidator
)


class TestValidationResult(unittest.TestCase):
    """Test cases for ValidationResult class"""
    
    def test_validation_result_creation(self):
        """Test ValidationResult initialization"""
        result = ValidationResult()
        self.assertTrue(result.is_valid)
        self.assertEqual(result.errors, [])
        
        result_with_errors = ValidationResult(False, ["Error 1", "Error 2"])
        self.assertFalse(result_with_errors.is_valid)
        self.assertEqual(result_with_errors.errors, ["Error 1", "Error 2"])
    
    def test_add_error(self):
        """Test adding errors to ValidationResult"""
        result = ValidationResult()
        result.add_error("Test error")
        self.assertFalse(result.is_valid)
        self.assertEqual(result.errors, ["Test error"])


class TestStringValidator(unittest.TestCase):
    """Test cases for StringValidator"""
    
    def test_valid_string(self):
        """Test validation of valid strings"""
        validator = Schema.string()
        result = validator.validate("hello")
        self.assertTrue(result.is_valid)
        self.assertEqual(result.errors, [])
    
    def test_invalid_type(self):
        """Test validation of non-string values"""
        validator = Schema.string()
        result = validator.validate(123)
        self.assertFalse(result.is_valid)
        self.assertIn("Must be a string", result.errors[0])
    
    def test_optional_field(self):
        """Test optional string validation"""
        validator = Schema.string().optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)
    
    def test_required_field_none(self):
        """Test required string with None value"""
        validator = Schema.string()
        result = validator.validate(None)
        self.assertFalse(result.is_valid)
        self.assertIn("Field is required", result.errors[0])
    
    def test_min_length(self):
        """Test string minimum length validation"""
        validator = Schema.string().min_length(5)
        
        # Valid case
        result = validator.validate("hello")
        self.assertTrue(result.is_valid)
        
        # Invalid case
        result = validator.validate("hi")
        self.assertFalse(result.is_valid)
        self.assertIn("at least 5 characters", result.errors[0])
    
    def test_max_length(self):
        """Test string maximum length validation"""
        validator = Schema.string().max_length(5)
        
        # Valid case
        result = validator.validate("hello")
        self.assertTrue(result.is_valid)
        
        # Invalid case
        result = validator.validate("hello world")
        self.assertFalse(result.is_valid)
        self.assertIn("at most 5 characters", result.errors[0])
    
    def test_pattern_validation(self):
        """Test regex pattern validation"""
        email_validator = Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
        
        # Valid email
        result = email_validator.validate("test@example.com")
        self.assertTrue(result.is_valid)
        
        # Invalid email
        result = email_validator.validate("invalid-email")
        self.assertFalse(result.is_valid)
        self.assertIn("does not match required pattern", result.errors[0])
    
    def test_pattern_with_compiled_regex(self):
        """Test pattern validation with pre-compiled regex"""
        pattern = re.compile(r"^\d{5}$")
        validator = Schema.string().pattern(pattern)
        
        result = validator.validate("12345")
        self.assertTrue(result.is_valid)
        
        result = validator.validate("1234")
        self.assertFalse(result.is_valid)
    
    def test_custom_message(self):
        """Test custom error messages"""
        validator = Schema.string().pattern(r"^\d{5}$").with_message("Must be 5 digits")
        result = validator.validate("abc")
        self.assertFalse(result.is_valid)
        self.assertIn("Must be 5 digits", result.errors[0])
    
    def test_method_chaining(self):
        """Test method chaining for multiple constraints"""
        validator = Schema.string().min_length(2).max_length(10).pattern(r"^[a-zA-Z]+$")
        
        # Valid case
        result = validator.validate("hello")
        self.assertTrue(result.is_valid)
        
        # Multiple violations
        result = validator.validate("a")  # Too short
        self.assertFalse(result.is_valid)
        self.assertTrue(len(result.errors) > 0)


class TestNumberValidator(unittest.TestCase):
    """Test cases for NumberValidator"""
    
    def test_valid_numbers(self):
        """Test validation of valid numbers"""
        validator = Schema.number()
        
        result = validator.validate(42)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(3.14)
        self.assertTrue(result.is_valid)
    
    def test_invalid_type(self):
        """Test validation of non-numeric values"""
        validator = Schema.number()
        result = validator.validate("123")
        self.assertFalse(result.is_valid)
        self.assertIn("Must be a number", result.errors[0])
    
    def test_optional_number(self):
        """Test optional number validation"""
        validator = Schema.number().optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)
    
    def test_min_value(self):
        """Test number minimum value validation"""
        validator = Schema.number().min_value(10)
        
        result = validator.validate(15)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(5)
        self.assertFalse(result.is_valid)
        self.assertIn("at least 10", result.errors[0])
    
    def test_max_value(self):
        """Test number maximum value validation"""
        validator = Schema.number().max_value(100)
        
        result = validator.validate(50)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(150)
        self.assertFalse(result.is_valid)
        self.assertIn("at most 100", result.errors[0])
    
    def test_integer_constraint(self):
        """Test integer-only validation"""
        validator = Schema.number().integer()
        
        result = validator.validate(42)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(3.14)
        self.assertFalse(result.is_valid)
        self.assertIn("Must be an integer", result.errors[0])
    
    def test_combined_constraints(self):
        """Test multiple number constraints together"""
        validator = Schema.number().integer().min_value(1).max_value(100)
        
        result = validator.validate(50)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(3.5)  # Not integer
        self.assertFalse(result.is_valid)
        
        result = validator.validate(150)  # Too large
        self.assertFalse(result.is_valid)


class TestBooleanValidator(unittest.TestCase):
    """Test cases for BooleanValidator"""
    
    def test_valid_booleans(self):
        """Test validation of valid boolean values"""
        validator = Schema.boolean()
        
        result = validator.validate(True)
        self.assertTrue(result.is_valid)
        
        result = validator.validate(False)
        self.assertTrue(result.is_valid)
    
    def test_invalid_type(self):
        """Test validation of non-boolean values"""
        validator = Schema.boolean()
        
        result = validator.validate(1)
        self.assertFalse(result.is_valid)
        self.assertIn("Must be a boolean", result.errors[0])
        
        result = validator.validate("true")
        self.assertFalse(result.is_valid)
    
    def test_optional_boolean(self):
        """Test optional boolean validation"""
        validator = Schema.boolean().optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)


class TestDateValidator(unittest.TestCase):
    """Test cases for DateValidator"""
    
    def test_datetime_object(self):
        """Test validation of datetime objects"""
        validator = Schema.date()
        now = datetime.now()
        result = validator.validate(now)
        self.assertTrue(result.is_valid)
    
    def test_valid_date_string(self):
        """Test validation of valid date strings"""
        validator = Schema.date()
        result = validator.validate("2023-12-25")
        self.assertTrue(result.is_valid)
    
    def test_invalid_date_string(self):
        """Test validation of invalid date strings"""
        validator = Schema.date()
        result = validator.validate("invalid-date")
        self.assertFalse(result.is_valid)
        self.assertIn("Date must be in format", result.errors[0])
    
    def test_custom_date_format(self):
        """Test custom date format validation"""
        validator = Schema.date().format("%d/%m/%Y")
        
        result = validator.validate("25/12/2023")
        self.assertTrue(result.is_valid)
        
        result = validator.validate("2023-12-25")
        self.assertFalse(result.is_valid)
    
    def test_invalid_type(self):
        """Test validation of non-date values"""
        validator = Schema.date()
        result = validator.validate(123)
        self.assertFalse(result.is_valid)
        self.assertIn("Must be a date or datetime string", result.errors[0])
    
    def test_optional_date(self):
        """Test optional date validation"""
        validator = Schema.date().optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)


class TestArrayValidator(unittest.TestCase):
    """Test cases for ArrayValidator"""
    
    def test_valid_array(self):
        """Test validation of valid arrays"""
        validator = Schema.array(Schema.string())
        result = validator.validate(["hello", "world"])
        self.assertTrue(result.is_valid)
    
    def test_invalid_type(self):
        """Test validation of non-array values"""
        validator = Schema.array(Schema.string())
        result = validator.validate("not an array")
        self.assertFalse(result.is_valid)
        self.assertIn("Must be an array", result.errors[0])
    
    def test_array_item_validation(self):
        """Test validation of array items"""
        validator = Schema.array(Schema.number())
        
        result = validator.validate([1, 2, 3])
        self.assertTrue(result.is_valid)
        
        result = validator.validate([1, "two", 3])
        self.assertFalse(result.is_valid)
        self.assertIn("[1]: Must be a number", result.errors[0])
    
    def test_min_length(self):
        """Test array minimum length validation"""
        validator = Schema.array(Schema.string()).min_length(2)
        
        result = validator.validate(["a", "b"])
        self.assertTrue(result.is_valid)
        
        result = validator.validate(["a"])
        self.assertFalse(result.is_valid)
        self.assertIn("at least 2 items", result.errors[0])
    
    def test_max_length(self):
        """Test array maximum length validation"""
        validator = Schema.array(Schema.string()).max_length(2)
        
        result = validator.validate(["a", "b"])
        self.assertTrue(result.is_valid)
        
        result = validator.validate(["a", "b", "c"])
        self.assertFalse(result.is_valid)
        self.assertIn("at most 2 items", result.errors[0])
    
    def test_optional_array(self):
        """Test optional array validation"""
        validator = Schema.array(Schema.string()).optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)
    
    def test_nested_arrays(self):
        """Test validation of nested arrays"""
        validator = Schema.array(Schema.array(Schema.number()))
        
        result = validator.validate([[1, 2], [3, 4]])
        self.assertTrue(result.is_valid)
        
        result = validator.validate([[1, "two"], [3, 4]])
        self.assertFalse(result.is_valid)


class TestObjectValidator(unittest.TestCase):
    """Test cases for ObjectValidator"""
    
    def test_valid_object(self):
        """Test validation of valid objects"""
        schema = {
            "name": Schema.string(),
            "age": Schema.number()
        }
        validator = Schema.object(schema)
        
        result = validator.validate({"name": "John", "age": 30})
        self.assertTrue(result.is_valid)
    
    def test_invalid_type(self):
        """Test validation of non-dictionary values"""
        validator = Schema.object({"name": Schema.string()})
        result = validator.validate("not an object")
        self.assertFalse(result.is_valid)
        self.assertIn("Must be an object", result.errors[0])
    
    def test_missing_required_field(self):
        """Test validation when required fields are missing"""
        schema = {"name": Schema.string(), "age": Schema.number()}
        validator = Schema.object(schema)
        
        result = validator.validate({"name": "John"})
        self.assertFalse(result.is_valid)
        self.assertIn("age: Field is required", result.errors[0])
    
    def test_optional_fields(self):
        """Test validation with optional fields"""
        schema = {
            "name": Schema.string(),
            "age": Schema.number().optional()
        }
        validator = Schema.object(schema)
        
        result = validator.validate({"name": "John"})
        self.assertTrue(result.is_valid)
    
    def test_field_validation_errors(self):
        """Test propagation of field validation errors"""
        schema = {
            "name": Schema.string().min_length(5),
            "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
        }
        validator = Schema.object(schema)
        
        result = validator.validate({
            "name": "Jo",  # Too short
            "email": "invalid"  # Invalid format
        })
        self.assertFalse(result.is_valid)
        self.assertTrue(len(result.errors) >= 2)
    
    def test_strict_mode(self):
        """Test strict mode validation (no extra fields)"""
        schema = {"name": Schema.string()}
        validator = Schema.object(schema).strict()
        
        result = validator.validate({"name": "John", "extra": "field"})
        self.assertFalse(result.is_valid)
        self.assertIn("Extra field not allowed", result.errors[0])
    
    def test_non_strict_mode(self):
        """Test non-strict mode (allow extra fields)"""
        schema = {"name": Schema.string()}
        validator = Schema.object(schema)
        
        result = validator.validate({"name": "John", "extra": "field"})
        self.assertTrue(result.is_valid)
    
    def test_nested_objects(self):
        """Test validation of nested objects"""
        address_schema = Schema.object({
            "street": Schema.string(),
            "city": Schema.string()
        })
        
        user_schema = Schema.object({
            "name": Schema.string(),
            "address": address_schema
        })
        
        valid_data = {
            "name": "John",
            "address": {
                "street": "123 Main St",
                "city": "Anytown"
            }
        }
        
        result = user_schema.validate(valid_data)
        self.assertTrue(result.is_valid)
        
        # Test with invalid nested data
        invalid_data = {
            "name": "John",
            "address": {
                "street": 123,  # Should be string
                "city": "Anytown"
            }
        }
        
        result = user_schema.validate(invalid_data)
        self.assertFalse(result.is_valid)
        self.assertIn("address.street", result.errors[0])
    
    def test_optional_object(self):
        """Test optional object validation"""
        validator = Schema.object({"name": Schema.string()}).optional()
        result = validator.validate(None)
        self.assertTrue(result.is_valid)


class TestSchemaClass(unittest.TestCase):
    """Test cases for main Schema class"""
    
    def test_schema_factory_methods(self):
        """Test all Schema factory methods return correct validator types"""
        self.assertIsInstance(Schema.string(), StringValidator)
        self.assertIsInstance(Schema.number(), NumberValidator)
        self.assertIsInstance(Schema.boolean(), BooleanValidator)
        self.assertIsInstance(Schema.date(), DateValidator)
        self.assertIsInstance(Schema.array(Schema.string()), ArrayValidator)
        self.assertIsInstance(Schema.object({}), ObjectValidator)


class TestComplexValidationScenarios(unittest.TestCase):
    """Test cases for complex, real-world validation scenarios"""
    
    def setUp(self):
        """Set up complex schemas for testing"""
        self.address_schema = Schema.object({
            "street": Schema.string().min_length(1),
            "city": Schema.string().min_length(1),
            "postal_code": Schema.string().pattern(r"^\d{5}$"),
            "country": Schema.string().min_length(2)
        })
        
        self.user_schema = Schema.object({
            "id": Schema.string().pattern(r"^\d+$"),
            "name": Schema.string().min_length(2).max_length(50),
            "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
            "age": Schema.number().integer().min_value(0).max_value(150).optional(),
            "is_active": Schema.boolean(),
            "tags": Schema.array(Schema.string()).min_length(1),
            "address": self.address_schema.optional(),
            "metadata": Schema.object({}).optional()
        })
    
    def test_valid_complex_data(self):
        """Test validation of complex valid data"""
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
            "metadata": {"role": "admin"}
        }
        
        result = self.user_schema.validate(user_data)
        self.assertTrue(result.is_valid, f"Validation failed: {result.errors}")
    
    def test_invalid_complex_data(self):
        """Test validation of complex invalid data"""
        user_data = {
            "id": "invalid_id",  # Should be numeric string
            "name": "J",  # Too short
            "email": "invalid-email",  # Invalid format
            "age": -5,  # Negative age
            "is_active": "yes",  # Should be boolean
            "tags": [],  # Empty array (min_length 1)
            "address": {
                "street": "",  # Empty string
                "city": "Anytown",
                "postal_code": "1234",  # Wrong format
                "country": "US"
            }
        }
        
        result = self.user_schema.validate(user_data)
        self.assertFalse(result.is_valid)
        
        # Should have multiple errors
        self.assertTrue(len(result.errors) > 5)
        
        # Check some specific expected errors
        error_messages = " ".join(result.errors)
        self.assertIn("id:", error_messages)
        self.assertIn("name:", error_messages)
        self.assertIn("email:", error_messages)
        self.assertIn("age:", error_messages)
        self.assertIn("is_active:", error_messages)
    
    def test_minimal_valid_data(self):
        """Test validation with minimal required data"""
        user_data = {
            "id": "12345",
            "name": "John Doe",
            "email": "john@example.com",
            "is_active": True,
            "tags": ["developer"]
        }
        
        result = self.user_schema.validate(user_data)
        self.assertTrue(result.is_valid)
    
    def test_field_path_in_errors(self):
        """Test that error messages include correct field paths"""
        user_data = {
            "id": "12345",
            "name": "John Doe",
            "email": "john@example.com",
            "is_active": True,
            "tags": ["developer", 123],  # Invalid tag type
            "address": {
                "street": "123 Main St",
                "city": "Anytown",
                "postal_code": "invalid",  # Invalid postal code
                "country": "USA"
            }
        }
        
        result = self.user_schema.validate(user_data)
        self.assertFalse(result.is_valid)
        
        # Check field paths in error messages
        error_messages = " ".join(result.errors)
        self.assertIn("tags[1]:", error_messages)
        self.assertIn("address.postal_code:", error_messages)


class TestValidationError(unittest.TestCase):
    """Test cases for ValidationError exception"""
    
    def test_validation_error_creation(self):
        """Test ValidationError exception creation"""
        error = ValidationError("Test message", "field.path")
        self.assertEqual(error.message, "Test message")
        self.assertEqual(error.field_path, "field.path")
        self.assertEqual(str(error), "field.path: Test message")
        
        error_no_path = ValidationError("Test message")
        self.assertEqual(str(error_no_path), "Test message")


if __name__ == "__main__":
    # Run all tests
    unittest.main(verbosity=2) 