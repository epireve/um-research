# UM Research Supervisor Matching Web Application

This directory contains the web application for the UM Research Supervisor Matching project. The application is built using Next.js 13 with the App Router, React, and Tailwind CSS.

## Components

The application consists of the following components:

### Pages

- `app/page.js` - The main page that displays a list of supervisors and allows searching/filtering.
- `app/supervisors/[id]/page.js` - The supervisor detail page that displays comprehensive information about a supervisor.
- `app/layout.js` - The root layout that includes the header and footer.

### Components

- `app/components/SupervisorCard.js` - Displays a card with supervisor information.
- `app/components/SupervisorList.js` - Renders a grid of supervisor cards with loading and empty states.
- `app/components/SearchBar.js` - Provides search functionality with text input and research area filters.

## Data Flow

1. The application currently uses mock data defined in the page components.
2. In a production environment, this would be replaced with API calls to fetch data from the server.
3. The search functionality filters supervisors based on name, department, expertise, research interests, and publications.

## Styling

The application uses Tailwind CSS for styling, with custom styles defined in `app/globals.css`. The design is responsive and works well on mobile, tablet, and desktop devices.

## Future Enhancements

- Integration with a backend API to fetch real supervisor data
- Authentication for students and supervisors
- Matching algorithm to suggest supervisors based on student interests
- Contact/request system for students to reach out to potential supervisors
- Admin panel for managing supervisor profiles

## Running the Application

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

To build for production:

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
``` 