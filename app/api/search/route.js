import { NextResponse } from 'next/server';
import { findSupervisorsMultiCriteria } from '../../utils/vectorize';

/**
 * API endpoint for searching supervisors by semantic similarity
 * 
 * This route demonstrates how to create a search API that utilizes
 * pgvector-stored embeddings to find the most relevant supervisors
 * based on research interests, expertise, and keywords from publications.
 * Now using local LM Studio embeddings instead of OpenAI.
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { researchInterests, expertise, keywords, limit = 5 } = body;
    
    // Validate request
    if (!researchInterests && !expertise && !keywords) {
      return NextResponse.json(
        { error: 'At least one search criterion is required' },
        { status: 400 }
      );
    }
    
    // Search for supervisors using vector similarity
    const results = await findSupervisorsMultiCriteria(
      { researchInterests, expertise, keywords },
      limit
    );
    
    // Process results for client-side consumption
    const processedResults = results.map(supervisor => ({
      id: supervisor.id,
      name: supervisor.name,
      position: supervisor.position,
      department: supervisor.department,
      similarity: supervisor.similarity,
      matchedCriteria: supervisor.matchedCriteria,
      researchInterests: supervisor.profileData?.research_interests || [],
      expertise: supervisor.profileData?.expertise || [],
      publications: supervisor.profileData?.publications || [],
      contactInfo: {
        email: supervisor.profileData?.contact_info?.email || supervisor.email || '',
        office: supervisor.profileData?.contact_info?.office || ''
      }
    }));
    
    // Return the matching supervisors
    return NextResponse.json({
      count: processedResults.length,
      supervisors: processedResults
    });
  } catch (error) {
    console.error('Error in supervisor search API:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while searching for supervisors' },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 