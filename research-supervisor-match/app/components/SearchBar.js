'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, researchAreas = [] }) {
  const [query, setQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, researchAreas: selectedAreas });
  };

  const handleAreaToggle = (area) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by name, expertise, or keywords
            </label>
            <input
              type="text"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., AI, Machine Learning, Dr. Smith"
            />
          </div>
          <div className="md:w-1/4">
            <button
              type="submit"
              className="w-full h-10 mt-6 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {researchAreas.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Research Areas</h3>
            <div className="flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaToggle(area)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium 
                    ${selectedAreas.includes(area) 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 