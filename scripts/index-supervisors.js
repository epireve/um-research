#!/usr/bin/env node

/**
 * Supervisor Profile Indexing Script
 * 
 * This script:
 * 1. Loads all YAML supervisor profiles
 * 2. Generates embeddings using local LM Studio
 * 3. Saves supervisors and their embeddings in PostgreSQL with pgvector
 * 4. Updates the embedding cache for future searches
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');
const { Pool } = require('pg');
const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);
const profilesDir = args[0] || 'data/profiles'; // Default to data/profiles directory

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';
const EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5@q8_0";

// Path to profiles directory
const PROFILES_DIR = path.join(process.cwd(), profilesDir);

/**
 * Load a YAML profile by ID
 * @param {string} profileId - The profile ID (filename without extension)
 * @returns {Object} - The parsed profile data
 */
async function loadProfile(profileId) {
  try {
    const filePath = path.join(PROFILES_DIR, `${profileId}.yaml`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error loading profile ${profileId}:`, error);
    return null;
  }
}

/**
 * Extract text from specified fields in the profile
 * @param {Object} profile - The profile object
 * @param {string} field - The field to extract (research_interests, expertise, etc.)
 * @returns {string} - Concatenated text of the field
 */
function extractFieldText(profile, field) {
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
 * Parse pgvector string format back to array
 * @param {string} vectorStr - Vector string from database
 * @returns {Array} - Array of vector components
 */
function parseVectorFromPg(vectorStr) {
  if (!vectorStr) return null;
  
  try {
    // Handle string representation from database
    if (typeof vectorStr === 'string' && vectorStr.startsWith('[') && vectorStr.endsWith(']')) {
      return JSON.parse(vectorStr);
    }
    
    // Already an array
    if (Array.isArray(vectorStr)) {
      return vectorStr;
    }
    
    console.warn('Unknown vector format:', typeof vectorStr);
    return null;
  } catch (error) {
    console.error('Error parsing vector:', error);
    return null;
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
      return null;
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
        
        // Parse the cached vector
        return parseVectorFromPg(cachedResult.rows[0].embedding);
      }
    } catch (error) {
      console.warn('Warning: Could not check embedding cache:', error.message);
    }
    
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding for: "${normalizedText.substring(0, 50)}${normalizedText.length > 50 ? '...' : ''}"`);
    
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: normalizedText.slice(0, 8000), // Limit text to 8000 characters
      model: EMBEDDING_MODEL
    });
    
    const embedding = response.data.data[0].embedding;
    
    // Format for pgvector
    const vectorStr = `[${embedding.join(',')}]`;
    
    // Cache the embedding
    try {
      await pool.query(`
        INSERT INTO embedding_cache (text_hash, text, embedding, created_at, last_used)
        VALUES ($1, $2, $3::vector, NOW(), NOW())
      `, [textHash, normalizedText.substring(0, 1000), vectorStr]);
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
    return null;
  }
}

/**
 * Format vector array for pgvector
 * @param {Array} embedding - Vector array
 * @returns {string} - Formatted vector string for pgvector
 */
function formatVectorForPg(embedding) {
  if (!embedding) return null;
  
  // Check if already in string format
  if (typeof embedding === 'string' && embedding.startsWith('[') && embedding.endsWith(']')) {
    return embedding;
  }
  
  // Check if it's an array
  if (Array.isArray(embedding)) {
    return `[${embedding.join(',')}]`;
  }
  
  console.error('Invalid embedding format:', typeof embedding);
  return null;
}

/**
 * Generate embedding for a specific field in the profile
 * @param {Object} profile - The profile object
 * @param {string} field - The field to generate embedding for
 * @returns {Object} - The embedding vector and field
 */
async function generateFieldEmbedding(profile, field) {
  try {
    const text = extractFieldText(profile, field);
    if (!text) return null;
    
    const embedding = await generateEmbedding(text);
    if (!embedding) return null;
    
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
async function generateItemEmbeddings(profile, field) {
  try {
    if (!profile[field] || !Array.isArray(profile[field])) return [];
    
    const results = [];
    for (const item of profile[field]) {
      const text = typeof item === 'string' ? item : item.title || JSON.stringify(item);
      
      const embedding = await generateEmbedding(text);
      if (!embedding) continue;
      
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
async function saveSupervisorWithEmbeddings(profile) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert or update supervisor
    const supervisorId = profile.id || path.basename(profile.name, '.yaml');
    
    console.log(`📝 Processing supervisor: ${profile.name} (${supervisorId})`);
    
    // Get email from profile data or provide a default
    const email = profile.email || 
                 (profile.contact_info && profile.contact_info.email) || 
                 `${supervisorId.toLowerCase().replace(/[^a-z0-9]/g, '')}@um.edu.my`;
    
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
        profile.position || 'Senior Lecturer',
        profile.department || 'Software Engineering',
        email,
        JSON.stringify(profile)
      ]
    );
    
    // Generate and save embeddings for primary fields
    const primaryFields = ['research_interests', 'expertise', 'publications'];
    for (const field of primaryFields) {
      console.log(`  - Generating embedding for ${field}`);
      const embedding = await generateFieldEmbedding(profile, field);
      if (embedding) {
        const vectorStr = formatVectorForPg(embedding.embedding);
        if (vectorStr) {
          await client.query(
            `INSERT INTO supervisor_embeddings (supervisor_id, embedding_type, embedding)
             VALUES ($1, $2, $3::vector)
             ON CONFLICT (supervisor_id, embedding_type)
             DO UPDATE SET embedding = $3::vector, created_at = NOW()`,
            [embedding.supervisorId, embedding.embeddingType, vectorStr]
          );
        }
      }
    }
    
    // Generate and save individual research interest embeddings
    if (profile.research_interests && Array.isArray(profile.research_interests)) {
      // First delete existing entries
      await client.query('DELETE FROM research_interests WHERE supervisor_id = $1', [supervisorId]);
      
      console.log(`  - Generating embeddings for ${profile.research_interests.length} research interests`);
      
      // Generate embeddings for each interest
      const interests = await generateItemEmbeddings(profile, 'research_interests');
      for (const interest of interests) {
        const vectorStr = formatVectorForPg(interest.embedding);
        if (vectorStr) {
          await client.query(
            `INSERT INTO research_interests (supervisor_id, interest, embedding)
             VALUES ($1, $2, $3::vector)`,
            [interest.supervisorId, interest.item, vectorStr]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    console.log(`✅ Successfully processed ${profile.name}`);
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Error saving supervisor with embeddings: ${profile.name}`, error);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Process all YAML profiles and store their vectors
 * @returns {Promise<Array>} - Array of processed supervisor IDs
 */
async function processAllProfiles() {
  try {
    console.log(`🔍 Looking for profiles in ${PROFILES_DIR}`);
    const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.yaml'));
    console.log(`📋 Found ${files.length} profiles to process`);
    
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
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Supervisor Profile Indexing');
  console.log('=============================');
  console.log(`Using LM Studio model: ${EMBEDDING_MODEL}`);
  console.log(`Using profiles from: ${PROFILES_DIR}`);
  
  try {
    // Process all profiles
    const processedIds = await processAllProfiles();
    
    console.log(`\n✅ Successfully processed ${processedIds.length} supervisor profiles`);
    
    // Close the database connection
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
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