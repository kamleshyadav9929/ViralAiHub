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
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#17171c] leading-none">
            Recent Reconstructions
          </h2>
          <p className="text-xs text-[#616161] font-light">
            The latest prompt blueprints and step-by-step guides added to the index
          </p>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-2xl">
          <Sparkles className="mx-auto text-neutral-400 mb-4 animate-pulse" size={36} />
          <p className="text-sm font-semibold text-[#17171c]">No resources found.</p>
          <p className="text-xs text-[#616161] mt-1">Check back later or submit a new pipeline.</p>
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
                className="w-full sm:w-auto bg-[#17171c] hover:bg-black text-white rounded-full transition-all border-none font-bold text-xs px-6 py-2.5 shadow-sm"
              >
                Load More Blueprints
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default LatestGrid;
