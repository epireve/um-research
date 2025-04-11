# UM Research Supervisor Matching: Implementation Summary

## Overview

This project provides a simple matching system to help students find suitable research supervisors based on research interests. The implementation consists of two main components:

1. **Data Collection and Preparation**: Comprehensive supervisor profiles with research interests, expertise, and publications
2. **Matching System**: A simple web UI and backend API that matches students with supervisors based on defined criteria

## Matching Criteria

### Primary Matching Criteria
- Research interests
- Expertise areas
- Publications (journal articles)

### Secondary Ranking Criteria
- Projects
- Supervised students
- Conference publications
- Book chapters
- Roles

## Technical Implementation

### Data Preparation

The data preparation phase has been completed, including:

1. **Profile Data Collection**: Supervisor profiles stored in `profiles/{userID}.yaml`
2. **Data Enrichment**: AI-assisted merging of data from multiple sources
3. **Profile Images**: Extraction of profile images from base64 data to `data/images/{userID}.jpeg`
4. **Standardization**: Consistent data format following the defined schema

### Profile Structure

Each supervisor profile contains:

```yaml
name: "Dr. Example Supervisor"
position: "Associate Professor"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "example@um.edu.my"
  office: "A-12-12"
  phone: "+60-3-7967-1234"
academic_background:
  - degree: "Ph.D."
    field: "Computer Science"
    institution: "Example University"
    year: 2010
research_interests:
  - "Software Engineering"
  - "Machine Learning"
expertise:
  - "Software Quality Assurance"
  - "Web Application Development"
publications:
  - title: "Example Publication Title"
    authors: "Supervisor, E., et al."
    venue: "Journal of Software Engineering"
    year: 2020
    doi: "10.1234/jse.2020.1234"
# Other fields for secondary ranking
```

### Matching Algorithm (To Be Implemented)

The matching algorithm will:

1. Compare student interests with supervisor research interests using text similarity
2. Match expertise areas relevant to the student's interests
3. Consider publication relevance to the research topic
4. Use secondary criteria for further ranking

### Web Interface (To Be Implemented)

The web interface will allow students to:

1. Enter their research interests as free text
2. Specify relevant expertise areas
3. View matching supervisors with scores
4. Access detailed supervisor profiles

## Next Steps

1. **Implement Core Matching Algorithm**:
   - Text similarity for research interests
   - Expertise matching function
   - Publication relevance scoring

2. **Develop Web UI**:
   - Simple search interface
   - Results display with match scores
   - Supervisor profile view

3. **Create Backend API**:
   - Matching endpoint with filtering options
   - Profile data access

## Tools Used

- **Data Processing**: Python scripts for extraction and standardization
- **Image Processing**: Python script for extracting profile images
- **Profile Storage**: YAML format for structured data
- **Web Framework**: Next.js with App Router (planned)
- **Backend**: Node.js API for matching algorithm (planned)

## Conclusion

The data preparation phase is complete, with comprehensive supervisor profiles ready for the matching system. The next phase focuses on implementing the matching algorithm and building a simple UI to help students find suitable research supervisors based on their interests. 