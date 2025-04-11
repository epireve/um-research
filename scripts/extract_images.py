#!/usr/bin/env python3
"""
Script to extract base64-encoded images from supervisor_profiles.csv
and save them as JPEG files in the data/images directory.
"""

import os
import csv
import base64
import logging
from io import BytesIO
from PIL import Image

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configure paths
CSV_PATH = "data/reference/supervisor_profiles.csv"
IMAGES_DIR = "data/images"


def extract_and_save_images():
    """Extract base64-encoded images and save them as JPEG files."""
    # Ensure the images directory exists
    if not os.path.exists(IMAGES_DIR):
        logger.info(f"Creating directory: {IMAGES_DIR}")
        os.makedirs(IMAGES_DIR)

    total_images = 0
    successful_extractions = 0

    try:
        # Open the CSV file
        with open(CSV_PATH, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            # Process each row in the CSV
            for row in reader:
                total_images += 1

                # Get user ID from the row
                user_id = row.get("UserID")

                if not user_id:
                    logger.warning(f"Skipping row {total_images}: No UserID found")
                    continue

                # Get base64 image data - based on the CSV header, the column is "Image Source"
                base64_data = row.get("Image Source")

                if not base64_data:
                    logger.warning(f"Skipping {user_id}: No image data found")
                    continue

                try:
                    # Clean the base64 string if necessary (remove data:image/jpeg;base64, prefix)
                    if "," in base64_data:
                        base64_data = base64_data.split(",", 1)[1]

                    # Decode the base64 data
                    image_data = base64.b64decode(base64_data)

                    # Create an image from the binary data
                    image = Image.open(BytesIO(image_data))

                    # Save the image as JPEG
                    output_path = os.path.join(IMAGES_DIR, f"{user_id}.jpeg")
                    image.save(output_path, "JPEG")

                    logger.info(f"Saved image for {user_id} to {output_path}")
                    successful_extractions += 1

                except Exception as e:
                    logger.error(f"Error processing image for {user_id}: {str(e)}")

    except Exception as e:
        logger.error(f"Error reading CSV file: {str(e)}")

    # Log summary
    logger.info(
        f"Extraction complete: {successful_extractions}/{total_images} images extracted successfully"
    )

    return successful_extractions, total_images


if __name__ == "__main__":
    logger.info("Starting image extraction process")
    successful, total = extract_and_save_images()
    if successful == 0:
        logger.error(
            "No images were extracted. Please check the CSV file and image data."
        )
    elif successful < total:
        logger.warning(
            f"Extracted {successful} out of {total} images. Check logs for details on failures."
        )
    else:
        logger.info(f"Successfully extracted all {total} images!")
