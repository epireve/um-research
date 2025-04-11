#!/usr/bin/env python3
"""
Simple test script that installs dependencies and processes one profile
"""

import os
import subprocess

# Install required packages
try:
    import yaml
except ImportError:
    print("Installing PyYAML...")
    subprocess.check_call(["pip", "install", "pyyaml"])
    import yaml

try:
    from markdownify import markdownify
except ImportError:
    print("Installing markdownify...")
    subprocess.check_call(["pip", "install", "markdownify"])
    from markdownify import markdownify

import re


def read_yaml_profile(file_path):
    """Read an existing YAML profile file."""
    with open(file_path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def read_html_and_markdownify(file_path):
    """Read an HTML file and convert it to markdown."""
    if (
        not os.path.exists(file_path) or os.path.getsize(file_path) < 200
    ):  # Skip empty or near-empty files
        return None

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            html_content = file.read()
            # Use markdownify with settings to preserve some structure
            md = markdownify(html_content, heading_style="ATX", bullets="-")
            return md
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None


def extract_publications(markdown_content):
    """Extract publication information from markdown content."""
    publications = []

    # Look for publications section
    if "PUBLICATIONS" in markdown_content:
        section_content = markdown_content.split("PUBLICATIONS")[1].split("\n\n")[0]
        publications.append(
            {"section": "PUBLICATIONS", "content": section_content.strip()}
        )

    return publications


def main():
    # Process a single profile
    user_id = "sitihafizah"

    # Paths to files
    yaml_path = f"profiles/{user_id}.yaml"
    profile_html_path = f"source/profile/{user_id}.html"

    # Read existing YAML profile
    print(f"Reading existing profile for {user_id}...")
    profile_data = read_yaml_profile(yaml_path)
    print(f"Profile name: {profile_data.get('name', 'Unknown')}")

    # Process HTML
    print("\nProcessing profile HTML...")
    profile_md = read_html_and_markdownify(profile_html_path)
    if profile_md:
        print("Successfully converted HTML to Markdown")

        # Extract publications
        publications = extract_publications(profile_md)
        if publications:
            print(f"Found {len(publications)} publication entries")

        # Save extracted data
        extracted_data = {"publications": publications}
        output_path = f"profiles/{user_id}_extracted.yaml"

        with open(output_path, "w", encoding="utf-8") as f:
            yaml.dump(extracted_data, f, default_flow_style=False, allow_unicode=True)

        print(f"\nExtracted data saved to {output_path}")
    else:
        print("No profile HTML content found or error processing file")


if __name__ == "__main__":
    main()
