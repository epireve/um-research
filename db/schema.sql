-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- This schema file is for direct PostgreSQL setup
-- For production, we recommend using Prisma migrations instead
-- See prisma/schema.prisma for the complete schema definition

-- Create tables if not using Prisma
-- Note: Only use these CREATE TABLE statements if you're not using Prisma

/*
-- Manual table creation (only use if not using Prisma)
CREATE TABLE IF NOT EXISTS supervisors (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  department VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  profile_data JSONB NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_interests (
  id SERIAL PRIMARY KEY,
  supervisor_id VARCHAR REFERENCES supervisors(id) ON DELETE CASCADE,
  interest VARCHAR NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supervisor_embeddings (
  id SERIAL PRIMARY KEY,
  supervisor_id VARCHAR REFERENCES supervisors(id) ON DELETE CASCADE,
  embedding_type VARCHAR NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(supervisor_id, embedding_type)
);

CREATE TABLE IF NOT EXISTS embedding_cache (
  text_hash VARCHAR PRIMARY KEY,
  text VARCHAR(1000) NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS research_interests_embedding_idx ON research_interests 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS supervisor_embeddings_idx ON supervisor_embeddings 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
*/

-- To run this file: psql -d your_database_name -f db/schema.sql

-- Supervisors table
CREATE TABLE IF NOT EXISTS supervisors (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  department VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  profile_data JSONB NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table for storing field-specific embeddings (research_interests, expertise, publications)
CREATE TABLE IF NOT EXISTS supervisor_embeddings (
  id SERIAL PRIMARY KEY,
  supervisor_id VARCHAR REFERENCES supervisors(id) ON DELETE CASCADE,
  embedding_type VARCHAR NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(supervisor_id, embedding_type)
);

-- Table for individual research interests with embeddings
CREATE TABLE IF NOT EXISTS research_interests (
  id SERIAL PRIMARY KEY,
  supervisor_id VARCHAR REFERENCES supervisors(id) ON DELETE CASCADE,
  interest VARCHAR NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS research_interests_embedding_idx ON research_interests 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS supervisor_embeddings_idx ON supervisor_embeddings 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a view for retrieving basic supervisor information
CREATE OR REPLACE VIEW supervisor_info AS
SELECT 
  s.id,
  s.name,
  s.position,
  s.department,
  s.email,
  s.profile_data->'research_interests' as research_interests
FROM 
  supervisors s;

-- Function to find similar supervisors by research interest
CREATE OR REPLACE FUNCTION find_similar_supervisors(query_text TEXT, limit_count INT DEFAULT 5)
RETURNS TABLE (
  id VARCHAR,
  name VARCHAR,
  similarity FLOAT
) AS $$
DECLARE
  query_embedding vector(768);
BEGIN
  -- This would be replaced by actual embedding generation in application code
  -- For schema purposes, we're using a zero vector
  query_embedding := '{0}';
  
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM 
    supervisor_embeddings e
  JOIN 
    supervisors s ON e.supervisor_id = s.id
  WHERE 
    e.embedding_type = 'research_interests'
  ORDER BY 
    similarity DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql; 