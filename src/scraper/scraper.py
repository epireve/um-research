#!/usr/bin/env python3

import os
import json
import csv
import logging
import time
import httpx
from bs4 import BeautifulSoup
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from scrapegraphai.graphs import SmartScraperGraph
from schema import Researcher
import pandas as pd
from tqdm import tqdm

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("scraper.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


class Scraper:
    """Base scraper class for the Research Supervisor Matching project."""

    def __init__(self):
        """Initialize the scraper with default settings."""
        self.base_url = "https://umexpert.um.edu.my"
        self.search_endpoint = "/fcom-search/search.action"
        self.data_dir = Path(__file__).parent.parent.parent / "data"
        self.raw_dir = self.data_dir / "raw"
        self.html_dir = self.raw_dir / "html"
        self.profiles_dir = self.data_dir / "profiles"

        # Create directories if they don't exist
        self.html_dir.mkdir(parents=True, exist_ok=True)
        self.profiles_dir.mkdir(parents=True, exist_ok=True)

        # Configure httpx client
        self.client = httpx.Client(
            timeout=60.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        )

    def _make_request(self, url, method="GET", params=None, data=None, retry_count=3):
        """Make an HTTP request with retry logic."""
        for attempt in range(retry_count):
            try:
                if method.upper() == "GET":
                    response = self.client.get(url, params=params)
                else:
                    response = self.client.post(url, params=params, data=data)

                response.raise_for_status()
                return response
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error: {e} (Attempt {attempt + 1}/{retry_count})")
                if attempt == retry_count - 1:
                    raise
            except httpx.RequestError as e:
                logger.error(
                    f"Request error: {e} (Attempt {attempt + 1}/{retry_count})"
                )
                if attempt == retry_count - 1:
                    raise

            # Wait before retrying
            time.sleep(2**attempt)

    def scrape_researchers(self, department="Software Engineering"):
        """Scrape researchers from a specific department."""
        logger.info(f"Scraping researchers from department: {department}")

        search_url = self.base_url + self.search_endpoint
        params = {
            "page": 1,
            "pageSize": 100,
            "searchTerm": department,
            "typeFilter": "EXPERT",
        }

        try:
            response = self._make_request(search_url, params=params)

            # Save raw HTML for reference
            raw_html_path = self.html_dir / "search_result.html"
            with open(raw_html_path, "w", encoding="utf-8") as f:
                f.write(response.text)

            # Parse HTML
            soup = BeautifulSoup(response.text, "html.parser")
            researchers = []

            # Extract researcher data
            result_items = soup.select(".search-results .expert-item")
            for item in result_items:
                name_elem = item.select_one(".expert-name a")
                if name_elem:
                    name = name_elem.text.strip()
                    profile_url = name_elem["href"]

                    # Extract department and position
                    department_elem = item.select_one(".expert-department")
                    department = department_elem.text.strip() if department_elem else ""

                    position_elem = item.select_one(".expert-position")
                    position = position_elem.text.strip() if position_elem else ""

                    researchers.append(
                        {
                            "name": name,
                            "profile_url": profile_url,
                            "department": department,
                            "position": position,
                        }
                    )

            logger.info(f"Found {len(researchers)} researchers")
            return researchers

        except Exception as e:
            logger.error(f"Error scraping researchers: {e}")
            raise

    def save_to_json(self, researchers):
        """Save researchers data to JSON file."""
        json_path = self.data_dir / "reference" / "researchers.json"
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(researchers, f, indent=4)

        logger.info(f"Saved {len(researchers)} researchers to {json_path}")

    def save_to_csv(self, researchers):
        """Save researchers data to CSV file."""
        csv_path = self.data_dir / "reference" / "researchers.csv"
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)

        with open(csv_path, "w", encoding="utf-8", newline="") as f:
            fieldnames = ["name", "profile_url", "department", "position"]
            writer = csv.DictWriter(f, fieldnames=fieldnames)

            writer.writeheader()
            for researcher in researchers:
                writer.writerow(researcher)

        logger.info(f"Saved {len(researchers)} researchers to {csv_path}")

    def run(self):
        """Run the scraper to collect researcher data."""
        researchers = self.scrape_researchers()
        self.save_to_json(researchers)
        self.save_to_csv(researchers)
        return researchers


