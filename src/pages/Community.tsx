import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/card';

export const Community = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Active Discord Channels',
      desc: 'Join 5,000+ AI prompt engineers, editors, and sound designers. Share workflows, get feedback, and collaborate in real-time.'
    },
    {
      icon: Award,
      title: 'Weekly Creator Spotlights',
      desc: 'We highlight outstanding creators who replicate or extend our workflows on TikTok, Instagram, and YouTube.'
    },
    {
      icon: Sparkles,
      title: 'Exclusive Prompt Drops',
      desc: 'Get access to beta prompt models and experiment data before they are published to the public library.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Community Hub | ViralAI Hub</title>
        <meta name="description" content="Join the ViralAI Hub creator community. Connect with other prompt engineers, share tutorials, and access exclusive prompt drops." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-[#07070d] text-white py-24 px-6 md:px-12 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff7759]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {/* Header */}
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase font-mono tracking-wider font-bold text-white/60">
              Community
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-semibold leading-none tracking-tight">
              Connect with <span className="text-[#ff7759]">Creators</span>
            </h1>
            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-2xl">
              ViralAI Hub is more than just a library — it's a global network of prompt engineers, digital artists, and video editors pushing the limits of generative AI tools.
            </p>
          </div>

          {/* Core Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card hoverEffect={false} className="p-6 h-full flex flex-col justify-between bg-white/[0.02] border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-white leading-tight">
                        {f.title}
                      </h3>
                      <p className="text-[11px] text-white/50 leading-relaxed font-light">
                        {f.desc}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Creator Spotlight Showcase */}
          <div className="space-y-8 border-t border-white/10 pt-12 text-left">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold">Community Spotlight</h2>
              <p className="text-xs text-white/40 font-medium">Amazing creators using our workflow prompt configurations.</p>
            </div>

            <Card hoverEffect={false} className="p-6 bg-white/[0.02] border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-surface1 flex items-center justify-center shrink-0">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Creator Profile" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white">@alexa_visuals</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">Featured Creator</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-white leading-tight">Replicated the "IPL Cricket Reel" template</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  "Using the Kling AI camera path configs from ViralAI Hub, I generated a sports reel that hit 1.2M views on TikTok in 4 days. The copy-paste prompting variables saved me hours of testing."
                </p>
              </div>
            </Card>
          </div>

          {/* Banner Invitation */}
          <div className="rounded-3xl p-8 bg-indigo-950/40 border border-indigo-500/25 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Mesh background glow */}
            <div className="absolute -left-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl" />
            
            <div className="space-y-2 relative z-10 text-center md:text-left max-w-lg">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] uppercase font-bold tracking-wider font-mono">
                <Users size={10} className="mr-0.5" />
                <span>Join Discord</span>
              </div>
              <h3 className="font-heading text-xl font-medium text-white leading-tight">
                Connect with the Discord server
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Unlock exclusive chatrooms for advanced prompt design, daily feedback loops, and announcements.
              </p>
            </div>
            
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors duration-300 select-none shrink-0"
            >
              <span>Join Server</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
