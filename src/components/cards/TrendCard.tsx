import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Trend } from '../../types';
import { VideoPlayerModal } from '../ui/VideoPlayerModal';

interface TrendCardProps {
  trend: Trend;
  animateEntry?: boolean;
  delayIndex?: number;
}

export const TrendCard = ({ trend, animateEntry = true, delayIndex = 0 }: TrendCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div
      className={`w-full max-w-[290px] sm:max-w-[320px] md:max-w-[350px] bg-[#11111a] rounded-[28px] border border-white/10 overflow-hidden transition-all duration-300 relative flex flex-col hover:border-white/25 hover:shadow-[0_15px_40px_rgba(255,255,255,0.02)] ${animateEntry ? 'animate-fade-in opacity-0' : ''
        }`}
      style={{
        animationDelay: `${delayIndex * 0.05}s`
      }}
    >
      {/* Main Container / Thumbnail Frame */}
      <Link to={`/trend/${trend.slug}`} className="p-2.5 w-full block group">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#07070d]">
          {trend.video_preview_url && (
            <button
              onClick={handlePlayClick}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
              title="Play Video Preview"
            >
              <Play size={12} className="fill-white translate-x-[0.5px]" />
            </button>
          )}

          <img
            src={trend.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
            alt={trend.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-95" />

          {/* Text content overlays bottom of image */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <h3 className="font-heading text-base font-semibold leading-tight tracking-tight line-clamp-2 group-hover:text-white transition-colors duration-200">
              {trend.title}
            </h3>
          </div>
        </div>
      </Link>

      {/* Opened Content Area (Always Visible) */}
      <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-semibold tracking-wider text-white/40 font-mono">
            Overview
          </span>
          <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-3">
            {trend.short_description || 'Step-by-step workflow guide to master this viral AI content style.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-white/5">
          <Link
            to={`/trend/${trend.slug}`}
            className="w-full h-9 bg-white/5 hover:bg-white hover:text-[#07070d] text-white text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center justify-center gap-1 transition-all border border-white/10 hover:border-transparent"
          >
            <span>View Guide</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      <VideoPlayerModal
        videoUrl={trend.video_preview_url || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={trend.title}
      />
    </div>
  );
};
