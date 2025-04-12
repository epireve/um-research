#!/usr/bin/env node

/**
 * Test script for connecting to LM Studio and generating embeddings
 */

const axios = require('axios');
const crypto = require('crypto');

// LM Studio API settings
const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1';

/**
 * Generate an embedding for the provided text
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateEmbedding(text) {
  try {
    // Call LM Studio API for embedding
    console.log(`🔄 Generating embedding for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    const response = await axios.post(`${LM_STUDIO_API_URL}/embeddings`, {
      input: text,
      model: "text-embedding-nomic-embed-text-v1.5@q8_0"
    });
    
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw error;
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
    
    if (response.data && response.data.data) {
      console.log('📚 Available models:');
      response.data.data.forEach(model => {
        console.log(`   - ${model.id}${model.owned_by ? ` (${model.owned_by})` : ''}`);
      });
    }
    
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
 * Test embedding generation with a sample text
 */
async function testEmbeddingGeneration() {
  try {
    const sampleText = "This is a test for generating embeddings with LM Studio.";
    console.log('\n🧪 Testing embedding generation with sample text');
    
    const embedding = await generateEmbedding(sampleText);
    
    console.log('✅ Successfully generated embedding');
    console.log(`📊 Embedding dimension: ${embedding.length}`);
    console.log(`📊 First 5 values: ${embedding.slice(0, 5).map(v => v.toFixed(6)).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to generate embedding:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔤 Research Supervisor Matching - Embedding Test');
  console.log('=============================================');
  
  try {
    // Test connection to LM Studio
    const connected = await testLMStudioConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Test embedding generation
    const generated = await testEmbeddingGeneration();
    if (!generated) {
      process.exit(1);
    }
    
    console.log('\n✨ LM Studio connection and embedding generation tests passed!');
    console.log('The system is ready to process supervisor profiles.');
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    process.exit(1);
  }
}

// Set LM Studio API URL from .env if available
if (require('fs').existsSync('.env')) {
  require('dotenv').config();
}

// Run the main function
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 