'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { assetsApi } from '@/lib/api/assets';
import { useQuery } from '@tanstack/react-query';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier' | 'all';

interface AssetResult {
  id: string;
  type: AssetType;
  name: string;
  identifier: string;
  criticality?: string;
  owner?: string;
  businessUnit?: string;
  createdAt: string;
  updatedAt: string;
}

export function GlobalSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('globalSearchRecentSearches');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (q: string) => {
    if (typeof window === 'undefined') return;
    const trimmed = q.trim();
    if (!trimmed) return;
    const existing = recentSearches.filter((r) => r !== trimmed);
    const updated = [trimmed, ...existing].slice(0, 5);
    setRecentSearches(updated);
    try {
      window.localStorage.setItem('globalSearchRecentSearches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Debounced search suggestions
  const { data: suggestions, isLoading: isSuggesting } = useQuery({
    queryKey: ['global-search-suggestions', search],
    queryFn: async () => {
      if (!search.trim()) return [];
      const response = await assetsApi.searchAssets({
        q: search,
        limit: 5,
      });
      return response.data || [];
    },
    enabled: search.trim().length > 0,
    staleTime: 30000,
  });

  // Handle search submission
  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    saveRecentSearch(trimmed);
    
    // Navigate to All Assets page with search query
    const params = new URLSearchParams({ q: trimmed });
    router.push(`/en/dashboard/assets/all?${params.toString()}`);
    setShowSuggestions(false);
    setShowRecent(false);
    setSearch('');
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: AssetResult) => {
    saveRecentSearch(suggestion.name || suggestion.identifier);
    const params = new URLSearchParams({ q: suggestion.name || suggestion.identifier });
    router.push(`/en/dashboard/assets/all?${params.toString()}`);
    setShowSuggestions(false);
    setShowRecent(false);
    setSearch('');
  };

  // Handle recent search click
  const handleRecentClick = (recent: string) => {
    const params = new URLSearchParams({ q: recent });
    router.push(`/en/dashboard/assets/all?${params.toString()}`);
    setShowRecent(false);
    setSearch('');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeLabel = (type: AssetType): string => {
    const labels: Record<AssetType, string> = {
      physical: 'Physical',
      information: 'Information',
      application: 'Application',
      software: 'Software',
      supplier: 'Supplier',
      all: 'All',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: AssetType): string => {
    const colors: Record<AssetType, string> = {
      physical: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      information: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      application: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      software: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      supplier: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      all: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[type] || '';
  };

  const getCriticalityColor = (criticality: string): string => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return colors[criticality?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search all assets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(e.target.value.trim().length > 0);
            setShowRecent(e.target.value.trim().length === 0 && recentSearches.length > 0);
          }}
          onFocus={() => {
            if (recentSearches.length > 0 && !search) {
              setShowRecent(true);
            }
            if (search.trim()) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              handleSearch(search);
            } else if (e.key === 'Escape') {
              setShowSuggestions(false);
              setShowRecent(false);
              if (inputRef.current) {
                inputRef.current.blur();
              }
            }
          }}
          className="pl-10 pr-4"
        />
      </div>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="px-2 py-1 text-xs text-muted-foreground border-b">Recent searches</div>
          {recentSearches.map((recent, idx) => (
            <button
              key={`recent-${idx}`}
              type="button"
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
              onClick={() => handleRecentClick(recent)}
            >
              <span className="font-medium">{recent}</span>
            </button>
          ))}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && search.trim() && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md max-h-80 overflow-y-auto">
          <div className="px-2 py-1 text-xs text-muted-foreground flex items-center justify-between border-b">
            <span>Suggestions</span>
            {isSuggesting && <span className="text-[10px]">Loading…</span>}
          </div>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((s) => (
              <button
                key={`${s.type}-${s.id}`}
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => handleSuggestionClick(s)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate block">{s.name}</span>
                    {s.identifier && (
                      <span className="text-xs text-muted-foreground truncate block">
                        {s.identifier}
                      </span>
                    )}
                  </div>
                  <div className="ml-2 flex items-center gap-1 flex-shrink-0">
                    <Badge className={getTypeColor(s.type)} variant="outline">
                      {getTypeLabel(s.type)}
                    </Badge>
                    {s.criticality && (
                      <Badge className={getCriticalityColor(s.criticality)} variant="outline">
                        {s.criticality}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            !isSuggesting && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No suggestions found
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}


