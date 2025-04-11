# Profile Merging Process

This document explains the methodology and process used for merging extracted profile data with existing supervisor profiles using AI assistance.

## Overview

The profile merging process combines data extracted from multiple sources with existing supervisor profiles to create comprehensive, up-to-date profiles for each research supervisor. This process ensures that:

1. New information is added without losing existing data
2. Similar sections are intelligently merged
3. Duplicate information is removed
4. The YAML structure remains consistent

## Process Flow

The merging process follows these steps:

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Source Data   │ → │ Data           │ → │ AI-Assisted    │ → │ Updated        │
│ Collection    │    │ Extraction    │    │ Merging       │    │ Profiles      │
└───────────────┘    └───────────────┘    └───────────────┘    └───────────────┘
```

1. **Source Data Collection**: HTML and CSV data is gathered from university websites, academic databases, and other sources.
2. **Data Extraction**: Key information is parsed and extracted into structured YAML files.
3. **AI-Assisted Merging**: Google Gemini 2.5 Pro is used to intelligently merge the extracted data with existing profiles.
4. **Updated Profiles**: The finalized profiles are saved to the repository.

## Tools and Technologies

The merging process uses:

- **Python scripts** for data extraction and processing
- **Google Gemini 2.5 Pro** for intelligent merging
- **PyYAML** for YAML parsing and generation
- **Regular expressions** for pattern matching in text

## Detailed Workflow

### 1. Initial Profile Creation

Each supervisor has an initial profile stored in `profiles/{user_id}.yaml` with basic information:

```yaml
name: "Dr. Example Supervisor"
position: "Associate Professor"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "example@um.edu.my"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "Example University"
    year: 2010
research_interests:
  - "Software Engineering"
  - "Machine Learning"
```

### 2. Data Extraction

New data is extracted from various sources and stored in `profiles/{user_id}_extracted.yaml`:

```yaml
academic_background:
  - degree: "M.Sc."
    field: "Information Technology"
    institution: "University of Example"
    year: 2005
contact:
  email: "example@um.edu.my"
  office: "A-12-12"
  phone: "+60-3-1234-5678"
publications:
  - title: "A Novel Approach to Software Testing"
    authors: "Supervisor, E., Colleague, A."
    venue: "Journal of Software Engineering"
    year: 2020
    doi: "10.1234/jse.2020.1234"
  - title: "Machine Learning for Software Defect Prediction"
    authors: "Supervisor, E., Student, B."
    venue: "International Conference on Software Engineering"
    year: 2019
research_interests:
  - "Automated Testing"
  - "Software Quality Assurance"
```

### 3. Prompt Generation

A prompt is generated for Google Gemini 2.5 Pro in `gemini_prompts/{user_id}_prompt.txt`. The prompt contains:

1. Instructions for merging the data
2. The existing profile data
3. The extracted data to be merged

Example prompt structure:

```
I need you to merge extracted data into an existing YAML profile for Professor Example Supervisor. 
Follow these guidelines:

1. Add new information without removing existing data
2. Merge similar sections (e.g., add new publications to the publications list)
3. Maintain proper YAML structure
4. Remove duplicates where they exist
5. Format inline lists properly with proper indentation
6. Always prioritize newer information if there are conflicts, but preserve complete information

Existing Profile:
---
name: "Dr. Example Supervisor"
position: "Associate Professor"
... [entire existing profile YAML]

Extracted Data:
---
academic_background:
  - degree: "M.Sc."
... [entire extracted data YAML]

Provide only the merged YAML as the response.
```

### 4. AI-Assisted Merging

Google Gemini 2.5 Pro processes the prompt and generates a merged profile by:

1. Analyzing both YAML structures
2. Identifying new information to add
3. Resolving conflicts with newer information
4. Ensuring structural consistency
5. Removing duplicate entries

### 5. Profile Update

The merged profile is saved to `profiles/{user_id}.yaml`, replacing the previous version. The process preserves appropriate indentation and structure.

## Example: Complete Merging Process

### Example 1: Adding New Publications

**Existing profile (simplified):**

```yaml
name: "Dr. Siti Hafizah Ab Hamid"
position: "Senior Lecturer"
department: "Software Engineering"
university: "University of Malaya"
publications:
  - title: "Systematic Literature Review on Agile Methods"
    authors: "Ab Hamid, S.H., Zainal, A."
    venue: "Journal of Software Engineering"
    year: 2018
