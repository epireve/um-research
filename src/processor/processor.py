import os
import re
from pathlib import Path

try:
    import yaml
except ImportError:
    print("Installing PyYAML...")
    import subprocess

    subprocess.check_call(["pip3", "install", "pyyaml"])
    import yaml

try:
    from markdownify import markdownify
except ImportError:
    print("Installing markdownify...")
    import subprocess

    subprocess.check_call(["pip3", "install", "markdownify"])
    from markdownify import markdownify


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


def process_supervisor(user_id):
    """Process all sources for a single supervisor."""
    # Paths to all possible source files
    yaml_path = f"profiles/{user_id}.yaml"
    profile_html_path = f"source/profile/{user_id}.html"
    cv_html_path = f"source/cv/{user_id}.html"
    dashboard_html_path = f"source/dashboard/{user_id}.html"

    # Read existing YAML profile
    profile_data = read_yaml_profile(yaml_path)

    # Process source files
    sources = {}

    # Process profile HTML
    profile_md = read_html_and_markdownify(profile_html_path)
    if profile_md:
        sources["profile"] = profile_md

    # Process CV HTML
    cv_md = read_html_and_markdownify(cv_html_path)
    if cv_md:
        sources["cv"] = cv_md

    # Process dashboard HTML
    dashboard_md = read_html_and_markdownify(dashboard_html_path)
    if dashboard_md:
        sources["dashboard"] = dashboard_md

    # Return both the existing profile and the extracted sources
    return {"profile_data": profile_data, "sources": sources}


def extract_section(markdown_content, section_name):
    """Extract a section from the markdown content based on headers."""
    # Look for headers that might indicate the section
    patterns = [
        rf"# {section_name}",
        rf"## {section_name}",
        rf"\*\*{section_name}\*\*",
        rf"{section_name}:",
    ]

    for pattern in patterns:
        matches = re.split(pattern, markdown_content, flags=re.IGNORECASE)
        if len(matches) > 1:
            # Get content after the header until the next header or end
            section_content = matches[1]
            next_header = re.search(r"#|\*\*|\n\n[A-Z]", section_content)
            if next_header:
                section_content = section_content[: next_header.start()]
            return section_content.strip()

    return None


def extract_publications(markdown_content):
    """Extract publication information from markdown content."""
    publications = []

    # Look for various publication section names
    sections = [
        "ACADEMIC JOURNALS",
        "JOURNAL ARTICLES",
        "ARTICLES IN ACADEMIC JOURNALS",
        "CHAPTER IN BOOK",
        "CHAPTERS IN BOOKS",
        "BOOK CHAPTERS",
        "PROCEEDINGS",
        "CONFERENCE PROCEEDINGS",
        "CONFERENCES",
        "PUBLICATIONS",
    ]

    # Extract publications from identified sections
    for section in sections:
        section_content = extract_section(markdown_content, section)
        if section_content:
            # Split into individual publications if possible
            individual_pubs = re.split(r"\n\s*\n|\n-\s+|\n\d+\.\s+", section_content)
            for pub in individual_pubs:
                if len(pub.strip()) > 10:  # Skip very short fragments
                    publications.append({"section": section, "content": pub.strip()})

    # Try to look for patterns that might indicate publications
    # This catches publications that aren't in a specific section
    pub_patterns = [
        r"\d{4}\)\.\s+[A-Z].*?(?=\n\n|\Z)",  # Year followed by title
        r"\(\d{4}\)\.\s+.*?(?=\n\n|\Z)",  # Year in parentheses followed by text
        r"[A-Za-z., ]+ et al\..*?(?=\n\n|\Z)",  # Author et al. pattern
    ]

    for pattern in pub_patterns:
        matches = re.findall(pattern, markdown_content, re.DOTALL)
        for match in matches:
            if len(match.strip()) > 30:  # Skip short matches
                # Check if this publication is unique
                is_unique = True
                for existing_pub in publications:
                    if match.strip() in existing_pub["content"]:
                        is_unique = False
                        break

                if is_unique:
                    publications.append(
                        {"section": "DETECTED_PUBLICATIONS", "content": match.strip()}
                    )

    return publications


def extract_contact_info(markdown_content):
    """Extract contact information from markdown content."""
    contact_info = {}

    # Extract email addresses
    email_matches = re.findall(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", markdown_content
    )
    if email_matches:
        contact_info["email"] = list(set(email_matches))  # Remove duplicates

    # Extract phone numbers
    phone_matches = re.findall(
        r"(?:Tel|Phone|Contact)(?:[:\s]+)([+\d\s()-]{7,})",
        markdown_content,
        re.IGNORECASE,
    )
    if phone_matches:
        contact_info["phone"] = [m.strip() for m in phone_matches]

    # Extract office location
    office_pattern = r"(?:Office|Room|Location)(?:[:\s]+)(.*?)(?:\n|$)"
    office_matches = re.findall(office_pattern, markdown_content, re.IGNORECASE)
    if office_matches:
        contact_info["office"] = office_matches[0].strip()

    return contact_info


