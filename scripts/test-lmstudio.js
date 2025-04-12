#!/usr/bin/env node

/**
 * LM Studio Embedding Test
 * 
 * This script tests the integration with LM Studio for generating embeddings
 * and performs a vector similarity search in the database.
 */

const axios = require('axios');
const { Pool } = require('pg');
const crypto = require('crypto');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';
const EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5@q8_0";

/**
 * Generate embedding using LM Studio API
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateEmbedding(text) {
  try {
    // Skip empty text
    if (!text || text.trim() === '') {
      console.error('Error: Empty text provided');
      return null;
    }

    // Normalize text
    const normalizedText = text.trim();
    
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding using local model: ${EMBEDDING_MODEL}`);
    console.log(`📝 Text: "${normalizedText.substring(0, 50)}${normalizedText.length > 50 ? '...' : ''}"`);
    
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: normalizedText.slice(0, 8000), // Limit text to 8000 characters
      model: EMBEDDING_MODEL
    });
    
    const embedding = response.data.data[0].embedding;
    console.log(`✅ Generated embedding with ${embedding.length} dimensions`);
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    return null;
  }
}

/**
 * Convert embedding array to pgvector format
 * @param {Array} embedding - Embedding array
 * @returns {string} - Formatted vector string for pgvector
 */
function formatVectorForPg(embedding) {
  return `[${embedding.join(',')}]`;
}

/**
 * Search for supervisors with similar research interests
 * @param {Array} embedding - Query embedding vector
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Matching supervisors
 */
async function searchSupervisors(embedding, limit = 5) {
  try {
    console.log('\n🔍 Searching for similar supervisors...');
    
    // Format the embedding for pgvector
    const vectorStr = formatVectorForPg(embedding);
    
    // Perform vector similarity search
    const result = await pool.query(`
      SELECT DISTINCT ON (s.id)
        s.id,
        s.name,
        s.position,
        s.department, 
        1 - (e.embedding <=> $1::vector) as similarity
      FROM 
        supervisor_embeddings e
      JOIN 
        supervisors s ON e.supervisor_id = s.id
      WHERE 
        e.embedding_type = 'research_interests'
      ORDER BY 
        s.id, similarity DESC
      LIMIT $2
    `, [vectorStr, limit]);
    
    // Sort by similarity score for final output
    return result.rows.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error searching for supervisors:', error.message);
    return [];
  }
}

/**
 * Display search results in a readable format
 * @param {Array} results - Search results
 */
function displayResults(results) {
  if (!results || results.length === 0) {
    console.log('\n❌ No matching supervisors found');
    return;
  }
  
  console.log(`\n✅ Found ${results.length} potential supervisors:\n`);
  
  results.forEach((result, index) => {
    // Convert similarity to percentage
    const similarityPercent = Math.round(result.similarity * 100);
    
    console.log(`${index + 1}. ${result.name} (${similarityPercent}% match)`);
    console.log(`   Position: ${result.position}`);
    console.log(`   Department: ${result.department}`);
    console.log(''); // Empty line between results
  });
}

/**
 * Main function
 */
async function main() {
  const queryText = process.argv[2] || "machine learning";
  
  console.log('🔍 LM Studio Embedding Test');
  console.log('=========================');
  
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(queryText);
    
    if (!embedding) {
      console.error('❌ Failed to generate embedding');
      process.exit(1);
    }
    
    // Search for supervisors
    const results = await searchSupervisors(embedding);
    
    // Display results
    displayResults(results);
    
    // Close the database connection
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  pool.end();
  process.exit(1);
}); 