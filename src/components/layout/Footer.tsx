import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Check } from 'lucide-react';
import { dbService } from '../../services/db';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await dbService.addSubscriber(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-primary border-t border-border1 py-12 pb-24 md:pb-12 text-white/70 text-sm mt-auto relative z-10">
      <div className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-0.5 bg-white">
              <img src="/logo.png" alt="ViralAI Hub Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading text-lg font-medium text-white tracking-tight">
              ViralAI Hub
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/50 max-w-xs">
            Discover and master the hottest viral AI-generated content. Get step-by-step creation guides, detailed prompt templates, and tutorials.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-white mb-4">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/category/ai-video" className="hover:text-white transition-colors text-white/60">AI Video</Link></li>
            <li><Link to="/category/ai-image" className="hover:text-white transition-colors text-white/60">AI Image</Link></li>
            <li><Link to="/category/ai-music" className="hover:text-white transition-colors text-white/60">AI Music</Link></li>
            <li><Link to="/category/ai-voice" className="hover:text-white transition-colors text-white/60">AI Voice</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors text-white/60">Explore Trends</Link></li>
            <li><Link to="/search" className="hover:text-white transition-colors text-white/60">Search Library</Link></li>
          </ul>
        </div>

        {/* Newsletter Capture */}
        <div className="space-y-4">
          <h4 className="font-heading text-xs uppercase tracking-widest text-secondary">Weekly Prompts</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Get the newest viral AI creation prompts delivered straight to your inbox weekly.
          </p>
          
          {subscribed ? (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <Check size={14} />
              <span>Subscribed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-colors pr-10"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 bg-secondary text-white rounded-full px-3 flex items-center justify-center hover:bg-secondary/90 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={10} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="w-full px-6 md:px-12 border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} ViralAI Hub. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Inspired by Cohere Design</p>
      </div>
    </footer>
  );
};
