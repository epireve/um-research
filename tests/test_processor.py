"""
Test script to process a single supervisor profile and display results.
"""

import os
import yaml
from processor import read_yaml_profile, read_html_and_markdownify, extract_publications
from processor import (
    extract_contact_info,
    extract_social_profiles,
    extract_research_interests,
)
from processor import extract_academic_background


def process_single_profile(user_id):
    """Process a single supervisor profile and display extracted information."""
    # Paths to all possible source files
    yaml_path = f"profiles/{user_id}.yaml"
    profile_html_path = f"source/profile/{user_id}.html"
    cv_html_path = f"source/cv/{user_id}.html"
    dashboard_html_path = f"source/dashboard/{user_id}.html"

    # Read existing YAML profile
    print(f"Reading existing profile for {user_id}...")
    profile_data = read_yaml_profile(yaml_path)
    print(f"Profile name: {profile_data.get('name', 'Unknown')}")

    # Process source files
    sources = {}

    # Process profile HTML
    print("\nProcessing profile HTML...")
    profile_md = read_html_and_markdownify(profile_html_path)
    if profile_md:
        sources["profile"] = profile_md
        sample = profile_md[:500] + "..." if len(profile_md) > 500 else profile_md
        print(f"Sample content:\n{sample}")
    else:
        print("No profile HTML content found or error processing file")

    # Process CV HTML
    print("\nProcessing CV HTML...")
    cv_md = read_html_and_markdownify(cv_html_path)
    if cv_md:
        sources["cv"] = cv_md
        sample = cv_md[:500] + "..." if len(cv_md) > 500 else cv_md
        print(f"Sample content:\n{sample}")
    else:
        print("No CV HTML content found or error processing file")

    # Process dashboard HTML
    print("\nProcessing dashboard HTML...")
    dashboard_md = read_html_and_markdownify(dashboard_html_path)
    if dashboard_md:
        sources["dashboard"] = dashboard_md
        sample = dashboard_md[:500] + "..." if len(dashboard_md) > 500 else dashboard_md
        print(f"Sample content:\n{sample}")
    else:
        print("No dashboard HTML content found or error processing file")

    # Extract relevant information from sources
    extracted_data = {
        "publications": [],
        "contact": {},
        "social_profiles": {},
        "research_interests": [],
        "academic_background": [],
        "additional_info": {},
    }

    # Extract information from each source
    for source_type, content in sources.items():
        print(f"\nExtracting data from {source_type}...")

        # Extract publications
        publications = extract_publications(content)
        if publications:
            print(f"Found {len(publications)} publication entries")
            extracted_data["publications"].extend(publications)
            # Show sample publication
            if publications:
                print(f"Sample publication: {publications[0]['content'][:100]}...")

        # Extract contact info
        contact_info = extract_contact_info(content)
        if contact_info:
            print(f"Found contact info: {list(contact_info.keys())}")
            for k, v in contact_info.items():
                if k not in extracted_data["contact"]:
                    extracted_data["contact"][k] = v

        # Extract social profiles
        social_profiles = extract_social_profiles(content)
        if social_profiles:
            print(f"Found social profiles: {list(social_profiles.keys())}")
            for k, v in social_profiles.items():
                if k not in extracted_data["social_profiles"]:
                    extracted_data["social_profiles"][k] = v

        # Extract research interests
        interests = extract_research_interests(content)
        if interests:
            print(f"Found {len(interests)} research interests")
            extracted_data["research_interests"].extend(interests)
            if interests:
                print(f"Sample interest: {interests[0]}")

        # Extract academic background
        education = extract_academic_background(content)
        if education:
            print(f"Found {len(education)} academic qualifications")
            extracted_data["academic_background"].extend(education)
            if education:
                print(f"Sample qualification: {education[0]}")

    # Save the extracted data to the profiles directory
    output_path = f"profiles/{user_id}_extracted.yaml"

    with open(output_path, "w", encoding="utf-8") as f:
        yaml.dump(
            extracted_data,
            f,
            default_flow_style=False,
            allow_unicode=True,
        )

    print(f"\nResults saved to {output_path}")
    print(
        f"Please use Google Gemini 2.5 Pro to merge this extracted data with the original profile at profiles/{user_id}.yaml"
    )


if __name__ == "__main__":
    # Process a sample profile - change this to any profile you want to test
    process_single_profile("sitihafizah")
