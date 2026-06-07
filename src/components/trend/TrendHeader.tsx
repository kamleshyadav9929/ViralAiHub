import { useState } from 'react';
import { Eye, Calendar, Clock, Share2, Twitter, Check } from 'lucide-react';
import type { Trend } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { getToolInfo } from '../../lib/utils';

interface TrendHeaderProps {
  trend: Trend;
}

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Estimate read time based on steps description length
  const getReadTime = () => {
    const stepsLength = trend.steps?.reduce((sum, s) => sum + (s.description?.length || 0), 0) || 100;
    const minutes = Math.max(2, Math.ceil(stepsLength / 400));
    return `${minutes} min read`;
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Visual Media Showcase */}
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-surface1 border border-border1">
        {trend.video_preview_url ? (
          <video
            src={trend.video_preview_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={trend.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
            alt={trend.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Faint overlay */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Meta Headers */}
      <div className="space-y-4">
        {/* Badges & Share Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {trend.category && (
              <Badge variant="default" className="bg-primary text-white border-transparent font-medium px-4 py-1">
                {trend.category.name}
              </Badge>
            )}
            <Badge variant="difficulty" difficulty={trend.difficulty} className="px-4 py-1" />
            
            {/* Tools list */}
            {trend.tools?.map((tool) => {
              const info = getToolInfo(tool);
              return (
                <span 
                  key={tool} 
                  className="inline-flex items-center gap-1.5 text-xs bg-surface2 border border-border1 text-textSecondary px-3 py-1 rounded-full font-medium"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-border1 flex items-center justify-center overflow-hidden p-0.5 shrink-0 shadow-sm">
                    <img
                      src={`https://logo.clearbit.com/${info.domain}`}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.includes('clearbit.com')) {
                          img.src = `https://www.google.com/s2/favicons?domain=${info.domain}&sz=32`;
                        } else {
                          img.style.display = 'none';
                        }
                      }}
                    />
                  </span>
                  <span>{tool}</span>
                </span>
              );
            })}
          </div>

          {/* Share Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 h-8 px-4 text-xs font-semibold"
            >
              {shareCopied ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
              <span>{shareCopied ? 'Copied' : 'Copy Link'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareTwitter}
              className="flex items-center gap-1.5 h-8 px-4 text-xs border-border1"
            >
              <Twitter size={12} />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-5xl font-medium text-textPrimary leading-tight tracking-tight">
          {trend.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-textSecondary max-w-4xl font-light leading-relaxed">
          {trend.short_description}
        </p>

        {/* Metadata Details */}
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
