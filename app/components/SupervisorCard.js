'use client';

import Link from 'next/link';

export default function SupervisorCard({ supervisor }) {
  const { 
    name, 
    position, 
    department, 
    researchInterests, 
    expertise, 
    publications, 
    contactInfo 
  } = supervisor;

  // Generate a slug for the supervisor from the name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/dr\.\s+/, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const slug = supervisor.id || generateSlug(name);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden supervisor-card">
      <div className="p-6">
        <Link href={`/supervisors/${slug}`} className="inline-block">
          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-1">{name}</h2>
        </Link>
        <p className="text-gray-600 mb-4">{position}, {department}</p>
        
        {contactInfo && contactInfo.email && (
          <div className="mb-4">
            <a 
              href={`mailto:${contactInfo.email}`} 
              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </a>
          </div>
        )}
        
        {researchInterests && researchInterests.length > 0 && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Research Interests</h3>
            <div className="flex flex-wrap gap-1">
              {researchInterests.slice(0, 3).map((interest, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {interest}
                </span>
              ))}
              {researchInterests.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  +{researchInterests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {expertise && expertise.length > 0 && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Expertise</h3>
            <div className="flex flex-wrap gap-1">
              {expertise.slice(0, 3).map((skill, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {skill}
                </span>
              ))}
              {expertise.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  +{expertise.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {publications && publications.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Publications</h3>
            <ul className="space-y-1">
              {publications.slice(0, 2).map((pub, index) => (
                <li key={index} className="text-sm text-gray-600 truncate">
                  {typeof pub === 'string' 
                    ? pub 
                    : pub.title}
                </li>
              ))}
            </ul>
            {publications.length > 2 && (
              <Link href={`/supervisors/${slug}`} className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-block">
                View all {publications.length} publications
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <Link 
          href={`/supervisors/${slug}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View Profile
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}