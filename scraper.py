import os
import json
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from langchain_openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
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
        """Initialize the scraper with OpenAI."""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        logger.info("Initializing UMExpertScraper")
        self.llm = ChatOpenAI(api_key=api_key, model="gpt-3.5-turbo", temperature=0)
        self.base_url = "https://umexpert.um.edu.my/expert_search.php"
        self.faculty = "Faculty of Computer Science and Information Technology"
        self.parser = PydanticOutputParser(pydantic_object=Researcher)
        logger.info("Scraper initialized successfully")

    def _get_page_content(self, page: int) -> str:
        """Get the HTML content of a page."""
        url = f"{self.base_url}?search_front=C&cat=faculty&page={page}"
        logger.debug(f"Fetching content from page {page}: {url}")
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logger.error(f"Error fetching page {page}: {e}")
            raise

    def _has_next_page(self, soup: BeautifulSoup) -> bool:
        """Check if there is a next page."""
        pagination = soup.find("ul", class_="pagination")
        if not pagination:
            return False
        next_button = pagination.find("a", text="»")
        return bool(next_button)

    def _extract_researcher_info(self, html_content: str) -> List[Dict[str, Any]]:
        """Extract researcher information using LangChain and OpenAI."""
        prompt = PromptTemplate(
            template="""Extract researcher information from the following HTML content. 
            For each researcher, provide:
            - Full name (including titles like Prof., Dr., etc)
            - Academic title (if available)
            - Department within the faculty
            - Areas of expertise
            - Email address
            - Phone number (in format +603-XXXXXXXX)
            - Profile URL
            - Image URL (look for img tags with src attribute)

            HTML Content:
            {html_content}

            {format_instructions}
            """,
            input_variables=["html_content"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        soup = BeautifulSoup(html_content, "html.parser")
        researcher_elements = soup.find_all("div", class_="expert-item")
        researchers = []

        logger.info(f"Found {len(researcher_elements)} researchers on current page")

        for element in tqdm(
            researcher_elements, desc="Processing researchers", leave=False
        ):
            # Get the raw HTML of just this researcher's element
            researcher_html = str(element)

            try:
                # Use LangChain to extract information
                _input = prompt.format_prompt(html_content=researcher_html)
                output = self.llm.invoke(_input.to_string())
                researcher = self.parser.parse(output)
                researchers.append(researcher.model_dump())
                logger.debug(
                    f"Successfully extracted info for researcher: {researcher.name}"
                )
            except Exception as e:
                logger.error(f"Error processing researcher data: {e}")
                logger.debug(f"Problematic HTML: {researcher_html[:200]}...")
                continue

        return researchers

    async def scrape_researchers(self) -> List[Researcher]:
        """Scrape all researchers from the faculty."""
        researchers = []
        page = 1
        total_processed = 0

        logger.info("Starting researcher scraping process")

        with tqdm(desc="Scraping pages", unit="page") as pbar:
            while True:
                try:
                    # Get page content
                    logger.info(f"Processing page {page}")
                    content = self._get_page_content(page)
                    soup = BeautifulSoup(content, "html.parser")

                    # Extract researchers from current page
                    page_researchers = self._extract_researcher_info(content)
                    for researcher_data in page_researchers:
                        profile_url = researcher_data.get("profile_url")
                        # Generate CV URL by appending .html to profile URL
                        cv_url = f"{profile_url}.html" if profile_url else None
                        researcher_data["cv_url"] = cv_url

                        researcher = Researcher(**researcher_data)
                        researchers.append(researcher)
                        total_processed += 1

                    # Update progress
                    pbar.update(1)
                    logger.info(
                        f"Completed page {page}. Total researchers so far: {total_processed}"
                    )

                    # Check if there are more pages
                    if not self._has_next_page(soup):
                        logger.info("No more pages to process")
                        break

                    page += 1

                except Exception as e:
                    logger.error(f"Error processing page {page}: {e}")
                    break

        logger.info(
            f"Scraping completed. Total researchers extracted: {len(researchers)}"
        )
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


async def main():
    """Main function to run the scraper."""
    logger.info("Starting scraping process")
    try:
        scraper = UMExpertScraper()
        researchers = await scraper.scrape_researchers()

        # Save results in both JSON and CSV formats
        scraper.save_to_json(researchers)
        scraper.save_to_csv(researchers)

        logger.info(f"Successfully scraped {len(researchers)} researchers!")
        print(f"\nSuccessfully scraped {len(researchers)} researchers!")

    except Exception as e:
        logger.error(f"Fatal error in main process: {e}")
        raise


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
