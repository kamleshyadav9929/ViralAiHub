import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Trend } from '../../types';

interface TrendCardProps {
  trend: Trend;
  animateEntry?: boolean;
  delayIndex?: number;
}

export const TrendCard = ({ trend, animateEntry = true, delayIndex = 0 }: TrendCardProps) => {
  return (
    <div
      className={`w-full max-w-[290px] sm:max-w-[320px] md:max-w-[350px] bg-white rounded-[28px] border border-[#eeece7] overflow-hidden transition-all duration-300 relative flex flex-col hover:border-[#d9d9dd] ${
        animateEntry ? 'animate-fade-in opacity-0' : ''
      }`}
      style={{
        animationDelay: `${delayIndex * 0.05}s`
      }}
    >
      {/* Main Container / Thumbnail Frame */}
      <Link to={`/trend/${trend.slug}`} className="p-2.5 w-full block group">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#f8f7f4]">
          <img 
            src={trend.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'} 
            alt={trend.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-95" />

          {/* Text content overlays bottom of image */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <h3 className="font-heading text-base font-semibold leading-tight tracking-tight line-clamp-2 group-hover:underline">
              {trend.title}
            </h3>
          </div>
        </div>
      </Link>

      {/* Opened Content Area (Always Visible) */}
      <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#93939f] font-mono">
            Overview
          </span>
          <p className="text-xs text-[#616161] leading-relaxed font-light line-clamp-3">
            {trend.short_description || 'Step-by-step workflow guide to master this viral AI content style.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#f2f2f2]">
          <Link 
            to={`/trend/${trend.slug}`}
            className="w-full h-9 bg-[#17171c] hover:bg-black text-white text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center justify-center gap-1 transition-all shadow-sm hover:shadow-md"
          >
            <span>View Guide</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};
