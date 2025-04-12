import os
import re
import yaml
import logging
import requests
import time
import uvicorn
import uvicorn.supervisors
import asyncio
import httpx
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from bs4 import BeautifulSoup
from tqdm import tqdm

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("scraper.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class UMExpertProfileScraper:
    def __init__(self):
        """Initialize the profile scraper."""
        self.base_url = "https://umexpert.um.edu.my"
        self.profiles_dir = Path("data/profiles")
        self.source_dir = Path("source")

        # Create source directory if it doesn't exist
        os.makedirs(self.source_dir, exist_ok=True)

        # Create subdirectories for different types of pages
        os.makedirs(self.source_dir / "profile", exist_ok=True)
        os.makedirs(self.source_dir / "cv", exist_ok=True)
        os.makedirs(self.source_dir / "dashboard", exist_ok=True)

        logger.info("Profile scraper initialized successfully")

    def extract_user_id_from_filename(self, filename: str) -> str:
        """Extract the user ID from the YAML filename."""
        # The filename is expected to be in the format 'username.yaml'
        return Path(filename).stem

    def get_profile_urls(self, user_id: str) -> Tuple[str, str, str]:
        """Generate the URLs for profile, CV, and dashboard pages."""
        profile_url = f"{self.base_url}/{user_id}.html"
        cv_url = f"{self.base_url}/cv/{user_id}"
        dashboard_url = f"{self.base_url}/cv_dashboard_view.php?viewid={user_id}"

        return profile_url, cv_url, dashboard_url

    def fetch_page(
        self, url: str, max_retries: int = 3, delay: int = 5
    ) -> Optional[str]:
        """Fetch a web page asynchronously using uv/httpx with retry logic."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        async def async_fetch():
            for attempt in range(max_retries):
                try:
                    async with httpx.AsyncClient(http2=True) as client:
                        response = await client.get(url, headers=headers, timeout=30)
                        response.raise_for_status()
                        return response.text
                except httpx.RequestError as e:
                    if attempt == max_retries - 1:
                        logger.error(
                            f"Failed to fetch {url} after {max_retries} attempts: {e}"
                        )
                        return None
                    logger.warning(
                        f"Attempt {attempt + 1} failed for {url}: {e}. Retrying in {delay} seconds..."
                    )
                    await asyncio.sleep(delay)
                    delay_val = delay * 2
            return None

        return asyncio.run(async_fetch())

    def save_html_content(self, user_id: str, page_type: str, content: str) -> None:
        """Save the HTML content to a file."""
        if not content:
            return

        file_path = self.source_dir / page_type / f"{user_id}.html"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        logger.debug(f"Saved {page_type} page for {user_id} to {file_path}")

    def extract_publications(
        self, profile_html: str, cv_html: str, dashboard_html: str
    ) -> Dict[str, List[Dict]]:
        pass  # Removed publication extraction, not needed for HTML download

    def _extract_from_profile(
        self, html: str, publications: Dict[str, List[Dict]]
    ) -> None:
        pass

    def _extract_from_cv(self, html: str, publications: Dict[str, List[Dict]]) -> None:
        pass

    def _extract_from_dashboard(
        self, html: str, publications: Dict[str, List[Dict]]
    ) -> None:
        pass

    def update_yaml_file(
        self, user_id: str, publications: Dict[str, List[Dict]]
    ) -> None:
        pass  # Removed YAML update logic, not needed for HTML saving

    def scrape_researcher_profile(self, yaml_file: str) -> None:
        """Scrape a researcher's profile and update their YAML file."""
        user_id = self.extract_user_id_from_filename(yaml_file)
        logger.info(f"Scraping profile for {user_id}")

        # Generate URLs
        profile_url, cv_url, dashboard_url = self.get_profile_urls(user_id)

        # Fetch pages
        profile_html = self.fetch_page(profile_url)
        cv_html = self.fetch_page(cv_url)
        dashboard_html = self.fetch_page(dashboard_url)

        # Save HTML content
        if profile_html:
            self.save_html_content(user_id, "profile", profile_html)
        if cv_html:
            self.save_html_content(user_id, "cv", cv_html)
        if dashboard_html:
            self.save_html_content(user_id, "dashboard", dashboard_html)

        # Extract publications
        publications = self.extract_publications(profile_html, cv_html, dashboard_html)

        # Update YAML file
        self.update_yaml_file(user_id, publications)

    def scrape_all_profiles(self) -> None:
        """Scrape all researcher profiles in the profiles directory."""
        yaml_files = list(self.profiles_dir.glob("*.yaml"))
        logger.info(f"Found {len(yaml_files)} YAML files to process")

        for yaml_file in tqdm(yaml_files, desc="Scraping profiles"):
            try:
                self.scrape_researcher_profile(yaml_file.name)
                # Add a delay to avoid overwhelming the server
                time.sleep(2)
            except Exception as e:
                logger.error(f"Error processing {yaml_file.name}: {e}")


def main():
    """Main function to run the profile scraper."""
    logger.info("Starting profile scraping process")
    try:
        scraper = UMExpertProfileScraper()
        scraper.scrape_all_profiles()
        logger.info("Profile scraping completed successfully")
    except Exception as e:
        logger.error(f"Fatal error in profile scraping process: {e}")
        raise


if __name__ == "__main__":
    main()
