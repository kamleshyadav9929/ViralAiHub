import { useState, useRef, useEffect } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered) {
      // Unmute for audio categories (AI Music / AI Voice) at soft volume, mute others
      const isAudioCategory = trend.category?.slug === 'ai-music' || trend.category?.slug === 'ai-voice';
      videoRef.current.muted = !isAudioCategory;
      videoRef.current.volume = 0.35; // Soft volume for premium preview feel
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Playback failed or was interrupted (ignore)
        });
      }
    } else {
      // Pause and reset when hover leaves
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, trend.category]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full max-w-[340px] sm:max-w-[320px] md:max-w-[350px] h-[400px] mx-auto bg-white rounded-[28px] border overflow-hidden transition-all duration-500 ease-out relative ${
        isHovered 
          ? 'border-neutral-300 shadow-lg' 
          : 'border-neutral-200 shadow-sm'
      } ${animateEntry ? 'animate-fade-in opacity-0' : ''}`}
      style={{
        animationDelay: `${delayIndex * 0.05}s`
      }}
    >
      {/* Full-bleed Thumbnail Frame */}
      <Link 
        to={`/trend/${trend.slug}`} 
        className="w-full h-full block relative z-10 p-2.5"
      >
        <div className="relative w-full h-[380px] overflow-hidden bg-neutral-100 rounded-[20px]">
          {/* Play Button — top right */}
          {trend.video_preview_url && (
            <button
              onClick={handlePlayClick}
              className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-80'
              }`}
              title="Play Video with Sound"
            >
              <Play size={12} className="fill-white translate-x-[0.5px]" />
            </button>
          )}

          {/* Autoplaying Video Preview */}
          {trend.video_preview_url && (
            <video
              ref={videoRef}
              src={trend.video_preview_url}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 pointer-events-none ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <img
            src={trend.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
            alt={trend.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-90'
            }`}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-20 pointer-events-none" />

          {/* Title overlay — bottom left */}
          <div className="absolute bottom-4 left-4 right-14 text-white z-20 text-left pointer-events-none">
            <h3 className="font-heading text-base font-semibold leading-tight tracking-tight line-clamp-2">
              {trend.title}
            </h3>
          </div>

          {/* Directional Arrow — bottom right, appears on hover */}
          <div
            className={`absolute bottom-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center transition-all duration-400 shadow-lg ${
              isHovered 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-2 scale-90'
            }`}
          >
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </Link>

      <VideoPlayerModal
        videoUrl={trend.video_preview_url || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={trend.title}
      />
    </div>
  );
};
