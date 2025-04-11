"""
Instructions for Integrating Extracted Data with Google Gemini 2.5 Pro

This file provides guidance on how to use the extracted data from processor.py
with Google Gemini 2.5 Pro to update the supervisor YAML profiles.

After running processor.py, you'll have extracted data files in the 'profiles' directory
with "_extracted.yaml" suffix alongside the original profiles.
"""

import os
import yaml
from pathlib import Path


def generate_gemini_prompt(user_id):
    """
    Generate a prompt for Google Gemini 2.5 Pro to update a supervisor's profile.
    """
    profile_file = f"profiles/{user_id}.yaml"
    extracted_file = f"profiles/{user_id}_extracted.yaml"

    if not os.path.exists(extracted_file):
        return f"No extracted data found for {user_id}"

    # Load the profile and extracted data
    with open(profile_file, "r", encoding="utf-8") as f:
        existing_profile = yaml.safe_load(f)

    with open(extracted_file, "r", encoding="utf-8") as f:
        extracted_data = yaml.safe_load(f)

    # Generate prompt
    prompt = f"""
TASK: Merge the extracted data into the existing YAML profile for Professor {user_id}.

INSTRUCTIONS:
1. Add new information from the extracted data to the existing profile.
2. DO NOT remove any existing information.
3. Merge similar sections (like publications or contact info).
4. Ensure the merged data maintains proper YAML structure.
5. Remove any duplicate information.
6. Format inline lists as proper YAML lists with hyphen bullets.
7. Maintain any existing formatting conventions in the YAML.

EXISTING PROFILE:
```yaml
{yaml.dump(existing_profile, default_flow_style=False, allow_unicode=True)}
```

EXTRACTED DATA:
```yaml
{yaml.dump(extracted_data, default_flow_style=False, allow_unicode=True)}
```

IMPORTANT NOTES:
- The extracted data contains information from HTML sources that have been converted to markdown.
- Some elements in the extracted data might be duplicates of what's already in the profile.
- Prioritize adding new publications, contact details, research interests, and academic background.
- Maintain the structure of the existing profile, adding sections only if they don't exist.

Please output only the updated YAML with no additional explanation.
"""
    return prompt


def create_gemini_inputs():
    """
    Create prompt files for each supervisor to use with Google Gemini 2.5 Pro.
    """
    os.makedirs("gemini_prompts", exist_ok=True)

    # Find all extracted data files
    extracted_files = [
        f for f in os.listdir("profiles") if f.endswith("_extracted.yaml")
    ]

    for file in extracted_files:
        user_id = file.replace("_extracted.yaml", "")
        prompt = generate_gemini_prompt(user_id)

        with open(f"gemini_prompts/{user_id}_prompt.txt", "w", encoding="utf-8") as f:
            f.write(prompt)

        print(f"Created prompt for {user_id}")


def main():
    """
    Run this script after processor.py to generate prompts for Google Gemini 2.5 Pro.
    """
    # Check if any extracted files exist
    extracted_files = [
        f for f in os.listdir("profiles") if f.endswith("_extracted.yaml")
    ]
    if not extracted_files:
        print("Error: No extracted data files found. Please run processor.py first.")
        return

    print("Generating prompts for Google Gemini 2.5 Pro...")
    create_gemini_inputs()

    print("\nDone! Follow these steps to update profiles:")
    print("1. Go to the 'gemini_prompts' directory")
    print("2. For each file, copy the content and paste it to Google Gemini 2.5 Pro")
    print(
        "3. Save Gemini's response as the updated YAML file in 'profiles' directory, replacing the original file"
    )
    print("4. After updating each profile, you can delete the _extracted.yaml file")
    print(
        "\nAlternatively, you could use the Google Gemini API to automate this process."
    )


if __name__ == "__main__":
    main()
