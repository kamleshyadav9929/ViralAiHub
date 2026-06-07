import { useState } from 'react';
import { Eye, Calendar, Clock, Share2, Twitter, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Trend } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { getToolInfo } from '../../lib/utils';

interface TrendHeaderProps {
  trend: Trend;
}

// Map category slugs → a vibrant banner gradient
const CATEGORY_GRADIENTS: Record<string, { from: string; via: string; to: string }> = {
  'ai-video':     { from: '#0f0c29', via: '#302b63', to: '#24243e' },
  'ai-image':     { from: '#1a1a2e', via: '#16213e', to: '#0f3460' },
  'ai-music':     { from: '#0a3d0a', via: '#1a5c1a', to: '#003c33' },
  'ai-voice':     { from: '#2c1654', via: '#3d1f7a', to: '#1a0a35' },
  'ai-avatar':    { from: '#1c2b3a', via: '#2d4a6a', to: '#0d1f2d' },
  '3d-animation': { from: '#3a1a00', via: '#6b3300', to: '#2a1200' },
};

const DEFAULT_GRADIENT = { from: '#17171c', via: '#2d2d38', to: '#0a0a0f' };

export const TrendHeader = ({ trend }: TrendHeaderProps) => {
  const toast = useToast();
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    toast.show('Link copied to clipboard!');
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `Check out "${trend.title}" on ViralAI Hub — with step-by-step guides and exact prompts!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getReadTime = () => {
    const stepsLength = trend.steps?.reduce((sum, s) => sum + (s.description?.length || 0), 0) || 100;
    return `${Math.max(2, Math.ceil(stepsLength / 400))} min read`;
  };

  const grad = CATEGORY_GRADIENTS[trend.category?.slug || ''] || DEFAULT_GRADIENT;

  return (
    <div className="w-full space-y-0 rounded-2xl overflow-hidden border border-border1">

      {/* Full-bleed category color banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${grad.from} 0%, ${grad.via} 50%, ${grad.to} 100%)` }}
      >
        {/* Decorative noise circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        {/* Media (video or image) */}
        <div className="relative w-full aspect-[21/9] max-h-[420px]">
          {trend.video_preview_url ? (
            <video
              src={trend.video_preview_url}
              autoPlay loop muted playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src={trend.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
              alt={trend.title}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          {/* Bottom fade into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Overlaid title + badges sitting on the banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              {trend.category && (
                <Badge variant="default" className="bg-white/20 backdrop-blur-sm text-white border-white/20 font-medium px-3 py-0.5 text-[10px]">
                  {trend.category.name}
                </Badge>
              )}
              <Badge variant="difficulty" difficulty={trend.difficulty} className="px-3 py-0.5 text-[10px] bg-white/20 backdrop-blur-sm border-white/20 text-white" />
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-medium text-white leading-tight tracking-tight drop-shadow-lg">
              {trend.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Below-banner content area */}
      <div className="bg-white/[0.03] backdrop-blur-md p-6 md:p-8 space-y-5">

        {/* Description + Share row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <p className="text-sm text-textSecondary max-w-3xl font-light leading-relaxed flex-1">
            {trend.short_description}
          </p>
          <div className="flex items-center space-x-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={handleCopyLink} className="flex items-center gap-1.5 h-8 px-4 text-xs font-semibold">
              {shareCopied ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
              <span>{shareCopied ? 'Copied' : 'Copy Link'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareTwitter} className="flex items-center gap-1.5 h-8 px-4 text-xs border-border1">
              <Twitter size={12} />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Tool badges */}
        {(trend.tools?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2">
            {trend.tools?.map((tool) => {
              const info = getToolInfo(tool);
              return (
                <span key={tool} className="inline-flex items-center gap-1.5 text-xs bg-surface2 border border-border1 text-textSecondary px-3 py-1 rounded-full font-medium">
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-border1 flex items-center justify-center overflow-hidden p-0.5 shrink-0 shadow-sm">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${info.domain}&sz=32`}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                    />
                  </span>
                  <span>{tool}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-textMuted border-t border-border1 pt-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            Published {formatDate(trend.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} />
            {trend.view_count || 0} views
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {getReadTime()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default TrendHeader;
