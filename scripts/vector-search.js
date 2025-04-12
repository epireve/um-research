#!/usr/bin/env node

/**
 * Vector search demo for the Research Supervisor Matching system
 * This script:
 * 1. Takes a research interest query from the command line
 * 2. Generates an embedding for the query using LM Studio's local API
 * 3. Performs a vector similarity search using pgvector
 * 4. Displays the top matching supervisors
 */

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const crypto = require('crypto');
const readline = require('readline');

// Initialize Prisma client
const prisma = new PrismaClient();

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';
const EMBEDDING_DIMENSION = 1536;

// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    const cachedEmbedding = await prisma.embeddingCache.findUnique({
      where: { textHash }
    });
    
    if (cachedEmbedding) {
      return cachedEmbedding.embedding;
    }
    
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding for query: "${normalizedText}"`);
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: normalizedText,
      model: "embedding"
    });
    
    const embedding = response.data.data[0].embedding;
    
    // Cache the embedding
    await prisma.embeddingCache.create({
      data: {
        textHash,
        text: normalizedText.substring(0, 1000),
        embedding
      }
    });
    
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
 * Search for supervisors with similar research interests
 * @param {string} query - Research interest query
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Matching supervisors
 */
async function searchSupervisors(query, limit = 5) {
  try {
    console.log('\n🔍 Searching for supervisors matching:', query);
    
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Perform vector similarity search
    const results = await prisma.$queryRaw`
      SELECT 
        s.id,
        s.name,
        s.position,
        s.department,
        s.email,
        s.profile_data->'research_interests' as research_interests,
        1 - (e.embedding <=> ${embedding}) as similarity
      FROM 
        supervisor_embeddings e
      JOIN 
        supervisors s ON e.supervisor_id = s.id
      WHERE 
        e.embedding_type = 'research_interests'
      ORDER BY 
        similarity DESC
      LIMIT ${limit}
    `;
    
    return results;
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
    console.log(`   Email: ${result.email}`);
    
    // Extract research interests
    const interests = Array.isArray(result.research_interests) 
      ? result.research_interests 
      : [];
    
    if (interests.length > 0) {
      console.log('   Research Interests:');
      interests.forEach(interest => {
        console.log(`     - ${interest}`);
      });
    }
    
    console.log(''); // Empty line between results
  });
}

/**
 * Interactive search mode
 */
async function interactiveSearch() {
  console.log('\n🔎 Enter a research interest to find matching supervisors:');
  console.log('   (Type "exit" to quit)');
  
  const askQuestion = () => {
    rl.question('\n> ', async (query) => {
      if (query.toLowerCase() === 'exit') {
        await prisma.$disconnect();
        rl.close();
        process.exit(0);
      }
      
      if (query.trim() === '') {
        console.log('Please enter a valid research interest');
        askQuestion();
        return;
      }
      
      try {
        const results = await searchSupervisors(query);
        displayResults(results);
        askQuestion();
      } catch (error) {
        console.error('Error during search:', error.message);
        askQuestion();
      }
    });
  };
  
  askQuestion();
}

/**
 * Process command line arguments
 * @returns {string|null} - Query string or null for interactive mode
 */
function processArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    return null; // No args, use interactive mode
  }
  
  return args.join(' '); // Combine all args as the query
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Research Supervisor Matching - Vector Search Demo');
  console.log('=================================================');
  
  try {
    // Check if query was provided as command line argument
    const queryArg = processArgs();
    
    if (queryArg) {
      // Single query mode
      const results = await searchSupervisors(queryArg);
      displayResults(results);
      await prisma.$disconnect();
      process.exit(0);
    } else {
      // Interactive mode
      interactiveSearch();
    }
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  prisma.$disconnect();
  process.exit(1);
}); 