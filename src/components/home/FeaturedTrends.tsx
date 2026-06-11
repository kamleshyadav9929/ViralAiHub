import { useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trend } from '../../types';
import { TrendCard } from '../cards/TrendCard';

interface FeaturedTrendsProps {
  trends: Trend[];
}

export const FeaturedTrends = ({ trends }: FeaturedTrendsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 370; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Filter for featured trends, sorted by overall popularity (views + copies)
  const featured = trends
    .filter(t => t.is_featured)
    .sort((a, b) => ((b.copied_count || 0) + (b.view_count || 0)) - ((a.copied_count || 0) + (a.view_count || 0)));
  
  // To meet the design requirements of showing exactly 8 cards, 
  // duplicate the array items if there are fewer than 8.
  const displayTrends: Trend[] = [];
  if (featured.length > 0) {
    while (displayTrends.length < 8) {
      displayTrends.push(...featured);
    }
  }
  const finalTrends = displayTrends.slice(0, 8).map((t, idx) => ({
    ...t,
    // Add unique key to avoid react duplicate keys warnings
    id: `${t.id}-feat-${idx}`
  }));

  if (featured.length === 0) return null;

  return (
    <section className="w-full py-2 space-y-6 relative z-10">
      
      {/* Title & Scroll Buttons Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#ff7759]/10 text-[#ff7759] p-2 rounded-xl border border-[#ff7759]/25">
            <Flame size={20} className="fill-[#ff7759] animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#17171c] leading-none mb-1">
              Emerging Workflows
            </h2>
            <p className="text-xs text-[#616161] font-medium">
              Curated generative pipelines currently driving digital media trends
            </p>
          </div>
        </div>

        {/* Scroll Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-[#17171c] transition-colors cursor-pointer bg-white"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-[#17171c] transition-colors cursor-pointer bg-white"
            aria-label="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 items-start overflow-x-auto pb-6 pt-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {finalTrends.map((trend, idx) => (
            <div 
              key={trend.id} 
              className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[calc(25%-18px)] shrink-0 snap-start"
            >
              <TrendCard trend={trend} delayIndex={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedTrends;