```

**Extracted data:**

```yaml
publications:
  - title: "Empirical Study of Agile Testing Techniques"
    authors: "Ab Hamid, S.H., Ibrahim, N."
    venue: "International Journal of Software Testing"
    year: 2022
    doi: "10.1234/ijst.2022.5678"
  - title: "A Framework for Automated Test Case Generation"
    authors: "Ab Hamid, S.H., Rahman, F., Ibrahim, N."
    venue: "IEEE Conference on Software Testing"
    year: 2021
    doi: "10.1109/icst.2021.12345"
```

**Merged profile:**

```yaml
name: "Dr. Siti Hafizah Ab Hamid"
position: "Senior Lecturer"
department: "Software Engineering"
university: "University of Malaya"
publications:
  - title: "Empirical Study of Agile Testing Techniques"
    authors: "Ab Hamid, S.H., Ibrahim, N."
    venue: "International Journal of Software Testing"
    year: 2022
    doi: "10.1234/ijst.2022.5678"
  - title: "A Framework for Automated Test Case Generation"
    authors: "Ab Hamid, S.H., Rahman, F., Ibrahim, N."
    venue: "IEEE Conference on Software Testing"
    year: 2021
    doi: "10.1109/icst.2021.12345"
  - title: "Systematic Literature Review on Agile Methods"
    authors: "Ab Hamid, S.H., Zainal, A."
    venue: "Journal of Software Engineering"
    year: 2018
```

### Example 2: Updating Contact Information and Adding Academic Background

**Existing profile:**

```yaml
name: "Dr. Chiam Yin Kia"
position: "Senior Lecturer"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "tkchiew@um.edu.my"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2015
```

**Extracted data:**

```yaml
contact:
  email: "tkchiew@um.edu.my"
  office: "A-12-12"
  phone: "+60-3-7967-1234"
academic_background:
  - degree: "M.Sc."
    field: "Information Technology"
    institution: "Universiti Putra Malaysia"
    year: 1999
  - degree: "B.Sc."
    field: "Computer Science"
    institution: "Universiti Putra Malaysia"
    year: 1997
```

**Merged profile:**

```yaml
name: "Dr. Chiam Yin Kia"
position: "Senior Lecturer"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "tkchiew@um.edu.my"
  office: "A-12-12"
  phone: "+60-3-7967-1234"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2015
  - degree: "M.Sc."
    field: "Information Technology"
    institution: "Universiti Putra Malaysia"
    year: 1999
  - degree: "B.Sc."
    field: "Computer Science"
    institution: "Universiti Putra Malaysia"
    year: 1997
```

## Merging Challenges and Solutions

### Duplicate Detection

**Challenge:** Identifying duplicate publications that may have slightly different titles or author listings.

**Solution:** Google Gemini 2.5 Pro was able to recognize patterns indicating the same publication even with minor variations. The AI considered:
- Title similarity
- Author listings
- Publication year
- Venue

### Conflicting Information

**Challenge:** Resolving conflicts when the existing profile and extracted data contained different information.

**Solution:** The AI was instructed to prioritize newer information while preserving completeness. For example, if the existing profile had detailed author information but the extracted data had newer dates, the merged result would include both the detailed author information and the updated dates.

### Maintaining Structure

**Challenge:** Ensuring the nested YAML structure remained valid and consistent.

**Solution:** The AI was given examples of the expected structure and specifically instructed to maintain proper indentation and formatting. The prompts included guidelines for handling nested objects and arrays.

## Quality Assurance

To ensure the quality of merged profiles:

1. **Backup Creation**: Before merging, each existing profile was backed up.
2. **Manual Review**: After AI-assisted merging, profiles were manually reviewed for accuracy.
3. **Schema Validation**: The merged profiles were validated against the schema to ensure structural integrity.
4. **Completeness Check**: The profiles were checked to ensure all available information was properly merged.

## Future Improvements

The merging process can be improved in the following ways:

1. **Automated Validation**: Implement automated tests to validate merged profiles against the schema.
2. **Incremental Updates**: Develop a system for regular, incremental updates rather than one-time merges.
3. **Conflict Resolution Rules**: Create more detailed rules for resolving specific types of conflicts.
4. **Source Tracking**: Add metadata to track the source of each piece of information.
5. **User Interface**: Develop a web interface for manual review and editing of merged profiles.

## Conclusion

The AI-assisted merging process successfully integrated extracted data with existing profiles, resulting in comprehensive and up-to-date information for each supervisor. The combination of automated extraction, AI-based merging, and manual review ensured high-quality results while significantly reducing the time and effort required for the task. 