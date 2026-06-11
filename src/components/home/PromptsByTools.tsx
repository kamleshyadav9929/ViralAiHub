import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getToolInfo, getToolGradient } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ToolItem {
  name: string;
  category: string;
  slug: string;
  domain: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

const TOOLS: ToolItem[] = [
  { name: 'Kling AI', category: 'Video', slug: 'ai-video', domain: 'klingai.com', accent: 'text-sky-600', accentBg: 'bg-sky-500', accentBorder: 'hover:border-sky-200' },
  { name: 'Midjourney', category: 'Image', slug: 'ai-image', domain: 'midjourney.com', accent: 'text-rose-600', accentBg: 'bg-rose-500', accentBorder: 'hover:border-rose-200' },
  { name: 'ElevenLabs', category: 'Voice', slug: 'ai-voice', domain: 'elevenlabs.io', accent: 'text-indigo-600', accentBg: 'bg-indigo-500', accentBorder: 'hover:border-indigo-200' },
  { name: 'Suno AI', category: 'Music', slug: 'ai-music', domain: 'suno.com', accent: 'text-emerald-600', accentBg: 'bg-emerald-500', accentBorder: 'hover:border-emerald-200' },
  { name: 'Runway Gen-3', category: 'Video', slug: 'ai-video', domain: 'runwayml.com', accent: 'text-sky-600', accentBg: 'bg-sky-500', accentBorder: 'hover:border-sky-200' },
  { name: 'HeyGen', category: 'Avatar', slug: 'ai-avatar', domain: 'heygen.com', accent: 'text-blue-600', accentBg: 'bg-blue-500', accentBorder: 'hover:border-blue-200' },
  { name: 'Udio', category: 'Music', slug: 'ai-music', domain: 'udio.com', accent: 'text-emerald-600', accentBg: 'bg-emerald-500', accentBorder: 'hover:border-emerald-200' },
  { name: 'Magnific AI', category: 'Image', slug: 'ai-image', domain: 'magnific.ai', accent: 'text-rose-600', accentBg: 'bg-rose-500', accentBorder: 'hover:border-rose-200' },
  { name: 'Luma Dream Machine', category: 'Video', slug: 'ai-video', domain: 'lumalabs.ai', accent: 'text-sky-600', accentBg: 'bg-sky-500', accentBorder: 'hover:border-sky-200' },
  { name: 'Stable Diffusion', category: 'Image', slug: 'ai-image', domain: 'stability.ai', accent: 'text-rose-600', accentBg: 'bg-rose-500', accentBorder: 'hover:border-rose-200' },
  { name: 'Blender', category: '3D', slug: '3d-animation', domain: 'blender.org', accent: 'text-amber-600', accentBg: 'bg-amber-500', accentBorder: 'hover:border-amber-200' },
  { name: 'Meshy', category: '3D', slug: '3d-animation', domain: 'meshy.ai', accent: 'text-amber-600', accentBg: 'bg-amber-500', accentBorder: 'hover:border-amber-200' },
];

const ToolCard = ({ tool, onClick }: { tool: ToolItem; onClick: () => void }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const info = getToolInfo(tool.name);
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${info.domain}`;

  const initials = tool.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left bg-white rounded-2xl border border-neutral-200/80 p-3.5 cursor-pointer",
        "transition-all duration-300 ease-out group relative overflow-hidden",
        "hover:shadow-md hover:-translate-y-[2px]",
        tool.accentBorder
      )}
    >
      {/* Left accent bar */}
      <div className={cn(
        "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-300",
        "opacity-0 group-hover:opacity-100",
        tool.accentBg
      )} />

      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-100 flex items-center justify-center shrink-0 bg-neutral-50/80">
          {!imgFailed ? (
            <img
              src={faviconUrl}
              alt={tool.name}
              onError={() => setImgFailed(true)}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <div className={cn(
              "w-full h-full rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wide",
              getToolGradient(tool.name)
            )}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[13px] font-semibold text-neutral-900 truncate leading-none">
              {tool.name}
            </h4>
            <ArrowUpRight 
              size={13} 
              className="text-neutral-300 group-hover:text-neutral-600 transition-colors duration-200 shrink-0 -translate-x-0.5 group-hover:translate-x-0 group-hover:-translate-y-0.5" 
            />
          </div>
          <p className="text-[10px] text-neutral-400 leading-none truncate">
            {info.domain}
          </p>
        </div>
      </div>

      {/* Category label */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100/80">
        <span className={cn("text-[9px] font-semibold uppercase tracking-widest", tool.accent)}>
          {tool.category}
        </span>
      </div>
    </button>
  );
};

export const PromptsByTools = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="text-left">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#17171c] tracking-tight">
          Tools
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Find workflows by the tools you already use.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.name}
            tool={tool}
            onClick={() => navigate(`/search?tool=${encodeURIComponent(tool.name)}`)}
          />
        ))}
      </div>
    </div>
  );
};
export default PromptsByTools;
