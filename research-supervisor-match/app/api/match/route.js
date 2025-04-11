import { NextResponse } from 'next/server'

// Mock data for demonstration (in a real app, this would come from the YAML files)
const supervisors = [
  {
    id: 'sitihafizah',
    name: 'Dr. Siti Hafizah Ab Hamid',
    position: 'Senior Lecturer',
    department: 'Software Engineering',
    university: 'University of Malaya',
    contact: {
      email: 'sitihafizah@um.edu.my'
    },
    research_interests: [
      'Software Testing',
      'Requirements Engineering',
      'Software Architecture'
    ],
    expertise: [
      'Software Quality Assurance',
      'Web Application Development',
      'Software Testing'
    ],
    publications: [
      { title: 'A Systematic Literature Review on Agile Requirements Engineering', year: 2018 },
      { title: 'Machine Learning Approaches for Software Defect Prediction', year: 2022 }
    ]
  },
  {
    id: 'tkchiew',
    name: 'Dr. Chiam Yin Kia',
    position: 'Senior Lecturer',
    department: 'Software Engineering',
    university: 'University of Malaya',
    contact: {
      email: 'tkchiew@um.edu.my'
    },
    research_interests: [
      'Machine Learning',
      'Artificial Intelligence',
      'Software Engineering Education'
    ],
    expertise: [
      'Machine Learning Algorithms',
      'Educational Technology',
      'Data Analysis'
    ],
    publications: [
      { title: 'Deep Learning for Software Defect Prediction', year: 2020 },
      { title: 'Enhancing Student Learning in Software Engineering Courses', year: 2019 }
    ]
  },
  {
    id: 'nazean',
    name: 'Dr. Nazean Jomhari',
    position: 'Associate Professor',
    department: 'Software Engineering',
    university: 'University of Malaya',
    contact: {
      email: 'nazean@um.edu.my'
    },
    research_interests: [
      'Human-Computer Interaction',
      'Educational Technology',
      'User Experience Design'
    ],
    expertise: [
      'UI/UX Design',
      'Educational Software',
      'Usability Testing'
    ],
    publications: [
      { title: 'Designing Educational Interfaces for Children with Autism', year: 2021 },
      { title: 'User Experience Evaluation Methods in Educational Software', year: 2018 }
    ]
  }
]

// Simple text similarity function
function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0
  
  // Convert to lowercase
  const a = text1.toLowerCase()
  const b = text2.toLowerCase()
  
  // Create sets of words
  const wordsA = new Set(a.split(/\s+/).filter(Boolean))
  const wordsB = new Set(b.split(/\s+/).filter(Boolean))
  
  // Find intersection
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)))
  
  // Calculate Jaccard similarity
  const union = new Set([...wordsA, ...wordsB])
  
  return intersection.size / union.size
}

export async function POST(request) {
  try {
    const { researchInterests, expertise = [] } = await request.json()
    
    // Calculate match scores for each supervisor
    const results = supervisors.map(supervisor => {
      // Calculate research interests similarity
      const interestsText = supervisor.research_interests.join(' ')
      const interestsSimilarity = calculateSimilarity(researchInterests, interestsText)
      
      // Calculate expertise match
      let expertiseMatch = 0
      if (expertise.length > 0) {
        const supervisorExpertise = supervisor.expertise || []
        const matchingExpertise = expertise.filter(e => 
          supervisorExpertise.some(se => se.toLowerCase().includes(e.toLowerCase()))
        )
        expertiseMatch = expertise.length > 0 ? matchingExpertise.length / expertise.length : 0
      }
      
      // Calculate combined score (70% research interests, 30% expertise)
      const combinedScore = (interestsSimilarity * 0.7) + (expertiseMatch * 0.3)
      
      // Convert to percentage and round
      const matchScore = Math.round(combinedScore * 100)
      
      return {
        ...supervisor,
        matchScore
      }
    })
    
    // Sort by match score (highest first)
    const sortedResults = results.sort((a, b) => b.matchScore - a.matchScore)
    
    return NextResponse.json({
      results: sortedResults
    })
  } catch (error) {
    console.error('Error in match API:', error)
    return NextResponse.json(
      { error: 'Failed to process matching request' },
      { status: 500 }
    )
  }
} 