# Repository Structure

## Overview

This document outlines the revised repository structure for the Research Supervisor Matching project. The structure is designed to provide clear organization of data, code, and documentation to enhance maintainability and collaboration.

## Directory Structure

```
um-research-scrape/
├── README.md                     # Project overview and setup instructions
├── CONTRIBUTING.md               # Guidelines for contributing to the project
├── LICENSE                       # Project license
├── setup.py                      # Package installation configuration
├── requirements.txt              # Python dependencies
├── .gitignore                    # Files and directories to be ignored by git
├── docs/                         # Documentation
│   ├── methodology.md            # Data collection methodology
│   ├── profile_format_standards.md # Profile formatting standards
│   ├── repository_structure.md   # This file
│   ├── schema/                   # Schema documentation
│   │   ├── profile_schema.json   # JSON Schema for profile validation
│   │   └── profile_schema.md     # Human-readable schema documentation
│   └── guides/                   # User and developer guides
│       ├── data_access.md        # Guide to accessing and querying the data
│       ├── contribution_guide.md # Detailed contribution guide
│       └── development_setup.md  # Development environment setup
├── data/                         # Data files
│   ├── profiles/                 # Final supervisor profiles
│   │   ├── [profile1].yaml       # Individual supervisor profiles
│   │   ├── [profile2].yaml
│   │   └── ...
│   ├── raw/                      # Raw collected data
│   │   ├── html/                 # Raw HTML files
│   │   │   ├── profiles/         # Profile pages
│   │   │   ├── cv/               # CV pages
│   │   │   └── publications/     # Publication pages
│   │   └── pdf/                  # PDF documents
│   ├── extracted/                # Extracted data before merging
│   │   ├── [profile1]_extracted.yaml
│   │   ├── [profile2]_extracted.yaml
│   │   └── ...
│   ├── backups/                  # Backup files
│   │   ├── [date]/               # Dated backups
│   │   └── ...
│   └── reference/                # Reference data
│       ├── institutions.yaml     # Standard institution names
│       ├── journals.yaml         # Standard journal names
│       └── research_areas.yaml   # Standard research areas
├── src/                          # Source code
│   ├── __init__.py               # Package initialization
│   ├── scraper/                  # Web scraping modules
│   │   ├── __init__.py
│   │   ├── base.py               # Base scraper functionality
│   │   ├── profile_scraper.py    # Profile scraping functionality
│   │   ├── publication_scraper.py # Publication scraping functionality
│   │   └── utils.py              # Utility functions for scraping
│   ├── processor/                # Data processing modules
│   │   ├── __init__.py
│   │   ├── extractor.py          # Information extraction from raw data
│   │   ├── merger.py             # Profile merging functionality
│   │   ├── validator.py          # Data validation
│   │   └── normalizer.py         # Data normalization
│   ├── utils/                    # Utility modules
│   │   ├── __init__.py
│   │   ├── yaml_utils.py         # YAML handling utilities
│   │   ├── text_processing.py    # Text processing utilities
│   │   └── logger.py             # Logging configuration
│   ├── config/                   # Configuration
│   │   ├── __init__.py
│   │   └── settings.py           # Project settings
│   └── cli/                      # Command-line interface
│       ├── __init__.py
│       └── commands.py           # CLI commands
├── scripts/                      # Standalone scripts
│   ├── validate_profiles.py      # Profile validation script
│   ├── format_publications.py    # Publication formatting script
│   ├── normalize_institutions.py # Institution name normalization
│   └── backup_profiles.py        # Profile backup script
└── tests/                        # Test suite
    ├── __init__.py
    ├── test_scraper.py           # Tests for scraper modules
    ├── test_processor.py         # Tests for processor modules
    ├── test_utils.py             # Tests for utility modules
    └── test_data/                # Test data files
        ├── profiles/             # Test profile files
        └── raw/                  # Test raw data files
```

## Key Directory Explanations

### `docs/`

Contains all project documentation:

- General methodology and standards
- Technical schema documentation
- User and developer guides

### `data/`

Contains all data files organized by processing stage:

- `profiles/`: Final, validated supervisor profiles ready for use
- `raw/`: Raw data collected from various sources, organized by type
- `extracted/`: Intermediate data extracted from raw sources before merging
- `backups/`: Regular backups of profile data for safety
- `reference/`: Reference data used for standardization and normalization

### `src/`

Contains all source code organized by functionality:

- `scraper/`: Modules for collecting data from web sources
- `processor/`: Modules for processing, merging, and validating data
- `utils/`: Utility functions used across multiple modules
- `config/`: Configuration settings for the application
- `cli/`: Command-line interface for the application

### `scripts/`

Contains standalone utility scripts that can be run independently:

- Validation scripts
- Formatting scripts
- Backup scripts

### `tests/`

Contains the test suite for the application:

- Test modules corresponding to source code modules
- Test data files

## Migration Plan

To transition to this structure from the current repository:

1. Create the new directory structure
2. Move existing files to their appropriate locations
3. Update import statements in Python files
4. Update references in documentation
5. Create any missing directories or placeholder files
6. Update README with new structure information

## Best Practices for Repository Usage

### File Naming

- Use lowercase with underscores for Python files (`profile_scraper.py`)
- Use lowercase with hyphens for documentation files (`profile-format-standards.md`)
- Use meaningful, descriptive names that indicate the file's purpose

### Code Organization

- Follow the package structure for Python code
- Keep related functionality in the same module
- Use relative imports within the package
- Document module purposes in docstrings

### Data Management

- Always work with copies of profiles during development
- Use the backup script before making batch changes
- Validate profiles after changes using the validation script
- Store sensitive or private information outside the repository

### Documentation

- Keep documentation up-to-date with code changes
- Document all major components and functions
- Include examples in documentation where helpful
- Follow Markdown formatting conventions 