'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data - would be replaced with real data from your API/backend
const mockSupervisors = {
  'chiam-yin-kia': {
    id: 'chiam-yin-kia',
    name: 'Dr. Chiam Yin Kia',
    position: 'Senior Lecturer',
    department: 'Software Engineering',
    university: 'University of Malaya',
    academicBackground: [
      'PhD in Computer Science, University of Malaya, 2018',
      'M.Sc in Software Engineering, University of Malaya, 2012',
      'B.Sc in Computer Science, University of Malaya, 2009'
    ],
    researchInterests: [
      'Software Testing',
      'Agile Development',
      'Quality Assurance',
      'Test Automation',
      'DevOps Practices'
    ],
    expertise: [
      'Software Engineering',
      'Database Systems',
      'Web Technologies',
      'Continuous Integration',
      'Test-Driven Development'
    ],
    publications: [
      {
        title: 'Automated Test Case Generation for Web Applications',
        authors: 'Chiam YK, Rahman A, Lee SP',
        journal: 'Journal of Software Testing, Verification and Reliability',
        year: 2021,
        doi: '10.1002/stvr.1234'
      },
      {
        title: 'A Review of Agile Methodologies in Software Development',
        authors: 'Chiam YK, Sani N, Abdullah R',
        journal: 'IEEE Access',
        year: 2020,
        doi: '10.1109/access.2020.5678'
      },
      {
        title: 'Quality Metrics for Software Testing',
        authors: 'Chiam YK, Lee SP, Rahman A',
        journal: 'Software Quality Journal',
        year: 2019,
        doi: '10.1007/s11219-019-1234'
      },
      {
        title: 'Test Case Prioritization Techniques: A Systematic Review',
        authors: 'Chiam YK, Rahman A',
        journal: 'Information and Software Technology',
        year: 2018,
        doi: '10.1016/j.infsof.2018.5678'
      },
      {
        title: 'Enhancing Software Quality through Continuous Integration',
        authors: 'Chiam YK, Abdullah R, Lee SP',
        journal: 'ACM SIGSOFT Software Engineering Notes',
        year: 2017,
        doi: '10.1145/3011286.3011291'
      }
    ],
    projects: [
      {
        title: 'Automated Testing Framework for Web Applications',
        description: 'Development of a framework that automates the testing of web applications with minimal configuration.',
        duration: '2020-2022',
        funding: 'University Research Grant'
      },
      {
        title: 'Quality Metrics Dashboard for Agile Teams',
        description: 'A dashboard tool that helps agile teams monitor and improve software quality through defined metrics.',
        duration: '2018-2020',
        funding: 'Industry Collaboration Fund'
      }
    ],
    supervisedStudents: {
      phd: 3,
      masters: 8,
      undergraduate: 15
    },
    contactInfo: {
      email: 'tkchiew@um.edu.my',
      phone: '+603-7967-6300',
      office: 'A-12-3, Faculty of Computer Science & Information Technology'
    },
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=example',
      researchGate: 'https://www.researchgate.net/profile/Chiam-Yin-Kia',
      orcid: 'https://orcid.org/0000-0001-example'
    }
  },
  'su-moon-ting': {
    id: 'su-moon-ting',
    name: 'Dr. Su Moon Ting',
    position: 'Associate Professor',
    department: 'Software Engineering',
    university: 'University of Malaya',
    academicBackground: [
      'PhD in Computer Science, University of Auckland, 2015',
      'M.Sc in Computer Science, Universiti Putra Malaysia, 1999',
      'B.Sc in Computer Science (Honours), Universiti Putra Malaysia, 1997'
    ],
    researchInterests: [
      'Software Quality',
      'Software Architecture',
      'Cloud Computing',
      'Service-Oriented Architecture',
      'Software Metrics'
    ],
    expertise: [
      'Software Design Patterns',
      'Cloud Computing',
      'Distributed Systems',
      'Software Quality Assessment',
      'Enterprise Architecture'
    ],
    publications: [
      {
        title: 'Cloud-based Software Architectures for Educational Institutions',
        authors: 'Su MT, Hamid SHA, Lim YP',
        journal: 'Journal of Cloud Computing',
        year: 2022,
        doi: '10.1186/s13677-022-1234-5'
      },
      {
        title: 'Quality Attributes in Cloud-Native Applications',
        authors: 'Su MT, Abdullah R, Hashim NL',
        journal: 'IEEE Transactions on Software Engineering',
        year: 2021,
        doi: '10.1109/tse.2021.5678'
      },
      {
        title: 'A Framework for Measuring Software Quality in Distributed Systems',
        authors: 'Su MT, Ibrahim S, Lim YP',
        journal: 'Information and Software Technology',
        year: 2020,
        doi: '10.1016/j.infsof.2020.1234'
      },
      {
        title: 'Service Composition in Cloud Environments: Challenges and Opportunities',
        authors: 'Su MT, Chiam YK, Abdullah R',
        journal: 'Future Generation Computer Systems',
        year: 2019,
        doi: '10.1016/j.future.2019.4567'
      },
      {
        title: 'Architectural Patterns for Scalable Cloud Applications',
        authors: 'Su MT, Hamid SHA, Ibrahim S',
        journal: 'ACM Computing Surveys',
        year: 2018,
        doi: '10.1145/3196883.3196892'
      }
    ],
    projects: [
      {
        title: 'Cloud-Native Architecture for Higher Education',
        description: 'Development of a reference architecture for educational institutions migrating to cloud-native solutions.',
        duration: '2021-2023',
        funding: 'National Research Grant'
      },
      {
        title: 'Quality Assessment Framework for Distributed Systems',
        description: 'A comprehensive framework to evaluate software quality in distributed and cloud-based systems.',
        duration: '2019-2021',
        funding: 'University Research Grant'
      }
    ],
    supervisedStudents: {
      phd: 5,
      masters: 12,
      undergraduate: 22
    },
    contactInfo: {
      email: 'smting@um.edu.my',
      phone: '+603-7967-6311',
      office: 'B-14-5, Faculty of Computer Science & Information Technology'
    },
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=example2',
      researchGate: 'https://www.researchgate.net/profile/Su-Moon-Ting',
      orcid: 'https://orcid.org/0000-0002-example'
    }
  },
  'siti-hafizah': {
    id: 'siti-hafizah',
    name: 'Dr. Siti Hafizah Ab Hamid',
    position: 'Professor',
    department: 'Software Engineering',
    university: 'University of Malaya',
    academicBackground: [
      'PhD in Computer Science, University of Manchester, 2010',
      'M.Sc in Software Engineering, University of Malaya, 2004',
      'B.Sc in Computer Science, University of Malaya, 2001'
    ],
    researchInterests: [
      'Requirements Engineering',
      'Software Process',
      'Empirical Software Engineering',
      'Software Quality Assurance',
      'Software Engineering Education'
    ],
    expertise: [
      'Requirements Specification',
      'Software Process Improvement',
      'Software Metrics',
      'Empirical Methods',
      'Software Project Management'
    ],
    publications: [
      {
        title: 'A Systematic Review of Requirements Engineering Techniques',
        authors: 'Hamid SHA, Rahman A, Ibrahim S',
        journal: 'IEEE Transactions on Software Engineering',
        year: 2022,
        doi: '10.1109/tse.2022.9876'
      },
      {
        title: 'Improving Requirements Elicitation Process in Agile Development',
        authors: 'Hamid SHA, Chiam YK, Lee SP',
        journal: 'Requirements Engineering Journal',
        year: 2021,
        doi: '10.1007/s00766-021-1234'
      },
      {
        title: 'Empirical Study on Software Process Models in Malaysian Industries',
        authors: 'Hamid SHA, Su MT, Abdullah R',
        journal: 'Journal of Systems and Software',
        year: 2020,
        doi: '10.1016/j.jss.2020.5678'
      },
      {
        title: 'A Framework for Requirements Traceability in Safety-Critical Systems',
        authors: 'Hamid SHA, Ibrahim S, Rahman A',
        journal: 'Software Quality Journal',
        year: 2019,
        doi: '10.1007/s11219-019-5678'
      },
      {
        title: 'Teaching Software Engineering: Challenges and Innovations',
        authors: 'Hamid SHA, Lee SP, Abdullah R',
        journal: 'IEEE Transactions on Education',
        year: 2018,
        doi: '10.1109/te.2018.1234'
      }
    ],
    projects: [
      {
        title: 'Automated Requirements Traceability Tool',
        description: 'Development of a tool to automatically trace requirements through the software development lifecycle.',
        duration: '2021-2023',
        funding: 'National Research Grant'
      },
      {
        title: 'Software Process Improvement Framework for SMEs',
        description: 'A lightweight framework for small and medium enterprises to improve their software development processes.',
        duration: '2019-2021',
        funding: 'Industry Collaboration Fund'
      }
    ],
    supervisedStudents: {
      phd: 8,
      masters: 15,
      undergraduate: 30
    },
    contactInfo: {
      email: 'sitihafizah@um.edu.my',
      phone: '+603-7967-6322',
      office: 'C-10-2, Faculty of Computer Science & Information Technology'
    },
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=example3',
      researchGate: 'https://www.researchgate.net/profile/Siti-Hafizah-Hamid',
      orcid: 'https://orcid.org/0000-0003-example'
    }
  }
};