def extract_social_profiles(markdown_content):
    """Extract social and academic profile links."""
    profiles = {}

    # Common academic and professional profiles
    profile_patterns = {
        "google_scholar": r'scholar\.google\.com[^\s"\'<>]+',
        "researchgate": r'researchgate\.net[^\s"\'<>]+',
        "orcid": r'orcid\.org[^\s"\'<>]+',
        "linkedin": r'linkedin\.com[^\s"\'<>]+',
        "academia": r'academia\.edu[^\s"\'<>]+',
        "dblp": r'dblp\.org[^\s"\'<>]+',
        "website": r'https?://(?!scholar\.google|researchgate|orcid|linkedin|academia|dblp)[^\s"\'<>]+',
    }

    for profile_type, pattern in profile_patterns.items():
        matches = re.findall(pattern, markdown_content)
        if matches:
            # Clean up the URLs and add proper http:// if missing
            clean_urls = []
            for url in matches:
                if not url.startswith("http"):
                    url = "https://" + url
                clean_urls.append(url)

            profiles[profile_type] = list(set(clean_urls))  # Remove duplicates

    return profiles


def extract_research_interests(markdown_content):
    """Extract research interests."""
    # Look for research interests section
    research_interests = []

    interest_section = extract_section(markdown_content, "RESEARCH INTERESTS")
    if not interest_section:
        interest_section = extract_section(markdown_content, "RESEARCH AREA")

    if interest_section:
        # Try to split into individual interests
        interests = re.split(r"\n-\s+|\n\*\s+|\n\d+\.\s+", interest_section)
        for interest in interests:
            if len(interest.strip()) > 5:
                research_interests.append(interest.strip())

    return research_interests


def extract_academic_background(markdown_content):
    """Extract academic qualifications and education."""
    education = []

    # Look for education/qualification section
    edu_section = extract_section(markdown_content, "EDUCATION")
    if not edu_section:
        edu_section = extract_section(markdown_content, "QUALIFICATION")
    if not edu_section:
        edu_section = extract_section(markdown_content, "ACADEMIC QUALIFICATION")

    if edu_section:
        # Try to split into individual qualifications
        qualifications = re.split(r"\n-\s+|\n\*\s+|\n\d+\.\s+|\n\n", edu_section)
        for qual in qualifications:
            if len(qual.strip()) > 10:
                # Check for degree patterns
                if re.search(
                    r"(?:PhD|Doctorate|Master|MSc|BSc|Bachelor|Degree)",
                    qual,
                    re.IGNORECASE,
                ):
                    education.append(qual.strip())

    # Also try to look for degree patterns throughout the document
    degree_matches = re.findall(
        r"(?:PhD|Doctorate|Master|MSc|BSc|Bachelor)[^\n.]*(?:from|at|University|Institute)[^\n.]*\.",
        markdown_content,
    )
    for match in degree_matches:
        if len(match.strip()) > 10 and match.strip() not in education:
            education.append(match.strip())

    return education


def main():
    # Get list of all YAML files
    yaml_files = [f for f in os.listdir("profiles") if f.endswith(".yaml")]

    for yaml_file in yaml_files:
        user_id = yaml_file.replace(".yaml", "")
        print(f"Processing {user_id}...")

        result = process_supervisor(user_id)

        if not result["sources"]:
            print(f"No source files found for {user_id}")
            continue

        # Extract relevant information from sources
        extracted_data = {
            "publications": [],
            "contact": {},
            "social_profiles": {},
            "research_interests": [],
            "academic_background": [],
            "additional_info": {},
        }

        for source_type, content in result["sources"].items():
            print(f"  Extracting from {source_type}...")

            # Extract publications
            publications = extract_publications(content)
            if publications:
                extracted_data["publications"].extend(publications)

            # Extract contact info
            contact_info = extract_contact_info(content)
            if contact_info:
                for k, v in contact_info.items():
                    if k not in extracted_data["contact"]:
                        extracted_data["contact"][k] = v

            # Extract social profiles
            social_profiles = extract_social_profiles(content)
            if social_profiles:
                for k, v in social_profiles.items():
                    if k not in extracted_data["social_profiles"]:
                        extracted_data["social_profiles"][k] = v

            # Extract research interests
            interests = extract_research_interests(content)
            if interests:
                extracted_data["research_interests"].extend(interests)

            # Extract academic background
            education = extract_academic_background(content)
            if education:
                extracted_data["academic_background"].extend(education)

        # Remove duplicates
        extracted_data["research_interests"] = list(
            set(extracted_data["research_interests"])
        )
        extracted_data["academic_background"] = list(
            set(extracted_data["academic_background"])
        )

        # Create a combined data file for review (temporary)
        temp_output_path = f"profiles/{user_id}_extracted.yaml"

        with open(temp_output_path, "w", encoding="utf-8") as f:
            # Use yaml.dump with allow_unicode to handle non-ASCII characters
            yaml.dump(
                extracted_data,
                f,
                default_flow_style=False,
                allow_unicode=True,
            )

        print(f"Saved extracted data for {user_id} at {temp_output_path}")
        print(
            "Please use this extracted data to update the original profile using a language model like Google Gemini."
        )
        print(f"Original profile: profiles/{user_id}.yaml")
        print(f"Extracted data: {temp_output_path}")


if __name__ == "__main__":
    main()
