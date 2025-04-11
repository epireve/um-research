'use client';

import { useState } from 'react';

export default function SearchForm({ onSearch, isLoading = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('keywords');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch({ 
        term: searchTerm.trim(), 
        type: searchType 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="w-full md:w-1/4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="keywords">Keywords</option>
            <option value="research_interests">Research Interests</option>
            <option value="expertise">Expertise</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for research supervisors..."
            className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-70"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
} 