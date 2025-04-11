"""
Instructions for Integrating Extracted Data with Google Gemini 2.5 Pro

This file provides guidance on how to use the extracted data from processor.py
with Google Gemini 2.5 Pro to update the supervisor YAML profiles.

After running processor.py, you'll have extracted data files in the 'data/extracted' directory
with "_extracted.yaml" suffix alongside the original profiles.
"""

import os
import yaml
from pathlib import Path


def generate_gemini_prompt(user_id):
    """
    Generate a prompt for Google Gemini 2.5 Pro to update a supervisor's profile.
    """
    profile_file = f"data/profiles/{user_id}.yaml"
    extracted_file = f"data/extracted/{user_id}_extracted.yaml"

    if not os.path.exists(extracted_file):
        return f"No extracted data found for {user_id}"

    # Load the profile and extracted data
    with open(profile_file, "r", encoding="utf-8") as f:
        existing_profile = yaml.safe_load(f)

    with open(extracted_file, "r", encoding="utf-8") as f:
        extracted_data = yaml.safe_load(f)

    # Create the prompt for Gemini
    prompt = f"""You are a helpful assistant trained to merge extracted data with existing YAML profiles.

TASK: Merge the extracted data into the existing profile for Professor {user_id} while following these rules:

1. IMPORTANT: Add new information without removing any existing information
2. Merge similar sections, combining data appropriately
3. Ensure the final result is valid YAML with proper indentation
4. Remove any duplicates (e.g., in publications, research interests)
5. Format inline lists as YAML lists with proper indentation
6. Prioritize newer information when there are conflicts

EXISTING PROFILE:
```yaml
{yaml.dump(existing_profile, default_flow_style=False, allow_unicode=True)}
```

EXTRACTED DATA:
```yaml
{yaml.dump(extracted_data, default_flow_style=False, allow_unicode=True)}
```

OUTPUT FORMAT: Provide ONLY the updated YAML content without any additional explanations or conversation.
"""

    return prompt


def create_gemini_inputs():
    """
    Create prompt files for each supervisor to use with Google Gemini 2.5 Pro.
    """
    prompt_dir = Path("data/prompts")
    prompt_dir.mkdir(exist_ok=True, parents=True)

    # Find all extracted data files
    extracted_dir = Path("data/extracted")
    extracted_files = [f.name for f in extracted_dir.glob("*_extracted.yaml")]

    for file in extracted_files:
        user_id = file.replace("_extracted.yaml", "")
        prompt = generate_gemini_prompt(user_id)

        prompt_file = prompt_dir / f"{user_id}_prompt.txt"
        with open(prompt_file, "w", encoding="utf-8") as f:
            f.write(prompt)

        print(f"Created prompt for {user_id}")


def main():
    """
    Run this script after processor.py to generate prompts for Google Gemini 2.5 Pro.
    """
    # Check if any extracted files exist
    extracted_dir = Path("data/extracted")
    extracted_files = list(extracted_dir.glob("*_extracted.yaml"))

    if not extracted_files:
        print("Error: No extracted data files found. Please run processor.py first.")
        return

    print("Generating prompts for Google Gemini 2.5 Pro...")
    create_gemini_inputs()

    print("\nDone! Follow these steps to update profiles:")
    print("1. Go to the 'data/prompts' directory")
    print("2. For each file, copy the content and paste it to Google Gemini 2.5 Pro")
    print(
        "3. Save Gemini's response as the updated YAML file in 'data/profiles' directory, replacing the original file"
    )
    print("4. After updating each profile, you can delete the _extracted.yaml file")
    print(
        "\nAlternatively, you could use the Google Gemini API to automate this process."
    )


if __name__ == "__main__":
    main()
