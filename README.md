# Research Supervisor Matching

A comprehensive system for matching graduate students with research supervisors based on research interests, expertise, and academic backgrounds.

## Project Overview

The Research Supervisor Matching project aims to help graduate students find suitable research supervisors whose expertise and research interests align with their academic goals. The project involves:

1. Collecting comprehensive profiles of research supervisors from various sources
2. Structuring and standardizing the profile data
3. Creating a matching system to connect students with potential supervisors

The project is currently in the data collection and cleanup phase, with plans to develop an interactive web dashboard in the future.

## Repository Structure

The repository is organized as follows:

```
um-research-scrape/
├── docs/                         # Documentation
│   ├── methodology.md            # Data collection methodology
│   ├── profile_format_standards.md # Profile formatting standards
│   ├── repository_structure.md   # Repository structure documentation
│   └── schema/                   # Schema documentation
│       ├── profile_schema.json   # JSON Schema for profile validation
│       └── profile_schema.md     # Human-readable schema documentation
├── profiles/                     # Supervisor profiles (YAML format)
├── src/                          # Source code
│   ├── scraper/                  # Web scraping modules
│   └── processor/                # Data processing modules
└── scripts/                      # Utility scripts
    └── validate_profile.py       # Profile validation script
```

For a more detailed explanation of the repository structure, see [repository_structure.md](docs/repository_structure.md).

## Supervisor Profiles

Each supervisor profile contains comprehensive information about a research supervisor, including:

- Basic information (name, position, department)
- Contact information
- Academic background
- Research interests and expertise
- Publications
- Projects
- Supervised students
- Professional roles and memberships

Profiles are stored in YAML format for readability and ease of editing. The profile schema is documented in [profile_schema.md](docs/schema/profile_schema.md).

## Getting Started

### Prerequisites

To work with this repository, you'll need:

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/um-research-scrape.git
   cd um-research-scrape
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Validating Profiles

You can validate supervisor profiles against the schema using the validation script:

```bash
python scripts/validate_profile.py profiles/ --schema docs/schema/profile_schema.json -v
```

### Viewing Profiles

Profiles are stored in YAML format and can be viewed with any text editor. For a better viewing experience, you can use tools like VSCode with YAML extension or online YAML viewers.

## Data Collection Methodology

The supervisor profiles were collected using a systematic approach involving:

1. Web scraping of university and academic database sources
2. Extraction of structured information from HTML and PDF sources
3. Processing and standardization of the data
4. Validation against a defined schema

For a detailed explanation of the methodology, see [methodology.md](docs/methodology.md).

## Profile Format Standards

To ensure consistency across all supervisor profiles, we follow specific formatting standards detailed in [profile_format_standards.md](docs/profile_format_standards.md). These standards cover:

- Field naming and structure
- Date formats
- Contact information format
- Publication listing format
- And more

## Development

### Setting Up Development Environment

1. Follow the installation steps above
2. Make sure you have the required development tools:
   ```bash
   pip install black mypy pytest
   ```

3. Install pre-commit hooks (optional):
   ```bash
   pip install pre-commit
   pre-commit install
   ```

### Project Roadmap

The project is divided into two main phases:

1. **Data Collection and Cleanup Phase** (Current)
   - Collection and structuring of supervisor profiles
   - Validation and standardization of data
   - Documentation of methodology and standards

2. **Dashboard Development Phase** (Future)
   - Development of matching algorithms
   - Creation of web interface
   - Implementation of search and filter functionality

For a detailed project plan, see [project_plan.md](project_plan.md).

## Contributing

Contributions to the Research Supervisor Matching project are welcome! Please follow these steps:

1. Check the [project_plan.md](project_plan.md) for current priorities
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Validate any profiles you've modified (`python scripts/validate_profile.py profiles/`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

Please ensure your contributions adhere to the formatting standards documented in [profile_format_standards.md](docs/profile_format_standards.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- University of Malaya for providing the initial dataset
- All supervisors whose information is included in the profiles
- Contributors to the open-source tools used in this project 