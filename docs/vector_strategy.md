# Vector Strategy for Research Supervisor Matching

## Overview

This document outlines the strategy for implementing vector embeddings to enhance the Research Supervisor Matching system while maintaining the human readability of profile data. The approach balances the need for efficient semantic search with the requirement to keep profile data accessible in YAML format.

## Hybrid Approach: YAML + PostgreSQL with pgvector

We propose a hybrid approach that preserves YAML files as the source of truth while leveraging PostgreSQL with pgvector for semantic search capabilities:

1. **YAML as Source of Truth**
   - Profile data remains in YAML format for human readability and editing
   - Each profile maintains its comprehensive structure as defined in the schema
   - Updates to profiles continue through the existing YAML file workflow

2. **PostgreSQL with pgvector for Search**
   - PostgreSQL database with pgvector extension for vector storage and similarity search
   - Automated sync process to keep database in sync with YAML files
   - Semantic embeddings generated from key profile sections

## Vectorization Strategy

### Primary Matching Fields (High Priority)

These fields are most critical for student-supervisor matching and will receive higher weight in similarity calculations:

1. **Research Interests**
   - Generate embeddings for each research interest individually
   - Create a combined embedding for all research interests as a whole
   - Store both individual and combined vectors for flexible querying

2. **Expertise**
   - Generate embeddings for each expertise area
   - Create a combined expertise vector
   - Enable matching specific expertise requirements

3. **Publications**
   - Generate embeddings from publication titles
   - Focus on recent publications (last 5 years) for relevance
   - Extract and embed key themes across publications

### Secondary Ranking Fields (Medium Priority)

These fields provide additional signals for ranking and can refine matches:

1. **Projects**
   - Generate embeddings from project titles and descriptions
   - Weight ongoing projects higher than completed ones

2. **Supervised Students**
   - Generate embeddings from thesis/dissertation titles
   - Use supervision history to identify experience in specific areas

3. **Conference Publications, Book Chapters, Roles**
   - Generate embeddings for additional context
   - Use as secondary ranking signals

## Technical Implementation

### Embedding Generation

1. **Embedding Model**
   - Use a domain-adapted embedding model for academic content
   - Options include fine-tuned models like BERT, SciBERT, or general models like OpenAI's text-embedding-ada-002
   - Target embedding dimension: 1536 (compatible with OpenAI embeddings)

2. **Processing Pipeline**
   - YAML to JSON conversion for processing
   - Text extraction from structured fields
   - Preprocessing (normalization, stop word removal for certain fields)
   - Batch embedding generation
   - Vector storage in PostgreSQL via Prisma ORM

### Database Schema

Instead of raw SQL, we'll use Prisma schema to define our models:

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

model Supervisor {
  id            String   @id
  name          String
  position      String
  department    String
  email         String
  profileData   Json     @map("profile_data")
  lastUpdated   DateTime @default(now()) @map("last_updated")
  
  // Relations
  researchInterests ResearchInterest[]
  embeddings        SupervisorEmbedding[]

  @@map("supervisors")
}

model ResearchInterest {
  id           Int      @id @default(autoincrement())
  supervisorId String   @map("supervisor_id")
  interest     String
  embedding    Unsupported("vector(1536)")
  createdAt    DateTime @default(now()) @map("created_at")
  
  // Relations
  supervisor   Supervisor @relation(fields: [supervisorId], references: [id], onDelete: Cascade)

  @@index([embedding], type: Ivfflat(lists: 100))
  @@map("research_interests")
}

