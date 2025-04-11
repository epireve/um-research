#!/usr/bin/env python3

import os
import sys
import json
import yaml
import jsonschema
import argparse
import logging
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class ProfileValidator:
    """Validates YAML profiles against the JSON schema"""

    def __init__(self):
        """Initialize the validator with schema"""
        # Load schema from file
        schema_path = (
            Path(__file__).parent.parent / "docs" / "schema" / "profile_schema.json"
        )
        with open(schema_path, "r") as f:
            self.schema = json.load(f)

        # Set up profiles directory
        self.profiles_dir = Path(__file__).parent.parent / "data" / "profiles"

    def validate_file(self, file_path):
        """Validate a single YAML file against the schema"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)

            jsonschema.validate(instance=data, schema=self.schema)
            logger.info(f"✅ {os.path.basename(file_path)} is valid")
            return True
        except yaml.YAMLError as e:
            logger.error(
                f"❌ YAML parsing error in {os.path.basename(file_path)}: {str(e)}"
            )
            return False
        except jsonschema.exceptions.ValidationError as e:
            logger.error(
                f"❌ Schema validation error in {os.path.basename(file_path)}: {str(e)}"
            )
            return False
        except Exception as e:
            logger.error(f"❌ Error validating {os.path.basename(file_path)}: {str(e)}")
            return False

    def validate_all(self):
        """Validate all YAML files in the profiles directory"""
        success_count = 0
        failure_count = 0

        for file_path in self.profiles_dir.glob("*.yaml"):
            # Skip files with _extracted suffix
            if "_extracted" in file_path.name:
                continue

            if self.validate_file(file_path):
                success_count += 1
            else:
                failure_count += 1

        logger.info(
            f"\nValidation complete. {success_count} valid, {failure_count} invalid."
        )
        return success_count, failure_count


def main():
    parser = argparse.ArgumentParser(
        description="Validate YAML profiles against JSON schema"
    )
    parser.add_argument("--file", help="Validate a specific YAML file")
    parser.add_argument("--all", action="store_true", help="Validate all profiles")

    args = parser.parse_args()
    validator = ProfileValidator()

    if args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            return 1
        validator.validate_file(file_path)
    elif args.all:
        success_count, failure_count = validator.validate_all()
        if failure_count > 0:
            return 1
    else:
        parser.print_help()

    return 0


if __name__ == "__main__":
    sys.exit(main())
