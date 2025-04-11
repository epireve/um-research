#!/usr/bin/env python3
"""
Profile Validator Script

This script validates supervisor profile YAML files against the defined JSON schema.
It checks for structural correctness, required fields, and format consistency.
"""

import os
import sys
import json
import yaml
import argparse
import jsonschema
from jsonschema import validate
from pathlib import Path
from typing import Dict, List, Union, Optional, Any, Tuple


def load_schema(schema_path: str) -> Dict[str, Any]:
    """
    Load the JSON schema from the specified path.

    Args:
        schema_path: Path to the JSON schema file

    Returns:
        Dict containing the JSON schema

    Raises:
        FileNotFoundError: If schema file doesn't exist
        json.JSONDecodeError: If schema is not valid JSON
    """
    try:
        with open(schema_path, "r") as f:
            schema = json.load(f)
        return schema
    except FileNotFoundError:
        print(f"Error: Schema file not found at {schema_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in schema file: {e}")
        sys.exit(1)


def load_yaml_profile(profile_path: str) -> Dict[str, Any]:
    """
    Load a YAML profile file.

    Args:
        profile_path: Path to the YAML profile file

    Returns:
        Dict containing the YAML data

    Raises:
        FileNotFoundError: If profile file doesn't exist
        yaml.YAMLError: If profile is not valid YAML
    """
    try:
        with open(profile_path, "r") as f:
            profile_data = yaml.safe_load(f)
        return profile_data
    except FileNotFoundError:
        print(f"Error: Profile file not found at {profile_path}")
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"Error: Invalid YAML in profile file: {e}")
        sys.exit(1)


def validate_profile(
    profile_data: Dict[str, Any], schema: Dict[str, Any]
) -> Tuple[bool, List[str]]:
    """
    Validate profile data against schema.

    Args:
        profile_data: Dictionary containing profile data
        schema: Dictionary containing JSON schema

    Returns:
        Tuple of (is_valid, error_messages)
    """
    errors = []
    is_valid = True

    try:
        validate(instance=profile_data, schema=schema)
    except jsonschema.exceptions.ValidationError as e:
        is_valid = False
        # Get the path to the error in the document
        path = ".".join(str(p) for p in e.path)
        if not path:
            path = "root"
        errors.append(f"{path}: {e.message}")

    return is_valid, errors


def check_custom_rules(profile_data: Dict[str, Any]) -> List[str]:
    """
    Perform additional checks not covered by JSON Schema.

    Args:
        profile_data: Dictionary containing profile data

    Returns:
        List of error messages, empty if all checks pass
    """
    errors = []

    # Check for duplicate research interests
    if "research_interests" in profile_data:
        interests = profile_data["research_interests"]
        duplicate_interests = set([x for x in interests if interests.count(x) > 1])
        if duplicate_interests:
            errors.append(
                f"Duplicate research interests found: {', '.join(duplicate_interests)}"
            )

    # Check for duplicate publications (based on title and year)
    if "publications" in profile_data and isinstance(
        profile_data["publications"], list
    ):
        pub_identifiers = []
        for pub in profile_data["publications"]:
            if isinstance(pub, dict) and "title" in pub and "year" in pub:
                identifier = (pub["title"].lower(), pub["year"])
                if identifier in pub_identifiers:
                    errors.append(
                        f"Duplicate publication: '{pub['title']}' ({pub['year']})"
                    )
                pub_identifiers.append(identifier)

    # Check for valid date ranges
    date_fields = []
    if "projects" in profile_data and isinstance(profile_data["projects"], list):
        for project in profile_data["projects"]:
            if isinstance(project, dict) and "duration" in project:
                date_fields.append(
                    ("project", project.get("title", "Unknown"), project["duration"])
                )

    if "roles" in profile_data and isinstance(profile_data["roles"], list):
        for role in profile_data["roles"]:
            if isinstance(role, dict) and "duration" in role:
                date_fields.append(
                    ("role", role.get("title", "Unknown"), role["duration"])
                )

    for field_type, name, duration in date_fields:
        if not isinstance(duration, str):
            errors.append(
                f"Invalid {field_type} duration format for '{name}': not a string"
            )
            continue

        parts = duration.split(" - ")
        if len(parts) != 2:
            errors.append(
                f"Invalid {field_type} duration format for '{name}': {duration}"
            )
            continue

        start, end = parts
        if end != "Present":
            try:
                start_year, end_year = int(start), int(end)
                if start_year > end_year:
                    errors.append(
                        f"Invalid {field_type} duration for '{name}': start year {start_year} is after end year {end_year}"
                    )
            except ValueError:
                errors.append(
                    f"Invalid {field_type} duration years for '{name}': {duration}"
                )

    return errors


