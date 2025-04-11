'use client'

import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import SupervisorList from './components/SupervisorList'

// This would normally come from an API or database
const RESEARCH_AREAS = [
  'Artificial Intelligence',
  'Software Engineering',
  'Data Science',
  'Machine Learning',
  'Human-Computer Interaction',
  'Computer Vision',
  'Natural Language Processing',
  'Cybersecurity',
  'Database Systems',
  'Computer Networks'
]

// Mock data - would be replaced with real data from your API/backend
const mockSupervisors = [
  {
    id: 'chiam-yin-kia',
    name: 'Dr. Chiam Yin Kia',
    position: 'Senior Lecturer',
    department: 'Software Engineering',
    researchInterests: ['Software Testing', 'Agile Development', 'Quality Assurance'],
    expertise: ['Software Engineering', 'Database Systems', 'Web Technologies'],
    publications: [
      'Automated Test Case Generation for Web Applications',
      'A Review of Agile Methodologies in Software Development',
      'Quality Metrics for Software Testing'
    ],
    contactInfo: {
      email: 'tkchiew@um.edu.my',
      office: 'A-12-3'
    }
  },
  {
    id: 'su-moon-ting',
    name: 'Dr. Su Moon Ting',
    position: 'Associate Professor',
    department: 'Software Engineering',
    researchInterests: ['Software Quality', 'Software Architecture', 'Cloud Computing'],
    expertise: ['Software Design Patterns', 'Cloud Computing', 'Distributed Systems'],
    publications: [
      'Cloud-based Software Architectures for Educational Institutions',
      'Quality Attributes in Cloud-Native Applications',
      'A Framework for Measuring Software Quality in Distributed Systems'
    ],
    contactInfo: {
      email: 'smting@um.edu.my',
      office: 'B-14-5'
    }
  },
  {
    id: 'siti-hafizah',
    name: 'Dr. Siti Hafizah Ab Hamid',
    position: 'Professor',
    department: 'Software Engineering',
    researchInterests: ['Requirements Engineering', 'Software Process', 'Empirical Software Engineering'],
    expertise: ['Requirements Specification', 'Software Process Improvement', 'Software Metrics'],
    publications: [
      'A Systematic Review of Requirements Engineering Techniques',
      'Improving Requirements Elicitation Process in Agile Development',
      'Empirical Study on Software Process Models in Malaysian Industries'
    ],
    contactInfo: {
      email: 'sitihafizah@um.edu.my',
      office: 'C-10-2'
    }
  }
]

export default function Home() {
  const [supervisors, setSupervisors] = useState([])
  const [filteredSupervisors, setFilteredSupervisors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API request
    const fetchSupervisors = async () => {
      setIsLoading(true)
      try {
        // This would normally be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
        setSupervisors(mockSupervisors)
        setFilteredSupervisors(mockSupervisors)
      } catch (error) {
        console.error('Error fetching supervisors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupervisors()
  }, [])

  const handleSearch = ({ query, researchAreas }) => {
    if (!query && researchAreas.length === 0) {
      setFilteredSupervisors(supervisors)
      return
    }

    const filtered = supervisors.filter(supervisor => {
      // Filter by text query
      const matchesQuery = !query || [
        supervisor.name,
        supervisor.department,
        ...supervisor.expertise,
        ...supervisor.researchInterests,
        ...(supervisor.publications || [])
      ].some(field => 
        field.toLowerCase().includes(query.toLowerCase())
      )

      // Filter by research areas
      const matchesResearchAreas = researchAreas.length === 0 || 
        researchAreas.some(area => 
          supervisor.researchInterests.some(interest => 
            interest.toLowerCase().includes(area.toLowerCase())
          )
        )

      return matchesQuery && matchesResearchAreas
    })

    setFilteredSupervisors(filtered)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Research Supervisor Matching
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find the perfect research supervisor for your academic journey
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          researchAreas={RESEARCH_AREAS} 
        />

        <SupervisorList 
          supervisors={filteredSupervisors} 
          isLoading={isLoading} 
        />
      </div>
    </main>
  )
} 