model SupervisorEmbedding {
  id            Int      @id @default(autoincrement())
  supervisorId  String   @map("supervisor_id")
  embeddingType String   @map("embedding_type")
  embedding     Unsupported("vector(1536)")
  createdAt     DateTime @default(now()) @map("created_at")
  
  // Relations
  supervisor    Supervisor @relation(fields: [supervisorId], references: [id], onDelete: Cascade)
  
  @@unique([supervisorId, embeddingType])
  @@index([embedding], type: Ivfflat(lists: 100))
  @@map("supervisor_embeddings")
}
```

Note: Prisma requires the `pgvector` extension and uses the `Unsupported` type for vectors since vector support is still experimental.

### Synchronization Process

1. **Initial Load**
   - Process all YAML files and populate PostgreSQL tables via Prisma
   - Generate embeddings for all vectorizable fields
   - Create initial indexes for similarity search

2. **Incremental Updates**
   - Monitor YAML files for changes (using file timestamps)
   - Process only modified files
   - Update corresponding database records and embeddings using Prisma transactions
   - Run synchronization on a scheduled basis (e.g., nightly)

3. **Validation**
   - Verify data integrity during synchronization
   - Log any discrepancies for manual review

## Query Strategy

### Student Interest Matching

When a student enters research interests:

1. Convert student interests to vector embeddings
2. Perform similarity search against supervisor research interest embeddings
3. Rank results based on cosine similarity
4. Apply additional filters based on other criteria (department, expertise)

Example query using Prisma with raw PostgreSQL for vector operations:

```javascript
// Find supervisors with similar research interests
const findSimilarSupervisors = async (interestEmbedding) => {
  // Use Prisma with $queryRaw for vector operations
  const supervisors = await prisma.$queryRaw`
    SELECT 
      s.id, 
      s.name, 
      s.department, 
      1 - (e.embedding <=> ${interestEmbedding}::vector) as similarity
    FROM supervisor_embeddings e
    JOIN supervisors s ON e.supervisor_id = s.id
    WHERE e.embedding_type = 'research_interests'
    ORDER BY similarity DESC
    LIMIT 10
  `;
  
  return supervisors;
};
```

### Advanced Queries

Combine multiple embedding types for more nuanced matching:

```javascript
// Combined research interests and expertise matching
const findMultiCriteriaSupervisors = async (researchEmbedding, expertiseEmbedding) => {
  const supervisors = await prisma.$queryRaw`
    WITH research_match AS (
      SELECT supervisor_id, 
             1 - (embedding <=> ${researchEmbedding}::vector) as research_similarity
      FROM supervisor_embeddings
      WHERE embedding_type = 'research_interests'
    ),
    expertise_match AS (
      SELECT supervisor_id, 
             1 - (embedding <=> ${expertiseEmbedding}::vector) as expertise_similarity
      FROM supervisor_embeddings
      WHERE embedding_type = 'expertise'
    )
    SELECT s.id, s.name, s.department,
           r.research_similarity * 0.7 + e.expertise_similarity * 0.3 as combined_score
    FROM supervisors s
    JOIN research_match r ON s.id = r.supervisor_id
    JOIN expertise_match e ON s.id = e.supervisor_id
    ORDER BY combined_score DESC
    LIMIT 10
  `;
  
  return supervisors;
};
```

## Implementation Plan

1. **Phase 1: Setup PostgreSQL with pgvector and Prisma** (2 weeks)
   - Install and configure PostgreSQL with pgvector extension
   - Create Prisma schema and generate client
   - Implement basic YAML to PostgreSQL sync using Prisma

2. **Phase 2: Embedding Generation** (3 weeks)
   - Implement embedding generation pipeline
   - Generate and store vectors for all profiles
   - Test vector similarity performance

3. **Phase 3: API Development** (2 weeks)
   - Develop REST API for vector-based matching
   - Implement query strategies for different search types
   - Test API performance and accuracy

4. **Phase 4: Integration with Frontend** (2 weeks)
   - Connect frontend search functionality to vector-based APIs
   - Implement UI for displaying match results
   - Test end-to-end functionality

## Conclusion

This hybrid approach allows us to maintain the human readability and accessibility of YAML files while gaining the powerful semantic search capabilities of vector embeddings. By focusing vectorization efforts on the most relevant fields for matching, we can create an effective supervisor matching system that understands the semantic relationships between research topics and student interests. The use of Prisma as our ORM provides type safety, improved developer experience, and better maintainability compared to raw SQL queries. 