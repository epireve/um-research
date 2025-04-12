/**
 * Utility for converting YAML supervisor profiles into vector embeddings for pgvector
 * 
 * This module demonstrates how to:
 * 1. Load YAML profiles
 * 2. Extract relevant text for vectorization
 * 3. Generate embeddings using a local embedding model
 * 4. Store supervisors and their embeddings in a PostgreSQL database with pgvector
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { pool } from '../lib/db';
import axios from 'axios';
import crypto from 'crypto';

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';
const EMBEDDING_DIMENSION = 768;

// Path to profiles directory
const PROFILES_DIR = path.join(process.cwd(), 'data/profiles');

/**
 * Load a YAML profile by ID
 * @param {string} profileId - The profile ID (filename without extension)
 * @returns {Object} - The parsed profile data
 */
export async function loadProfile(profileId) {
  try {
    const filePath = path.join(PROFILES_DIR, `${profileId}.yaml`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error loading profile ${profileId}:`, error);
    throw error;
  }
}

/**
 * Extract text from specified fields in the profile
 * @param {Object} profile - The profile object
 * @param {string} field - The field to extract (research_interests, expertise, etc.)
 * @returns {string} - Concatenated text of the field
 */
export function extractFieldText(profile, field) {
  try {
    if (!profile[field]) return '';
    
    if (Array.isArray(profile[field])) {
      // Handle array fields like research_interests
      return profile[field].join(' ');
    } else if (field === 'publications' && Array.isArray(profile.publications)) {
      // Handle publications specifically
      return profile.publications.map(pub => 
        `${pub.title || ''} ${pub.abstract || ''} ${pub.keywords?.join(' ') || ''}`
      ).join(' ');
    }
    
    return profile[field].toString();
  } catch (error) {
    console.error(`Error extracting text from ${field}:`, error);
    return '';
  }
}

/**
 * Generate embedding using LM Studio API
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateEmbedding(text) {
  try {
    // Skip empty text
    if (!text || text.trim() === '') {
      console.warn('Warning: Attempted to generate embedding for empty text');
      return new Array(EMBEDDING_DIMENSION).fill(0);
    }

    // Normalize text
    const normalizedText = text.trim();
    
    // Get hash for caching
    const textHash = crypto.createHash('md5').update(normalizedText).digest('hex');
    
    // Check cache first
    try {
      const cachedResult = await pool.query(`
        SELECT embedding 
        FROM embedding_cache 
        WHERE text_hash = $1
      `, [textHash]);
      
      if (cachedResult.rows.length > 0) {
        console.log('📄 Using cached embedding');
        // Update last_used timestamp
        await pool.query(`
          UPDATE embedding_cache 
          SET last_used = NOW() 
          WHERE text_hash = $1
        `, [textHash]);
        return cachedResult.rows[0].embedding;
      }
    } catch (error) {
      console.warn('Warning: Could not check embedding cache:', error.message);
    }
    
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding using local model`);
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: normalizedText.slice(0, 8000), // Limit text to 8000 characters
      model: "text-embedding-nomic-embed-text-v1.5@q8_0"
    });
    
    const embedding = response.data.data[0].embedding;
    
    // Cache the embedding
    try {
      await pool.query(`
        INSERT INTO embedding_cache (text_hash, text, embedding, created_at, last_used)
        VALUES ($1, $2, $3::vector, NOW(), NOW())
      `, [textHash, normalizedText.substring(0, 1000), embedding]);
      console.log('✅ Embedding cached successfully');
    } catch (error) {
      console.error('Error caching embedding:', error.message);
    }
    
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    // Return zero vector as fallback
    return new Array(EMBEDDING_DIMENSION).fill(0);
  }
}

/**
 * Generate embedding for a specific field in the profile
 * @param {Object} profile - The profile object
 * @param {string} field - The field to generate embedding for
 * @returns {Object} - The embedding vector and field
 */
export async function generateFieldEmbedding(profile, field) {
  try {
    const text = extractFieldText(profile, field);
    if (!text) return null;
    
    const embedding = await generateEmbedding(text);
    
    return {
      supervisorId: profile.id || path.basename(profile.name, '.yaml'),
      embeddingType: field,
      embedding: embedding
    };
  } catch (error) {
    console.error(`Error generating embedding for ${field}:`, error);
    return null;
  }
}

/**
 * Generate embeddings for individual items in an array field
 * @param {Object} profile - The profile object
 * @param {string} field - The field containing the array
 * @returns {Array} - Array of item embeddings
 */
export async function generateItemEmbeddings(profile, field) {
  try {
    if (!profile[field] || !Array.isArray(profile[field])) return [];
    
    const results = [];
    for (const item of profile[field]) {
      const text = typeof item === 'string' ? item : item.title || JSON.stringify(item);
      
      const embedding = await generateEmbedding(text);
      
      results.push({
        supervisorId: profile.id || path.basename(profile.name, '.yaml'),
        item: text,
        embedding: embedding
      });
    }
    
    return results;
  } catch (error) {
    console.error(`Error generating item embeddings for ${field}:`, error);
    return [];
  }
}

/**
 * Save supervisor with embeddings to the database
 * @param {Object} profile - The supervisor profile
 * @returns {boolean} - Success status
 */
