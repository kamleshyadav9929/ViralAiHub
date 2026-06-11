import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import Grainient from './Grainient';

interface HeroSectionProps {
  onExploreClick: () => void;
}

const PREVIEW_CARDS = [
  {
    title: 'Anime Portrait Style',
    tag: 'AI Image',
    model: 'MIDJOURNEY V6',
    views: '124k',
    img: '/images/hero/anime_portrait_hero.png',
    rotate: -7,
    floatDelay: 0,
  },
  {
    title: 'Lo-Fi Music Video',
    tag: 'AI Music',
    model: 'SUNO AI V4',
    views: '89k',
    img: '/images/hero/lofi_bedroom_hero.png',
    rotate: 0,
    floatDelay: 0.4,
  },
  {
    title: 'AI Talking Avatar',
    tag: 'AI Video',
    model: 'HEYGEN V3',
    views: '203k',
    img: '/images/hero/digital_human_hero.png',
    rotate: 7,
    floatDelay: 0.8,
  },
];

/* ── Primary button: black pill, coral fill on hover ── */
const PrimaryBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      className="relative rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide overflow-hidden cursor-pointer select-none bg-[#17171c] text-white border-0 outline-none shadow-sm w-full sm:w-auto"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#ff7759]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
};

/* ── Secondary button: outline pill, white/light-grey fill on hover ── */
const SecondaryBtn = ({ children, to }: { children: React.ReactNode; to: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.95 }}
        className="relative rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide overflow-hidden cursor-pointer select-none border border-neutral-300 bg-white w-full sm:w-auto text-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-neutral-100"
          initial={{ opacity: 0 }}
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        />
        <motion.span
          className="relative z-10 text-[#616161]"
          animate={{ color: hovered ? '#17171c' : '#616161' }}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Map mouse position to range [-0.08, 0.08] for subtle shift
    const x = ((clientX / w) - 0.5) * 0.16;
    const y = ((clientY / h) - 0.5) * 0.16;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-[#ffffff]"
    >

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <Grainient
          centerX={mousePos.x}
          centerY={mousePos.y}
          color1="#ffffff"
          color2="#fff0ec"
          color3="#eef3f1"
          zoom={1.5}
          timeSpeed={0.06}
          warpStrength={0.3}
          warpFrequency={2.5}
          warpSpeed={1.0}
          grainAmount={0.015}
          className="absolute inset-0"
        />
        {/* Subtle grid lines overlay on top of the gradient */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Bottom fade → warm stone (so it bleeds into the StatsBar cleanly) */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#eeece7] via-[#eeece7]/40 to-transparent" />
      </div>

      {/* ── Upper content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 sm:pt-32">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="font-heading font-semibold text-[#17171c] tracking-tight leading-[1.05] text-center select-none animate-slide-up"
          style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}
        >
          <div>The Open Index for</div>
          <div className="text-[#ff7759] mt-2">Generative Media.</div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[#616161] text-sm sm:text-base max-w-lg mx-auto leading-relaxed mt-7 font-light"
        >
          A curated repository of production pipelines, prompt syntaxes, and step-by-step reconstruction guides for modern digital creators.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-9 w-full sm:w-auto px-4 sm:px-0"
        >
          <PrimaryBtn onClick={onExploreClick}>Browse the Index</PrimaryBtn>
          <SecondaryBtn to="/submit">Contribute a Workflow</SecondaryBtn>
        </motion.div>
      </div>

      <div className="relative z-10 mt-20 sm:mt-24 flex items-end justify-center gap-3 sm:gap-5 px-6 w-full max-w-2xl mx-auto">
        {PREVIEW_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className={`flex-1 min-w-0 ${i !== 1 ? 'hidden sm:block' : ''} max-w-[280px] sm:max-w-none mx-auto`}
            initial={{ opacity: 0, y: 50, rotate: card.rotate }}
            animate={{ opacity: 1, y: 0, rotate: card.rotate }}
            transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gentle float loop */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
            >
              <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-colors">
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] bg-neutral-50">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  {/* Category tag */}
                  <span className="absolute top-2 left-2 bg-[#ff7759] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {card.tag}
                  </span>
                  {/* View count */}
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white/95 text-[8px] font-medium px-2 py-0.5 rounded-full">
                    <Eye size={7} />
                    {card.views}
                  </span>
                </div>
                {/* Card footer */}
                <div className="px-3 py-2.5 bg-white border-t border-neutral-100 flex items-center justify-between">
                  <p className="text-[#17171c] text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                    {card.title}
                  </p>
                  <span className="text-[7.5px] font-bold text-neutral-400 font-mono tracking-wider shrink-0 ml-1">
                    {card.model}
                  </span>
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
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer text-neutral-400 hover:text-[#17171c] transition-colors"
      >
        <span className="text-[8px] uppercase tracking-[0.2em] font-mono font-bold">scroll</span>
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