export default function SupervisorDetail({ params }) {
  const { id } = params;
  const [supervisor, setSupervisor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API request
    const fetchSupervisor = async () => {
      setIsLoading(true);
      try {
        // This would normally be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const supervisorData = mockSupervisors[id];
        if (!supervisorData) {
          throw new Error('Supervisor not found');
        }
        
        setSupervisor(supervisorData);
      } catch (error) {
        console.error('Error fetching supervisor details:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2 text-gray-600">Loading supervisor details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link href="/" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Return to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supervisor) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Supervisors
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{supervisor.name}</h1>
              <p className="text-lg text-gray-600">{supervisor.position}, {supervisor.department}</p>
              <p className="text-gray-500">{supervisor.university}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${supervisor.contactInfo.email}`} className="text-blue-600 hover:text-blue-800">
                        {supervisor.contactInfo.email}
                      </a>
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Phone:</span> {supervisor.contactInfo.phone}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Office:</span> {supervisor.contactInfo.office}
                    </p>
                  </div>
                </div>

                {supervisor.profileLinks && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Online Profiles</h3>
                    <div className="mt-2 space-y-1">
                      {supervisor.profileLinks.googleScholar && (
                        <p className="text-sm">
                          <a href={supervisor.profileLinks.googleScholar} className="text-blue-600 hover:text-blue-800 flex items-center" target="_blank" rel="noopener noreferrer">
                            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 12a8 8 0 017.162 1.44L24 9.5 12 0z" />
                            </svg>
                            Google Scholar
                          </a>
                        </p>
                      )}
                      {supervisor.profileLinks.researchGate && (
                        <p className="text-sm">
                          <a href={supervisor.profileLinks.researchGate} className="text-blue-600 hover:text-blue-800 flex items-center" target="_blank" rel="noopener noreferrer">
                            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.586 0c-2.123 0-3.957 1.342-4.686 3.207a23.268 23.268 0 00-2.057-.151c-3.59 0-6.707 1.824-8.615 4.524C2.871 9.629 2.286 12.258 2.286 15c0 1.815.313 3.491.824 5.001h9.988c.163-.58.243-1.094.243-1.683 0-1.724-.785-3.242-2.11-4.331.874-.895 2.179-1.385 4.075-1.385 2.037 0 3.586.82 4.479 2.375.863 1.501 1.019 2.958 1.019 4.977 0 2.683-.863 6.042-4.533 6.042-.997 0-2.219-.426-2.978-1.016-.77-.596-1.374-1.405-1.374-2.471 0-2.099 2.352-3.378 3.381-3.378.301 0 .645.151.645.437 0 .136-.033.235-.1.321-.068.087-.188.156-.356.211-.387.125-1.544.644-1.544 1.646 0 .612.642 1.095 1.443 1.095 1.196 0 1.983-.946 1.983-2.405 0-1.379-.766-2.897-3.029-2.897-2.327 0-4.009 1.347-4.009 3.539 0 .86.133 1.645.532 2.402H0v-6.316c1.425-3.263 4.782-5.585 8.843-5.585 1.571 0 3.016.35 4.252.947-.013.151-.033.302-.033.447 0 2.28 1.482 4.168 3.568 5.047a4.105 4.105 0 01-.24 1.381h-1.148A5.913 5.913 0 0114.91 15c0-1.868.663-3.571 1.762-4.92-1.124-2.223-3.493-3.762-6.243-3.762-3.842 0-6.953 3.061-6.953 6.839 0 .992.225 1.929.594 2.785-.126-.007-.236-.017-.362-.017-1.9 0-3.501 1.232-3.772 2.857A10.93 10.93 0 010 15C0 6.732 7.164 0 16 0h3.586z" />
                            </svg>
                            ResearchGate
                          </a>
                        </p>
                      )}
                      {supervisor.profileLinks.orcid && (
                        <p className="text-sm">
                          <a href={supervisor.profileLinks.orcid} className="text-blue-600 hover:text-blue-800 flex items-center" target="_blank" rel="noopener noreferrer">
                            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-7 16.5V7.5h2.1v9h-2.1zm1.05-10.2a1.05 1.05 0 110-2.1 1.05 1.05 0 010 2.1zm10.962 10.2h-2.1v-4.95c0-1.05-.525-1.575-1.575-1.575-.9 0-1.575.525-1.575 1.575V16.5h-2.1V7.5h2.1v.75h.075c.375-.675 1.275-1.275 2.625-1.275 1.5 0 2.55.675 2.55 2.55V16.5z" />
                            </svg>
                            ORCID
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Background</h2>
          <ul className="list-disc pl-5 space-y-1">
            {supervisor.academicBackground.map((education, index) => (
              <li key={index} className="text-gray-700">{education}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Interests</h2>
            <div className="flex flex-wrap gap-2">
              {supervisor.researchInterests.map((interest, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {supervisor.expertise.map((item, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Publications</h2>
          <div className="space-y-4">
            {supervisor.publications.map((publication, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium text-gray-900">{publication.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{publication.authors}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {publication.journal}, {publication.year}
                </p>
                {publication.doi && (
                  <p className="text-sm mt-1">
                    <a href={`https://doi.org/${publication.doi}`} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      DOI: {publication.doi}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {supervisor.projects && supervisor.projects.length > 0 && (
          <div className="p-6 md:p-8 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Projects</h2>
            <div className="space-y-4">
              {supervisor.projects.map((project, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex flex-wrap text-sm text-gray-500 mt-2">
                    <span className="mr-4">{project.duration}</span>
                    <span>{project.funding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {supervisor.supervisedStudents && (
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Supervised Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded text-center">
                <span className="block text-3xl font-bold text-blue-600">{supervisor.supervisedStudents.phd}</span>
                <span className="text-gray-600">PhD Students</span>
              </div>
              <div className="p-4 bg-gray-50 rounded text-center">
                <span className="block text-3xl font-bold text-blue-600">{supervisor.supervisedStudents.masters}</span>
                <span className="text-gray-600">Master's Students</span>
              </div>
              <div className="p-4 bg-gray-50 rounded text-center">
                <span className="block text-3xl font-bold text-blue-600">{supervisor.supervisedStudents.undergraduate}</span>
                <span className="text-gray-600">Undergraduate Students</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
</rewritten_file>