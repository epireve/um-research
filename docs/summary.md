# UM Research Supervisor Profile Enrichment: Implementation Summary

## Overview

This project provides tools to enrich research supervisor profiles by extracting information from HTML sources and updating YAML profiles. The implementation has been designed with the following elements:

1. **Data Extraction**: The `processor.py` script extracts data from HTML sources and saves it to `profiles/{user_id}_extracted.yaml`
2. **Prompt Generation**: The `gemini_integration.py` script creates prompts for Google Gemini 2.5 Pro
3. **Profile Update**: Using Google Gemini 2.5 Pro to merge the extracted data with the existing profiles

## Technical Details

### Data Extraction (`processor.py`)

The processor script performs the following functions:

1. Reads YAML profiles from `profiles/{user_id}.yaml`
2. Processes HTML sources from three directories:
   - `source/profile/`: Contains profile HTML pages
   - `source/cv/`: Contains CV HTML pages
   - `source/dashboard/`: Contains dashboard HTML pages

3. Extracts various information types:
   - Publications (academic journals, book chapters, proceedings)
   - Contact information
   - Social and academic profiles
   - Research interests
   - Academic background

4. Saves the extracted data to `profiles/{user_id}_extracted.yaml`

### Prompt Generation (`gemini_integration.py`)

This script creates prompts for Google Gemini 2.5 Pro by:

1. For each `{user_id}_extracted.yaml` file, reading both the original profile and the extracted data
2. Creating a prompt with specific instructions for merging the data
3. Saving the prompts to the `gemini_prompts/` directory

### Profile Update (Using Google Gemini 2.5 Pro)

The final step involves using Google Gemini 2.5 Pro to:

1. Take the prompt from `gemini_prompts/{user_id}_prompt.txt`
2. Intelligently merge the extracted data with the existing profile
3. Output an updated YAML file that can replace the original profile

## Implementation Notes

1. **Dependencies**:
   - Python 3.6+
   - markdownify: For converting HTML to Markdown
   - pyyaml: For handling YAML files

2. **HTML Processing**:
   - The HTML files are converted to Markdown to remove markup noise
   - Regular expressions are used to identify sections and extract relevant information

3. **Data Handling**:
   - All extracted data is carefully formatted as YAML
   - Care is taken to avoid duplicate information
   - The final merge respects the structure of the original YAML files

## Troubleshooting

If you encounter issues with dependencies, try installing them manually:

```bash
pip install pyyaml markdownify
```

If there are issues with file permissions or paths, ensure that:
1. The `profiles/` directory exists and is writable
2. The `source/` directory contains the HTML files
3. Python has permission to read and write in these directories

## Next Steps

Once the environment is properly set up, you can:

1. Run `python processor.py` to extract data
2. Run `python gemini_integration.py` to generate prompts
3. Use Google Gemini 2.5 Pro to update the profiles 