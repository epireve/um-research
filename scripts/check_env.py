#!/usr/bin/env python3
"""
Simple script to check environment variables
"""

import os
import sys
from pathlib import Path


def main():
    print("Python version:", sys.version)
    print("\nEnvironment variables:")

    # Check for Gemini API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        print("GEMINI_API_KEY: Found (not displaying for security)")
    else:
        print("GEMINI_API_KEY: Not found")

    # Check other environment variables
    model_name = os.environ.get("GEMINI_MODEL")
    print(f"GEMINI_MODEL: {model_name or 'Not found'}")

    prompt_dir = os.environ.get("PROMPT_DIR", "data/prompts")
    print(f"PROMPT_DIR: {prompt_dir}")

    # Check for prompt files
    prompt_path = Path(prompt_dir)
    if prompt_path.exists():
        prompt_files = list(prompt_path.glob("*_prompt.txt"))
        print(f"\nFound {len(prompt_files)} prompt files in '{prompt_dir}' directory:")
        for file in prompt_files[:5]:  # Show just the first 5
            print(f"  - {file.name}")
        if len(prompt_files) > 5:
            print(f"  ... and {len(prompt_files) - 5} more")
    else:
        print(f"\nThe '{prompt_dir}' directory does not exist.")

    # Check for profile files
    profiles_path = Path("data/profiles")
    if profiles_path.exists():
        profile_files = list(profiles_path.glob("*.yaml"))
        print(
            f"\nFound {len(profile_files)} profile files in '{profiles_path}' directory:"
        )
        for file in profile_files[:5]:  # Show just the first 5
            print(f"  - {file.name}")
        if len(profile_files) > 5:
            print(f"  ... and {len(profile_files) - 5} more")
    else:
        print(f"\nThe '{profiles_path}' directory does not exist.")

    # Check for extracted files
    extracted_path = Path("data/extracted")
    if extracted_path.exists():
        extracted_files = list(extracted_path.glob("*_extracted.yaml"))
        print(
            f"\nFound {len(extracted_files)} extracted files in '{extracted_path}' directory:"
        )
        for file in extracted_files[:5]:  # Show just the first 5
            print(f"  - {file.name}")
        if len(extracted_files) > 5:
            print(f"  ... and {len(extracted_files) - 5} more")
    else:
        print(f"\nThe '{extracted_path}' directory does not exist.")

    # Check available packages
    print("\nChecking for required packages:")

    try:
        import yaml

        print("✅ PyYAML is installed")
    except ImportError:
        print("❌ PyYAML is not installed")

    try:
        from google import genai

        print("✅ google-genai is installed")
    except ImportError:
        print("❌ google-genai is not installed")

    try:
        from dotenv import load_dotenv

        print("✅ python-dotenv is installed")
    except ImportError:
        print("❌ python-dotenv is not installed")


if __name__ == "__main__":
    main()
