#!/usr/bin/env python3
"""
Simplified script to update profiles using the Gemini API
"""

import os
import yaml
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env file
load_dotenv()

# Set up the Gemini API client
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY not found in .env file")
    print("Please ensure you've set up your .env file with your API key")
    sys.exit(1)

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-pro-exp-03-25")
PROMPT_DIR = os.getenv("PROMPT_DIR", "data/prompts")
EXTRACTED_DATA_SUFFIX = os.getenv("EXTRACTED_DATA_SUFFIX", "_extracted.yaml")

# Configure the Gemini API client with the new API structure
genai.Client(api_key=API_KEY)


def update_profile_with_gemini(user_id):
    """Update a profile using Gemini API."""
    prompt_file = f"{PROMPT_DIR}/{user_id}_prompt.txt"

    if not os.path.exists(prompt_file):
        print(f"No prompt file found for {user_id}")
        return False

    # Read the prompt
    with open(prompt_file, "r", encoding="utf-8") as f:
        prompt = f.read()

    # Call the Gemini API with updated API structure
    print(f"   Calling Gemini API with model {MODEL_NAME}...")
    client = genai.Client(api_key=API_KEY)
    model = client.get_genai_model(MODEL_NAME)

    try:
        response = model.generate_content([prompt])
        response_text = response.text

        # Validate that it's valid YAML
        try:
            updated_profile = yaml.safe_load(response_text)

            # Save the updated profile
            profile_path = f"data/profiles/{user_id}.yaml"

            # Create a backup of the original file
            backup_path = f"data/backups/profiles/{user_id}.yaml.bak"
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)

            if os.path.exists(profile_path):
                with open(profile_path, "r", encoding="utf-8") as src:
                    with open(backup_path, "w", encoding="utf-8") as dst:
                        dst.write(src.read())
                print(f"   Created backup at {backup_path}")

            # Save the updated profile
            with open(profile_path, "w", encoding="utf-8") as f:
                yaml.dump(
                    updated_profile, f, default_flow_style=False, allow_unicode=True
                )

            print(f"✅ Successfully updated profile for {user_id}")

            # Optionally clean up the extracted data file
            extracted_file = f"data/extracted/{user_id}{EXTRACTED_DATA_SUFFIX}"
            if os.path.exists(extracted_file):
                clean_up = input(
                    f"   Remove extracted data file for {user_id}? (y/n): "
                )
                if clean_up.lower() == "y":
                    os.remove(extracted_file)
                    print(f"   Removed extracted data file for {user_id}")

            return True

        except yaml.YAMLError as e:
            print(f"❌ Error: Invalid YAML generated for {user_id}")
            print(f"Error details: {str(e)}")

            # Save the raw response for debugging
            raw_path = f"data/backups/raw_responses/{user_id}_raw.txt"
            os.makedirs(os.path.dirname(raw_path), exist_ok=True)
            with open(raw_path, "w", encoding="utf-8") as f:
                f.write(response_text)
            print(f"   Raw response saved to {raw_path}")
            return False

    except Exception as e:
        print(f"❌ Error calling Gemini API: {str(e)}")
        return False


def main():
    """Process all prompt files and update profiles."""
    # Create directories if they don't exist
    os.makedirs("data/profiles", exist_ok=True)
    os.makedirs(PROMPT_DIR, exist_ok=True)
    os.makedirs("data/backups/profiles", exist_ok=True)
    os.makedirs("data/backups/raw_responses", exist_ok=True)

    # Check if prompt directory exists
    if not os.path.exists(PROMPT_DIR):
        print(f"Error: '{PROMPT_DIR}' directory not found.")
        print("Please ensure you've created the prompt files first.")
        return

    # Get all prompt files
    prompt_files = [f for f in os.listdir(PROMPT_DIR) if f.endswith("_prompt.txt")]

    if not prompt_files:
        print(f"No prompt files found in '{PROMPT_DIR}' directory.")
        print("Please create prompt files first.")
        return

    print(f"Found {len(prompt_files)} prompt files to process.")

    # For testing, let's just do the first one
    if prompt_files:
        test_file = prompt_files[0]
        user_id = test_file.replace("_prompt.txt", "")
        print(f"\nProcessing {user_id} as a test...")

        if update_profile_with_gemini(user_id):
            print(f"\nTest successful! You can now process all files.")

            # Ask if user wants to process all files
            process_all = input("Process all files? (y/n): ")
            if process_all.lower() == "y":
                success_count = 1  # already processed one
                for prompt_file in prompt_files[1:]:  # skip the first one
                    user_id = prompt_file.replace("_prompt.txt", "")
                    print(f"\nProcessing {user_id}...")

                    if update_profile_with_gemini(user_id):
                        success_count += 1

                print(
                    f"\nSummary: Successfully updated {success_count}/{len(prompt_files)} profiles"
                )
        else:
            print("Test failed. Please check the error message above.")


if __name__ == "__main__":
    main()
