import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X, Filter, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { useTrends } from '../hooks/useTrends';
import { useCategories } from '../hooks/useCategories';
import { TrendCard } from '../components/cards/TrendCard';
import { LatestGridSkeleton } from '../components/ui/Skeletons';

export const Search = () => {
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '');
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(searchParams.get('difficulty') || undefined);
  const [selectedTool, setSelectedTool] = useState<string | undefined>(searchParams.get('tool') || undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  // Category specific pagination
  const INITIAL_CATEGORY_COUNT = 4;
  const LOAD_MORE_CATEGORY_COUNT = 8;
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({});

  // Sync search parameters from URL query string
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const tool = searchParams.get('tool') || undefined;
    const cat = searchParams.get('category') || undefined;
    const diff = searchParams.get('difficulty') || undefined;
    
    setQuery(q);
    setSelectedTool(tool);
    setSelectedCategory(cat);
    setSelectedDifficulty(diff);
  }, [searchParams]);

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setCategoryLimits({});
  }, [debouncedQuery, selectedCategory, selectedDifficulty, selectedTool]);

  // Fetch results based on filters (fetch all matching category/tool, skip DB search)
  const { trends, loading } = useTrends({
    categorySlug: selectedCategory,
    difficulty: selectedDifficulty,
    tool: selectedTool,
  });

  // Client-side fuzzy search for instant results
  const fuse = useMemo(() => new Fuse(trends, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'tools', weight: 1.5 },
      { name: 'category.name', weight: 1 },
      { name: 'short_description', weight: 0.5 }
    ],
    threshold: 0.3,
    ignoreLocation: true,
  }), [trends]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return trends;
    return fuse.search(debouncedQuery).map(r => r.item);
  }, [debouncedQuery, fuse, trends]);

  const visibleTrends = searchResults.slice(0, visibleCount);
  const hasMore = visibleCount < searchResults.length;

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory(undefined);
    setSelectedDifficulty(undefined);
    setSelectedTool(undefined);
  };

  // Compile list of popular tools from seed data
  const popularTools = [
    'Kling AI',
    'Midjourney',
    'ElevenLabs',
    'Veo 3',
    'Suno AI',
    'Runway ML',
    'CapCut',
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <>
      <Helmet>
        <title>Search Viral AI Prompts & Guides | ViralAI Hub</title>
        <meta name="description" content="Search our extensive prompt library for Kling, Suno, Midjourney, Runway, and more. Filter by category, tool, and difficulty." />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6 pt-16">
        
        {/* Header & Search Bar Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-200 pb-6">
          {/* Page Header */}
          <div className="space-y-1.5 shrink-0 text-left">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#17171c] leading-none">
              Search Prompt Library
            </h1>
            <p className="text-xs text-[#616161] font-light leading-relaxed">
              Search titles, descriptions, prompts, or tool stacks.
            </p>
          </div>

          {/* Search Bar & Toggle Filter Button */}
          <div className="flex items-center gap-3 w-full lg:max-w-2xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 transition-colors">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                placeholder="Type to search (e.g. cricket, lo-fi lyrics, Midjourney...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#eeece7]/40 border border-neutral-200 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-300 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-black transition-colors cursor-pointer bg-transparent border-0 outline-none"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className={`flex items-center justify-center space-x-1.5 h-10 px-4 rounded-full border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                showFilters 
                  ? 'bg-[#ff7759] text-white border-transparent shadow-sm' 
                  : 'bg-[#eeece7]/60 border-neutral-200 text-[#616161] hover:bg-[#eeece7]/80 hover:text-[#17171c]'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {(selectedCategory || selectedDifficulty || selectedTool) && (
                <span className={`w-1.5 h-1.5 rounded-full ${showFilters ? 'bg-white' : 'bg-[#ff7759]'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="space-y-4 max-w-4xl p-5 md:p-6 bg-white border border-neutral-200 rounded-2xl animate-fade-in shadow-sm">
            
            <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3 mb-4">
              <Filter size={14} className="text-[#ff7759]" />
              <h3 className="font-heading text-xs uppercase tracking-wider font-bold text-[#17171c]">
                Filter Results
              </h3>
              
              {(selectedCategory || selectedDifficulty || selectedTool || query) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] text-[#ff7759] hover:underline font-bold uppercase ml-auto cursor-pointer bg-transparent border-0 outline-none"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs text-left">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <span className="font-semibold text-[#616161]">Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => {
                    const isActive = selectedCategory === c.slug;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(isActive ? undefined : c.slug)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-[#17171c] text-white border-[#17171c]'
                            : 'border-neutral-200 text-neutral-600 hover:bg-[#eeece7]/50'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Pills */}
              <div className="space-y-1.5">
                <span className="font-semibold text-[#616161]">Difficulty:</span>
                <div className="flex flex-wrap gap-1.5">
                  {difficulties.map((diff) => {
                    const isActive = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(isActive ? undefined : diff)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-[#17171c] text-white border-[#17171c]'
                            : 'border-neutral-200 text-neutral-600 hover:bg-[#eeece7]/50'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tool Chips */}
              <div className="space-y-1.5">
                <span className="font-semibold text-[#616161]">Tool Used:</span>
                <div className="flex flex-wrap gap-1.5">
                  {popularTools.map((tool) => {
                    const isActive = selectedTool === tool;
                    return (
                      <button
                        key={tool}
                        onClick={() => setSelectedTool(isActive ? undefined : tool)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-[#ff7759] text-white border-[#ff7759]'
                            : 'border-neutral-200 text-neutral-600 hover:bg-[#eeece7]/50'
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Results Container */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-bold text-[#616161] text-left">
              {debouncedQuery 
                ? `Showing ${Math.min(visibleCount, searchResults.length)} of ${searchResults.length} results`
                : `Showing ${searchResults.length} total results`}
            </span>
            {hasMore && debouncedQuery && !loading && (
              <span className="text-[10px] text-neutral-400">
                {searchResults.length - visibleCount} more available
              </span>
            )}
          </div>

          {loading ? (
            <LatestGridSkeleton count={8} showHeader={false} />
          ) : searchResults.length === 0 ? (
            <div className="text-center py-20 max-w-lg mx-auto">
              {/* Illustrated empty state */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-28 h-28">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-200 animate-[spin_20s_linear_infinite]" />
                  {/* Inner glow circle */}
                  <div className="absolute inset-3 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Telescope body */}
                      <rect x="8" y="22" width="28" height="6" rx="3" fill="#eeece7" stroke="#d9d9dd" strokeWidth="1.5"/>
                      {/* Lens */}
                      <circle cx="36" cy="25" r="6" fill="#f1f5ff" stroke="#93939f" strokeWidth="1.5"/>
                      {/* Eyepiece */}
                      <rect x="6" y="23.5" width="5" height="3" rx="1.5" fill="#93939f"/>
                      {/* Stand */}
                      <line x1="20" y1="28" x2="16" y2="38" stroke="#d9d9dd" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="26" y1="28" x2="30" y2="38" stroke="#d9d9dd" strokeWidth="1.5" strokeLinecap="round"/>
                      {/* Stars */}
                      <circle cx="10" cy="10" r="1.5" fill="#ff7759" className="animate-pulse"/>
                      <circle cx="38" cy="8" r="1" fill="#93939f"/>
                      <circle cx="42" cy="15" r="1.5" fill="#ff7759" style={{animationDelay:'0.5s'}} className="animate-pulse"/>
                      <circle cx="6" cy="18" r="1" fill="#d9d9dd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#17171c] mb-2">No guides found</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-8 max-w-sm mx-auto">
                We couldn't find any AI guides matching your search. Try a different keyword or explore these popular categories.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: '🎬 IPL Cricket Reel', q: 'IPL' },
                  { label: '🎵 Hindi Lo-Fi Song', q: 'lo-fi' },
                  { label: '🖼️ Midjourney Portrait', q: 'Midjourney' },
                  { label: '🎙️ AI Voice Clone', q: 'ElevenLabs' },
                  { label: '🤖 AI Avatar Video', q: 'HeyGen' },
                ].map((s) => (
                  <button
                    key={s.q}
                    onClick={() => { setQuery(s.q); setSelectedCategory(undefined); }}
                    className="px-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-full text-neutral-600 hover:border-neutral-300 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer font-medium"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {debouncedQuery ? (
                // Google-Style List View for active searches
                <div className="space-y-8 max-w-3xl text-left">
                  {visibleTrends.map((trend) => (
                    <div key={trend.id} className="group">
                      <Link to={`/trend/${trend.slug}`} className="block">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#202124] mb-1">
                          <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                            <span className="text-[8px]">🎯</span>
                          </div>
                          <span>ViralAI Hub</span>
                          <ChevronRight size={10} className="text-neutral-400" />
                          <span className="text-neutral-500">{trend.category?.name || 'Guide'}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium text-[#1a0dab] group-hover:underline mb-1">
                          {trend.title}
                        </h3>
                        <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                          {trend.short_description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {trend.tools?.map((t) => (
                            <button 
                              key={t} 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuery(t);
                              }}
                              className="text-[10px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black px-2 py-0.5 rounded-sm transition-colors cursor-pointer border-0"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                // Grouped Cards View for browsing
                <div className="space-y-12">
                  {Object.entries(
                    searchResults.reduce((acc, trend) => {
                      const catName = trend.category?.name || 'Other';
                      if (!acc[catName]) acc[catName] = [];
                      acc[catName].push(trend);
                      return acc;
                    }, {} as Record<string, typeof searchResults>)
                  ).map(([categoryName, items]) => {
                    const limit = categoryLimits[categoryName] || INITIAL_CATEGORY_COUNT;
                    const visibleItems = items.slice(0, limit);
                    const hasMoreInCategory = limit < items.length;

                    return (
                      <div key={categoryName} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                          <h3 className="font-heading text-sm md:text-base font-bold text-[#17171c]">{categoryName}</h3>
                          <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-medium">
                            {items.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                          {visibleItems.map((trend, idx) => (
                            <TrendCard key={trend.id} trend={trend} delayIndex={idx % LOAD_MORE_CATEGORY_COUNT} />
                          ))}
                        </div>
                        {hasMoreInCategory && (
                          <div className="flex justify-center pt-2">
                            <button
                              onClick={() => setCategoryLimits(prev => ({
                                ...prev,
                                [categoryName]: (prev[categoryName] || INITIAL_CATEGORY_COUNT) + LOAD_MORE_CATEGORY_COUNT
                              }))}
                              className="px-6 py-2 text-[11px] font-semibold text-[#17171c] bg-white border border-neutral-200 rounded-full hover:border-neutral-400 hover:bg-neutral-50 transition-all cursor-pointer"
                            >
                              Load More {categoryName}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Global Load More (Only for list view) */}
              {hasMore && debouncedQuery && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="px-8 py-2.5 text-xs font-semibold text-[#17171c] bg-white border border-neutral-200 rounded-full hover:border-neutral-400 hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    Load More Results
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </>
  );
};
export default Search;
