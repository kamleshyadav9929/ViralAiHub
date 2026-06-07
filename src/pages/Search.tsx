import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Compass, X, Filter } from 'lucide-react';
import { useTrends } from '../hooks/useTrends';
import { useCategories } from '../hooks/useCategories';
import { TrendCard } from '../components/cards/TrendCard';
import { Button } from '../components/ui/button';
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

  // Fetch results based on filters
  const { trends, loading } = useTrends({
    search: debouncedQuery || undefined,
    categorySlug: selectedCategory,
    difficulty: selectedDifficulty,
    tool: selectedTool,
  });

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border1 pb-6">
          {/* Page Header */}
          <div className="space-y-1.5 shrink-0">
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-textPrimary leading-none">
              Search Prompt Library
            </h1>
            <p className="text-xs text-textSecondary font-light leading-relaxed">
              Search titles, descriptions, prompts, or tool stacks.
            </p>
          </div>

          {/* Search Bar & Toggle Filter Button */}
          <div className="flex items-center gap-3 w-full lg:max-w-2xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-textMuted transition-colors">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                placeholder="Type to search (e.g. cricket, lo-fi lyrics, Midjourney...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-border1 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-textMuted hover:text-textPrimary transition-colors cursor-pointer bg-transparent border-0 outline-none"
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
                  ? 'bg-primary text-white border-primary shadow-sm' 
                  : 'bg-white border-border1 text-textSecondary hover:bg-surface1 hover:text-textPrimary'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {(selectedCategory || selectedDifficulty || selectedTool) && (
                <span className={`w-1.5 h-1.5 rounded-full ${showFilters ? 'bg-white' : 'bg-primary'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="space-y-4 max-w-4xl p-5 md:p-6 bg-white border border-border1 rounded-2xl animate-fade-in">
            
            <div className="flex items-center space-x-2 border-b border-border1 pb-3 mb-4">
              <Filter size={14} className="text-secondary" />
              <h3 className="font-heading text-xs uppercase tracking-wider font-extrabold text-textPrimary">
                Filter Results
              </h3>
              
              {(selectedCategory || selectedDifficulty || selectedTool || query) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] text-primary hover:underline font-bold uppercase ml-auto cursor-pointer bg-transparent border-0 outline-none"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <span className="font-semibold text-textSecondary">Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => {
                    const isActive = selectedCategory === c.slug;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(isActive ? undefined : c.slug)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-primary text-white border-primary'
                            : 'border-border1 text-textSecondary hover:bg-surface1'
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
                <span className="font-semibold text-textSecondary">Difficulty:</span>
                <div className="flex flex-wrap gap-1.5">
                  {difficulties.map((diff) => {
                    const isActive = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(isActive ? undefined : diff)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-primary text-white border-primary'
                            : 'border-border1 text-textSecondary hover:bg-surface1'
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
                <span className="font-semibold text-textSecondary">Tool Used:</span>
                <div className="flex flex-wrap gap-1.5">
                  {popularTools.map((tool) => {
                    const isActive = selectedTool === tool;
                    return (
                      <button
                        key={tool}
                        onClick={() => setSelectedTool(isActive ? undefined : tool)}
                        className={`px-3 py-1 rounded-full border transition-all text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-secondary text-white border-secondary'
                            : 'border-border1 text-textSecondary hover:bg-surface1'
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
          <div className="text-xs font-semibold text-textSecondary border-b border-border1 pb-2">
            Search Results ({trends.length})
          </div>

          {loading ? (
            <LatestGridSkeleton count={8} showHeader={false} />
          ) : trends.length === 0 ? (
            <div className="text-center py-16 bg-surface1 border border-border1 rounded-2xl max-w-3xl">
              <Compass className="mx-auto text-textMuted mb-4" size={32} />
              <p className="text-sm font-semibold text-textSecondary">No matching guides found</p>
              <p className="text-xs text-textMuted mt-1">Try resetting filters or explore these popular searches:</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md mx-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setQuery('IPL'); setSelectedCategory(undefined); }}
                  className="text-[10px] py-1 border-border1"
                >
                  "IPL Cricket Reel"
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setQuery('Hindi'); setSelectedCategory(undefined); }}
                  className="text-[10px] py-1 border-border1"
                >
                  "Hindi Story"
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setQuery('lo-fi'); setSelectedCategory(undefined); }}
                  className="text-[10px] py-1 border-border1"
                >
                  "Lo-Fi Hindi Song"
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
              {trends.map((trend, idx) => (
                <TrendCard key={trend.id} trend={trend} delayIndex={idx} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};
export default Search;
