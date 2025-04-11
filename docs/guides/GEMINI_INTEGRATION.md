# Gemini API Integration

This guide explains how to use Google's Gemini API to automatically update supervisor profiles.

## Setup

1. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file by copying the `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Edit the `.env` file and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Usage

The workflow consists of three steps:

### 1. Extract Data

Run the processor script to extract information from HTML sources:

```bash
python -m src.processor.processor
```

This creates `*_extracted.yaml` files in the `data/extracted` directory.

### 2. Generate Prompts

Generate prompts for the Gemini API:

```bash
python -m src.processor.gemini_integration
```

This creates prompt files in the `data/prompts` directory.

### 3. Update Profiles with Gemini

Use the Gemini API to update the profiles:

```bash
python -m src.processor.gemini_update
```

This will:
- Process each prompt file
- Call the Gemini API
- Update the profile YAML files
- Create backups of the original files in `data/backups/profiles`
- Remove the extracted data files

## Troubleshooting

If you encounter errors:

1. **API Key Issues**: Ensure your API key is correctly set in the `.env` file
2. **Model Availability**: If the specified model isn't available, try changing it in the `.env` file:
   ```
   GEMINI_MODEL=gemini-1.5-pro
   ```
3. **YAML Parsing Errors**: Check the raw response files in `data/backups/raw_responses` for any issues

## Manual Fallback

If the automatic update fails, you can:

1. Copy the content from a prompt file in `data/prompts/`
2. Paste it into the [Google Gemini web interface](https://gemini.google.com/)
3. Copy the response and save it to the appropriate profile YAML file in `data/profiles/`

## Notes on the Gemini Model

The script uses the `gemini-2.5-pro-exp-03-25` model by default. If this model becomes unavailable, you can update the `GEMINI_MODEL` in your `.env` file to a different version of Gemini. 