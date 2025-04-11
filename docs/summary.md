# UM Research Supervisor Profile Enrichment: Implementation Summary

## Overview

This project provides tools to enrich research supervisor profiles by extracting information from HTML sources and updating YAML profiles. The implementation has been designed with the following elements:

1. **Data Extraction**: The `processor.py` script extracts data from HTML sources and saves it to `data/extracted/{user_id}_extracted.yaml`
2. **Prompt Generation**: The `gemini_integration.py` script creates prompts for Google Gemini 2.5 Pro
3. **Profile Update**: Using Google Gemini 2.5 Pro to merge the extracted data with the existing profiles
4. **Image Extraction**: The `extract_images.py` script extracts profile images from base64-encoded data

## Technical Details

### Data Extraction (`processor.py`)

The processor script performs the following functions:

1. Reads YAML profiles from `data/profiles/{user_id}.yaml`
2. Processes HTML sources from three directories:
   - `data/raw/html/profile/`: Contains profile HTML pages
   - `data/raw/html/cv/`: Contains CV HTML pages
   - `data/raw/html/dashboard/`: Contains dashboard HTML pages

3. Extracts various information types:
   - Publications (academic journals, book chapters, proceedings)
   - Contact information
   - Social and academic profiles
   - Research interests
   - Academic background

4. Saves the extracted data to `data/extracted/{user_id}_extracted.yaml`

### Profile Data Parsing (`parse_results.py`)

The parsing script processes HTML search results to extract structured supervisor data:

1. Reads the HTML from `data/raw/html/search_result.html`
2. Parses the HTML to extract information about researchers, including:
   - Names, departments, and faculties
   - Contact information (email, phone)
   - Areas of expertise
   - Profile links and user IDs
   - Base64-encoded profile images
3. Saves the parsed data to `data/reference/supervisor_profiles.csv`

### Image Extraction (`extract_images.py`)

The image extraction script processes base64-encoded images from the supervisor CSV file:

1. Reads the CSV file from `data/reference/supervisor_profiles.csv`
2. For each supervisor record:
   - Extracts the base64-encoded image data
   - Decodes the base64 string to binary image data
   - Saves the image as `data/images/{userID}.jpeg`
3. Logs the process and reports on successfully extracted images

### Prompt Generation (`gemini_integration.py`)

This script creates prompts for Google Gemini 2.5 Pro by:

1. For each `{user_id}_extracted.yaml` file, reading both the original profile and the extracted data
2. Creating a prompt with specific instructions for merging the data
3. Saving the prompts to the `data/prompts/` directory

### Profile Update (Using Google Gemini 2.5 Pro)

The final step involves using Google Gemini 2.5 Pro to:

1. Take the prompt from `data/prompts/{user_id}_prompt.txt`
2. Intelligently merge the extracted data with the existing profile
3. Output an updated YAML file that can replace the original profile

## Implementation Notes

1. **Dependencies**:
   - Python 3.6+
   - markdownify: For converting HTML to Markdown
   - pyyaml: For handling YAML files
   - beautifulsoup4: For HTML parsing
   - Pillow: For image processing

2. **HTML Processing**:
   - The HTML files are converted to Markdown to remove markup noise
   - Regular expressions are used to identify sections and extract relevant information

3. **Data Handling**:
   - All extracted data is carefully formatted as YAML
   - Care is taken to avoid duplicate information
   - The final merge respects the structure of the original YAML files

4. **Image Processing**:
   - Base64-encoded images are extracted from the CSV file
   - Images are saved as JPEG files with consistent naming
   - File names correspond to researcher user IDs for easy association
   - The process handles different image formats embedded in the base64 data

## Troubleshooting

If you encounter issues with dependencies, try installing them manually:

```bash
pip install pyyaml markdownify beautifulsoup4 pillow
```

If there are issues with file permissions or paths, ensure that:
1. The `data/profiles/` directory exists and is writable
2. The `data/raw/html/` directory contains the HTML files
3. The `data/images/` directory exists and is writable
4. Python has permission to read and write in these directories

## Next Steps

Once the environment is properly set up, you can:

1. Run `python -m src.processor.processor` to extract data
2. Run `python -m src.processor.parse_results` to parse HTML search results
3. Run `python -m scripts.extract_images` to extract profile images
4. Run `python -m src.processor.gemini_integration` to generate prompts
5. Use Google Gemini 2.5 Pro to update the profiles 