# Methodology for Research Supervisor Profile Collection

## Introduction

This document outlines the systematic methodology employed for collecting, processing, and structuring data about research supervisors in the Software Engineering Department at the University of Malaya. The resulting dataset serves as a foundation for a system that helps graduate students identify and connect with potential research supervisors whose expertise and interests align with their own research goals.

## Data Collection

### Data Sources

The profile information was collected from multiple authoritative sources to ensure comprehensive coverage:

1. **University Platforms**
   - Faculty directory pages
   - Personal academic pages hosted on university domains
   - Departmental research group listings
   - University research repositories

2. **Academic Databases**
   - Google Scholar profiles
   - Scopus author pages
   - ORCID records
   - Web of Science researcher profiles
   - ResearchGate and Academia.edu profiles

3. **Academic CVs and Personal Websites**
   - Curriculum vitae documents (PDF, DOC)
   - Personal academic websites
   - Conference and journal websites listing committee members

4. **Publication Records**
   - Journal articles
   - Conference proceedings
   - Book chapters
   - Technical reports
   - Research grants and funding information

### Collection Tools and Techniques

The following tools and techniques were utilized for data collection:

1. **Web Scraping Scripts**
   - Custom Python scripts utilizing Requests and Selenium for automated data retrieval
   - Rate-limited crawling to respect server limitations
   - User-agent rotation to prevent IP blocking

2. **HTML Parsing**
   - BeautifulSoup4 for structured extraction from HTML pages
   - XPath and CSS selectors for targeting specific elements
   - Regular expressions for pattern-based extraction

3. **PDF Extraction**
   - PyPDF2 and pdfminer for text extraction from PDF documents
   - OCR processing for scanned documents using Tesseract

4. **API Integration**
   - Scopus API for publication retrieval
   - ORCID API for researcher identification
   - CrossRef API for DOI resolution and metadata retrieval

5. **Manual Collection**
   - Directed information gathering for cases where automated methods were insufficient
   - Verification of ambiguous or conflicting information
   - Supplementation of missing data fields

## Data Processing

### Processing Stages

The raw collected data underwent several processing stages to transform it into structured profiles:

1. **HTML to Markdown Conversion**
   - Conversion of formatted HTML content to standardized Markdown
   - Removal of script tags, styling, and non-essential elements
   - Preservation of semantic structure (headings, lists, tables)

2. **Pattern Matching and Extraction**
   - Regular expression-based extraction of key information (emails, phone numbers, degrees)
   - Named entity recognition for identifying people, organizations, and locations
   - Date pattern recognition for temporal information

3. **Section Extraction**
   - Identification of logical sections within documents (education, experience, publications)
   - Classification of section types based on headings and content patterns
   - Hierarchical structuring of related information

4. **Information Categorization**
   - Classification of extracted text into predefined categories
   - Mapping of free-text fields to controlled vocabularies where applicable
   - Tagging with relevant metadata (field of study, research methodologies)

5. **Entity Recognition and Linking**
   - Identification of research topics and domains
   - Recognition of institutions and organizations
   - Linking of publications to publication databases via DOIs/identifiers

6. **Reference Parsing**
   - Extraction of publication details from citation formats
   - Structuring of bibliographic information into machine-readable format
   - Normalization of journal names and conference proceedings

7. **Deduplication**
   - Identification and removal of duplicate information across sources
   - Resolution of conflicting information through confidence scoring
   - Versioning to track information changes over time

## Data Enrichment

The initial structured data was enhanced through several enrichment techniques:

1. **Cross-Source Integration**
   - Combining information from multiple sources for each supervisor
   - Creating comprehensive profiles with maximum coverage
   - Resolving source-specific limitations

2. **Inference and Derivation**
   - Inferring research interests from publication titles and abstracts
   - Deriving expertise areas based on teaching history and project supervision
   - Calculating publication metrics and collaboration patterns

3. **Normalization and Standardization**
   - Standardizing institution names and department affiliations
   - Normalizing publication venues and journal names
   - Unifying date formats and contact information presentation

4. **Contextual Enhancement**
   - Adding departmental context to individual profiles
   - Linking related supervisors based on co-authorship
   - Including research group affiliations and roles

5. **AI-Assisted Integration**
   - Using large language models to extract structured information from unstructured text
   - Generating coherent research summaries from publication abstracts
   - Classifying research into standardized taxonomies

