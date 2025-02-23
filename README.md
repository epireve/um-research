# UM Expert Directory Scraper

This project scrapes the directory of lecturers and researchers from the Faculty of Computer Science and Information Technology at the University of Malaya using ScrapeGraphAI.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory and add your ScrapeGraphAI API key:
```bash
SCRAPEGRAPH_API_KEY=your_api_key_here
```

## Usage

Run the scraper:
```bash
python scraper.py
```

The script will:
1. Scrape all researchers' information from the faculty directory
2. Handle pagination automatically
3. Save the results in both JSON (`researchers.json`) and CSV (`researchers.csv`) formats

## Data Structure

Each researcher entry contains:
- Name
- Title (if available)
- Department (if available)
- Areas of expertise
- Email (if available)
- Profile URL
- Faculty name

## Requirements

- Python 3.8+
- Dependencies listed in `requirements.txt`
- ScrapeGraphAI API key

## Notes

- The scraper uses ScrapeGraphAI's intelligent extraction capabilities to handle the website's structure
- Pagination is handled automatically
- Results are saved in both JSON and CSV formats for flexibility 