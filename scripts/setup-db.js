#!/usr/bin/env node

/**
 * Database setup script for the Research Supervisor Matching system
 * This script:
 * 1. Checks database connection
 * 2. Executes the SQL schema to setup pgvector and tables
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Path to schema.sql file
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

/**
 * Main function
 */
async function main() {
  console.log('🗄️  Research Supervisor Matching - Database Setup');
  console.log('================================================');
  
  try {
    // Check if schema.sql exists
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }

    // Execute the SQL schema
    console.log('\n🔌 Setting up database schema with pgvector extension...');
    execSync(`psql -d research_supervisor_match -f ${schemaPath}`, { 
      stdio: 'inherit' 
    });
    console.log('✅ Database schema setup complete');

    // Try to connect with Prisma
    console.log('\n🔌 Testing Prisma connection...');
    
    try {
      const prisma = new PrismaClient();
      await prisma.$connect();
      console.log('✅ Successfully connected to database with Prisma');
      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Failed to connect with Prisma:', error.message);
      console.log('Please ensure your DATABASE_URL is correct in .env file');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nReady to import supervisor profiles!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 