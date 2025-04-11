import os
import json
import logging
import time
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
