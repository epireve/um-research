# AI Prompt Templates

This document provides templates and examples of the AI prompts used for various tasks in the Research Supervisor Matching project, particularly focusing on the profile merging process.

## Profile Merging Prompt

The following template is used to generate prompts for merging extracted data into existing supervisor profiles:

```
I need you to merge extracted data into an existing YAML profile for Professor [NAME]. 
Follow these guidelines:

1. Add new information without removing existing data
2. Merge similar sections (e.g., add new publications to the publications list)
3. Maintain proper YAML structure
4. Remove duplicates where they exist
5. Format inline lists properly with proper indentation
6. Always prioritize newer information if there are conflicts, but preserve complete information

Existing Profile:
---
[EXISTING_PROFILE_YAML]

Extracted Data:
---
[EXTRACTED_DATA_YAML]

Provide only the merged YAML as the response.
```

### Parameters

- `[NAME]`: Full name of the supervisor
- `[EXISTING_PROFILE_YAML]`: Complete YAML content of the existing profile
- `[EXTRACTED_DATA_YAML]`: Complete YAML content of the extracted data

## Complete Example

Here is a complete example of a prompt used for merging Dr. Siti Hafizah's profile:

```
I need you to merge extracted data into an existing YAML profile for Professor Siti Hafizah Ab Hamid. 
Follow these guidelines:

1. Add new information without removing existing data
2. Merge similar sections (e.g., add new publications to the publications list)
3. Maintain proper YAML structure
4. Remove duplicates where they exist
5. Format inline lists properly with proper indentation
6. Always prioritize newer information if there are conflicts, but preserve complete information

Existing Profile:
---
name: "Dr. Siti Hafizah Ab Hamid"
position: "Senior Lecturer"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "sitihafizah@um.edu.my"
  office: "A-13-12"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2015
    thesis: "A Framework for Mobile Web Content Adaptation"
research_interests:
  - "Requirements Engineering"
  - "Software Architecture"
  - "Software Testing"
expertise:
  - "Software Quality Assurance"
  - "Web Application Development"
  - "Software Testing"
key_achievements:
  - "Best Paper Award, International Conference on Software Engineering (ICSE) 2018"
  - "University Research Excellence Award, 2020"
publications:
  - title: "A Systematic Literature Review on Agile Requirements Engineering Practices and Challenges"
    authors: "Ab Hamid, S.H., Mahrin, M.N."
    venue: "Journal of Software: Evolution and Process"
    year: 2018
    doi: "10.1002/smr.1921"
  - title: "Enhancing the Quality of Requirements Through Requirements Patterns and Machine Learning"
    authors: "Ab Hamid, S.H., Ibrahim, N."
    venue: "IEEE Access"
    year: 2019
    doi: "10.1109/ACCESS.2019.2924234"
roles:
  - title: "Programme Coordinator"
    organization: "Software Engineering Department"
    duration: "2018 - Present"
  - title: "Committee Member"
    organization: "Faculty Curriculum Development Committee"
    duration: "2017 - Present"
profile_links:
  google_scholar: "https://scholar.google.com/citations?user=123456"
  orcid: "https://orcid.org/0000-0001-2345-6789"

Extracted Data:
---
academic_background:
  - degree: "M.Sc."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2010
  - degree: "B.Sc."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2008
contact:
  email: "sitihafizah@um.edu.my"
  office: "A-13-12"
  phone: "+60-3-7967-6339"
publications:
  - title: "Machine Learning Approaches for Software Defect Prediction: A Systematic Review"
    authors: "Ab Hamid, S.H., Omar, K., Ibrahim, N."
    venue: "IEEE Transactions on Software Engineering"
    year: 2022
    doi: "10.1109/TSE.2022.3145789"
  - title: "An Empirical Study of Test Case Generation Techniques"
    authors: "Ab Hamid, S.H., Zaki, M.Z."
    venue: "Journal of Systems and Software"
    year: 2021
    doi: "10.1016/j.jss.2021.111022"
  - title: "Automated Test Case Generation: Challenges and Opportunities"
    authors: "Ab Hamid, S.H."
    venue: "International Conference on Software Testing"
    year: 2020
    doi: "10.1145/3395667.3397536"
research_interests:
  - "Software Testing"
  - "Test Automation"
  - "Machine Learning in Software Engineering"
profile_links:
  google_scholar: "https://scholar.google.com/citations?user=123456"
  researchgate: "https://www.researchgate.net/profile/Siti_Hafizah_Ab_Hamid"
  scopus: "https://www.scopus.com/authid/detail.uri?authorId=12345678"

Provide only the merged YAML as the response.
```

## Additional Prompt Guidelines

When creating prompts for profile merging, consider these additional guidelines:

### 1. Section-Specific Instructions

For complex sections like publications, add specific instructions:

```
When merging publications:
- Identify duplicates based on title similarity, authors, and year
- Order publications by year (newest first)
- Maintain all fields in publication entries (title, authors, venue, year, doi)
- Ensure consistent formatting of author names (Last, F.M.)
```

### 2. Handling Inconsistencies

Add guidelines for handling inconsistent data:

```
If you encounter inconsistencies:
- For names, degrees, and titles, prefer the more formal, complete version
- For dates and numerical data, prefer the more recent source
- For contact information, prefer the more complete entry
- Document any significant conflicts in a YAML comment
```

### 3. Formatting Guidelines

Include specific formatting guidelines:

```
Ensure proper YAML formatting:
- Use double quotes for all string values containing special characters
- Use proper indentation (2 spaces per level)
- Format multi-line text using the YAML block scalar notation (|)
- For lists, place each item on a new line with proper indentation
```

## Customizing Prompts

The base prompt template can be customized for specific profiles or scenarios:

### For Profiles with Extensive Publications

```
Special instructions for publications:
- This profile has a large number of publications
- Focus on deduplicating based on DOI when available, then fallback to title similarity
- Ensure publications are properly categorized by type (journal, conference, book chapter)
- Maintain chronological ordering within each publication type (newest first)
```

### For Profiles with Multiple Affiliations

```
Special instructions for affiliations and roles:
- This supervisor has multiple affiliations and roles
- Ensure all roles are preserved with their correct durations
- If roles overlap, maintain both with their specific organizations
- For conflicting duration information, use the wider date range
```

## Response Handling

After receiving the AI response, the system processes it as follows:

1. Validate the response to ensure it's valid YAML
2. Check for structural consistency with the expected schema
3. Backup the original profile
4. Save the merged profile to the appropriate file
5. Log the merge operation

## Conclusion

These prompt templates and guidelines ensure consistent, high-quality merging of supervisor profile data. By providing clear instructions and examples to the AI, we can achieve reliable results that maintain data integrity and comprehensiveness. 