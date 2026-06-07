import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, AlertTriangle, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { useTrends } from '../hooks/useTrends';
import { dbService } from '../services/db';
import type { Category as CategoryType } from '../types';
import { CategoryIcon } from '../components/cards/CategoryCard';
import { TrendCard } from '../components/cards/TrendCard';
import { Button } from '../components/ui/button';
import { CategorySkeleton, LatestGridSkeleton } from '../components/ui/Skeletons';

export const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [catLoading, setCatLoading] = useState(true);
  
  // Sort State
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'copied'>('latest');

  // Fetch Category Info
  useEffect(() => {
    async function loadCategory() {
      if (!slug) return;
      try {
        setCatLoading(true);
        const data = await dbService.getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCatLoading(false);
      }
    }
    loadCategory();
  }, [slug]);

  // Fetch trends in this category
  const { trends, loading: trendsLoading } = useTrends({
    categorySlug: slug
  });

  // Sort logic on trends list
  const getSortedTrends = () => {
    const sorted = [...trends];
    if (sortBy === 'views') {
      return sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }
    if (sortBy === 'copied') {
      // Sort by length of first prompt as heuristic
      return sorted.sort((a, b) => {
        const lenA = a.prompts?.[0]?.prompt_text?.length || 0;
        const lenB = b.prompts?.[0]?.prompt_text?.length || 0;
        return lenB - lenA;
      });
    }
    // Latest
    return sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  };

  const sortedTrends = getSortedTrends();

  if (catLoading) {
    return <CategorySkeleton />;
  }

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-full border border-rose-500/20 mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-textPrimary">Category Not Found</h2>
        <p className="text-xs text-textSecondary max-w-sm">
          The category you are looking for does not exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="secondary" size="sm" className="mt-4">
            Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${category.name} AI Trends & Guides | ViralAI Hub`}</title>
        <meta name="description" content={`Explore all viral guides, prompt templates, and walkthroughs for ${category.name}.`} />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6 pt-16">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 text-xs text-textMuted hover:text-textPrimary transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Back to Explore</span>
        </Link>

        {/* Category Hero Banner */}
        <div className="relative w-full p-8 md:p-12 rounded-3xl glass-panel border border-border1 overflow-hidden bg-white">
          {/* Decorative nodes */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
              <CategoryIcon iconName={category.icon} size={28} />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-textPrimary leading-none">
                {category.name}
              </h1>
              <p className="text-sm text-textSecondary max-w-2xl font-light leading-relaxed">
                {category.description || `Browse the hottest guides and copy-paste templates in ${category.name}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar: Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border1 pb-4">
          <div className="text-xs font-semibold text-textSecondary">
            Showing {sortedTrends.length} {sortedTrends.length === 1 ? 'trend' : 'trends'}
          </div>

          {/* Sort Pill Selectors */}
          <div className="flex items-center space-x-2">
            <div className="text-[10px] uppercase font-bold text-textMuted flex items-center gap-1">
              <ArrowUpDown size={10} />
              <span>Sort by:</span>
            </div>
            
            <div className="flex space-x-1 bg-surface1 p-0.5 rounded-full border border-border1">
              {(['latest', 'views', 'copied'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortBy(mode)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                    sortBy === mode
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface2'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {trendsLoading ? (
          <LatestGridSkeleton count={8} showHeader={false} />
        ) : sortedTrends.length === 0 ? (
          <div className="text-center py-20 bg-surface1 border border-border1 rounded-2xl">
            <Compass className="mx-auto text-textMuted mb-4 animate-pulse" size={36} />
            <p className="text-sm font-semibold text-textSecondary">No trends in this category yet.</p>
            <p className="text-xs text-textMuted mt-1">Check back soon or submit a new trend.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {sortedTrends.map((trend, idx) => (
              <TrendCard key={trend.id} trend={trend} delayIndex={idx} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};
export default Category;