def validate_profiles(
    profiles_dir: str, schema_path: str, verbose: bool = False
) -> Dict[str, List[str]]:
    """
    Validate all YAML profiles in a directory against the schema.

    Args:
        profiles_dir: Directory containing YAML profile files
        schema_path: Path to the JSON schema file
        verbose: Whether to print detailed information

    Returns:
        Dictionary of {profile_path: [error_messages]}
    """
    schema = load_schema(schema_path)
    profile_errors = {}

    # Get all YAML files in the directory
    profile_paths = []
    for root, _, files in os.walk(profiles_dir):
        for file in files:
            if file.endswith((".yaml", ".yml")) and not file.endswith(
                "_extracted.yaml"
            ):
                profile_paths.append(os.path.join(root, file))

    total_profiles = len(profile_paths)
    valid_count = 0

    for profile_path in profile_paths:
        if verbose:
            print(f"Validating {profile_path}...")

        try:
            profile_data = load_yaml_profile(profile_path)
            is_valid, schema_errors = validate_profile(profile_data, schema)
            custom_errors = check_custom_rules(profile_data)

            all_errors = schema_errors + custom_errors

            if all_errors:
                profile_errors[profile_path] = all_errors
                if verbose:
                    print(f"  ❌ Failed with {len(all_errors)} errors")
                    for error in all_errors:
                        print(f"    - {error}")
            else:
                valid_count += 1
                if verbose:
                    print(f"  ✅ Valid")

        except Exception as e:
            profile_errors[profile_path] = [f"Error processing file: {str(e)}"]
            if verbose:
                print(f"  ❌ Error: {str(e)}")

    return profile_errors, valid_count, total_profiles


def main():
    """Main function to run the script."""
    parser = argparse.ArgumentParser(
        description="Validate supervisor profile YAML files against JSON schema"
    )
    parser.add_argument("profiles_dir", help="Directory containing YAML profile files")
    parser.add_argument(
        "--schema", default="profile_schema.json", help="Path to the JSON schema file"
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="Print detailed information"
    )
    args = parser.parse_args()

    # Resolve paths
    profiles_dir = os.path.abspath(args.profiles_dir)
    if not os.path.exists(args.schema):
        # Try to find schema in common locations
        possible_locations = [
            args.schema,
            os.path.join("docs", "schema", "profile_schema.json"),
            os.path.join(os.path.dirname(__file__), "profile_schema.json"),
            os.path.join(
                os.path.dirname(__file__), "..", "docs", "schema", "profile_schema.json"
            ),
        ]

        for loc in possible_locations:
            if os.path.exists(loc):
                schema_path = loc
                break
        else:
            print(
                f"Error: Schema file not found at {args.schema} or in common locations"
            )
            sys.exit(1)
    else:
        schema_path = args.schema

    print(f"Using schema from: {schema_path}")
    print(f"Validating profiles in: {profiles_dir}")

    profile_errors, valid_count, total_profiles = validate_profiles(
        profiles_dir, schema_path, args.verbose
    )

    print("\nValidation Summary:")
    print(f"Total profiles: {total_profiles}")
    print(f"Valid profiles: {valid_count}")
    print(f"Invalid profiles: {total_profiles - valid_count}")

    if profile_errors:
        print("\nErrors by profile:")
        for profile_path, errors in profile_errors.items():
            rel_path = os.path.relpath(profile_path, start=os.getcwd())
            print(f"\n{rel_path}:")
            for error in errors:
                print(f"  - {error}")
        sys.exit(1)
    else:
        print("\nAll profiles are valid! ✅")
        sys.exit(0)


if __name__ == "__main__":
    main()
