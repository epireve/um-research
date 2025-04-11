# Supervisor Profile Format Standards

## Overview

This document outlines the formatting standards for all supervisor profiles in the Research Supervisor Matching project. Consistent formatting ensures data quality, improves searchability, and provides a better experience for users of the system.

## YAML Structure

All profiles must adhere to the following structure:

```yaml
name: "Full Name with Title"
position: "Current Academic Position"
department: "Department Name"
university: "University Name"
contact:
  email: "institutional.email@example.edu"
  office: "Building and Room Number"
  phone: "+XX-XXX-XXXXXXX"
  website: "https://personal.website.edu"
academic_background:
  - degree: "Degree Type"
    field: "Field of Study"
    institution: "Institution Name"
    year: YYYY
    thesis: "Thesis Title (if applicable)"
research_interests:
  - "Research Interest 1"
  - "Research Interest 2"
expertise:
  - "Expertise Area 1"
  - "Expertise Area 2"
key_achievements:
  - "Achievement 1"
  - "Achievement 2"
publications:
  - title: "Publication Title"
    authors: "Author1, Author2, ..."
    venue: "Journal/Conference Name"
    year: YYYY
    doi: "DOI identifier"
    citation: "Standard Citation Format"
    type: "journal|conference|book|report"
projects:
  - title: "Project Title"
    description: "Brief description of the project"
    role: "Principal Investigator/Co-Investigator/etc."
    funding: "Funding Agency and Amount"
    duration: "Start Year - End Year"
    status: "Completed/Ongoing"
supervised_students:
  phd:
    - name: "Student Name"
      thesis: "Thesis Title"
      year: YYYY
      status: "Completed/Ongoing"
  masters:
    - name: "Student Name"
      thesis: "Thesis Title"
      year: YYYY
      status: "Completed/Ongoing"
  undergraduate:
    - name: "Student Name"
      project: "Project Title"
      year: YYYY
roles:
  - title: "Role Title"
    organization: "Organization Name"
    duration: "Start Year - End Year"
professional_memberships:
  - name: "Organization Name"
    role: "Member/Committee Member/etc."
    duration: "Start Year - End Year"
profile_links:
  google_scholar: "https://scholar.google.com/..."
  orcid: "https://orcid.org/XXXX-XXXX-XXXX-XXXX"
  scopus: "https://www.scopus.com/authid/..."
  researchgate: "https://www.researchgate.net/profile/..."
  linkedin: "https://www.linkedin.com/in/..."
```

## Field Format Standards

### Names and Titles

- **Full Name**: Include title (Dr., Prof., etc.) and full name
- **Position**: Use standard academic positions (e.g., "Senior Lecturer", "Associate Professor")
- **Department**: Use official department name
- **University**: Use full university name

### Contact Information

- **Email**: Use institutional email, not personal
- **Office**: Include building name and room number
- **Phone**: Use international format with country code (+XX-XXX-XXXXXX)
- **Website**: Include full URL with https://

### Academic Background

- **Degree**: Use standard abbreviations (Ph.D., M.Sc., B.Eng., etc.)
- **Field**: Be specific but not overly narrow
- **Institution**: Use full institution name, not abbreviations
- **Year**: Use four-digit year format (YYYY)
- **Thesis**: Include full thesis title in sentence case

### Research Interests and Expertise

- Use consistent terminology across profiles
- Keep items brief (2-5 words where possible)
- Use sentence case
- Avoid overly broad terms

### Publications

- **Title**: Use title case for publication titles
- **Authors**: List all authors in the format "Lastname, F., Lastname, F., ..."
- **Venue**: Use full journal/conference name, not abbreviations
- **Year**: Use four-digit year format (YYYY)
- **DOI**: Include complete DOI with prefix (10.XXXX/...)
- **Citation**: Use APA or IEEE format consistently
- **Type**: Categorize as "journal", "conference", "book", "report", or "other"

### Projects

- **Title**: Use official project title
- **Description**: Provide a brief (1-3 sentence) summary
- **Funding**: Include both funding agency and amount if available
- **Duration**: Use "YYYY - YYYY" format

### Supervised Students

- **Name**: Use full student name
- **Thesis/Project**: Use full title in sentence case
- **Year**: Use completion year or expected completion year
- **Status**: Use either "Completed" or "Ongoing"

### Roles and Memberships

- **Title**: Use official role title
- **Organization**: Use full organization name
- **Duration**: Use "YYYY - YYYY" format or "YYYY - Present" for current roles

### Profile Links

- Include full URLs with proper prefixes (https://)
- Verify all links are working and point to the correct profile

## Formatting Conventions

### Lists

- All lists should be in YAML sequence format with hyphen prefix
- Each item in a list should follow the same grammatical structure
- Use sentence case for list items, unless they are proper nouns

### Dates

- Use four-digit years (YYYY)
- For date ranges, use "YYYY - YYYY" format with spaces around the hyphen
- For ongoing activities, use "YYYY - Present"

### Descriptions and Text Fields

- Use sentence case for descriptions
- Avoid abbreviations unless they are standard in the field
- Keep descriptions concise but informative
- Use proper grammar and punctuation

## Validation Requirements

All profiles must pass the following validation checks:

1. All required fields are present
2. Dates are in correct format
3. Email addresses are valid
4. URLs are properly formatted and working
5. DOIs are in valid format
6. No duplicate entries exist in lists
7. All sequences and maps follow proper YAML formatting

## Implementation Procedure

To ensure all profiles meet these standards:

1. Review existing profiles against these standards
2. Update any non-conforming fields
3. Run automated validation checks
4. Address any validation errors
5. Have a second person review the profile for quality

## Tools for Formatting Standardization

The following tools are available in the repository to help with standardization:

- `validate_profile.py`: Script to check a profile against schema requirements
- `format_publications.py`: Script to standardize publication formats
- `normalize_institutions.py`: Script to standardize institution names
- `keyword_standardizer.py`: Script to suggest standard keywords for research interests 