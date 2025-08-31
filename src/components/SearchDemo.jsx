import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

export function SearchDemo() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    setSearchTerm(searchInput.trim());
    
    // Simulate API call
    setTimeout(() => {
      setSearching(false);
      console.log('Searching for:', searchInput.trim());
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Search Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Type to search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            {searchInput && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearSearch}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={searching || !searchInput.trim()}
              className="h-6 px-2 text-xs"
            >
              {searching ? '...' : 'Search'}
            </Button>
          </div>
        </div>

        {searchTerm && (
          <div className="p-3 bg-green-50 rounded border">
            <p className="text-sm text-green-800">
              <strong>Active search:</strong> "{searchTerm}"
            </p>
            <button
              onClick={handleClearSearch}
              className="text-xs text-green-600 hover:text-green-800 mt-1"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Type in the search box</p>
          <p>• Press Enter or click Search button</p>
          <p>• Use X button to clear</p>
        </div>
      </CardContent>
    </Card>
  );
}
