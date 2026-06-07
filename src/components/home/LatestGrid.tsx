import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Trend } from '../../types';
import { TrendCard } from '../cards/TrendCard';
import { Button } from '../ui/button';

interface LatestGridProps {
  trends: Trend[];
}

export const LatestGrid = ({ trends }: LatestGridProps) => {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const hasMore = trends.length > visibleCount;

  return (
    <div className="w-full py-2 space-y-8 relative z-10">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-heading font-medium text-white leading-none">
            Latest AI Trends
          </h2>
          <p className="text-xs text-white/40 font-medium">
            Explore the newly added prompt templates and step-by-step tutorials
          </p>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-2xl">
          <Sparkles className="mx-auto text-white/40 mb-4 animate-pulse" size={36} />
          <p className="text-sm font-semibold text-white/80">No trends found.</p>
          <p className="text-xs text-white/40 mt-1">Check back later or submit a new trend.</p>
        </div>
      ) : (
        <>
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {trends.slice(0, visibleCount).map((trend, idx) => (
              <TrendCard key={trend.id} trend={trend} delayIndex={idx} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button 
                variant="secondary" 
                onClick={handleLoadMore}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all"
              >
                Load More Trends
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default LatestGrid;
