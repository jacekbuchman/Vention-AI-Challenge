"""
Data Validation Library

A robust Python validation library for validating complex data structures
with type-safe validator functions and method chaining support.
"""

import re
from typing import Any, Dict, List, Optional, Union, Type, Callable
from datetime import datetime


class ValidationError(Exception):
    """Custom exception for validation errors"""
    
    def __init__(self, message: str, field_path: str = ""):
        self.message = message
        self.field_path = field_path
        super().__init__(f"{field_path}: {message}" if field_path else message)


class ValidationResult:
    """Container for validation results with success status and errors"""
    
    def __init__(self, is_valid: bool = True, errors: Optional[List[str]] = None):
        self.is_valid = is_valid
        self.errors = errors or []
    
    def add_error(self, error: str):
        """Add an error to the validation result"""
        self.is_valid = False
        self.errors.append(error)


class BaseValidator:
    """Base class for all validators providing common functionality"""
    
    def __init__(self):
        self._optional = False
        self._custom_message: Optional[str] = None
    
    def optional(self) -> 'BaseValidator':
        """Mark this field as optional (can be None or missing)"""
        self._optional = True
        return self
    
    def with_message(self, message: str) -> 'BaseValidator':
        """Set a custom error message for validation failures"""
        self._custom_message = message
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Main validation method - should be overridden by subclasses"""
        raise NotImplementedError("Subclasses must implement validate method")
    
    def _create_error(self, message: str, field_path: str = "") -> str:
        """Create formatted error message using custom message if available"""
        error_msg = self._custom_message or message
        return f"{field_path}: {error_msg}" if field_path else error_msg


class StringValidator(BaseValidator):
    """Validator for string values with length and pattern constraints"""
    
    def __init__(self):
        super().__init__()
        self._min_length: Optional[int] = None
        self._max_length: Optional[int] = None
        self._pattern: Optional[re.Pattern] = None
        self._pattern_message: Optional[str] = None
    
    def min_length(self, length: int) -> 'StringValidator':
        """Set minimum string length constraint"""
        self._min_length = length
        return self
    
    def max_length(self, length: int) -> 'StringValidator':
        """Set maximum string length constraint"""
        self._max_length = length
        return self
    
    def pattern(self, regex: Union[str, re.Pattern]) -> 'StringValidator':
        """Set regex pattern constraint for string validation"""
        if isinstance(regex, str):
            self._pattern = re.compile(regex)
        else:
            self._pattern = regex
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate string value against all configured constraints"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Check if value is string
        if not isinstance(value, str):
            result.add_error(self._create_error("Must be a string", field_path))
            return result
        
        # Check minimum length
        if self._min_length is not None and len(value) < self._min_length:
            result.add_error(self._create_error(
                f"String must be at least {self._min_length} characters long", field_path
            ))
        
        # Check maximum length
        if self._max_length is not None and len(value) > self._max_length:
            result.add_error(self._create_error(
                f"String must be at most {self._max_length} characters long", field_path
            ))
        
        # Check pattern
        if self._pattern is not None and not self._pattern.match(value):
            result.add_error(self._create_error(
                f"String does not match required pattern", field_path
            ))
        
        return result


class NumberValidator(BaseValidator):
    """Validator for numeric values with range constraints"""
    
    def __init__(self):
        super().__init__()
        self._min_value: Optional[Union[int, float]] = None
        self._max_value: Optional[Union[int, float]] = None
        self._integer_only = False
    
    def min_value(self, value: Union[int, float]) -> 'NumberValidator':
        """Set minimum numeric value constraint"""
        self._min_value = value
        return self
    
    def max_value(self, value: Union[int, float]) -> 'NumberValidator':
        """Set maximum numeric value constraint"""
        self._max_value = value
        return self
    
    def integer(self) -> 'NumberValidator':
        """Restrict to integer values only"""
        self._integer_only = True
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate numeric value against all configured constraints"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Check if value is numeric
        if not isinstance(value, (int, float)):
            result.add_error(self._create_error("Must be a number", field_path))
            return result
        
        # Check integer constraint
        if self._integer_only and not isinstance(value, int):
            result.add_error(self._create_error("Must be an integer", field_path))
        
        # Check minimum value
        if self._min_value is not None and value < self._min_value:
            result.add_error(self._create_error(
                f"Number must be at least {self._min_value}", field_path
            ))
        
        # Check maximum value
        if self._max_value is not None and value > self._max_value:
            result.add_error(self._create_error(
                f"Number must be at most {self._max_value}", field_path
            ))
        
        return result


class BooleanValidator(BaseValidator):
    """Validator for boolean values"""
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate boolean value"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Check if value is boolean
        if not isinstance(value, bool):
            result.add_error(self._create_error("Must be a boolean", field_path))
        
        return result


class DateValidator(BaseValidator):
    """Validator for date values with format constraints"""
    
    def __init__(self):
        super().__init__()
        self._date_format = "%Y-%m-%d"
    
    def format(self, date_format: str) -> 'DateValidator':
        """Set expected date format for string parsing"""
        self._date_format = date_format
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate date value, accepting datetime objects or formatted strings"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Accept datetime objects directly
        if isinstance(value, datetime):
            return result
        
        # Try to parse string as date
        if isinstance(value, str):
            try:
                datetime.strptime(value, self._date_format)
                return result
            except ValueError:
                result.add_error(self._create_error(
                    f"Date must be in format {self._date_format}", field_path
                ))
                return result
        
        result.add_error(self._create_error("Must be a date or datetime string", field_path))
        return result


class ArrayValidator(BaseValidator):
    """Validator for array/list values with item validation"""
    
    def __init__(self, item_validator: BaseValidator):
        super().__init__()
        self.item_validator = item_validator
        self._min_length: Optional[int] = None
        self._max_length: Optional[int] = None
    
    def min_length(self, length: int) -> 'ArrayValidator':
        """Set minimum array length constraint"""
        self._min_length = length
        return self
    
    def max_length(self, length: int) -> 'ArrayValidator':
        """Set maximum array length constraint"""
        self._max_length = length
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate array and all its items against the item validator"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Check if value is list
        if not isinstance(value, list):
            result.add_error(self._create_error("Must be an array", field_path))
            return result
        
        # Check minimum length
        if self._min_length is not None and len(value) < self._min_length:
            result.add_error(self._create_error(
                f"Array must have at least {self._min_length} items", field_path
            ))
        
        # Check maximum length
        if self._max_length is not None and len(value) > self._max_length:
            result.add_error(self._create_error(
                f"Array must have at most {self._max_length} items", field_path
            ))
        
        # Validate each item in the array
        for i, item in enumerate(value):
            item_path = f"{field_path}[{i}]" if field_path else f"[{i}]"
            item_result = self.item_validator.validate(item, item_path)
            if not item_result.is_valid:
                result.errors.extend(item_result.errors)
                result.is_valid = False
        
        return result


class ObjectValidator(BaseValidator):
    """Validator for object/dictionary values with field-specific validation"""
    
    def __init__(self, schema: Dict[str, BaseValidator]):
        super().__init__()
        self.schema = schema
        self._strict = False
    
    def strict(self) -> 'ObjectValidator':
        """Enable strict mode - disallow extra fields not in schema"""
        self._strict = True
        return self
    
    def validate(self, value: Any, field_path: str = "") -> ValidationResult:
        """Validate object against schema, checking all defined fields"""
        result = ValidationResult()
        
        # Handle optional fields
        if value is None:
            if self._optional:
                return result
            result.add_error(self._create_error("Field is required", field_path))
            return result
        
        # Check if value is dictionary
        if not isinstance(value, dict):
            result.add_error(self._create_error("Must be an object", field_path))
            return result
        
        # Check for extra fields in strict mode
        if self._strict:
            extra_fields = set(value.keys()) - set(self.schema.keys())
            if extra_fields:
                for field in extra_fields:
                    field_full_path = f"{field_path}.{field}" if field_path else field
                    result.add_error(self._create_error(
                        "Extra field not allowed in strict mode", field_full_path
                    ))
        
        # Validate each field in the schema
        for field_name, field_validator in self.schema.items():
            field_full_path = f"{field_path}.{field_name}" if field_path else field_name
            field_value = value.get(field_name)
            
            field_result = field_validator.validate(field_value, field_full_path)
            if not field_result.is_valid:
                result.errors.extend(field_result.errors)
                result.is_valid = False
        
        return result


class Schema:
    """Main Schema class providing static methods to create validators"""
    
    @staticmethod
    def string() -> StringValidator:
        """Create a new string validator"""
        return StringValidator()
    
    @staticmethod
    def number() -> NumberValidator:
        """Create a new number validator"""
        return NumberValidator()
    
    @staticmethod
    def boolean() -> BooleanValidator:
        """Create a new boolean validator"""
        return BooleanValidator()
    
    @staticmethod
    def date() -> DateValidator:
        """Create a new date validator"""
        return DateValidator()
    
    @staticmethod
    def object(schema: Dict[str, BaseValidator]) -> ObjectValidator:
        """Create a new object validator with the given schema"""
        return ObjectValidator(schema)
    
    @staticmethod
    def array(item_validator: BaseValidator) -> ArrayValidator:
        """Create a new array validator with the given item validator"""
        return ArrayValidator(item_validator)


# Example usage and demonstration
if __name__ == "__main__":
    # Define a complex schema similar to the JavaScript template
    address_schema = Schema.object({
        "street": Schema.string(),
        "city": Schema.string(),
        "postal_code": Schema.string().pattern(r"^\d{5}$").with_message("Postal code must be 5 digits"),
        "country": Schema.string()
    })
    
    user_schema = Schema.object({
        "id": Schema.string().with_message("ID must be a string"),
        "name": Schema.string().min_length(2).max_length(50),
        "email": Schema.string().pattern(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
        "age": Schema.number().optional(),
        "is_active": Schema.boolean(),
        "tags": Schema.array(Schema.string()),
        "address": address_schema.optional(),
        "metadata": Schema.object({}).optional()
    })
    
    # Test data
    user_data = {
        "id": "12345",
        "name": "John Doe",
        "email": "john@example.com",
        "is_active": True,
        "tags": ["developer", "designer"],
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "postal_code": "12345",
            "country": "USA"
        }
    }
    
    # Validate the data
    result = user_schema.validate(user_data)
    
    if result.is_valid:
        print("✅ Validation successful!")
    else:
        print("❌ Validation failed:")
        for error in result.errors:
            print(f"  - {error}") 