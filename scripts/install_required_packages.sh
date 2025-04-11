#!/bin/bash

# This script creates a virtual environment and installs required packages

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install required packages
pip install pyyaml google-genai python-dotenv markdownify

# Print success message
echo "Packages installed successfully in the virtual environment."
echo "To use the virtual environment, run:"
echo "source venv/bin/activate"
echo "Then you can run your Python scripts using python instead of python3." 