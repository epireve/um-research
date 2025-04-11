# Supervisor Profile Schema Documentation

## Overview

This document provides detailed information about the schema used for research supervisor profiles in the Research Supervisor Matching project. The schema defines the structure, field types, and validation rules for all profile data.

## Schema Structure

Each supervisor profile is stored as a YAML file with a hierarchical structure representing different aspects of a supervisor's academic profile. The schema is designed to capture comprehensive information while maintaining readability and ease of use.

## Required vs. Optional Fields

Fields marked with *(required)* must be present in all profiles. Fields not marked as required are optional but recommended when the information is available.

## Field Descriptions

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` *(required)* | string | Full name of the supervisor, including title (e.g., "Dr. John Smith") |
| `position` *(required)* | string | Current academic position (e.g., "Associate Professor") |
| `department` *(required)* | string | Department name (e.g., "Software Engineering") |
| `university` *(required)* | string | Full university name (e.g., "University of Malaya") |
| `contact` *(required)* | object | Contact information (see Contact Fields) |
| `academic_background` *(required)* | array | List of academic degrees and qualifications |
| `research_interests` *(required)* | array | List of research topics and interests |
| `expertise` | array | List of specific areas of expertise |
| `key_achievements` | array | List of significant professional achievements |
| `publications` | array | List of academic publications |
| `projects` | array | List of research projects |
| `supervised_students` | object | Information about supervised students |
| `roles` | array | Academic and administrative roles |
| `professional_memberships` | array | Professional organization memberships |
| `profile_links` | object | Links to academic profiles on external platforms |

### Contact Fields

| Field | Type | Description |
|-------|------|-------------|
| `email` *(required)* | string | Institutional email address |
| `office` | string | Office location (building and room number) |
| `phone` | string | Office phone number in international format |
| `website` | string | Personal or institutional website URL |

### Academic Background Fields

Each item in the `academic_background` array is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `degree` *(required)* | string | Degree type (e.g., "Ph.D.", "M.Sc.") |
| `field` *(required)* | string | Field of study |
| `institution` *(required)* | string | Institution where degree was obtained |
| `year` *(required)* | integer | Year degree was conferred |
| `thesis` | string | Thesis or dissertation title |

### Publication Fields

Each item in the `publications` array is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` *(required)* | string | Full publication title |
| `authors` *(required)* | string | Comma-separated list of authors |
| `venue` *(required)* | string | Journal name, conference name, or book title |
| `year` *(required)* | integer | Publication year |
| `doi` | string | Digital Object Identifier |
| `citation` | string | Formatted citation |
| `type` | string | Publication type (journal, conference, book, report, other) |
| `abstract` | string | Publication abstract |
| `keywords` | array | Keywords associated with the publication |
| `url` | string | URL to the publication |
| `impact_factor` | number | Journal impact factor (for journal articles) |

### Project Fields

Each item in the `projects` array is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` *(required)* | string | Project title |
| `description` | string | Brief description of the project |
| `role` | string | Supervisor's role in the project |
| `funding` | string | Funding source and amount |
| `duration` | string | Project duration (e.g., "2019 - 2022") |
| `status` | string | Project status (e.g., "Completed", "Ongoing") |
| `collaborators` | array | List of collaborating researchers or institutions |
| `outcomes` | array | List of project outcomes (publications, patents, software) |

### Supervised Students Fields

The `supervised_students` object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `phd` | array | List of Ph.D. students supervised |
| `masters` | array | List of Master's students supervised |
| `undergraduate` | array | List of undergraduate students supervised |

Each student entry in these arrays has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` *(required)* | string | Student's name |
| `thesis` | string | Thesis or project title |
| `year` | integer | Year of completion or expected completion |
| `status` | string | Status of supervision (e.g., "Completed", "Ongoing") |

### Roles Fields

Each item in the `roles` array is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` *(required)* | string | Role title |
| `organization` *(required)* | string | Organization name |
| `duration` | string | Duration of the role (e.g., "2018 - Present") |
| `description` | string | Brief description of responsibilities |

### Professional Memberships Fields

Each item in the `professional_memberships` array is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` *(required)* | string | Organization name |
| `role` | string | Role within the organization |
| `duration` | string | Duration of membership |

### Profile Links Fields

The `profile_links` object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `google_scholar` | string | URL to Google Scholar profile |
| `orcid` | string | URL to ORCID profile |
| `scopus` | string | URL to Scopus author profile |
| `researchgate` | string | URL to ResearchGate profile |
| `linkedin` | string | URL to LinkedIn profile |
| `dblp` | string | URL to DBLP profile |
| `academia` | string | URL to Academia.edu profile |

## Data Types and Formats

### Strings

- Text values should use UTF-8 encoding
- Multi-line strings should use YAML's block scalar notation (|)
- URLs should include the full address with https:// prefix
- Email addresses should follow standard format (username@domain)

### Numbers

- Years should be represented as four-digit integers (e.g., 2022)
- Impact factors and other decimal values should maintain appropriate precision

### Arrays

- Arrays are represented as YAML sequences with the hyphen (-) prefix
- Each item in a sequence should follow consistent formatting

### Dates and Durations

- Individual dates should use YYYY format
- Date ranges should use "YYYY - YYYY" format
- Current/ongoing durations should use "YYYY - Present"

## Example Profile

Below is an example of a minimal valid profile:

```yaml
name: "Dr. Jane Smith"
position: "Associate Professor"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "jane.smith@um.edu.my"
  office: "Faculty of Computer Science, Room A101"
  phone: "+60-3-7967-1234"
  website: "https://www.fsktm.um.edu.my/janesmith"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "Stanford University"
    year: 2010
    thesis: "Machine Learning Approaches for Software Defect Prediction"
  - degree: "M.Sc."
    field: "Software Engineering"
    institution: "University of Oxford"
    year: 2005
  - degree: "B.Sc."
    field: "Computer Science"
    institution: "University of Malaya"
    year: 2003
research_interests:
  - "Software defect prediction"
  - "Machine learning in software engineering"
  - "Automated software testing"
expertise:
  - "Python programming"
  - "Statistical analysis"
  - "Neural networks"
key_achievements:
  - "Best Paper Award at ICSE 2018"
  - "University Research Excellence Award, 2020"
```

## Complete Profile Example

A more comprehensive example is available in the `examples/` directory.

## Validation Rules

All profiles are validated against the following rules:

1. All required fields must be present
2. Field types must match schema definitions
3. Email addresses must be valid
4. URLs must be properly formatted
5. Years must be valid four-digit integers
6. All date ranges must have valid start and end years
7. All array items must follow consistent formatting

## Schema Evolution

As the project evolves, the schema may be extended with new fields or modified. Changes to the schema will be versioned and documented to maintain compatibility:

- Minor additions (new optional fields) will be backward compatible
- Required field additions will be considered major changes
- Field removals will be avoided when possible

## Implementation

The schema is implemented as a JSON Schema definition in `docs/schema/profile_schema.json` and can be used for programmatic validation of profiles. 