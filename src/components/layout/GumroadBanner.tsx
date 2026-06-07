import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const GumroadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage to see if user dismissed it
    const isDismissed = sessionStorage.getItem('viralai_premium_dismissed');
    if (!isDismissed) {
      // Show banner after 1.5s delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('viralai_premium_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-cohereBlack border-b border-white/10 text-white px-4 py-2 flex items-center justify-between text-xs md:text-sm"
        >
          <div className="flex items-center space-x-2 mx-auto">
            <Sparkles size={16} className="text-secondary animate-pulse" />
            <span>
              <strong>Limited Time offer:</strong> Unlock 500+ premium viral prompts for Midjourney, Suno, and Kling AI!
            </span>
            <a 
              href="https://gumroad.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-secondary font-bold hover:text-white ml-1 transition-colors"
            >
              Get Premium Pack →
            </a>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-textSecondary hover:text-textPrimary p-1 hover:bg-white/5 rounded-full transition-colors cursor-pointer absolute right-3"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
