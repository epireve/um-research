#!/usr/bin/env python3
"""
Script to automate updating profiles using the Gemini API
"""

import os
import sys
from pathlib import Path

# Check if required packages are installed
try:
    import yaml
except ImportError:
    print("Installing PyYAML...")
    import subprocess

    subprocess.check_call(["pip3", "install", "pyyaml"])
    import yaml

try:
    from dotenv import load_dotenv
except ImportError:
    print("Installing python-dotenv...")
    import subprocess

    subprocess.check_call(["pip3", "install", "python-dotenv"])
    from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check if required packages are installed
try:
    from google import genai
except ImportError:
    print("Error: google-genai package not found. Installing...")
    import subprocess

    subprocess.check_call(["pip3", "install", "google-genai"])
    from google import genai

# Set up the Gemini API client
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY environment variable not set. Please create a .env file based on .env.example"
    )

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-pro-exp-03-25")
PROMPT_DIR = os.getenv("PROMPT_DIR", "gemini_prompts")
EXTRACTED_DATA_SUFFIX = os.getenv("EXTRACTED_DATA_SUFFIX", "_extracted.yaml")

# Configure the Gemini API client
genai.configure(api_key=API_KEY)


def update_profile_with_gemini(user_id):
    """Update a profile using Gemini API."""
    prompt_file = f"{PROMPT_DIR}/{user_id}_prompt.txt"

    if not os.path.exists(prompt_file):
        print(f"No prompt file found for {user_id}")
        return False

    # Read the prompt
    with open(prompt_file, "r", encoding="utf-8") as f:
        prompt = f.read()

    # Call the Gemini API
    print(f"   Calling Gemini API with model {MODEL_NAME}...")
    model = genai.GenerativeModel(model_name=MODEL_NAME)

    try:
        response = model.generate_content(prompt)

        # Extract YAML content from response
        yaml_content = response.text

        # Validate that it's valid YAML
        try:
            updated_profile = yaml.safe_load(yaml_content)

            # Save the updated profile
            profile_path = f"profiles/{user_id}.yaml"

            # Create a backup of the original file
            backup_path = f"profiles/{user_id}.yaml.bak"
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

            # Clean up the extracted data file
            extracted_file = f"profiles/{user_id}{EXTRACTED_DATA_SUFFIX}"
            if os.path.exists(extracted_file):
                os.remove(extracted_file)
                print(f"   Removed extracted data file for {user_id}")

            return True

        except yaml.YAMLError:
            print(f"❌ Error: Gemini response for {user_id} is not valid YAML")
            print(
                f"   Saving raw response to profiles/{user_id}_raw_response.txt for review"
            )

            with open(
                f"profiles/{user_id}_raw_response.txt", "w", encoding="utf-8"
            ) as f:
                f.write(yaml_content)

            return False

    except Exception as e:
        print(f"❌ Error calling Gemini API for {user_id}: {e}")
        return False


def main():
    """Process all prompt files and update profiles."""
    # Create directories if they don't exist
    os.makedirs("profiles", exist_ok=True)
    os.makedirs(PROMPT_DIR, exist_ok=True)

    # Check if prompt directory exists
    if not os.path.exists(PROMPT_DIR):
        print(
            f"Error: '{PROMPT_DIR}' directory not found. Please run gemini_integration.py first."
        )
        return

    # Get all prompt files
    prompt_files = [f for f in os.listdir(PROMPT_DIR) if f.endswith("_prompt.txt")]

    if not prompt_files:
        print(f"No prompt files found in '{PROMPT_DIR}' directory.")
        return

    print(f"Found {len(prompt_files)} prompt files to process.")

    success_count = 0
    for prompt_file in prompt_files:
        user_id = prompt_file.replace("_prompt.txt", "")
        print(f"\nProcessing {user_id}...")

        if update_profile_with_gemini(user_id):
            success_count += 1

    print(
        f"\nSummary: Successfully updated {success_count}/{len(prompt_files)} profiles"
    )

    if success_count < len(prompt_files):
        print("Some profiles failed to update. Check the output above for details.")
        print("For any failures, you can:")
        print("1. Check the raw responses in the profiles directory")
        print(
            "2. Manually update the profiles with Google Gemini from the prompt files"
        )


if __name__ == "__main__":
    main()
