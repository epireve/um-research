# Prisma Implementation for Vector Search

This document provides implementation details for using Prisma ORM with pgvector to power the vector search capabilities in the Research Supervisor Matching system.

## Setup and Configuration

### Prerequisites

- Node.js 16+
- PostgreSQL 14+ with pgvector extension installed
- Prisma CLI (`npm install -g prisma`)

### Installation

```bash
# Install Prisma and dependencies
npm install @prisma/client
npm install prisma --save-dev

# Initialize Prisma
npx prisma init

# After modifying the schema.prisma file:
npx prisma generate
```

### PostgreSQL Setup

Ensure pgvector extension is installed in your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Prisma Schema

Create a `schema.prisma` file with the following content:

```prisma
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

## Implementation Examples

### Database Client Setup

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
```

### Importing Profiles

```javascript
// utils/import-profiles.js
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import prisma from '../lib/prisma';
import { generateEmbedding } from './embeddings';

const PROFILES_DIR = path.join(process.cwd(), 'profiles');

export async function importProfile(filename) {
  const filePath = path.join(PROFILES_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const profile = yaml.load(fileContent);
  
  // Extract profile ID from filename
  const id = path.basename(filename, '.yaml');
  
  // Create or update supervisor
  const supervisor = await prisma.supervisor.upsert({
    where: { id },
    update: {
      name: profile.name,
      position: profile.position || '',
      department: profile.department || '',
      email: profile.contact?.email || '',
      profileData: profile,
    },
    create: {
      id,
      name: profile.name,
      position: profile.position || '',
      department: profile.department || '',
      email: profile.contact?.email || '',
      profileData: profile,
    },
  });
  
  // Handle research interests
  if (profile.research_interests && Array.isArray(profile.research_interests)) {
    // Delete existing interests
    await prisma.researchInterest.deleteMany({
      where: { supervisorId: id },
    });
    
    // Create new interests with embeddings
    for (const interest of profile.research_interests) {
      const embedding = await generateEmbedding(interest);
      
      await prisma.researchInterest.create({
        data: {
          supervisorId: id,
          interest,
          embedding: prisma.$queryRaw`${embedding}::vector`,
        },
      });
    }
  }
  
  // Generate and store embeddings for key fields
  const fields = [
    { type: 'research_interests', text: profile.research_interests?.join(' ') || '' },
    { type: 'expertise', text: profile.expertise?.join(' ') || '' },
    { type: 'publications', text: profile.publications?.map(p => p.title).join(' ') || '' },
  ];
  
  for (const field of fields) {
    if (field.text) {
      const embedding = await generateEmbedding(field.text);
      
      await prisma.supervisorEmbedding.upsert({
        where: {
          supervisorId_embeddingType: {
            supervisorId: id,
            embeddingType: field.type,
          },
        },
        update: {
          embedding: prisma.$queryRaw`${embedding}::vector`,
        },
        create: {
          supervisorId: id,
          embeddingType: field.type,
          embedding: prisma.$queryRaw`${embedding}::vector`,
        },
      });
    }
  }
  
  return supervisor;
}

export async function importAllProfiles() {
  const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.yaml'));
  const results = [];
  
  for (const file of files) {
    try {
      const supervisor = await importProfile(file);
      results.push(supervisor.id);
    } catch (error) {
      console.error(`Error importing profile ${file}:`, error);
    }
  }
  
  return results;
}
```

### Vector Search Implementations

