import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Globe, Users, Target, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';

export const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Democratizing Creation',
      desc: 'We believe advanced AI content creation tools should be accessible to everyone, not just those with technical prompting expertise.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      desc: 'Connecting creators from around the world to share workflows, templates, and inspiration to push the boundaries of digital art.'
    },
    {
      icon: Users,
      title: 'Creator First',
      desc: 'Our guides are built, tested, and optimized specifically to help everyday creators drive virality and engagement.'
    },
    {
      icon: Shield,
      title: 'Verified Quality',
      desc: 'Every prompt and step-by-step tutorial uploaded to the hub is manually verified by our team to guarantee production-ready results.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Mission & Story | ViralAI Hub</title>
        <meta name="description" content="Learn about our mission to democratize viral AI content generation. We build verified step-by-step guides for creators globally." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-white text-[#17171c] py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {/* Header */}
          <div className="space-y-6 text-center md:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex px-3 py-1 rounded-full border border-neutral-200 bg-[#eeece7]/50 text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-500"
            >
              Our Mission
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl font-bold leading-none tracking-tight text-[#17171c]"
            >
              Democratizing <br className="hidden sm:block" />
              <span className="text-[#ff7759]">AI Content Creation</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#616161] font-light leading-relaxed max-w-2xl"
            >
              ViralAI Hub was founded with a single goal: to decode the complex, rapidly evolving landscape of viral AI digital art and hand the keys to everyday creators. We analyze the internet's most viral visual and audio trends, extracting the underlying prompt configurations and tool setups into simple, actionable steps.
            </motion.p>
          </div>

          {/* Core Values Grid */}
          <div className="space-y-8">
            <div className="border-b border-neutral-200 pb-4 text-left">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#17171c]">Our Values</h2>
              <p className="text-xs text-[#616161] font-medium">The principles guiding our platform and curation process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <Card hoverEffect={false} className="p-6 h-full flex flex-col justify-between bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-300">
                      <div className="space-y-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#eeece7] border border-neutral-200 flex items-center justify-center text-[#17171c] shrink-0 shadow-sm">
                          <Icon size={18} />
                        </div>
                        <h3 className="font-heading text-base font-semibold text-[#17171c] leading-tight">
                          {v.title}
                        </h3>
                        <p className="text-xs text-[#616161] leading-relaxed font-light">
                          {v.desc}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Cohere Deep Green Band Callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-3xl p-8 bg-[#003c33] border border-transparent flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
          >
            {/* Decorative mesh circle */}
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-xl" />
            
            <div className="space-y-2 relative z-10 text-center md:text-left max-w-lg">
              <h3 className="font-heading text-xl font-medium text-white leading-tight">
                Want to help shape the future of AI art?
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                We are always looking for passionate prompt engineering experts and video editors to join our community and contribute high-quality workflows.
              </p>
            </div>
            
            <a 
              href="/contact" 
              className="relative z-10 bg-white hover:bg-neutral-100 text-[#003c33] px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 select-none shrink-0 shadow-sm"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default About;
