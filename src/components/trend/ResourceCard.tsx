import { Youtube, ExternalLink, Link2, Wrench } from 'lucide-react';
import type { Article } from '../../types';
import { Card } from '../ui/card';
import { getToolInfo, getToolGradient } from '../../lib/utils';

interface ResourceCardProps {
  youtubeVideoId?: string;
  articles: Partial<Article>[];
  tools?: string[];
}

export const ResourceCard = ({ youtubeVideoId, articles, tools = [] }: ResourceCardProps) => {
  return (
    <div className="space-y-8">
      {/* YouTube Video Player */}
      {youtubeVideoId && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-textPrimary">
            <Youtube size={16} className="text-rose-600" />
            <h3 className="font-heading text-sm uppercase tracking-wider font-medium">Video Walkthrough</h3>
          </div>
          
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border1 relative bg-surface1">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Reference Articles */}
      {articles && articles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-textPrimary">
            <Link2 size={16} className="text-secondary" />
            <h3 className="font-heading text-sm uppercase tracking-wider font-medium">Reference Links</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((art, idx) => (
              <a
                key={art.id || idx}
                href={art.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="p-4 bg-surface2 hover:bg-surface1 transition-all border border-border1 rounded-xl flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-semibold text-textPrimary line-clamp-1 group-hover:text-white transition-colors duration-300">
                      {art.title || ''}
                    </div>
                    {art.source_name && (
                      <div className="text-[10px] text-textMuted font-medium">
                        Source: {art.source_name}
                      </div>
                    )}
                  </div>
                  <ExternalLink size={12} className="text-textMuted group-hover:text-textPrimary transition-colors shrink-0" />
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tools Section */}
      {tools && tools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-textPrimary">
            <Wrench size={16} className="text-secondary" />
            <h3 className="font-heading text-sm uppercase tracking-wider font-medium">Stack Details</h3>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {tools.map((tool) => {
              const info = getToolInfo(tool);
              const gradient = getToolGradient(tool);
              return (
                <a
                  key={tool}
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-surface2 border border-border1 hover:bg-white hover:border-primary/20 hover:shadow-sm px-3.5 py-2 rounded-xl text-xs text-textSecondary hover:text-textPrimary transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-md bg-white border border-border1 flex items-center justify-center overflow-hidden p-0.5 shrink-0 shadow-sm relative">
                    <img
                      src={`https://logo.clearbit.com/${info.domain}`}
                      alt={`${tool} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.includes('clearbit.com')) {
                          img.src = `https://www.google.com/s2/favicons?domain=${info.domain}&sz=32`;
                        } else {
                          img.style.display = 'none';
                          const fallback = img.parentElement?.querySelector('.fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    <span className={`fallback hidden absolute inset-0 flex items-center justify-center text-[8px] font-bold ${gradient}`}>
                      {tool[0]}
                    </span>
                  </div>
                  <span className="font-semibold">{tool}</span>
                  <ExternalLink size={10} className="text-textMuted group-hover:text-primary transition-colors duration-200" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default ResourceCard;
