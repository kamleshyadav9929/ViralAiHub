import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

const CYCLING_WORDS = ['AI Videos', 'AI Music', 'AI Images', 'AI Avatars', 'AI Voices', '3D Art'];

const PREVIEW_CARDS = [
  {
    title: 'Anime Portrait Style',
    tag: 'AI Image',
    views: '124k',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    rotate: -7,
    floatDelay: 0,
  },
  {
    title: 'Lo-Fi Music Video',
    tag: 'AI Music',
    views: '89k',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    rotate: 0,
    floatDelay: 0.4,
  },
  {
    title: 'AI Talking Avatar',
    tag: 'AI Video',
    views: '203k',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&auto=format&fit=crop&q=80',
    rotate: 7,
    floatDelay: 0.8,
  },
];

/* ── Primary button: white pill, coral fill on hover ── */
const PrimaryBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      className="relative rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide overflow-hidden cursor-pointer select-none bg-white border-0 outline-none"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#ff7759]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
      <motion.span
        className="relative z-10"
        animate={{ color: hovered ? '#ffffff' : '#07070d' }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

/* ── Secondary button: ghost outline, white glow fill on hover ── */
const SecondaryBtn = ({ children, to }: { children: React.ReactNode; to: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.95 }}
        className="relative rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide overflow-hidden cursor-pointer select-none border border-white/20"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        />
        <motion.span
          className="relative z-10"
          animate={{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </motion.div>
    </Link>
  );
};

/* ── Hero Section ── */
export const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-[#07070d]">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top coral radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px]"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,119,89,0.22) 0%, transparent 65%)' }}
        />
        {/* Centre deep purple glow */}
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(110,80,230,0.07) 0%, transparent 70%)' }}
        />
        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Bottom fade → white (so it bleeds into the StatsBar cleanly) */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>

      {/* ── Upper content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 sm:pt-32">


        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="font-heading font-semibold text-white tracking-tight leading-none text-center select-none"
          style={{ fontSize: 'clamp(44px, 8.5vw, 96px)' }}
        >
          {/* Line 1 — static forever */}
          <div>Discover Viral</div>

          {/* Line 2 — cycling accent word */}
          <div className="mt-1 sm:mt-2 h-[1.12em] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: '60%', filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: '-40%', filter: 'blur(6px)' }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#ff7759] inline-block"
              >
                {CYCLING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed mt-7"
        >
          Step-by-step guides, copy-paste prompts, and the exact tools behind the internet's most viral AI content.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="flex items-center gap-4 mt-9"
        >
          <PrimaryBtn onClick={onExploreClick}>Explore Library</PrimaryBtn>
          <SecondaryBtn to="/submit">Submit a Trend</SecondaryBtn>
        </motion.div>
      </div>

      {/* ── Floating preview cards ── */}
      <div className="relative z-10 mt-28 sm:mt-32 flex items-end justify-center gap-3 sm:gap-5 px-6 w-full max-w-2xl mx-auto">
        {PREVIEW_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 50, rotate: card.rotate }}
            animate={{ opacity: 1, y: 0, rotate: card.rotate }}
            transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gentle float loop */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
            >
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {/* Thumbnail */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Category tag */}
                  <span className="absolute top-2 left-2 bg-[#ff7759] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {card.tag}
                  </span>
                  {/* View count */}
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white/80 text-[8px] font-medium px-2 py-0.5 rounded-full">
                    <Eye size={7} />
                    {card.views}
                  </span>
                </div>
                {/* Card footer */}
                <div className="px-3 py-2.5">
                  <p className="text-white/70 text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                    {card.title}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ── Scroll cue ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={onExploreClick}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer text-white/25 hover:text-white/50 transition-colors"
      >
        <span className="text-[8px] uppercase tracking-[0.2em] font-mono">scroll</span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs"
        >
          ↓
        </motion.span>
      </motion.button>
    </div>
  );
};

export default HeroSection;
