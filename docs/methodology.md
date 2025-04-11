# Methodology: Research Supervisor Matching

This document outlines the methodology used for collecting, processing, and matching research supervisors with potential students based on research interests.

## Data Collection and Preparation

The data collection phase focused on gathering comprehensive information about research supervisors, including:

### Primary Matching Criteria
- **Research Interests**: Key research areas and topics
- **Expertise Areas**: Technical skills and domain knowledge
- **Publications**: Journal articles showcasing research focus

### Secondary Ranking Criteria
- **Projects**: Research projects and funding
- **Supervised Students**: Previous supervision experience
- **Conference Publications**: Conference papers and presentations
- **Book Chapters**: Contributions to academic books
- **Roles**: Academic and administrative responsibilities

### Sources
- UMExpert platform
- Scopus
- Web of Science
- ORCID
- Google Scholar
- Department websites

### Profile Images
- Extracted from departmental websites
- Saved in standard format as `data/images/{userID}.jpeg`

## Data Structure

Supervisor profiles are stored in YAML format with a standardized structure:

```yaml
name: "Dr. Example Supervisor"
position: "Associate Professor"
department: "Software Engineering"
university: "University of Malaya"
contact:
  email: "example@um.edu.my"
  office: "A-12-12"
  phone: "+60-3-7967-1234"
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

## Matching Methodology

The matching system uses the following approach:

### 1. Research Interest Matching

- **Text Similarity**: Comparing student interests with supervisor research interests
- **Keyword Matching**: Identifying common keywords and phrases
- **Semantic Analysis**: Using semantic similarity to match related concepts

### 2. Expertise Matching

- **Direct Matching**: Matching explicitly stated expertise areas
- **Implicit Matching**: Inferring expertise from publications and projects
- **Relevance Scoring**: Weighing expertise based on recency and depth

### 3. Publication Relevance

- **Topic Analysis**: Analyzing publication titles and venues for relevance
- **Citation Impact**: Considering publication impact where available
- **Recency**: Prioritizing recent publications that reflect current interests

### 4. Secondary Criteria Ranking

After initial matching based on primary criteria, results are further ranked using:

- **Supervision Experience**: Previous experience with similar research topics
- **Project Alignment**: Relevance of current and past projects
- **Academic Roles**: Relevant academic responsibilities and committees

## Presentation of Results

Matching results are presented to students in a clear, user-friendly format:

1. **Ranked List**: Supervisors ranked by overall match score
2. **Match Breakdown**: Visual indication of match strength across different criteria
3. **Profile Access**: Easy access to detailed supervisor profiles
4. **Filter Options**: Ability to filter and sort based on different criteria

## Evaluation Methodology

The matching system is evaluated based on:

1. **Relevance**: Do the top matches align with student interests?
2. **Coverage**: Is the system considering all relevant supervisors?
3. **User Satisfaction**: Do students find the matches helpful?
4. **Supervisor Feedback**: Do supervisors agree with the matching results?

## Implementation Approach

The implementation follows a simple, focused approach:

1. **Core Algorithm**: A straightforward matching algorithm focusing on text similarity
2. **Simple UI**: A clean, intuitive user interface for entering research interests
3. **Responsive Design**: Mobile-friendly design for accessibility
4. **Minimal Dependencies**: Focus on essential technologies (Next.js with App Router)

## Limitations and Considerations

1. **Data Completeness**: Matching quality depends on profile completeness
2. **Language Variations**: Handling different ways of expressing research interests
3. **Interdisciplinary Research**: Appropriately matching cross-disciplinary interests
4. **Profile Maintenance**: Ensuring profiles remain up-to-date

## References

1. Hicks, D., Wouters, P., Waltman, L., De Rijcke, S., & Rafols, I. (2015). Bibliometrics: The Leiden Manifesto for research metrics. Nature, 520(7548), 429-431.

2. Harzing, A. W., & Alakangas, S. (2016). Google Scholar, Scopus and the Web of Science: A longitudinal and cross-disciplinary comparison. Scientometrics, 106(2), 787-804.

3. Wuchty, S., Jones, B. F., & Uzzi, B. (2007). The increasing dominance of teams in production of knowledge. Science, 316(5827), 1036-1039. 