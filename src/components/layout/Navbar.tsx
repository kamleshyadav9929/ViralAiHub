import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, ChevronDown, Video, Image, Music, Mic, User, Layers, HelpCircle, Users, Globe, ShieldCheck, Mail, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredSubIndex, setHoveredSubIndex] = useState<number>(0);
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isDarkTheme = isHomePage && !isScrolled;
  const showNavbar = true;

  const handleMenuHover = (index: number) => {
    setHoveredMenuIndex(index);
    setHoveredSubIndex(0);
  };

  // Monitor scroll depth to apply subtle Aave floating layout styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navItems = [
    { name: 'Categories', index: 0 },
    { name: 'Resources', index: 1 },
    { name: 'Company', index: 2 },
  ];

  const categoriesList = [
    { name: 'AI Video', path: '/category/ai-video', desc: 'Create cinematic videos with Kling, Runway, Veo', icon: Video, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(56, 189, 248)' },
    { name: 'AI Image', path: '/category/ai-image', desc: 'Generate artwork with Midjourney, Photoshop', icon: Image, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(244, 63, 94)' },
    { name: 'AI Music', path: '/category/ai-music', desc: 'Compose beats and songs with Suno, Udio', icon: Music, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(16, 185, 129)' },
    { name: 'AI Voice', path: '/category/ai-voice', desc: 'Clone and synthesize speech with ElevenLabs', icon: Mic, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(99, 102, 241)' },
    { name: 'AI Avatar', path: '/category/ai-avatar', desc: 'Render digital avatars with HeyGen, ChatGPT', icon: User, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(59, 130, 246)' },
    { name: '3D/Animation', path: '/category/3d-animation', desc: 'Generate 3D assets with Meshy, Blender', icon: Layers, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(245, 158, 11)' },
  ];

  const resourcesList = [
    { name: 'Search Guides', path: '/search', desc: 'Find specific AI guides and prompts', icon: Search, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(139, 92, 246)' },
    { name: 'Popular Guides', path: '/', desc: 'Check out the most copied AI workflows', icon: Compass, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(236, 72, 153)' },
    { name: 'FAQ & Help', path: '/faq', desc: 'Answers to common AI creation questions', icon: HelpCircle, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(20, 184, 166)' },
    { name: 'Community', path: '/community', desc: 'Share your AI workflows and prompts', icon: Users, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(249, 115, 22)' },
  ];

  const companyList = [
    { name: 'Our Mission', path: '/about', desc: 'Democratizing viral AI video creation', icon: Globe, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(16, 185, 129)' },
    { name: 'Brand Assets', path: '/brand', desc: 'Download official logos and styles', icon: ShieldCheck, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(99, 102, 241)' },
    { name: 'Contact Us', path: '/contact', desc: 'Get in touch for custom workflows', icon: Mail, color: 'text-slate-600 bg-slate-100/80 border border-border1/30', hex: 'rgb(239, 68, 68)' },
  ];



  return (
    <>
      <div className="w-full fixed top-0 left-0 right-0 z-50 select-none pointer-events-none">
        <motion.header
          layout
          initial={{ y: 0, opacity: 1 }}
          animate={{ 
            y: showNavbar ? 0 : -64, 
            opacity: showNavbar ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "w-full h-12 flex items-center transition-all duration-300",
            showNavbar ? "pointer-events-auto" : "pointer-events-none",
            isDarkTheme
              ? "bg-transparent border-b border-transparent"
              : "bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-sm"
          )}
        >
          <div className="w-full px-6 flex items-center justify-between h-full">
            {/* Logo & Name */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-neutral-200 bg-white">
                <img src="/logo.png" alt="ViralAI Hub Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading text-base md:text-lg font-bold tracking-tight text-[#17171c] transition-colors duration-300">
                ViralAI Hub
              </span>
            </Link>

            {/* Desktop Nav Menus */}
            <nav 
              className="hidden md:flex items-center space-x-6 relative pointer-events-auto h-full"
              onMouseLeave={() => {
                setHoveredMenuIndex(null);
              }}
            >
              {navItems.map((item) => {
                const active = hoveredMenuIndex === item.index;

                return (
                  <div
                    key={item.name}
                    className="relative animate-fade-in h-full flex items-center"
                    onMouseEnter={() => {
                      handleMenuHover(item.index);
                    }}
                  >
                    <button
                      className={cn(
                        "relative px-4 py-1.5 text-sm font-bold rounded-full flex items-center space-x-1 transition-all outline-none cursor-pointer border-0 bg-transparent duration-300",
                        active ? "text-[#17171c]" : "text-[#616161] hover:text-[#17171c]"
                      )}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <ChevronDown size={14} className={cn("relative z-10 transition-transform duration-200", active && "rotate-180")} />
                    </button>

                    {/* Expansive split-pane dropdown relative to this menu item */}
                    <AnimatePresence>
                      {hoveredMenuIndex === item.index && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className={cn(
                            "absolute top-full mt-2 w-[560px] rounded-[24px] p-2 z-50 flex overflow-hidden transition-all duration-300 bg-white border border-[#e5e7eb] shadow-[0px_15px_40px_rgba(0,0,0,0.08)]",
                            item.index === 2 ? "-right-10 origin-top-right" : "-left-10 origin-top-left"
                          )}
                        >
                          {/* Left Column: List */}
                          <div className="flex-1 p-2 flex flex-col gap-1 relative z-10">
                            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider font-mono text-left text-neutral-400 transition-colors duration-300">
                              {hoveredMenuIndex === 0 && 'Guides by Categories'}
                              {hoveredMenuIndex === 1 && 'Resources & Tools'}
                              {hoveredMenuIndex === 2 && 'About ViralAI Hub'}
                            </div>
                            <div className="flex flex-col gap-0.5 relative">
                              {(() => {
                                const currentList = 
                                  hoveredMenuIndex === 0 ? categoriesList :
                                  hoveredMenuIndex === 1 ? resourcesList :
                                  companyList;
                                
                                return currentList.map((subItem, idx) => {
                                  const Icon = subItem.icon;
                                  const isSubHovered = hoveredSubIndex === idx;
                                  const targetPath = subItem.path;

                                  return (
                                    <Link
                                      key={subItem.name}
                                      to={targetPath}
                                      onMouseEnter={() => setHoveredSubIndex(idx)}
                                      className="flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-200 group/cat relative overflow-hidden text-left"
                                    >
                                      {/* Focus highlight bar (Darker Gray) */}
                                      {isSubHovered && (
                                        <motion.div
                                          layoutId="categoryHoverHighlight"
                                          className="absolute inset-0 rounded-xl bg-neutral-100"
                                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                        />
                                      )}
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-colors duration-200 text-neutral-700 bg-neutral-50 border border-neutral-200">
                                        <Icon size={16} />
                                      </div>
                                      <div className="space-y-0.5 text-left relative z-10">
                                        <h4 className="text-xs font-semibold leading-none transition-colors duration-200 text-neutral-900 group-hover/cat:text-neutral-900">
                                          {subItem.name}
                                        </h4>
                                        <p className="text-[10px] leading-tight font-light line-clamp-1 transition-colors duration-200 text-neutral-400">
                                          {subItem.desc}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          {/* Right Column: Colored Display Panel */}
                          {(() => {
                            const currentList = 
                              hoveredMenuIndex === 0 ? categoriesList :
                              hoveredMenuIndex === 1 ? resourcesList :
                              companyList;
                            const activeItem = currentList[hoveredSubIndex] || currentList[0];

                            return (
                              <motion.div
                                layout
                                className="w-[210px] rounded-2xl flex flex-col justify-between p-5 relative overflow-hidden text-white transition-colors duration-300"
                                style={{ backgroundColor: activeItem?.hex }}
                              >
                                {/* Decorative background circle */}
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                  {/* Large icon */}
                                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                    {activeItem?.icon && <activeItem.icon size={20} className="text-white" />}
                                  </div>

                                  <div className="mt-8 space-y-1.5 text-left">
                                    <h3 className="text-sm font-bold font-heading leading-tight tracking-tight">
                                      {activeItem?.name}
                                    </h3>
                                    <p className="text-[9.5px] text-white/90 leading-relaxed font-light">
                                      {hoveredMenuIndex === 0 && `Learn trends, prompts, resources, and steps to master ${activeItem?.name} production.`}
                                      {hoveredMenuIndex === 1 && `Access our premium ${activeItem?.name.toLowerCase()} resources to boost your AI content creation.`}
                                      {hoveredMenuIndex === 2 && `Discover more about ${activeItem?.name.toLowerCase()} and how we build high quality tools.`}
                                    </p>
                                  </div>

                                  <div className="mt-5 text-left">
                                    <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/35 transition-all text-[9px] font-bold tracking-wide uppercase select-none cursor-pointer">
                                      <span>Explore</span>
                                      <span>→</span>
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Search trigger icon on the right (Desktop) */}
            <div className="hidden md:flex items-center">
              <Link to="/search">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full transition-all duration-300 text-[#616161] hover:text-[#17171c] bg-[#eeece7]/50 hover:bg-[#eeece7] border border-[#e5e7eb] hover:border-neutral-300"
                >
                  <Search size={14} />
                </Button>
              </Link>
            </div>

            {/* Mobile Nav Triggers */}
            <div className="flex md:hidden items-center space-x-2 pointer-events-auto">
              <Link to="/search">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-[#616161] hover:bg-neutral-100/50">
                  <Search size={18} />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full text-[#616161] hover:bg-neutral-100/50"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-white pointer-events-auto flex flex-col"
          >
            <div className="w-full px-6 h-12 flex items-center justify-between border-b border-neutral-100 shrink-0">
              <span className="font-heading text-lg font-bold tracking-tight text-[#17171c]">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 bg-[#faf9f6]">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-mono text-left">Categories</h3>
                <div className="grid grid-cols-1 gap-2">
                  {categoriesList.map(cat => (
                    <Link key={cat.name} to={cat.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-neutral-200/60 shadow-sm active:scale-[0.98] transition-transform">
                      <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                        <cat.icon size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-[#17171c] text-sm leading-tight">{cat.name}</span>
                        <span className="text-[10px] text-neutral-400 font-light leading-none mt-1">{cat.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-mono text-left">Resources</h3>
                <div className="grid grid-cols-1 gap-2">
                  {resourcesList.map(res => (
                    <Link key={res.name} to={res.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-neutral-200/60 shadow-sm active:scale-[0.98] transition-transform">
                      <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                        <res.icon size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-[#17171c] text-sm leading-tight">{res.name}</span>
                        <span className="text-[10px] text-neutral-400 font-light leading-none mt-1">{res.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};
export default Navbar;
