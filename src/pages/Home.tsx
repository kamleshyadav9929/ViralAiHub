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

      {/* Fixed navbar offset */}
      <div className="pt-12">
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
          <div className="max-w-[1400px] mx-auto w-full">
            {allLoading ? <FeaturedTrendsSkeleton /> : <FeaturedTrends trends={allTrends} />}
          </div>
        </section>

        {/* Section 3: Browse Prompts by Tools */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 border-b border-border2 bg-dot-matrix">
          <div className="max-w-[1400px] mx-auto w-full">
            <PromptsByTools />
          </div>
        </section>

        {/* Section 4: Latest AI Trends (Filter & Grid) */}
        <section className="min-h-screen flex flex-col justify-start py-24 px-6 md:px-12 border-b border-border2 bg-pinstripe-emerald">
          <div className="max-w-[1400px] mx-auto w-full space-y-8">
            {/* Category Filter Pills */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-textSecondary text-left">
                Filter by Category
              </h3>
              <div className="w-full overflow-hidden">
                <div className="flex space-x-2 overflow-x-auto pb-2 px-1 no-scrollbar scroll-smooth">
                  {categoryPills.map((p) => {
                    const isActive = selectedCategory === p.slug;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setSelectedCategory(p.slug)}
                        className="relative px-5 py-2 text-xs font-medium rounded-full focus:outline-none transition-all duration-300 shrink-0 cursor-pointer"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryPill"
                            className="absolute inset-0 bg-primary rounded-full"
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          />
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 border border-border1 rounded-full bg-surface2 hover:bg-surface1 transition-colors" />
                        )}
                        <span className={`relative z-10 ${isActive ? 'text-white font-semibold' : 'text-textSecondary hover:text-textPrimary'}`}>
                          {p.name}
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
          </div>
        </section>

        {/* Section 5: Frequently Asked Questions */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 border-b border-border2 bg-faq-lights">
          <div className="max-w-[1400px] mx-auto w-full">
            <FaqSection />
          </div>
        </section>

        {/* Section 6: Newsletter Subscription */}
        <section className="min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 bg-newsletter-cosmic">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="w-full py-16 px-6 md:px-12 bg-white rounded-3xl overflow-hidden relative border border-border1">
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex p-3 bg-surface3 border border-success/20 rounded-2xl text-success mb-2">
                  <Mail size={24} />
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-heading font-medium text-textPrimary leading-none">
                  Get Weekly Viral AI Prompts
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary font-light leading-relaxed max-w-md mx-auto">
                  Stay ahead of the curve. Get copy-paste templates, new trend alerts, and tutorials sent to your inbox every single week.
                </p>
      
                {subscribed ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center space-x-2 text-emerald-700 font-semibold bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 max-w-sm mx-auto"
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
                      className="flex-1 bg-white border border-border1 rounded-full px-6 py-3 text-xs text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <Button
                      type="submit"
                      disabled={newsLoading}
                      variant="default"
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
