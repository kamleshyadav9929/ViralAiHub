import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Flame, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import Grainient from './Grainient';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-center py-12 px-4 overflow-hidden">
      
      {/* Dynamic Liquid Gradient Background - muted neutrals that don't clash with text */}
      <Grainient
        color1="#f5f3ef" // Warm parchment
        color2="#eef1f8" // Cool silver
        color3="#fafaf9" // Near-white base
        timeSpeed={0.10}
        colorBalance={0.05}
        warpStrength={0.4}
        warpFrequency={3.5}
        warpSpeed={0.6}
        warpAmplitude={40.0}
        blendAngle={45.0}
        blendSoftness={0.08}
        rotationAmount={100.0}
        noiseScale={1.0}
        grainAmount={0.025}
        grainScale={1.5}
        contrast={1.05}
        gamma={1.05}
        saturation={0.3}
        zoom={0.85}
        className="grainient-background"
      />
      
      {/* Content Container (Allows events to pass through text to the WebGL canvas) */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center pointer-events-none">
        
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center space-x-2 bg-paleGreen border border-success/15 px-4 py-1.5 rounded-full text-xs font-medium text-success hover:border-success/30 transition-all mb-8 cursor-pointer pointer-events-auto"
        >
          <Flame size={12} className="text-secondary fill-secondary animate-pulse" />
          <span className="font-mono tracking-wide">
            NEW VIRAL AI TRENDS ADDED WEEKLY
          </span>
        </motion.div>

        {/* Main Headlines */}
        <div className="space-y-6 mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl sm:text-6xl md:text-8xl font-normal tracking-tight leading-[1.05] text-textPrimary"
          >
            Discover <span className="text-secondary font-medium font-heading">Viral AI Trends</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm sm:text-lg md:text-xl text-textSecondary max-w-2xl mx-auto font-light leading-relaxed"
          >
            Step-by-step creation guides, exact copy-paste prompts, and tools used for the internet's most viral AI-generated content.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 pointer-events-auto"
        >
          <Button 
            variant="default" 
            size="lg"
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white bg-primary hover:bg-cohereBlack"
          >
            <Sparkles size={16} />
            Explore Library
          </Button>
          
          <Link to="/admin/trends/new" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-border1 hover:bg-surface1"
            >
              Submit a Trend
            </Button>
          </Link>
        </motion.div>

        {/* Animated Scroll Indicator inside content flow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={onExploreClick}
          className="flex flex-col items-center space-y-1 text-textMuted hover:text-textPrimary transition-colors duration-200 cursor-pointer mt-8 pointer-events-auto"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium font-mono">Scroll to Explore</span>
          <ArrowDown size={14} className="animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
