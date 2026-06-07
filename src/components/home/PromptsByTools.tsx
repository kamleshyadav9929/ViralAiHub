import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Image as ImageIcon, Music, Mic, User, Layers, ArrowRight } from 'lucide-react';
import { getToolInfo, getToolGradient } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ToolItem {
  name: string;
  category: string;
  slug: string;
  domain: string;
  color: string;
  bgClass: string;
  icon: React.ComponentType<any>;
}

export const PromptsByTools = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const tools: ToolItem[] = [
    { name: 'Kling AI', category: 'AI Video', slug: 'ai-video', domain: 'klingai.com', color: 'text-sky-500', bgClass: 'bg-sky-50 border-sky-100', icon: Video },
    { name: 'Midjourney', category: 'AI Image', slug: 'ai-image', domain: 'midjourney.com', color: 'text-rose-500', bgClass: 'bg-rose-50 border-rose-100', icon: ImageIcon },
    { name: 'ElevenLabs', category: 'AI Voice', slug: 'ai-voice', domain: 'elevenlabs.io', color: 'text-indigo-500', bgClass: 'bg-indigo-50 border-indigo-100', icon: Mic },
    { name: 'Suno AI', category: 'AI Music', slug: 'ai-music', domain: 'suno.com', color: 'text-emerald-500', bgClass: 'bg-emerald-50 border-emerald-100', icon: Music },
    { name: 'Runway Gen-3', category: 'AI Video', slug: 'ai-video', domain: 'runwayml.com', color: 'text-sky-500', bgClass: 'bg-sky-50 border-sky-100', icon: Video },
    { name: 'HeyGen', category: 'AI Avatar', slug: 'ai-avatar', domain: 'heygen.com', color: 'text-blue-500', bgClass: 'bg-blue-50 border-blue-100', icon: User },
    { name: 'Udio', category: 'AI Music', slug: 'ai-music', domain: 'udio.com', color: 'text-emerald-500', bgClass: 'bg-emerald-50 border-emerald-100', icon: Music },
    { name: 'Magnific AI', category: 'AI Image', slug: 'ai-image', domain: 'magnific.ai', color: 'text-rose-500', bgClass: 'bg-rose-50 border-rose-100', icon: ImageIcon },
    { name: 'Luma Dream Machine', category: 'AI Video', slug: 'ai-video', domain: 'lumalabs.ai', color: 'text-sky-500', bgClass: 'bg-sky-50 border-sky-100', icon: Video },
    { name: 'Stable Diffusion', category: 'AI Image', slug: 'ai-image', domain: 'stability.ai', color: 'text-rose-500', bgClass: 'bg-rose-50 border-rose-100', icon: ImageIcon },
    { name: 'Blender', category: '3D/Animation', slug: '3d-animation', domain: 'blender.org', color: 'text-amber-500', bgClass: 'bg-amber-50 border-amber-100', icon: Layers },
    { name: 'Meshy', category: '3D/Animation', slug: '3d-animation', domain: 'meshy.ai', color: 'text-amber-500', bgClass: 'bg-amber-50 border-amber-100', icon: Layers }
  ];

  const handleToolClick = (toolName: string) => {
    navigate(`/search?tool=${encodeURIComponent(toolName)}`);
  };

  const getBadgeClasses = (category: string) => {
    switch (category) {
      case 'AI Video': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'AI Image': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'AI Voice': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'AI Music': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'AI Avatar': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case '3D/Animation': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Prompts by Tools
          </h2>
          <p className="text-[11px] sm:text-xs text-white/40 font-light leading-none">
            Browse step-by-step prompt templates categorized by the AI tools used.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-7">
        {tools.map((tool) => {
          const info = getToolInfo(tool.name);
          const [imgSrc, setImgSrc] = React.useState(`https://logo.clearbit.com/${info.domain}`);
          const [imgFallbackLevel, setImgFallbackLevel] = React.useState(0); // 0 = Clearbit, 1 = Google Favicon, 2 = Gradient Initials
          const CategoryIcon = tool.icon;

          const handleImgError = () => {
            if (imgFallbackLevel === 0) {
              setImgFallbackLevel(1);
              setImgSrc(`https://www.google.com/s2/favicons?sz=64&domain=${info.domain}`);
            } else if (imgFallbackLevel === 1) {
              setImgFallbackLevel(2);
            }
          };

          const initials = tool.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          const isHovered = hoveredId === tool.name;

          return (
            <motion.div
              key={tool.name}
              onMouseEnter={() => setHoveredId(tool.name)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleToolClick(tool.name)}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-white/[0.03] border border-white/10 hover:border-white/25 rounded-2xl p-4 flex flex-col justify-between h-[132px] cursor-pointer hover:shadow-[0_10px_25px_rgba(255,255,255,0.02)] transition-all duration-300 relative group"
            >
              <div className="space-y-3">
                {/* Logo & Category Badge Row */}
                <div className="flex items-center justify-between">
                  {/* Tool Logo */}
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-1 bg-[#07070d]/50 shadow-sm shrink-0">
                    {imgFallbackLevel < 2 ? (
                      <img
                        src={imgSrc}
                        alt={`${tool.name} Logo`}
                        onError={handleImgError}
                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    ) : (
                      <div className={cn("w-full h-full rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider uppercase", getToolGradient(tool.name))}>
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Category Pill Icon */}
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border shrink-0", getBadgeClasses(tool.category))}>
                    <CategoryIcon size={12} />
                  </div>
                </div>

                {/* Name & Domain info */}
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-semibold text-white group-hover:text-white transition-colors duration-200 truncate">
                    {tool.name}
                  </h4>
                  <p className="text-[9px] text-white/40 font-mono truncate leading-none">
                    {info.domain}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-white/40 font-mono">
                  {tool.category}
                </span>
                
                {/* Quick link indicator */}
                <motion.div
                  animate={{ x: isHovered ? 2 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-white/40 group-hover:text-white transition-colors"
                >
                  <ArrowRight size={11} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default PromptsByTools;
