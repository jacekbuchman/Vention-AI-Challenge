# Service Analyzer - AI-Powered Service Analysis Tool

A lightweight console application that generates comprehensive, markdown-formatted analysis reports for digital services and products using OpenAI's GPT-4. The application accepts either known service names or raw service descriptions and provides multi-perspective insights including business, technical, and user-focused viewpoints.

## Features

- **Dual Input Support**: Accept either known service names (e.g., "Spotify", "Notion") or raw service description text
- **Comprehensive Analysis**: Generate reports with 8 key sections covering all aspects of a service
- **AI-Powered**: Leverages OpenAI's GPT-4 for intelligent analysis and insights
- **Flexible Output**: Display results in terminal or save to markdown files
- **Command-Line Interface**: Easy-to-use CLI with helpful options and examples

## Report Sections

Each generated report includes the following sections:

1. **Brief History** - Founding year, milestones, and key developments
2. **Target Audience** - Primary user segments and demographics
3. **Core Features** - Top 2-4 key functionalities
4. **Unique Selling Points** - Key differentiators from competitors
5. **Business Model** - Revenue streams and pricing strategy
6. **Tech Stack Insights** - Technologies used or likely used
7. **Perceived Strengths** - Notable advantages and standout features
8. **Perceived Weaknesses** - Common drawbacks or limitations

## Prerequisites

- Python 3.7 or higher
- OpenAI API key (get one at https://platform.openai.com/api-keys)

## Installation

1. **Clone or download the project files** to your local machine

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your OpenAI API key** (choose one method):

   **Method 1: Environment Variable (Recommended)**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```
   
   **Method 2: Pass as command-line argument**
   ```bash
   python service_analyzer.py --api-key "your-api-key-here" --service "Spotify"
   ```

## Usage

### Basic Usage

**Analyze a known service:**
```bash
python service_analyzer.py --service "Spotify"
```

**Analyze from service description text:**
```bash
python service_analyzer.py --text "We are a cloud-based project management platform that helps teams collaborate, track tasks, and manage workflows efficiently. Our platform integrates with popular tools and offers real-time updates, customizable dashboards, and advanced reporting features."
```

### Advanced Usage

**Save report to a file:**
```bash
python service_analyzer.py --service "Notion" --output notion_analysis.md
```

**Use short flags:**
```bash
python service_analyzer.py -s "Discord" -o discord_report.md
```

**Pass API key directly:**
```bash
python service_analyzer.py --api-key "your-key-here" -s "Slack"
```

### Command-Line Options

- `--service, -s`: Name of a known service (e.g., "Spotify", "Notion")
- `--text, -t`: Raw service description text
- `--output, -o`: Output file to save the report (optional)
- `--api-key`: OpenAI API key (optional if OPENAI_API_KEY env var is set)
- `--help, -h`: Show help message and exit

## Example Output

When you run the application, you'll see output like this:

```
🔍 Analyzing service: Spotify
⏳ Generating comprehensive analysis report...

================================================================================
📊 SERVICE ANALYSIS REPORT
================================================================================

## Brief History
Spotify was founded in 2006 by Daniel Ek and Martin Lorentzon in Stockholm, Sweden...

## Target Audience
- Music enthusiasts aged 16-34 (primary demographic)
- Podcast listeners and content creators...

[... rest of the analysis sections ...]

================================================================================
```

## Error Handling

The application includes comprehensive error handling for:

- Missing or invalid API keys
- Network connectivity issues
- Invalid input parameters
- File I/O errors
- API rate limits and errors

## Troubleshooting

### Common Issues

1. **"OpenAI API key is required" error**
   - Make sure you've set the `OPENAI_API_KEY` environment variable
   - Or pass the key using the `--api-key` flag

2. **"Permission denied" error when saving files**
   - Check that you have write permissions in the target directory
   - Try saving to a different location

3. **Import errors**
   - Make sure you've installed the requirements: `pip install -r requirements.txt`
   - Check that you're using Python 3.7 or higher

4. **API rate limit errors**
   - Wait a moment and try again
   - Consider upgrading your OpenAI API plan if you need higher limits

### Getting Help

Use the built-in help:
```bash
python service_analyzer.py --help
```

## Security Notes

- **Never commit your API key to version control**
- Use environment variables or secure configuration management
- The application doesn't store or log your API key
- Generated reports may contain sensitive business information - handle appropriately

## Requirements

- Python 3.7+
- openai>=1.0.0 (specified in requirements.txt)
- Internet connection for API calls
- Valid OpenAI API key with GPT-4 access

## License

This project is provided as-is for educational and demonstration purposes. 