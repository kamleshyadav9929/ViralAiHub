import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Send, Check } from 'lucide-react';
import { useTrends } from '../hooks/useTrends';
import { dbService } from '../services/db';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import FeaturedTrends from '../components/home/FeaturedTrends';
import PromptsByTools from '../components/home/PromptsByTools';
import LatestGrid from '../components/home/LatestGrid';
import FaqSection from '../components/home/FaqSection';
import { Button } from '../components/ui/button';
import { FeaturedTrendsSkeleton, LatestGridSkeleton } from '../components/ui/Skeletons';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  // Fetch trends with category filter
  const { trends, loading: trendsLoading } = useTrends({
    categorySlug: selectedCategory,
  });

  // Fetch all trends for stats/featured rows
  const { trends: allTrends, loading: allLoading } = useTrends();

  const getCategoryCount = (slug: string | undefined) => {
    if (slug === undefined) return allTrends.length;
    return allTrends.filter(t => t.category?.slug === slug).length;
  };

  const exploreRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const handleExploreClick = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsLoading(true);
    try {
      await dbService.addSubscriber(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setNewsLoading(false);
    }
  };

  // Structured Data (JSON-LD) for Search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ViralAI Hub',
    'url': window.location.origin,
    'description': 'Discover and master viral AI-generated content trends with step-by-step guides and copy-paste prompt templates.',
  };

  const categoryPills = [
    { name: 'All', slug: undefined },
    { name: 'AI Video', slug: 'ai-video' },
    { name: 'AI Image', slug: 'ai-image' },
    { name: 'AI Music', slug: 'ai-music' },
    { name: 'AI Voice', slug: 'ai-voice' },
    { name: 'AI Avatar', slug: 'ai-avatar' },
    { name: '3D/Animation', slug: '3d-animation' },
  ];

  return (
    <>
      <Helmet>
        <title>ViralAI Hub — Discover Viral AI Trends & Prompts</title>
        <meta name="description" content="Discover viral AI-generated content trends with step-by-step creation guides, copy-paste prompts, and tools for Kling, Midjourney, Suno, and more." />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content="ViralAI Hub — Discover Viral AI Trends & Prompts" />
        <meta property="og:description" content="Discover viral AI-generated content trends with step-by-step creation guides, copy-paste prompts, and tools for Kling, Midjourney, Suno, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ViralAI Hub" />
        <meta property="og:url" content={window.location.origin} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero sits directly at the top with a transparent navbar overlay */}
      <div>
        {/* Section 1: Hero (full screen) */}
        <section className="w-full border-b border-border2">
          <HeroSection onExploreClick={handleExploreClick} />
        </section>

        {/* Stats Bar */}
        <section className="bg-blueprint-grid border-b border-border2">
          <StatsBar />
        </section>
      </div>

      <div ref={exploreRef} className="w-full">
        {/* Section 2: Trending Now */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 border-b border-border2 bg-embers-glow">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto w-full transform-gpu"
          >
            {allLoading ? <FeaturedTrendsSkeleton /> : <FeaturedTrends trends={allTrends} />}
          </motion.div>
        </section>

        {/* Section 3: Browse Prompts by Tools */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 border-b border-border2 bg-dot-matrix">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto w-full transform-gpu"
          >
            <PromptsByTools />
          </motion.div>
        </section>

        {/* Section 4: Latest AI Trends (Filter & Grid) */}
        <section className="min-h-screen flex flex-col justify-start py-24 px-6 md:px-12 border-b border-border2 bg-pinstripe-emerald">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto w-full space-y-8 transform-gpu"
          >
            {/* Category Filter Bar */}
            <div className="py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase font-bold tracking-wider text-white/40 font-mono shrink-0 hidden sm:block">
                  Filter
                </span>
                <div className="flex space-x-2 overflow-x-auto pb-0 px-1 no-scrollbar scroll-smooth">
                  {categoryPills.map((p) => {
                    const isActive = selectedCategory === p.slug;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setSelectedCategory(p.slug)}
                        className="relative px-4 py-1.5 text-xs font-medium rounded-full focus:outline-none transition-all duration-300 shrink-0 cursor-pointer"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryPill"
                            className="absolute inset-0 bg-[#ff7759] rounded-full"
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          />
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-colors" />
                        )}
                        <span className={`relative z-10 ${isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white'}`}>
                          {p.name} <span className="opacity-60 text-[10px] ml-0.5 font-normal">({getCategoryCount(p.slug)})</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Latest Grid with skeleton fallback */}
            {trendsLoading ? (
              <LatestGridSkeleton showHeader={true} />
            ) : (
              <LatestGrid trends={trends} />
            )}
          </motion.div>
        </section>

        {/* Section 5: FAQ */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 border-b border-border2 bg-faq-lights">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto w-full transform-gpu"
          >
            <FaqSection />
          </motion.div>
        </section>

        {/* Section 6: Newsletter Subscription */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 bg-newsletter-cosmic">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="w-full py-16 px-6 md:px-12 bg-white/[0.03] backdrop-blur-md rounded-3xl overflow-hidden relative border border-white/10">
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex p-3 bg-[#ff7759]/10 border border-[#ff7759]/20 rounded-2xl text-[#ff7759] mb-2">
                  <Mail size={24} />
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-heading font-medium text-white leading-none">
                  Get Weekly Viral AI Prompts
                </h2>
                <p className="text-xs sm:text-sm text-white/40 font-light leading-relaxed max-w-md mx-auto">
                  Stay ahead of the curve. Get copy-paste templates, new trend alerts, and tutorials sent to your inbox every single week.
                </p>
      
                {subscribed ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center space-x-2 text-emerald-400 font-semibold bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 max-w-sm mx-auto"
                  >
                    <Check size={16} />
                    <span className="text-xs">Awesome! You've been subscribed.</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <Button
                      type="submit"
                      disabled={newsLoading}
                      variant="premium"
                      className="w-full sm:w-auto h-11 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Send size={12} />
                      <span>Subscribe</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Home;