```javascript
// utils/vector-search.js
import prisma from '../lib/prisma';
import { generateEmbedding } from './embeddings';

/**
 * Find supervisors with similar research interests
 */
export async function findSimilarResearchInterests(queryText, limit = 5) {
  const embedding = await generateEmbedding(queryText);
  
  const results = await prisma.$queryRaw`
    SELECT 
      s.id,
      s.name,
      s.position,
      s.department,
      s.profile_data->'research_interests' as research_interests,
      1 - (e.embedding <=> ${embedding}::vector) as similarity
    FROM 
      supervisor_embeddings e
    JOIN 
      supervisors s ON e.supervisor_id = s.id
    WHERE 
      e.embedding_type = 'research_interests'
      AND 1 - (e.embedding <=> ${embedding}::vector) > 0.7
    ORDER BY 
      similarity DESC
    LIMIT ${limit}
  `;
  
  return results;
}

/**
 * Find supervisors matching multiple criteria
 */
export async function findSupervisorsMultiCriteria(criteria, limit = 5) {
  const { researchInterests, expertise, keywords } = criteria;
  const embeddings = [];
  
  if (researchInterests) {
    const embedding = await generateEmbedding(researchInterests);
    embeddings.push({ type: 'research_interests', embedding });
  }
  
  if (expertise) {
    const embedding = await generateEmbedding(expertise);
    embeddings.push({ type: 'expertise', embedding });
  }
  
  if (keywords) {
    const embedding = await generateEmbedding(keywords);
    embeddings.push({ type: 'publications', embedding });
  }
  
  if (embeddings.length === 0) {
    return [];
  }
  
  // Build a dynamic query based on available criteria
  let queryParts = embeddings.map((embed, i) => `
    SELECT
      e.supervisor_id,
      1 - (e.embedding <=> ${embed.embedding}::vector) as similarity_score
    FROM
      supervisor_embeddings e
    WHERE
      e.embedding_type = '${embed.type}'
  `);
  
  const query = `
    WITH scores AS (
      ${queryParts.join(' UNION ALL ')}
    ),
    aggregated AS (
      SELECT
        supervisor_id,
        AVG(similarity_score) as avg_score,
        MAX(similarity_score) as max_score
      FROM
        scores
      GROUP BY
        supervisor_id
      ORDER BY
        avg_score DESC
      LIMIT ${limit}
    )
    SELECT
      s.id,
      s.name,
      s.position,
      s.department,
      s.email,
      a.avg_score as relevance_score,
      s.profile_data
    FROM
      aggregated a
    JOIN
      supervisors s ON a.supervisor_id = s.id
    ORDER BY
      a.avg_score DESC
  `;
  
  const result = await prisma.$queryRaw(query);
  return result;
}
```

### API Endpoint Implementation

```javascript
// api/search/route.js
import { NextResponse } from 'next/server';
import { findSupervisorsMultiCriteria } from '../../utils/vector-search';

export async function POST(request) {
  try {
    const body = await request.json();
    const { researchInterests, expertise, keywords, limit = 5 } = body;
    
    if (!researchInterests && !expertise && !keywords) {
      return NextResponse.json(
        { error: 'At least one search criterion is required' },
        { status: 400 }
      );
    }
    
    const results = await findSupervisorsMultiCriteria(
      { researchInterests, expertise, keywords },
      limit
    );
    
    return NextResponse.json({
      count: results.length,
      supervisors: results
    });
  } catch (error) {
    console.error('Error in supervisor search API:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while searching for supervisors' },
      { status: 500 }
    );
  }
}
```

## Migration from Raw SQL

When migrating from raw SQL to Prisma:

1. Generate Prisma schema from existing database:
   ```bash
   npx prisma db pull
   ```

2. Modify the generated schema to add vector support:
   - Add extensions to the datasource
   - Update vector fields to use Unsupported type
   - Add proper indexes

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

4. Update application code to use Prisma client instead of raw SQL queries

## Best Practices

1. **Transaction Support**: Use Prisma transactions for related operations
   ```javascript
   await prisma.$transaction(async (tx) => {
     // Multiple database operations as a single transaction
   });
   ```

2. **Embedding Generation**: Use a queue system for generating embeddings asynchronously

3. **Type Safety**: Leverage Prisma's type safety to reduce errors

4. **Performance**: Use Prisma's connection pooling for optimal performance

5. **Migrations**: Use Prisma Migrate to manage database schema changes
   ```bash
   npx prisma migrate dev --name add_new_field
   ```

## Conclusion

Using Prisma with pgvector provides a robust, type-safe approach to implementing vector search capabilities. While we still need to use raw SQL queries for vector operations, Prisma handles the rest of the database interactions in a clean, maintainable way. 