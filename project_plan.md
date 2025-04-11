# Research Supervisor Matching Project Plan

## Project Overview
The Research Supervisor Matching project aims to create a system that helps graduate students find suitable research supervisors based on matching research interests, expertise, and academic backgrounds. The project consists of two main phases:

1. **Data Collection and Cleanup Phase** (Current): Gathering comprehensive profiles of research supervisors, including their academic backgrounds, research interests, publications, and expertise areas.

2. **Dashboard Development Phase** (Future): Creating an interactive web application that allows students to search for and match with potential supervisors based on their research interests and requirements.

## Current Status
We have collected and enriched profile data for multiple research supervisors from the Software Engineering Department at the University of Malaya. The data includes academic backgrounds, contact information, research interests, publications, supervised students, and other relevant information. The data is stored in YAML format in the `profiles/` directory.

We have completed several important tasks, including:
- Profile data verification and merging of extracted data into existing profiles using AI assistance
- Creation of a standardized profile format and schema documentation
- Implementation of profile validation tools
- Development of comprehensive documentation for the repository structure and methodology
- Complete reorganization of the repository structure following the defined standards
- AI-assisted merging of extracted data for all supervisor profiles

The current focus is on documentation improvement, refining data processing pipelines, and preparing for the dashboard development phase.

## To-Do List

### Cleanup Tasks (Current Priority)

1. **Profile Data Verification**
   - [x] Verify the accuracy of existing profiles
   - [x] Cross-check publication data with academic databases
   - [x] Update contact information where needed
   - [x] Ensure consistent formatting across all profiles
   - [x] Add missing information from university directories

2. **Repository Structure Improvement**
   - [x] Reorganize file structure for better clarity
   - [x] Create separate directories for different data types
   - [x] Document repository structure in README.md
   - [x] Add comprehensive docstrings to existing code
   - [x] Update gitignore to exclude unnecessary files

3. **Documentation Enhancement**
   - [x] Create a methodology document explaining data collection techniques
   - [x] Document the profile schema and data format
   - [x] Create a data dictionary for all fields in profiles
   - [x] Add usage examples for accessing and querying the data
   - [x] Consolidate and standardize all documentation
   - [x] Document the profile merging process
   - [x] Create templates for AI prompts

4. **Data Processing Scripts Cleanup**
   - [ ] Refactor extraction scripts for better maintainability
   - [ ] Add error handling to data processing pipelines
   - [x] Create unit tests for validation functions
   - [ ] Optimize performance of data processing
   - [x] Add logging for better debugging
   - [x] Implement image extraction from base64 data

5. **Data Schema Standardization**
   - [x] Define a consistent schema for all profiles
   - [x] Create JSON schema for validation
   - [x] Convert all profiles to follow the standard schema
   - [x] Implement automated schema validation
   - [x] Document schema evolution and versioning

6. **Profile Merging and Enrichment**
   - [x] Create a system for AI-assisted profile merging
   - [x] Generate prompts for each supervisor profile
   - [x] Use Gemini 2.5 Pro to merge extracted data
   - [x] Validate merged profiles against the schema
   - [x] Document the merging process and results

### Design Tasks (Dashboard Development Preparation)

1. **User Research**
   - [ ] Conduct interviews with graduate students
   - [ ] Survey faculty about supervisor selection process
   - [ ] Analyze existing supervisor-student matching systems
   - [ ] Identify key pain points and opportunities
   - [ ] Define user personas and journey maps

2. **Feature Definition**
   - [ ] Define core features for the matching system
   - [ ] Prioritize features based on user needs
   - [ ] Create user stories and acceptance criteria
   - [ ] Define metrics for measuring success
   - [ ] Document feature requirements

3. **UI/UX Design**
   - [ ] Create wireframes for key user journeys
   - [ ] Design responsive UI mockups
   - [ ] Develop interactive prototypes
   - [ ] Conduct usability testing
   - [ ] Refine designs based on feedback

4. **Architecture Planning**
   - [ ] Define technical architecture for the dashboard
   - [ ] Select appropriate frontend and backend technologies
   - [ ] Plan data storage and retrieval mechanisms
   - [ ] Design API endpoints for data access
   - [ ] Document architecture decisions

5. **Algorithm Design**
   - [ ] Research matching algorithms for academic profiles
   - [ ] Design similarity metrics for research interests
   - [ ] Develop methods for comparing publication records
   - [ ] Create algorithms for suggesting potential supervisors
   - [ ] Plan for personalized recommendation features

### Development Tasks (Future Phase)

1. **Backend Development**
   - [ ] Set up development environment
   - [ ] Implement data models
   - [ ] Create API endpoints
   - [ ] Develop authentication system
   - [ ] Implement matching algorithms
   - [ ] Set up database and data access layer
   - [ ] Create admin interfaces for data management