class UMExpertScraper:
    def __init__(self):
        """Initialize the scraper with OpenAI configuration."""
        self.base_url = (
            "https://umexpert.um.edu.my/expert_search.php?search_front=C&cat=faculty"
        )
        self.faculty = "Faculty of Computer Science and Information Technology"

        # Configure the scraper with much longer timeout for slow page loads
        self.config = {
            "llm": {
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": "openai/gpt-4o-mini",
            },
            "verbose": True,
            "headless": True,  # Run in headless mode
            "timeout": 300000,  # 5 minutes total timeout
            "navigation": {
                "waitUntil": "domcontentloaded",  # Changed to domcontentloaded for faster initial load
                "timeout": 180000,  # 3 minutes navigation timeout
            },
            "retries": 3,  # Number of retries for failed requests
            "browser": {
                "args": [
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-web-security",
                    "--disable-features=IsolateOrigins,site-per-process",
                ]
            },
            "wait_for": {
                "text": "Search results for faculty of 'FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY'",
                "timeout": 180000,  # 3 minutes wait for text to appear
            },
        }
        logger.info("Scraper initialized successfully")

    def scrape_with_retry(self, scraper, max_retries=3, delay=10):
        """Run the scraper with retry logic."""
        for attempt in range(max_retries):
            try:
                return scraper.run()
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                logger.warning(
                    f"Attempt {attempt + 1} failed: {e}. Retrying in {delay} seconds..."
                )
                time.sleep(delay)
                delay *= 2  # Exponential backoff

    def scrape_researchers(self, max_pages: int = 10) -> List[Researcher]:
        """Scrape all researchers from the faculty using SmartScraperGraph."""
        logger.info("Starting researcher scraping process")
        researchers = []
        current_page = 1

        try:
            # Create the scraper for initial page
            scraper = SmartScraperGraph(
                prompt="Find all researcher profiles in 'expert-item' divs. For each profile, extract: name (with titles), academic title, department, expertise (as list), email, phone number (+603-XXXXXXXX format), profile URL, and image URL. Also check for a 'Next' button ('>') in pagination. Return a JSON with researchers array and has_next_page boolean.",
                source=self.base_url,
                config=self.config,
            )

            while current_page <= max_pages:
                logger.info(f"Scraping page {current_page}")

                # Run the scraper with retry logic
                result = self.scrape_with_retry(scraper)

                # Process results
                if "researchers" in result:
                    for researcher_data in result["researchers"]:
                        try:
                            # Generate CV URL by appending .html to profile URL
                            if "profile_url" in researcher_data:
                                researcher_data["cv_url"] = (
                                    f"{researcher_data['profile_url']}.html"
                                )

                            researcher = Researcher(**researcher_data)
                            researchers.append(researcher)
                            logger.debug(
                                f"Successfully processed researcher: {researcher.name}"
                            )
                        except Exception as e:
                            logger.error(f"Error processing researcher data: {e}")
                            continue

                # Check if there's a next page
                has_next = result.get("has_next_page", False)
                if not has_next:
                    logger.info("No more pages to scrape")
                    break

                current_page += 1

                # Add a longer delay between pages
                time.sleep(10)  # Increased delay between pages to 10 seconds

        except Exception as e:
            logger.error(f"Error during scraping: {e}")

        logger.info(f"Successfully extracted {len(researchers)} researchers")
        return researchers

    def save_to_json(
        self, researchers: List[Researcher], filename: str = "researchers.json"
    ):
        """Save researchers to a JSON file."""
        try:
            with open(filename, "w") as f:
                json.dump([r.model_dump() for r in researchers], f, indent=2)
            logger.info(f"Successfully saved data to {filename}")
        except Exception as e:
            logger.error(f"Error saving to JSON file {filename}: {e}")
            raise

    def save_to_csv(
        self, researchers: List[Researcher], filename: str = "researchers.csv"
    ):
        """Save researchers to a CSV file."""
        try:
            df = pd.DataFrame([r.model_dump() for r in researchers])
            df.to_csv(filename, index=False)
            logger.info(f"Successfully saved data to {filename}")
        except Exception as e:
            logger.error(f"Error saving to CSV file {filename}: {e}")
            raise


def main():
    """Main function to run the scraper."""
    logger.info("Starting scraping process")
    try:
        scraper = UMExpertScraper()
        researchers = scraper.scrape_researchers()

        # Save results in both JSON and CSV formats
        scraper.save_to_json(researchers)
        scraper.save_to_csv(researchers)

        logger.info(f"Successfully scraped {len(researchers)} researchers!")
        print(f"\nSuccessfully scraped {len(researchers)} researchers!")

    except Exception as e:
        logger.error(f"Fatal error in main process: {e}")
        raise


if __name__ == "__main__":
    main()
