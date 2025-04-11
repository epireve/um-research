# Research Supervisor Matching Project Plan

## Project Overview
The Research Supervisor Matching project aims to create a simple system that helps graduate students find suitable research supervisors based on their research interests. The system will have:

1. **A Simple Web UI**: Where students can describe their research interests
2. **A Matching Backend**: That connects students with appropriate supervisors based on defined criteria

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
- Roles and responsibilities

## Current Status
We have collected and enriched profile data for multiple research supervisors from the Software Engineering Department at the University of Malaya. The data is stored in YAML format in the `profiles/` directory and includes all necessary matching criteria.

Key accomplishments:
- Comprehensive supervisor profiles with research interests, expertise, and publications
- AI-assisted data enrichment and merging
- Profile images extracted and properly stored
- Documentation of the system architecture and data structure

## Simplified To-Do List

### 1. Data Preparation (Completed)
- [x] Collect supervisor profile data
- [x] Extract and process profile images
- [x] Standardize data format
- [x] Document data structure

### 2. Core Matchmaking Algorithm
- [ ] Implement text similarity for research interests matching
- [ ] Create expertise matching function
- [ ] Develop publication relevance scoring
- [ ] Design combined ranking algorithm using primary and secondary criteria

### 3. Simple Web UI
- [ ] Create basic UI mockups
- [ ] Build frontend with search/filter capabilities
- [ ] Implement results display with match scoring
- [ ] Design supervisor profile view

### 4. Backend API
- [ ] Design API endpoints for matching
- [ ] Implement profile data access layer
- [ ] Create matching endpoint with filtering options
- [ ] Add basic authentication (if needed)

### 5. Integration and Testing
- [ ] Connect frontend to backend
- [ ] Test with sample student queries
- [ ] Validate matching results
- [ ] Optimize performance

## Timeline

### Phase 1: Algorithm Development (2 weeks)
- Design and implement core matching algorithm
- Test with sample queries
- Fine-tune weights for different criteria

### Phase 2: Backend Development (3 weeks)
- Create API endpoints
- Implement data access layer
- Connect to matching algorithm

### Phase 3: Frontend Development (3 weeks)
- Build basic UI components
- Implement search interface
- Create results display

### Phase 4: Testing and Deployment (2 weeks)
- Integrate components
- Test end-to-end functionality
- Deploy to test environment

## Success Metrics

### Matching Accuracy
- Relevant supervisors appear in top 5 results
- Matching scores correlate with actual research compatibility

### User Experience
- Students can easily describe their research interests
- Results are clear and helpful for decision-making

## Next Steps

### Immediate Priority: Matchmaking Algorithm
1. Define similarity metrics for research interests
2. Create function to compare student interests with supervisor profiles
3. Implement weighted scoring based on primary and secondary criteria
4. Test with sample queries

### Recently Completed
1. AI-assisted merging of profile data
2. Extraction of profile images
3. Documentation consolidation
4. Data structure standardization 