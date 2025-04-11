import argparse
import logging
from scraper import UMExpertScraper
from profile_scraper import UMExpertProfileScraper

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("scraper.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


def main():
    """Main function to run the scrapers."""
    parser = argparse.ArgumentParser(description="UM Expert Directory Scraper")
    parser.add_argument(
        "--mode",
        choices=["researchers", "profiles", "all"],
        default="all",
        help="Scraping mode: 'researchers' to scrape researcher list, 'profiles' to scrape individual profiles, 'all' to do both",
    )
    args = parser.parse_args()

    try:
        if args.mode in ["researchers", "all"]:
            logger.info("Starting researcher directory scraping")
            researcher_scraper = UMExpertScraper()
            researchers = researcher_scraper.scrape_researchers()
            researcher_scraper.save_to_json(researchers)
            researcher_scraper.save_to_csv(researchers)
            logger.info(f"Successfully scraped {len(researchers)} researchers")

        if args.mode in ["profiles", "all"]:
            logger.info("Starting profile scraping for publications")
            profile_scraper = UMExpertProfileScraper()
            profile_scraper.scrape_all_profiles()
            logger.info("Profile scraping completed successfully")

        logger.info("Scraping process completed successfully")
        print("\nScraping process completed successfully!")

    except Exception as e:
        logger.error(f"Fatal error in main process: {e}")
        raise


if __name__ == "__main__":
    main()
