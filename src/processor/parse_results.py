import csv
import os
from pathlib import Path
from bs4 import BeautifulSoup

# Define file paths using repository structure
DATA_DIR = Path(__file__).parent.parent.parent / "data"
RAW_HTML_DIR = DATA_DIR / "raw" / "html"
REFERENCE_DIR = DATA_DIR / "reference"

# Create directories if they don't exist
RAW_HTML_DIR.mkdir(parents=True, exist_ok=True)
REFERENCE_DIR.mkdir(parents=True, exist_ok=True)

# Define input and output file paths
html_file_path = RAW_HTML_DIR / "search_result.html"
csv_file_path = REFERENCE_DIR / "supervisor_profiles.csv"

# Check if HTML file exists
if not html_file_path.exists():
    print(f"Error: HTML file not found at {html_file_path}")
    exit()

# Read the HTML file
try:
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
except Exception as e:
    print(f"Error reading HTML file: {e}")
    exit()

# Parse the HTML
soup = BeautifulSoup(html_content, "html.parser")

# Find all researcher cards (across all tds in the table body, regardless of tr)
researcher_cards = []
table = soup.select_one("table#myTable > tbody")
if not table:
    print("Table body not found. Please check the HTML structure.")
    exit()
# Get all td tags that are direct or indirect children of table body
for td in table.find_all("td"):
    card = td.find("div", class_="card")
    if card:
        researcher_cards.append(card)

if not researcher_cards:
    print("No researcher cards found. Please check the HTML structure or the selector.")
    exit()

# Prepare data list
researcher_data = []

# Define CSV headers
headers = [
    "Name",
    "Department",
    "Faculty",
    "Image Source",
    "Email",
    "Phone",
    "Expertise",
    "CV Link",
    "Profile Link",
    "UserID",
]

# Extract data for each researcher
for card in researcher_cards:
    # Name
    name_tag = card.find("div", class_="card-header")
    name = name_tag.get_text(strip=True) if name_tag else ""

    # Department and Faculty
    department = ""
    faculty = ""
    location_span = card.select_one("span.bi-building span.ml-md-2")
    if location_span:
        location_text = [text for text in location_span.stripped_strings]
        if len(location_text) >= 1:
            department = location_text[0].replace("Department of ", "").strip()
        if len(location_text) >= 2:
            faculty = location_text[1].replace("Faculty of ", "").strip()

    # Image Source
    img_tag = card.find("img")
    image_src = img_tag["src"] if img_tag else ""

    # Email
    email_span = card.select_one("span.bi-envelope-fill span.ml-md-2")
    email = email_span.get_text(strip=True) if email_span else ""

    # Phone
    phone_span = card.select_one("span.bi-telephone-fill span.ml-md-2")
    phone = phone_span.get_text(strip=True) if phone_span else ""

    # Expertise
    expertise_list_items = card.select("div.tc-expertise-areas ul li.tryyyy")
    expertise = "; ".join([li.get_text(strip=True) for li in expertise_list_items])

    # Links and UserID
    cv_link = ""
    profile_link = ""
    user_id = ""
    link_tags = card.select("div.card-footer a.btn")
    if len(link_tags) >= 1:
        cv_link = link_tags[0].get("href", "")
    if len(link_tags) >= 2:
        profile_link = link_tags[1].get("href", "")
        # Extract UserID from profile link
        if profile_link and "umexpert.um.edu.my/" in profile_link:
            parts = profile_link.split("/")
            if parts[-1]:  # Check if the last part is not empty
                user_id = parts[-1]
            elif len(parts) > 1 and parts[-1] == "" and parts[-2]:
                user_id = parts[-2].replace(".html", "")
                if user_id == ".":
                    user_id = ""
    # Handle potential missing profile link or malformed structure
    if not user_id and cv_link and "umexpert.um.edu.my/" in cv_link:
        parts = cv_link.split("/")
        potential_id = parts[-1].replace(".html", "")
        if potential_id and potential_id != ".":
            user_id = potential_id

    # Append extracted data
    researcher_data.append(
        [
            name,
            department,
            faculty,
            image_src,
            email,
            phone,
            expertise,
            cv_link,
            profile_link,
            user_id,
        ]
    )

# Write data to CSV file
try:
    with open(csv_file_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)  # Write header row
        writer.writerows(researcher_data)  # Write data rows
    print(f"Successfully parsed data and saved to {csv_file_path}")
except Exception as e:
    print(f"Error writing to CSV file: {e}")

# Print summary of the parsed data
print(f"Parsed {len(researcher_data)} researcher profiles")
print(f"Data saved to {csv_file_path}")
