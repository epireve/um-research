# Research Supervisor Matching System

This system helps graduate students find suitable research supervisors based on their research interests using vector embeddings and semantic search.

## Features

- Vector-based similarity search for matching research interests
- Integration with LM Studio for generating embeddings locally
- PostgreSQL with pgvector for efficient vector storage and search
- Prisma ORM for type-safe database operations

## Setup Instructions

### 1. Prerequisites

- Node.js 16+
- PostgreSQL 14+ with pgvector extension installed
- LM Studio desktop application

### 2. Database Setup

```bash
# Install pgvector extension if not already installed
brew install pgvector

# Create database
createdb research_supervisor_match

# Set up database schema and verify connection
npm run setup-db
```

### 3. LM Studio Setup

1. Download and install LM Studio from [lmstudio.ai](https://lmstudio.ai/)
2. Launch LM Studio
3. Go to the "Local Server" tab
4. Download an embedding model (recommended: text-embedding-3-small or similar)
5. Start the server with the embedding model loaded

### 4. Import Profiles

Make sure your profiles are in YAML format in the `profiles` directory, then:

```bash
# Test the embedding API
npm run test-embedding

# Import profiles and generate embeddings
npm run import-profiles
```

## Database Schema

The system uses the following tables:

- `supervisors`: Basic information about each supervisor
- `research_interests`: Individual research interests with vector embeddings
- `supervisor_embeddings`: Aggregated embeddings for various aspects (research, expertise, publications)
- `embedding_cache`: Cache for generated embeddings to improve performance

## Command Line Tools

This package includes several command-line tools:

- `npm run setup-db`: Set up the database schema and test connection
- `npm run test-embedding`: Test connection to LM Studio and embedding generation
- `npm run import-profiles`: Import supervisor profiles and generate embeddings

## Troubleshooting

### LM Studio Connection Issues

If you have trouble connecting to LM Studio:

1. Ensure LM Studio is running and the server is started
2. Check that an embedding model is loaded
3. Verify the API URL is correct (default: http://localhost:1234/v1)
4. Check the LM_STUDIO_API_URL in your .env file

### Database Connection Issues

If you have trouble connecting to PostgreSQL:

1. Ensure PostgreSQL is running
2. Check your DATABASE_URL in the .env file
3. Verify that the pgvector extension is installed
4. Ensure your user has access to the database

## License

MIT 