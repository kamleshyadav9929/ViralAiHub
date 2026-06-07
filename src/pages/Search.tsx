import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
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
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-textMuted hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none"
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
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
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
          <div className="space-y-4 max-w-4xl p-5 md:p-6 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl animate-fade-in">
            
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
              <Filter size={14} className="text-secondary" />
              <h3 className="font-heading text-xs uppercase tracking-wider font-extrabold text-white">
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
            <div className="text-center py-20 max-w-lg mx-auto">
              {/* Illustrated empty state */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-28 h-28">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-border1 animate-[spin_20s_linear_infinite]" />
                  {/* Inner glow circle */}
                  <div className="absolute inset-3 rounded-full bg-surface2 border border-border1 flex items-center justify-center">
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

              <h3 className="font-heading text-xl font-semibold text-textPrimary mb-2">No guides found</h3>
              <p className="text-xs text-textMuted leading-relaxed mb-8 max-w-sm mx-auto">
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
                    className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-full text-white/60 hover:border-white/25 hover:text-white hover:bg-white/10 transition-all cursor-pointer font-medium"
                  >
                    {s.label}
                  </button>
                ))}
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
