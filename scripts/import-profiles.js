#!/usr/bin/env node

/**
 * Profile import script for the Research Supervisor Matching system
 * This script:
 * 1. Reads all YAML profiles from the profiles directory
 * 2. Generates embeddings using LM Studio's local API
 * 3. Stores profiles and embeddings in the PostgreSQL database using Prisma
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Path to profiles directory
const PROFILES_DIR = path.join(__dirname, '..', 'data/profiles');

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';
const EMBEDDING_DIMENSION = 768;

/**
 * Generate an embedding using LM Studio API
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
      const cachedResult = await prisma.$queryRaw`
        SELECT embedding 
        FROM embedding_cache 
        WHERE text_hash = ${textHash}
      `;
      
      if (cachedResult.length > 0) {
        console.log('📄 Using cached embedding');
        // Update last_used timestamp
        await prisma.$executeRaw`
          UPDATE embedding_cache 
          SET last_used = NOW() 
          WHERE text_hash = ${textHash}
        `;
        return cachedResult[0].embedding;
      }
    } catch (error) {
      console.warn('Warning: Could not check embedding cache:', error.message);
    }
    
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding for: ${normalizedText.substring(0, 50)}${normalizedText.length > 50 ? '...' : ''}`);
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: normalizedText,
      model: "text-embedding-nomic-embed-text-v1.5@q8_0"
    });
    
    const embedding = response.data.data[0].embedding;
    
    // Cache the embedding
    try {
      await prisma.$executeRaw`
        INSERT INTO embedding_cache (text_hash, text, embedding, created_at, last_used)
        VALUES (${textHash}, ${normalizedText.substring(0, 1000)}, ${embedding}::vector, NOW(), NOW())
      `;
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
 * Import a single profile from a YAML file
 * @param {string} filename - Name of the YAML file
 * @returns {Promise<object>} - Imported supervisor record
 */
async function importProfile(filename) {
  try {
    console.log(`\n📄 Processing profile: ${filename}`);
    
    const filePath = path.join(PROFILES_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const profile = yaml.load(fileContent);
    
    // Extract profile ID from filename
    const id = path.basename(filename, '.yaml');
    
    console.log(`👤 Supervisor: ${profile.name}`);
    
    // Create or update supervisor record
    const supervisor = await prisma.supervisor.upsert({
      where: { id },
      update: {
        name: profile.name || 'Unknown',
        position: profile.position || '',
        department: profile.department || '',
        email: profile.contact?.email || '',
        profileData: profile
      },
      create: {
        id,
        name: profile.name || 'Unknown',
        position: profile.position || '',
        department: profile.department || '',
        email: profile.contact?.email || '',
        profileData: profile
      }
    });
    
    console.log('✅ Supervisor record created/updated');
    
    // Process research interests
    if (profile.research_interests && Array.isArray(profile.research_interests)) {
      console.log(`🔍 Processing ${profile.research_interests.length} research interests`);
      
      // Delete existing interests
      await prisma.researchInterest.deleteMany({
        where: { supervisorId: id }
      });
      
      // Process each interest with embedding
      for (const interest of profile.research_interests) {
        if (interest && interest.trim() !== '') {
          const embedding = await generateEmbedding(interest);
          
          try {
            await prisma.$executeRaw`
              INSERT INTO research_interests (supervisor_id, interest, embedding, created_at)
              VALUES (${id}, ${interest}, ${embedding}::vector, NOW())
            `;
          } catch (error) {
            console.error(`Error creating research interest "${interest}":`, error.message);
          }
        }
      }
      
      console.log('✅ Research interests processed');
    }
    
    // Generate combined embeddings for key fields
    const fieldMappings = [
      { 
        type: 'research_interests', 
        text: profile.research_interests ? profile.research_interests.join(' ') : '' 
      },
      { 
        type: 'expertise', 
        text: profile.expertise ? profile.expertise.join(' ') : '' 
      },
      { 
        type: 'publications', 
        text: profile.publications ? profile.publications.map(p => p.title).join(' ') : '' 
      }
    ];
    
    for (const field of fieldMappings) {
      if (field.text && field.text.trim() !== '') {
        console.log(`🔤 Generating embedding for ${field.type}`);
        const embedding = await generateEmbedding(field.text);
        
        try {
          // Check if the embedding already exists
          const existingResult = await prisma.$queryRaw`
            SELECT COUNT(*) AS count
            FROM supervisor_embeddings
            WHERE supervisor_id = ${id} AND embedding_type = ${field.type}
          `;
          
          const exists = parseInt(existingResult[0].count) > 0;
          
          if (exists) {
            // Update existing embedding
            await prisma.$executeRaw`
              UPDATE supervisor_embeddings
              SET embedding = ${embedding}::vector, created_at = NOW()
              WHERE supervisor_id = ${id} AND embedding_type = ${field.type}
            `;
          } else {
            // Insert new embedding
            await prisma.$executeRaw`
              INSERT INTO supervisor_embeddings (supervisor_id, embedding_type, embedding, created_at)
              VALUES (${id}, ${field.type}, ${embedding}::vector, NOW())
            `;
          }
        } catch (error) {
          console.error(`Error creating/updating ${field.type} embedding:`, error.message);
        }
      }
    }
    
    console.log('✅ Combined embeddings generated');
    
    return supervisor;
  } catch (error) {
    console.error(`❌ Error importing profile ${filename}:`, error.message);
    if (error.stack) console.error(error.stack);
    return null;
  }
}

/**
 * Import all profiles from the profiles directory
 */
async function importAllProfiles() {
  try {
    // Get all YAML files
    const files = fs.readdirSync(PROFILES_DIR)
      .filter(file => file.endsWith('.yaml') && !file.endsWith('_extracted.yaml'));
    
    console.log(`\n🗂️  Found ${files.length} profiles to import`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each file
    for (const file of files) {
      try {
        await importProfile(file);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to import ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Import completed: ${successCount} successful, ${errorCount} failed`);
  } catch (error) {
    console.error('❌ Error importing profiles:', error.message);
    process.exit(1);
  }
}

/**
 * Test LM Studio connection
 */
async function testLMStudioConnection() {
  try {
    console.log(`\n🔌 Testing connection to LM Studio API at ${LM_STUDIO_API_URL}`);
    const response = await axios.get(`${LM_STUDIO_API_URL}/models`);
    console.log('✅ Connection successful');
    console.log('📚 Available models:');
    response.data.data.forEach(model => {
      console.log(`   - ${model.id}`);
    });
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to LM Studio API:', error.message);
    console.log('\nPlease ensure that:');
    console.log('1. LM Studio is running on your machine');
    console.log('2. The local server is enabled in LM Studio');
    console.log('3. An embedding model is loaded');
    console.log(`4. The API URL is correct (current: ${LM_STUDIO_API_URL})`);
    console.log('\nYou can set a custom API URL with the LM_STUDIO_API_URL environment variable.');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🗄️  Research Supervisor Matching - Profile Import');
  console.log('================================================');
  
  try {
    // Test connection to LM Studio
    const connected = await testLMStudioConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Import all profiles
    await importAllProfiles();
    
    console.log('\n✨ Profile import and embedding generation complete!');
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 