#!/usr/bin/env python3

import os
import sys
import argparse
import logging
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.scraper.scraper import Scraper
from src.processor.processor import Processor
from src.processor.parse_results import ParseResults

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("scraper.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


def main():
    """Main function to run the scrapers."""
    parser = argparse.ArgumentParser(description="Research Supervisor Profile Scraper")
    parser.add_argument(
        "--scrape", action="store_true", help="Scrape researcher profiles"
    )
    parser.add_argument("--process", action="store_true", help="Process scraped data")
    parser.add_argument(
        "--parse",
        action="store_true",
        help="Parse processed data into structured format",
    )
    parser.add_argument("--all", action="store_true", help="Run all steps")

    args = parser.parse_args()

    if args.scrape or args.all:
        logger.info("Starting scraping process")
        scraper = Scraper()
        scraper.run()

    if args.process or args.all:
        logger.info("Starting processing of scraped data")
        processor = Processor()
        processor.run()

    if args.parse or args.all:
        logger.info("Starting parsing of processed data")
        parser = ParseResults()
        parser.run()

    if not (args.scrape or args.process or args.parse or args.all):
        parser.print_help()


if __name__ == "__main__":
    main()
