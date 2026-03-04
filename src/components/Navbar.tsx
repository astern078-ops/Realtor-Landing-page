import React, { useState } from 'react';
import { Search, Bookmark, BarChart3, Activity, Share2 } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  zillowUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, isLoading, zillowUrl }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const validateQuery = (val: string) => {
    const trimmed = val.trim();
    // Allow any search query that is at least 3 characters long
    return trimmed.length >= 3;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateQuery(query)) {
      setError(false);
      onSearch(query);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-blue-500 w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">
              Market<span className="text-blue-500">View</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search Address, City, or Zip..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError(false);
                }}
                className={`pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 w-80 transition-all ${
                  error ? 'ring-2 ring-red-500 animate-shake' : 'focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              <Search className={`absolute left-3 top-2.5 w-4 h-4 transition-colors ${error ? 'text-red-500' : 'text-slate-400'}`} />
              <button type="submit" className="hidden">Search</button>
              {error && (
                <div className="absolute top-full mt-2 left-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-fade-in">
                  Please enter a search query (address, zip, or city)
                </div>
              )}
            </form>
            <a className="text-slate-500 hover:text-blue-500 transition-colors" href="#">Saved</a>
            <a className="text-blue-500 border-b-2 border-blue-500 pb-1" href="#">Analyze</a>
            <a className="text-slate-500 hover:text-blue-500 transition-colors" href="#">Activity</a>
            {zillowUrl && (
              <a 
                className="text-slate-500 hover:text-blue-500 transition-colors flex items-center space-x-1" 
                href={zillowUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Zillow</span>
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </div>
    </nav>
  );
};
