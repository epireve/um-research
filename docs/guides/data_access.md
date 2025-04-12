# Accessing and Querying Supervisor Profiles

This guide explains how to access and work with supervisor profile data in the Research Supervisor Matching project.

## Profile Storage

Supervisor profiles are stored as YAML files in the `data/profiles/` directory, with each file named after the supervisor's ID (typically their username or a unique identifier):

```
data/profiles/
├── asmiza.yaml
├── hazimhanif.yaml
├── nazean.yaml
├── sitihafizah.yaml
├── tkchiew.yaml
└── ...
```

Each profile contains structured information about a supervisor, including academic background, research interests, publications, and more.

## Basic Access Methods

### Direct File Access

For simple use cases, you can read profile files directly using standard YAML libraries:

```python
import yaml

# Load a single profile
with open('data/profiles/sitihafizah.yaml', 'r', encoding='utf-8') as file:
    profile = yaml.safe_load(file)
    
# Access profile data
name = profile['name']
email = profile['contact']['email']
research_interests = profile['research_interests']
```

### Loading Multiple Profiles

To work with multiple profiles at once:

```python
import yaml
import os
import glob

def load_all_profiles():
    profiles = {}
    for profile_path in glob.glob('data/profiles/*.yaml'):
        user_id = os.path.basename(profile_path).replace('.yaml', '')
        with open(profile_path, 'r', encoding='utf-8') as file:
            profiles[user_id] = yaml.safe_load(file)
    return profiles

# Load all profiles into a dictionary
all_profiles = load_all_profiles()
```

## Querying Profiles

### Filtering Profiles by Criteria

To find supervisors matching specific criteria:

```python
def find_supervisors_by_interest(profiles, interest_keyword):
    """Find supervisors with a specific research interest."""
    matching_supervisors = []
    
    for user_id, profile in profiles.items():
        if 'research_interests' in profile:
            interests = profile['research_interests']
            if any(interest_keyword.lower() in interest.lower() for interest in interests):
                matching_supervisors.append({
                    'id': user_id,
                    'name': profile['name'],
                    'position': profile.get('position', 'Unknown'),
                    'matching_interests': [i for i in interests if interest_keyword.lower() in i.lower()]
                })
    
    return matching_supervisors

# Find supervisors interested in machine learning
ml_supervisors = find_supervisors_by_interest(all_profiles, "machine learning")
```

### Searching by Publication Keywords

To find supervisors based on publication keywords:

```python
def find_supervisors_by_publication_keyword(profiles, keyword):
    """Find supervisors who have published on a specific topic."""
    matching_supervisors = []
    
    for user_id, profile in profiles.items():
        if 'publications' not in profile:
            continue
            
        matching_pubs = []
        for pub in profile['publications']:
            title = pub.get('title', '')
            if keyword.lower() in title.lower():
                matching_pubs.append(title)
                
        if matching_pubs:
            matching_supervisors.append({
                'id': user_id,
                'name': profile['name'],
                'position': profile.get('position', 'Unknown'),
                'publication_count': len(matching_pubs),
                'matching_publications': matching_pubs
            })
    
    return matching_supervisors

# Find supervisors who have published on software testing
testing_supervisors = find_supervisors_by_publication_keyword(all_profiles, "software testing")
```

## Advanced Queries

### Expertise Matching

Finding supervisors whose expertise matches a student's research interests:

```python
def calculate_expertise_match(supervisor_expertise, student_interests):
    """Calculate match score between supervisor expertise and student interests."""
    if not supervisor_expertise or not student_interests:
        return 0
        
    supervisor_keywords = ' '.join(supervisor_expertise).lower()
    match_score = sum(1 for interest in student_interests 
                      if interest.lower() in supervisor_keywords)
    return match_score / len(student_interests)

def find_matching_supervisors(profiles, student_interests, min_score=0.3):
    """Find supervisors matching student interests with a minimum score."""
    matches = []
    
    for user_id, profile in profiles.items():
        expertise = profile.get('expertise', []) + profile.get('research_interests', [])
        score = calculate_expertise_match(expertise, student_interests)
        
        if score >= min_score:
            matches.append({
                'id': user_id,
                'name': profile['name'],
                'position': profile.get('position', 'Unknown'),
                'match_score': score,
                'expertise': expertise
            })
    
    # Sort by match score (highest first)
    return sorted(matches, key=lambda x: x['match_score'], reverse=True)

# Find supervisors matching a student's interests
student_interests = ["machine learning", "software testing", "automated verification"]
matching_supervisors = find_matching_supervisors(all_profiles, student_interests)
```

### Publication Analysis

Analyzing publication patterns and collaborations:

```python
def analyze_publication_trends(profiles):
    """Analyze publication trends across supervisors."""
    yearly_counts = {}
    
    for user_id, profile in profiles.items():
        if 'publications' not in profile:
            continue
            
        for pub in profile['publications']:
            year = pub.get('year')
            if not year:
                continue
                
            year = int(year)
            if year not in yearly_counts:
                yearly_counts[year] = 0
            yearly_counts[year] += 1
    
    # Convert to sorted list of (year, count) tuples
    trend_data = sorted(yearly_counts.items())
    return trend_data

# Get publication trends
publication_trends = analyze_publication_trends(all_profiles)
```

## Data Export

### Exporting to CSV

Converting profile data to CSV for analysis in other tools:

```python
import csv

def export_profiles_to_csv(profiles, output_file='supervisors.csv'):
    """Export basic supervisor information to CSV."""
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['id', 'name', 'position', 'department', 'email', 
                     'research_interests', 'publication_count']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for user_id, profile in profiles.items():
            writer.writerow({
                'id': user_id,
                'name': profile.get('name', ''),
                'position': profile.get('position', ''),
                'department': profile.get('department', ''),
                'email': profile.get('contact', {}).get('email', ''),
                'research_interests': '; '.join(profile.get('research_interests', [])),
                'publication_count': len(profile.get('publications', []))
            })

# Export profile data to CSV
export_profiles_to_csv(all_profiles)
```

## Common Challenges and Solutions

### Handling Missing Data

Profiles may have varying levels of completeness. Always check if a field exists before accessing it:

```python
# Wrong approach - may cause KeyError
email = profile['contact']['email']

# Better approach - use get() with default values
email = profile.get('contact', {}).get('email', 'No email available')
```

### Normalizing Research Interests

Research interests may be phrased differently across profiles. Consider normalizing them:

```python
def normalize_research_interest(interest):
    """Normalize research interest to a standard form."""
    # Convert to lowercase
    normalized = interest.lower()
    
    # Replace common variations
    replacements = {
        "machine learning": ["ml", "machine-learning", "deep learning"],
        "artificial intelligence": ["ai", "computational intelligence"],
        "software testing": ["testing", "test automation", "automated testing"]
    }
    
    for standard, variations in replacements.items():
        if normalized in variations:
            return standard
            
    return interest

def get_normalized_interests(profile):
    """Get normalized research interests for a profile."""
    if 'research_interests' not in profile:
        return []
        
    return [normalize_research_interest(interest) for interest in profile['research_interests']]
```

## Summary

This guide provides basic methods for accessing and querying supervisor profiles. By using these approaches, you can:

1. Load individual or multiple profiles
2. Search profiles by criteria such as research interests or publications
3. Calculate matching scores between student interests and supervisor expertise
4. Analyze trends across multiple profiles
5. Export data for use in other tools

For more advanced usage, consider creating a dedicated profile management module that provides a clean API for these operations.

## Next Steps

- Explore the [Profile Schema](../schema/profile_schema.md) to understand the structure of profile data
- Check out the [Repository Structure](../repository_structure.md) to learn more about the organization of profile data
- Contribute to the [Profile Completeness](../profile_completeness.md) initiative to improve data quality 