2. **Frontend Development**
   - [ ] Set up frontend framework
   - [ ] Implement responsive layouts
   - [ ] Create reusable UI components
   - [ ] Develop search and filter functionality
   - [ ] Implement profile visualization
   - [ ] Create user dashboards
   - [ ] Develop comparison features for supervisors

3. **Search and Matching Functionality**
   - [ ] Implement full-text search
   - [ ] Develop filters for expertise areas
   - [ ] Create algorithms for matching students with supervisors
   - [ ] Implement similarity scoring
   - [ ] Develop visualization for match strength
   - [ ] Add recommendation features

4. **User Management**
   - [ ] Implement user registration and authentication
   - [ ] Create profile management for students
   - [ ] Develop notification system
   - [ ] Add bookmarking and saving functionality
   - [ ] Implement user preferences

5. **Analytics and Reporting**
   - [ ] Create analytics dashboard for administrators
   - [ ] Implement usage tracking
   - [ ] Develop reporting features
   - [ ] Create visualization for matching patterns
   - [ ] Build export functionality for reports

### Testing and Deployment

1. **Testing**
   - [ ] Develop unit tests for core functionality
   - [ ] Create integration tests for APIs
   - [ ] Perform end-to-end testing
   - [ ] Conduct user acceptance testing
   - [ ] Test performance and scalability

2. **Deployment**
   - [ ] Set up CI/CD pipeline
   - [ ] Configure staging and production environments
   - [ ] Implement monitoring and logging
   - [ ] Set up backup and recovery procedures
   - [ ] Document deployment process

### Launch and Maintenance

1. **Launch Preparation**
   - [ ] Create user documentation
   - [ ] Prepare training materials
   - [ ] Develop launch communications
   - [ ] Plan phased rollout
   - [ ] Set up support channels

2. **Post-Launch Activities**
   - [ ] Monitor system performance
   - [ ] Collect user feedback
   - [ ] Prioritize improvements
   - [ ] Release regular updates
   - [ ] Expand supervisor database

## Timeline

### Phase 1: Data Collection and Cleanup (Current)
- Data Collection and Initial Processing: Completed
- Data Verification and Cleanup: Completed
- Repository Structure Improvement: Completed
- Documentation Enhancement: 1 week (In Progress)
- Profile Merging and Enrichment: Completed
- Processing Script Refinement: 2 weeks (Next)
- Data Export Utilities: 1 week

### Phase 2: Dashboard Development (Future)
- User Research and Feature Definition: 3 weeks
- UI/UX Design: 4 weeks
- Architecture Planning: 2 weeks
- Backend Development: 6 weeks
- Frontend Development: 6 weeks
- Integration and Testing: 4 weeks
- Deployment and Launch: 2 weeks

## Resources

### Technologies and Tools
- **Data Processing**: Python, PyYAML, Pandas, BeautifulSoup
- **AI Assistance**: Google Gemini 2.5 Pro, Google AI Python SDK
- **Validation**: JSON Schema, jsonschema, PyYAML
- **Backend**: Python (FastAPI or Django), PostgreSQL, Docker
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **DevOps**: GitHub Actions, Docker, AWS/GCP
- **Testing**: Jest, Pytest, Cypress

### Team Requirements
- Project Manager
- Data Engineers
- Backend Developers
- Frontend Developers
- UX/UI Designer
- QA Engineer

## Success Metrics

### Usage Metrics
- Number of active users
- Search queries performed
- Profiles viewed per session
- Time spent on the platform
- Successful matches made

### Satisfaction Metrics
- Student satisfaction with supervisor matches
- Supervisor satisfaction with student quality
- System usability score
- Net promoter score
- Feedback from academic departments

### Academic Outcomes
- Improved completion rates for research projects
- Reduced time to find suitable supervisors
- Quality of research collaborations
- Publications resulting from matched partnerships

## Next Steps

### Immediate Priorities (Next 2 Weeks)
1. ~~Complete the documentation consolidation and standardization~~
2. Create an updated README with clear project explanation and onboarding instructions
3. Develop data export utilities for analysis and visualization
4. Begin user research for the dashboard phase
5. Refactor and optimize data processing scripts

### Medium-Term Goals (1-3 Months)
1. Complete user research and feature definition
2. Create initial UI/UX designs for the dashboard
3. Develop a prototype of the matching algorithm
4. Begin backend development for the core API endpoints
5. Plan the database schema for the application 

### Recently Completed Milestones
1. AI-assisted merging of extracted data for all supervisor profiles
2. Comprehensive documentation of the profile merging process
3. Creation of templates for AI prompts used in the system
4. Implementation of data access guides and examples
5. Repository structure reorganization and documentation update
6. Extraction of profile images from base64 data and storage in the correct directory
7. Documentation consolidation and standardization 