## Data Structure

### Profile Schema

Each supervisor profile is structured according to a comprehensive schema that captures the multifaceted aspects of their academic and research activities:

1. **Basic Information**
   - Full name and title
   - Academic position
   - Departmental affiliation
   - University affiliation

2. **Contact Information**
   - Institutional email
   - Office location
   - Phone number
   - Alternative contact methods

3. **Academic Background**
   - Degrees obtained (type, institution, year, field)
   - Additional certifications and qualifications
   - Academic awards and recognitions

4. **Research Information**
   - Research interests (structured as topics)
   - Areas of expertise
   - Methodological approaches
   - Tools and technologies

5. **Publications**
   - Journal articles
   - Conference papers
   - Books and book chapters
   - Technical reports
   - Patents and intellectual property

6. **Projects**
   - Research grants (title, funding agency, amount, duration)
   - Industrial collaborations
   - Community projects
   - International research partnerships

7. **Supervision Experience**
   - PhD students supervised (completed and ongoing)
   - Master's students supervised
   - Undergraduate research supervision
   - Topics of supervised research

8. **Professional Information**
   - Academic roles and responsibilities
   - Committee memberships
   - Editorial positions
   - Professional affiliations
   - Community service

9. **Profile Links**
   - Academic profile pages
   - Research database identifiers (ORCID, Scopus ID)
   - Social and professional networks

### Data Format

The profile data is stored in YAML format, which offers several advantages:

1. **Human Readability**
   - Clear structure that is both machine and human-readable
   - Easy manual editing and verification
   - Accessible to non-technical stakeholders

2. **Hierarchical Structure**
   - Natural representation of nested information
   - Ability to capture complex relationships
   - Flexible schema that can accommodate varied information types

3. **Ecosystem Integration**
   - Easy conversion to JSON, XML, and other formats
   - Native support in many programming languages
   - Compatible with version control systems for tracking changes

4. **Extensibility**
   - Schema can evolve without breaking existing data
   - New sections can be added as information becomes available
   - Custom fields can be included for specific research areas

## Validation Process

The data underwent rigorous validation to ensure accuracy and completeness:

1. **Schema Validation**
   - Verification of structural conformity to the defined schema
   - Type checking for field values
   - Enforcement of required fields

2. **Consistency Checks**
   - Cross-validation between related fields
   - Temporal consistency of career information
   - Logical coherence of research narratives

3. **Completeness Assessment**
   - Identification of missing critical information
   - Scoring of profile completeness
   - Prioritization of data gaps for further collection

4. **Cross-Reference Validation**
   - Verification of publications against external databases
   - Confirmation of institutional affiliations
   - Validation of degrees and credentials

## Limitations

The methodology acknowledges several limitations:

1. **Information Currency**
   - Academic profiles change over time
   - Publication lists require regular updates
   - Research interests evolve with new projects

2. **Source Availability**
   - Not all supervisors maintain comprehensive online profiles
   - Some information may be behind institutional logins
   - Certain databases require subscription access

3. **Name Disambiguation**
   - Researchers with common names may be confused
   - Name variations across different platforms
   - Changes in names due to marriage or other reasons

4. **Coverage Variations**
   - Uneven depth of information across supervisors
   - Senior faculty often have more comprehensive profiles
   - Disciplinary differences in publication and recognition patterns

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

## References

1. Hicks, D., Wouters, P., Waltman, L., De Rijcke, S., & Rafols, I. (2015). Bibliometrics: The Leiden Manifesto for research metrics. Nature, 520(7548), 429-431.

2. Harzing, A. W., & Alakangas, S. (2016). Google Scholar, Scopus and the Web of Science: A longitudinal and cross-disciplinary comparison. Scientometrics, 106(2), 787-804.

3. Mitchell, R., & Chen, I. R. (2014). A survey of intrusion detection techniques for cyber-physical systems. ACM Computing Surveys (CSUR), 46(4), 1-29.

4. Wuchty, S., Jones, B. F., & Uzzi, B. (2007). The increasing dominance of teams in production of knowledge. Science, 316(5827), 1036-1039.

5. Sugimoto, C. R., Work, S., Larivière, V., & Haustein, S. (2017). Scholarly use of social media and altmetrics: A review of the literature. Journal of the Association for Information Science and Technology, 68(9), 2037-2062. 