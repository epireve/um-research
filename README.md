# UM Research Supervisor Matching

A web application to help students find the perfect research supervisor from the University of Malaya's Software Engineering Department.

## Features

- Search for supervisors by name, expertise, or research interests
- Filter by research areas
- View detailed supervisor profiles including contact information, research interests, and publications
- Responsive design for desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, Tailwind CSS
- **Styling**: Tailwind CSS with custom components
- **Data**: YAML-based profiles with potential for API integration

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/um-research-supervisor-matching.git
   cd um-research-supervisor-matching
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Main application components and pages (Next.js App Router)
- `/app/components` - Reusable React components
- `/app/globals.css` - Global styles and Tailwind CSS imports
- `/profiles` - YAML files containing supervisor profile data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- University of Malaya Software Engineering Department
- All the faculty members who contributed their profiles 