import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prompt } from '../../types';
import { Card } from '../ui/card';
import { useToast } from '../ui/toast';
import { playSuccessSound } from '../../lib/sound';

interface PromptCardProps {
  prompt: Partial<Prompt>;
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = prompt.prompt_text || '';
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playSuccessSound();
    toast.show(`Copied ${prompt.label || 'prompt'}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
      hoverEffect={false} 
      className={`border rounded-xl overflow-hidden bg-surface2 transition-all duration-300 ${
        copied ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-border1'
      }`}
    >
      
      {/* Header Info */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface1 border-b border-border1 text-xs">
        <div className="flex items-center space-x-2 text-textSecondary">
          <Terminal size={12} className="text-secondary" />
          <span className="font-semibold text-textPrimary">{prompt.label}</span>
          {prompt.tool_name && (
            <>
              <span className="text-textMuted">•</span>
              <span className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-[10px] text-textPrimary font-medium">
                {prompt.tool_name}
              </span>
            </>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-textSecondary hover:text-textPrimary flex items-center space-x-1 hover:bg-surface1 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-1 text-emerald-600"
              >
                <Check size={12} className="stroke-[3px]" />
                <span className="text-[10px] font-bold">Copied</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-1"
              >
                <Copy size={12} />
                <span className="text-[10px] font-semibold">Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code Text Block */}
      <div className="p-4">
        <pre className="monospace-code text-xs md:text-sm text-textPrimary bg-[#07070d]/50 p-4 rounded-lg border border-border1 whitespace-pre-wrap break-all leading-relaxed select-all">
          {prompt.prompt_text || ''}
        </pre>
      </div>
    </Card>
  );
};
export default PromptCard;
