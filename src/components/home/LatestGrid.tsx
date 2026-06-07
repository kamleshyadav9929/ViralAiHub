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
      <div className="flex items-center justify-between border-b border-border1 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-heading font-medium text-textPrimary leading-none">
            Latest AI Trends
          </h2>
          <p className="text-xs text-textSecondary font-medium">
            Explore the newly added prompt templates and step-by-step tutorials
          </p>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="text-center py-20 bg-surface2 border border-border1 rounded-2xl">
          <Sparkles className="mx-auto text-textMuted mb-4 animate-pulse" size={36} />
          <p className="text-sm font-semibold text-textSecondary">No trends found.</p>
          <p className="text-xs text-textMuted mt-1">Check back later or submit a new trend.</p>
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
                className="w-full sm:w-auto"
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