export async function saveSupervisorWithEmbeddings(profile) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert or update supervisor
    const supervisorId = profile.id || path.basename(profile.name, '.yaml');
    await client.query(
      `INSERT INTO supervisors (id, name, position, department, email, profile_data) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) 
       DO UPDATE SET 
         name = $2,
         position = $3, 
         department = $4,
         email = $5,
         profile_data = $6,
         last_updated = NOW()`,
      [
        supervisorId,
        profile.name,
        profile.position,
        profile.department,
        profile.email || profile.contact_info?.email,
        JSON.stringify(profile)
      ]
    );
    
    // Generate and save embeddings for primary fields
    const primaryFields = ['research_interests', 'expertise', 'publications'];
    for (const field of primaryFields) {
      const embedding = await generateFieldEmbedding(profile, field);
      if (embedding) {
        await client.query(
          `INSERT INTO supervisor_embeddings (supervisor_id, embedding_type, embedding)
           VALUES ($1, $2, $3)
           ON CONFLICT (supervisor_id, embedding_type)
           DO UPDATE SET embedding = $3, created_at = NOW()`,
          [embedding.supervisorId, embedding.embeddingType, embedding.embedding]
        );
      }
    }
    
    // Generate and save individual research interest embeddings
    if (profile.research_interests && Array.isArray(profile.research_interests)) {
      // First delete existing entries
      await client.query('DELETE FROM research_interests WHERE supervisor_id = $1', [supervisorId]);
      
      // Generate embeddings for each interest
      const interests = await generateItemEmbeddings(profile, 'research_interests');
      for (const interest of interests) {
        await client.query(
          `INSERT INTO research_interests (supervisor_id, interest, embedding)
           VALUES ($1, $2, $3)`,
          [interest.supervisorId, interest.item, interest.embedding]
        );
      }
    }
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving supervisor with embeddings:', error);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Process all YAML profiles and store their vectors
 * @returns {Array} - Array of processed supervisor IDs
 */
export async function processAllProfiles() {
  try {
    const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.yaml'));
    const results = [];
    
    for (const file of files) {
      const profileId = path.basename(file, '.yaml');
      const profile = await loadProfile(profileId);
      
      if (profile) {
        const success = await saveSupervisorWithEmbeddings(profile);
        if (success) {
          results.push(profileId);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error processing all profiles:', error);
    throw error;
  }
}

/**
 * Find supervisors with similar research interests
 * @param {string} queryText - The research interest query
 * @param {number} limit - Maximum number of results
 * @returns {Array} - Array of matching supervisors
 */
export async function findSimilarResearchInterests(queryText, limit = 5) {
  try {
    // Generate embedding for the query text
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Query the database for similar research interests
    const result = await pool.query(
      `SELECT 
        s.id,
        s.name,
        s.position,
        s.department, 
        s.profile_data as profileData,
        1 - (e.embedding <=> $1) as similarity
      FROM 
        supervisor_embeddings e
      JOIN 
        supervisors s ON e.supervisor_id = s.id
      WHERE 
        e.embedding_type = 'research_interests'
      ORDER BY 
        similarity DESC
      LIMIT $2`,
      [queryEmbedding, limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error finding similar research interests:', error);
    return [];
  }
}

/**
 * Find supervisors based on multiple criteria
 * @param {Object} criteria - Search criteria (researchInterests, expertise, keywords)
 * @param {number} limit - Maximum number of results
 * @returns {Array} - Array of matching supervisors
 */
export async function findSupervisorsMultiCriteria(criteria, limit = 5) {
  const { researchInterests, expertise, keywords } = criteria;
  
  try {
    // Generate embeddings for each criteria in parallel
    const embeddingPromises = [];
    
    if (researchInterests) {
      embeddingPromises.push(
        generateEmbedding(researchInterests).then(embedding => ({
          type: 'research_interests',
          embedding: embedding
        }))
      );
    }
    
    if (expertise) {
      embeddingPromises.push(
        generateEmbedding(expertise).then(embedding => ({
          type: 'expertise',
          embedding: embedding
        }))
      );
    }
    
    if (keywords) {
      embeddingPromises.push(
        generateEmbedding(keywords).then(embedding => ({
          type: 'publications',
          embedding: embedding
        }))
      );
    }
    
    // Wait for all embeddings to be generated
    const embeddings = await Promise.all(embeddingPromises);
    
    // If no valid embeddings, return empty array
    if (embeddings.length === 0) {
      return [];
    }
    
    // Build query for each embedding type and combine with UNION
    const queryParts = embeddings.map((embed, index) => `
      SELECT 
        s.id,
        s.name,
        s.position,
        s.department,
        s.profile_data as "profileData",
        1 - (e.embedding <=> $${index + 1}) as similarity,
        '${embed.type}' as match_type
      FROM 
        supervisor_embeddings e
      JOIN 
        supervisors s ON e.supervisor_id = s.id
      WHERE 
        e.embedding_type = '${embed.type}'
    `);
    
    const combinedQuery = `
      WITH similarities AS (
        ${queryParts.join(' UNION ALL ')}
      )
      SELECT 
        id, 
        name, 
        position, 
        department, 
        "profileData",
        ROUND((SUM(similarity) / COUNT(*))::numeric, 4) as avg_similarity,
        JSONB_AGG(DISTINCT match_type) as matched_criteria
      FROM 
        similarities
      GROUP BY 
        id, name, position, department, "profileData"
      ORDER BY 
        avg_similarity DESC
      LIMIT $${embeddings.length + 1}
    `;
    
    // Extract embeddings for query parameters
    const params = embeddings.map(e => e.embedding).concat([limit]);
    
    // Execute the query
    const result = await pool.query(combinedQuery, params);
    
    return result.rows.map(row => ({
      ...row,
      profileData: row.profileData,
      similarity: row.avg_similarity,
      matchedCriteria: row.matched_criteria
    }));
  } catch (error) {
    console.error('Error in multi-criteria search:', error);
    return [];
  }
} 