/**
 * Utility for generating text embeddings for vector search
 * 
 * This module provides functions to generate embeddings using OpenAI's API.
 * These embeddings are used for semantic search with pgvector in PostgreSQL.
 */

import { OpenAI } from 'openai';
import { createHash } from 'crypto';
import prisma from '../lib/prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Default embedding model to use
const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * Generate an embedding for the provided text using OpenAI's API
 * @param {string} text - The text to generate an embedding for
 * @returns {Array} - Vector embedding as an array of floats
 */
export async function generateEmbedding(text) {
  try {
    // Normalize and clean the text
    const normalizedText = text.trim().toLowerCase();
    
    // Check for empty text
    if (!normalizedText) {
      throw new Error('Cannot generate embedding for empty text');
    }
    
    // Generate a hash of the text to use for caching
    const textHash = createHash('md5').update(normalizedText).digest('hex');
    
    // Check if we have a cached embedding for this text
    const cachedEmbedding = await getCachedEmbedding(textHash);
    if (cachedEmbedding) {
      return cachedEmbedding;
    }
    
    // Limit text length to avoid API limits
    const truncatedText = normalizedText.slice(0, 8000);
    
    // Call OpenAI API to generate embedding
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedText,
    });
    
    const embedding = response.data[0].embedding;
    
    // Cache the embedding for future use
    await cacheEmbedding(textHash, truncatedText, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for an array of texts
 * @param {Array} texts - Array of texts to generate embeddings for
 * @returns {Array} - Array of embeddings
 */
export async function generateEmbeddings(texts) {
  // Process in smaller batches to avoid rate limits
  const batchSize = 20;
  const results = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map(text => generateEmbedding(text));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Retrieve a cached embedding from the database if it exists
 * @param {string} textHash - MD5 hash of the normalized text
 * @returns {Array|null} - The cached embedding or null if not found
 */
async function getCachedEmbedding(textHash) {
  try {
    const cached = await prisma.embeddingCache.findUnique({
      where: { textHash },
    });
    
    return cached?.embedding || null;
  } catch (error) {
    console.error('Error retrieving cached embedding:', error);
    return null;
  }
}

/**
 * Cache an embedding in the database for future use
 * @param {string} textHash - MD5 hash of the normalized text
 * @param {string} text - The original text (truncated)
 * @param {Array} embedding - The embedding vector to cache
 */
async function cacheEmbedding(textHash, text, embedding) {
  try {
    await prisma.embeddingCache.upsert({
      where: { textHash },
      update: {
        embedding: embedding,
        lastUsed: new Date(),
      },
      create: {
        textHash,
        text: text.slice(0, 1000), // Limit stored text length
        embedding: embedding,
      },
    });
  } catch (error) {
    console.error('Error caching embedding:', error);
    // Continue execution even if caching fails
  }
}

/**
 * Calculate cosine similarity between two embeddings
 * @param {Array} embedding1 - First embedding vector
 * @param {Array} embedding2 - Second embedding vector
 * @returns {number} - Cosine similarity (1 is most similar, -1 is least similar)
 */
export function calculateCosineSimilarity(embedding1, embedding2) {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    throw new Error('Invalid embeddings provided for similarity calculation');
  }
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
} 