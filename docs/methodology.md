# Methodology: Research Supervisor Profile Enrichment

This document outlines the methodology used for collecting, processing, and enriching research supervisor profiles for the University of Malaya's Software Engineering Department.

## Data Collection

### Sources
- UMExpert platform
- Scopus
- Web of Science
- ORCID
- Google Scholar
- Department websites
- Researcher personal websites

### Tools
- Web scraping scripts
- API integration (where available)
- Manual collection (for sources without APIs)
- `httpx` and BeautifulSoup libraries for HTML parsing
- `pandas` for data management

### Visual Data Collection
- Profile photographs from department websites and UMExpert
- Images from conference presentations and research activities
- Base64-encoded images embedded in data sources

## Data Processing

### HTML to Markdown Conversion
- Converting HTML content to standardized Markdown format
- Preserving structural elements while removing unwanted formatting

### Pattern Matching and Extraction
- Regular expressions for identifying structured information
- Named entity recognition for extracting names, institutions, and dates
- Citation pattern matching for publication extraction

### Section Extraction
- Identifying and categorizing content into predefined sections
- Extracting academic background, research interests, publications, etc.

### Deduplication
- Identifying and removing duplicate entries across multiple sources
- Publication deduplication based on title, authors, and DOI
- Creating unique identifiers for each supervisor

### Visual Data Processing
- Extracting base64-encoded images from source data
- Decoding base64 strings to binary image data
- Converting to standardized formats (JPEG)
- Naming convention: `{user_id}.jpeg` for consistent referencing
- Storage in dedicated `images/` directory for easy access

## Data Enrichment

### AI-Assisted Merging
- Using Google Gemini 2.5 Pro for intelligent merging of fragmented information
- Contextual understanding of academic profiles for better organization
- Weighting newer information more heavily while preserving historical data

### Structured Prompts for AI
- Creating detailed prompts with specific merging instructions
- Maintaining YAML structure throughout the enrichment process
- Preserving existing information while adding new data

### Manual Verification
- Human review of enriched profiles for accuracy
- Special attention to publications, academic background, and contact information
- Final approval before integration into the system

## Data Structure

The enriched profiles are structured in YAML format with the following sections:

### Basic Information
- Name
- Position
- Department
- University
- Profile photograph reference

### Academic Background
- Degrees
- Institutions
- Years
- Fields of study

### Research Information
- Research interests
- Expertise
- Key achievements

### Publications
- Journal articles
- Conference papers
- Book chapters
- Patents

### Projects
- Research projects
- Funding information
- Collaborators

### Supervision Experience
- PhD students
- Master's students
- Undergraduate students

### Professional Information
- Roles
- Professional memberships
- Awards and recognition

### Profile Links
- Academic profiles (Google Scholar, ORCID, etc.)
- Social profiles (LinkedIn, ResearchGate, etc.)

### Visual Data
- References to profile images
- Path to image files in the repository

## Validation

### Format Validation
- Ensuring proper YAML structure
- Checking for missing required fields
- Validating date formats and URLs

### Content Validation
- Cross-referencing information with original sources
- Verifying publication data against academic databases
- Checking for inconsistencies in academic background

### Completeness Assessment
- Evaluating the comprehensiveness of each profile
- Identifying areas requiring additional data collection
- Prioritizing profiles for further enrichment

## Limitations

- Availability and accessibility of source data
- Inconsistencies in how researchers present their information
- Language variations and transliteration differences
- Time constraints for manual verification
- Variations in image quality and availability

## Ethical Considerations

The data collection and processing adhered to ethical principles:

1. **Privacy Respect**
   - Collection limited to professionally relevant information
   - Exclusion of personal details not directly related to academic work
   - Compliance with institutional data policies

2. **Data Use Limitations**
   - Information collected solely for academic matching purposes
   - No commercial exploitation of personal data
   - Restricted access to authorized system users

3. **Transparency**
   - Clear documentation of data sources
   - Attribution of information to original sources where appropriate
   - Open methodology description

4. **Correction Mechanisms**
   - Processes for supervisors to review and correct their profiles
   - Regular update procedures
   - Feedback incorporation system

5. **Image Usage**
   - Use of publicly available professional photographs only
   - Attribution of image sources where required
   - Respect for institutional guidelines on image usage

## References

1. Hicks, D., Wouters, P., Waltman, L., De Rijcke, S., & Rafols, I. (2015). Bibliometrics: The Leiden Manifesto for research metrics. Nature, 520(7548), 429-431.

2. Harzing, A. W., & Alakangas, S. (2016). Google Scholar, Scopus and the Web of Science: A longitudinal and cross-disciplinary comparison. Scientometrics, 106(2), 787-804.

3. Mitchell, R., & Chen, I. R. (2014). A survey of intrusion detection techniques for cyber-physical systems. ACM Computing Surveys (CSUR), 46(4), 1-29.

4. Wuchty, S., Jones, B. F., & Uzzi, B. (2007). The increasing dominance of teams in production of knowledge. Science, 316(5827), 1036-1039.

5. Sugimoto, C. R., Work, S., Larivière, V., & Haustein, S. (2017). Scholarly use of social media and altmetrics: A review of the literature. Journal of the Association for Information Science and Technology, 68(9), 2037-2062. 