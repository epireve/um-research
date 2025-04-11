#!/usr/bin/env python3
"""
Simple script to check environment variables
"""

import os
import sys


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

    prompt_dir = os.environ.get("PROMPT_DIR")
    print(f"PROMPT_DIR: {prompt_dir or 'Not found'}")

    # Check for prompt files
    if os.path.exists("gemini_prompts"):
        prompt_files = [
            f for f in os.listdir("gemini_prompts") if f.endswith("_prompt.txt")
        ]
        print(
            f"\nFound {len(prompt_files)} prompt files in 'gemini_prompts' directory:"
        )
        for file in prompt_files:
            print(f"  - {file}")
    else:
        print("\nThe 'gemini_prompts' directory does not exist.")

    # Check for profile files
    if os.path.exists("profiles"):
        profile_files = [f for f in os.listdir("profiles") if f.endswith(".yaml")]
        print(f"\nFound {len(profile_files)} profile files in 'profiles' directory:")
        for file in profile_files[:5]:  # Show just the first 5
            print(f"  - {file}")
        if len(profile_files) > 5:
            print(f"  ... and {len(profile_files) - 5} more")
    else:
        print("\nThe 'profiles' directory does not exist.")

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

        # Try to load the .env file
        load_dotenv()
        print("   .env file loaded")

        # Check if API key was loaded from .env
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            print("   GEMINI_API_KEY loaded from .env file")
        else:
            print("   GEMINI_API_KEY not found in .env file")

    except ImportError:
        print("❌ python-dotenv is not installed")


if __name__ == "__main__":
    main()
