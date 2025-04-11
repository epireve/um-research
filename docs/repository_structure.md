# Repository Structure

## Overview

This document outlines the repository structure for the Research Supervisor Matching project. The structure is designed to provide clear organization of data, code, and documentation to enhance maintainability and collaboration.

## Current Directory Structure

```
um-research-scrape/
├── README.md                     # Project overview and setup instructions
├── CONTRIBUTING.md               # Guidelines for contributing to the project
├── LICENSE                       # Project license
├── requirements.txt              # Python dependencies
├── .gitignore                    # Files and directories to be ignored by git
├── project_plan.md               # Project plan with roadmap and tasks
├── docs/                         # Documentation
│   ├── methodology.md            # Data collection and processing methodology
│   ├── profile_format_standards.md # Profile formatting standards
│   ├── repository_structure.md   # This file
│   ├── summary.md                # Project implementation summary
│   ├── documentation_updates.md  # Recommendations for documentation updates
│   ├── profile_merging_process.md # Details on the profile merging process
│   ├── ai_prompt_templates.md    # Templates for AI prompts
│   ├── schema/                   # Schema documentation
│   │   ├── profile_schema.json   # JSON Schema for profile validation
│   │   └── profile_schema.md     # Human-readable schema documentation
│   └── guides/                   # User and developer guides
│       ├── GEMINI_INTEGRATION.md # Guide to Gemini API integration
│       ├── data_access.md        # Guide to accessing and querying the data
│       └── ...                   # Additional guides
├── profiles/                     # Supervisor profiles
│   ├── [userID].yaml             # Individual supervisor profiles (e.g., sitihafizah.yaml)
│   ├── [userID]_extracted.yaml   # Extracted data for each supervisor
│   └── ...
├── gemini_prompts/               # Prompts for Google Gemini 2.5 Pro
│   ├── [userID]_prompt.txt       # Prompt for each supervisor (e.g., sitihafizah_prompt.txt)
│   └── ...
├── data/                         # Data files
│   ├── raw/                      # Raw collected data
│   │   ├── html/                 # Raw HTML files
│   │   │   ├── profiles/         # Profile pages
│   │   │   ├── cv/               # CV pages
│   │   │   └── publications/     # Publication pages
│   │   └── pdf/                  # PDF documents
│   ├── images/                   # Profile images
│   │   ├── [userID].jpeg         # Individual supervisor profile images
│   │   └── ...
│   ├── backups/                  # Backup files
│   │   ├── [date]/               # Dated backups
│   │   └── ...
│   └── reference/                # Reference data
│       ├── institutions.yaml     # Standard institution names
│       ├── journals.yaml         # Standard journal names
│       ├── supervisor_profiles.csv # Processed supervisor profile data
│       └── research_areas.yaml   # Standard research areas
├── scripts/                      # Standalone scripts
│   ├── processor.py              # Main processing script
│   ├── extract_images.py         # Script for extracting profile images from base64 data in CSV
│   ├── gemini_integration.py     # Integration with Google Gemini AI
│   ├── parse_results.py          # Parse raw scrape results
│   ├── validate_profile.py       # Validate profiles against schema
│   └── check_env.py              # Check environment and dependencies
└── notebooks/                    # Jupyter notebooks
    ├── exploratory_analysis.ipynb # Data exploration
    └── profile_completeness.ipynb # Analysis of profile completeness
```

## Key Directory Explanations

### `docs/`

Contains all project documentation:

- **methodology.md**: Detailed description of data collection and enrichment methodology
- **profile_format_standards.md**: Standards for profile formatting and structure
- **repository_structure.md**: This file describing the repository organization
- **summary.md**: Summary of the project implementation
- **profile_merging_process.md**: Details on how profiles were merged with AI assistance
- **ai_prompt_templates.md**: Templates for prompts used with Gemini AI
- **schema/**: JSON schema and human-readable documentation
- **guides/**: User and developer guides for various aspects of the project

### `profiles/`

Contains supervisor profiles in YAML format:

- **[userID].yaml**: Complete profiles for each supervisor
- **[userID]_extracted.yaml**: Data extracted from various sources for each supervisor

Each profile includes academic background, contact information, research interests, publications, and other relevant information.

### `gemini_prompts/`

Contains prompts used with Google Gemini 2.5 Pro for AI-assisted merging:

- **[userID]_prompt.txt**: Custom prompt for each supervisor profile

These prompts follow a structured format that includes the existing profile, extracted data, and merging instructions.

### `data/`

Contains raw data, images, backups, and reference data:

- **raw/**: Original HTML and PDF files collected from various sources
- **images/**: Profile images for supervisors
- **backups/**: Backups of profiles and other important data
- **reference/**: Reference data used for standardization and normalization

### `scripts/`

Contains standalone scripts for data processing, extraction, and validation:

- **processor.py**: Main script for processing HTML and extracting information
- **extract_images.py**: Script for extracting and processing profile images
- **gemini_integration.py**: Script for generating Gemini prompts
- **parse_results.py**: Script for parsing search results
- **validate_profile.py**: Script for validating profiles against the schema
- **check_env.py**: Script for checking environment and dependencies

### `notebooks/`

Contains Jupyter notebooks for data exploration and analysis:

- **exploratory_analysis.ipynb**: Initial data exploration
- **profile_completeness.ipynb**: Analysis of profile completeness

## File Naming Conventions

- **YAML Files**: `[userID].yaml` for profiles, `[userID]_extracted.yaml` for extracted data
- **Prompt Files**: `[userID]_prompt.txt` for Gemini prompts
- **Image Files**: `[userID].jpeg` for profile images
- **Documentation**: Lowercase with underscores for markdown files (`profile_format_standards.md`)
- **Scripts**: Lowercase with descriptive names (`extract_images.py`)

## Data Flow

The repository is organized to support the following data flow:

1. Raw data collection in `data/raw/`
2. Data extraction and processing via scripts in `scripts/`
3. Storage of extracted data in `profiles/[userID]_extracted.yaml`
4. Generation of prompts in `gemini_prompts/[userID]_prompt.txt`
5. AI-assisted merging of data
6. Storage of updated profiles in `profiles/[userID].yaml`

## Best Practices for Repository Usage

### Working with Profiles

- Always create backups before making batch changes to profiles
- Validate profiles after changes using the validation script
- Maintain the structure defined in the profile schema
- Use the data access guide for querying and analyzing profiles

### Documentation

- Keep documentation up-to-date with code changes
- Follow the established Markdown formatting conventions
- Link related documentation files to create a cohesive knowledge base
- Add last updated dates to all documentation files

### Data Processing

- Store intermediate processing results in a separate directory
- Log all processing steps for reproducibility
- Use the established scripts for common tasks
- Follow the data flow pattern described above

## Future Organization

As the project evolves into the Dashboard Development Phase, the repository structure will be extended to include:

```
um-research-scrape/
├── ...
├── src/                          # Source code for the dashboard
│   ├── frontend/                 # Frontend code (React.js)
│   ├── backend/                  # Backend code (FastAPI or Django)
│   ├── database/                 # Database models and migrations
│   └── utils/                    # Utility functions
├── tests/                        # Test suite
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── fixtures/                 # Test fixtures
└── deployment/                   # Deployment configuration
    ├── docker/                   # Docker configuration
    └── ci/                       # CI/CD configuration
```

This structure will maintain compatibility with the current organization while adding new directories for dashboard development.