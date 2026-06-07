import { useState } from 'react';
import { Lightbulb, AlertTriangle, Copy, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Step, Prompt } from '../../types';
import { Card } from '../ui/card';
import { dbService } from '../../services/db';
import { playSuccessSound } from '../../lib/sound';

interface EditablePromptBlockProps {
  prompt: Partial<Prompt>;
}

const EditablePromptBlock = ({ prompt }: EditablePromptBlockProps) => {
  const [text, setText] = useState(prompt.prompt_text || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
    
    if (prompt.trend_id) {
      dbService.incrementCopyCount(prompt.trend_id).catch(err => console.error(err));
    }
  };

  return (
    <div className={`border rounded-xl overflow-hidden mt-3 bg-surface1 transition-all duration-300 ${
      copied ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-border1'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface2 border-b border-border1 text-xs select-none">
        <div className="flex items-center space-x-2 text-textSecondary">
          <Terminal size={12} className="text-[#ff7759]" />
          <span className="font-semibold text-white">{prompt.label}</span>
          {prompt.tool_name && (
            <>
              <span className="text-white/40">•</span>
              <span className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-[10px] text-white font-medium">
                {prompt.tool_name}
              </span>
            </>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-textSecondary hover:text-textPrimary flex items-center space-x-1 hover:bg-surface2 px-2 py-1 rounded transition-colors cursor-pointer bg-transparent border-0 outline-none"
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

      {/* Code Text Area */}
      <div className="p-3 bg-[#07070d]/50">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={Math.max(2, Math.min(8, text.split('\n').length))}
          className="w-full text-xs md:text-sm font-mono text-white bg-transparent border-0 outline-none resize-y focus:ring-0 leading-relaxed font-light"
          placeholder="Customize prompt text here..."
        />
        <div className="text-[10px] text-white/40 mt-1.5 flex justify-between items-center select-none border-t border-white/5 pt-1.5">
          <span>Edit this prompt above before copying</span>
          <span className="font-mono text-white/40">{text.length} chars</span>
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: Partial<Step>;
  prompts?: Partial<Prompt>[];
}

export const StepCard = ({ step, prompts = [] }: StepCardProps) => {
  return (
    <Card 
      hoverEffect={false} 
      className="border-l-4 border-l-primary border-border1 rounded-r-xl rounded-l-none bg-surface2"
    >
      <div className="p-6 space-y-4">
        
        {/* Step Header */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-mono text-sm font-semibold">
            {step.step_number || 1}
          </div>
          <h3 className="font-heading text-base md:text-lg font-medium text-textPrimary leading-none">
            {step.title || ''}
          </h3>
        </div>

        {/* Step Description */}
        <p className="text-xs md:text-sm text-textSecondary leading-relaxed font-light pl-0 sm:pl-11">
          {step.description || ''}
        </p>

        {/* Tip or Warning Boxes */}
        {(step.tip || step.warning) && (
          <div className="pl-0 sm:pl-11 space-y-2">
            {step.tip && (
              <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-xs text-amber-800">
                <Lightbulb size={14} className="shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed"><strong className="font-semibold text-amber-900">Tip: </strong>{step.tip}</p>
              </div>
            )}
            
            {step.warning && (
              <div className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-xs text-rose-800">
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed"><strong className="font-semibold text-rose-900">Caution: </strong>{step.warning}</p>
              </div>
            )}
          </div>
        )}

        {/* Associated Prompts */}
        {prompts && prompts.length > 0 && (
          <div className="pl-0 sm:pl-11 space-y-3">
            {prompts.map((prompt) => (
              <EditablePromptBlock key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}

      </div>
    </Card>
  );
};
export default StepCard;
