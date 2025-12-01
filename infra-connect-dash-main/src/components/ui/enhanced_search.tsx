import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, Folder, User, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSearch } from "@/contexts/SearchContext";

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending';
  icon: React.ReactNode;
}

export const EnhancedSearch = () => {
  const { searchQuery, setSearchQuery, searchResults, isSearching, searchError } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches: SearchSuggestion[] = [
    { id: '1', text: 'Agriculture Projects', type: 'recent', icon: <Clock className="h-4 w-4" /> },
    { id: '2', text: 'User Analytics', type: 'recent', icon: <User className="h-4 w-4" /> },
  ];

  const trendingSearches: SearchSuggestion[] = [
    { id: '3', text: 'Rural Development', type: 'trending', icon: <TrendingUp className="h-4 w-4" /> },
    { id: '4', text: 'Quarterly Reports', type: 'trending', icon: <Flag className="h-4 w-4" /> },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsOpen(true);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 md:flex-initial">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-300" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search projects, users, reports..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-12 pr-10 w-full md:w-96 bg-white border-2 border-gray-200 focus:bg-white focus:border-blue-500 text-gray-900 placeholder-gray-400 rounded-2xl transition-all duration-300 hover:shadow-xl focus:shadow-xl focus:scale-105 h-12 font-medium"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showSuggestions && !searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4">
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => selectSuggestion(suggestion.text)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                      >
                        {suggestion.icon}
                        <span className="text-gray-600">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Searches
                </h4>
                <div className="space-y-1">
                  {trendingSearches.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => selectSuggestion(suggestion.text)}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                    >
                      {suggestion.icon}
                      <span className="text-gray-600">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <PopoverContent 
          className="w-96 p-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
          align="start"
        >
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Search Results</h3>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {searchResults.length} found
                  </Badge>
                )}
              </div>
            </div>

            {isSearching && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Searching...</p>
              </div>
            )}

            {searchError && (
              <div className="p-4 text-center text-red-600 bg-red-50">
                <p>Search failed. Please try again.</p>
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No results found</p>
                <p className="text-gray-500 text-sm mt-1">Try different keywords or check spelling</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "p-3 rounded-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 hover:bg-blue-50",
                      index < searchResults.length - 1 && "mb-2"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        result.type === 'project' && "bg-green-100 text-green-600",
                        result.type === 'user' && "bg-blue-100 text-blue-600",
                        result.type === 'report' && "bg-orange-100 text-orange-600",
                        result.type === 'rating' && "bg-purple-100 text-purple-600"
                      )}>
                        {result.type === 'project' && <Folder className="h-4 w-4" />}
                        {result.type === 'user' && <User className="h-4 w-4" />}
                        {result.type === 'report' && <Flag className="h-4 w-4" />}
                        {result.type === 'rating' && <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{result.title}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs",
                              result.type === 'project' && "bg-green-100 text-green-700",
                              result.type === 'user' && "bg-blue-100 text-blue-700",
                              result.type === 'report' && "bg-orange-100 text-orange-700",
                              result.type === 'rating' && "bg-purple-100 text-purple-700"
                            )}
                          >
                            {result.type}
                          </Badge>
                          {result.relevance > 80 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              High match
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd> to view all results
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};