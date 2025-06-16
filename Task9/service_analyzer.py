#!/usr/bin/env python
"""
Service Analyzer - AI-Powered Service Analysis Tool

This application accepts either a known service name or raw service description text
and returns a comprehensive, markdown-formatted report from multiple viewpoints.
"""

import os
import sys
import argparse
from openai import OpenAI
from typing import Optional
import json

class ServiceAnalyzer:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the ServiceAnalyzer with OpenAI API key."""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it directly.")
        
        self.client = OpenAI(api_key=self.api_key)
    
    def create_analysis_prompt(self, input_text: str, is_service_name: bool = False) -> str:
        """Create a detailed prompt for the AI to analyze the service."""
        
        if is_service_name:
            context = f"Analyze the service/product named '{input_text}'"
        else:
            context = f"Analyze the following service/product description:\n\n{input_text}"
        
        prompt = f"""
{context}

Please provide a comprehensive analysis report in markdown format with the following sections:

## Brief History
- Founding year, key milestones, important developments

## Target Audience
- Primary user segments and demographics
- Who benefits most from this service

## Core Features
- Top 2-4 key functionalities
- What the service primarily does

## Unique Selling Points
- Key differentiators from competitors
- What makes this service stand out

## Business Model
- How the service makes money
- Revenue streams and pricing strategy

## Tech Stack Insights
- Technologies likely used (if known or can be inferred)
- Technical architecture insights

## Perceived Strengths
- Notable advantages and standout features
- What users/critics praise about the service

## Perceived Weaknesses
- Cited drawbacks or limitations
- Common complaints or areas for improvement

Please provide detailed, accurate information for each section. If specific information isn't available, make reasonable inferences based on industry knowledge while clearly indicating when you're making educated guesses.
"""
        return prompt
    
    def analyze_service(self, input_text: str, is_service_name: bool = False) -> str:
        """Use OpenAI API to analyze the service and generate a report."""
        try:
            prompt = self.create_analysis_prompt(input_text, is_service_name)
            
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert business analyst with deep knowledge of digital services, technology companies, and market dynamics. Provide thorough, accurate, and well-structured analysis reports."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            return f"Error analyzing service: {str(e)}"
    
    def save_report_to_file(self, report: str, filename: str) -> None:
        """Save the generated report to a file."""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\nReport saved to: {filename}")
        except Exception as e:
            print(f"Error saving report to file: {str(e)}")

def main():
    """Main function to handle command line interaction."""
    parser = argparse.ArgumentParser(
        description="AI-Powered Service Analysis Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python service_analyzer.py --service "Spotify"
  python service_analyzer.py --text "We are a cloud-based project management platform..."
  python service_analyzer.py --service "Notion" --output report.md
        """
    )
    
    # Create mutually exclusive group for input type
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument(
        '--service', '-s',
        help='Name of a known service (e.g., "Spotify", "Notion")'
    )
    input_group.add_argument(
        '--text', '-t',
        help='Raw service description text'
    )
    
    parser.add_argument(
        '--output', '-o',
        help='Output file to save the report (optional)'
    )
    
    parser.add_argument(
        '--api-key',
        help='OpenAI API key (optional if OPENAI_API_KEY env var is set)'
    )
    
    args = parser.parse_args()
    
    try:
        # Initialize the analyzer
        analyzer = ServiceAnalyzer(api_key=args.api_key)
        
        # Determine input type and content
        if args.service:
            input_text = args.service
            is_service_name = True
            print(f"Analyzing service: {args.service}")
        else:
            input_text = args.text
            is_service_name = False
            print("Analyzing provided service description...")
        
        print("Generating comprehensive analysis report...")
        
        # Generate the analysis report
        report = analyzer.analyze_service(input_text, is_service_name)
        
        # Display the report
        print("\n" + "="*80)
        print("SERVICE ANALYSIS REPORT")
        print("="*80)
        print(report)
        print("="*80)
        
        # Save to file if requested
        if args.output:
            analyzer.save_report_to_file(report, args.output)
        
    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
