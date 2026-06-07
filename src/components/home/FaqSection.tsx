import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[20px] border border-[#eeece7] overflow-hidden transition-all duration-300 hover:border-[#d9d9dd]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left font-heading font-medium text-sm sm:text-base text-[#212121] hover:bg-[#faf9f6] transition-colors focus:outline-none cursor-pointer"
      >
        <span className="pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="text-[#93939f] shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.2, delay: 0.05 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.15 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-xs sm:text-sm text-[#616161] leading-relaxed font-light border-t border-[#f2f2f2] pt-4 bg-[#faf9f6]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FaqSection = () => {
  const faqs = [
    {
      question: "What is ViralAI Hub?",
      answer: "ViralAI Hub is a curated repository designed to help creators master trending AI workflows. We break down viral AI-generated reels, images, avatar speaking videos, and lo-fi tracks from platforms like TikTok and Instagram into simple, step-by-step guides and copy-paste templates."
    },
    {
      question: "Which AI tools are covered in the guides?",
      answer: "We support a wide array of state-of-the-art tools, including Kling AI, Midjourney, Suno AI, ElevenLabs, Udio, Runway Gen-3, CapCut, and more. Each guide lists the exact tool stack needed to achieve the result."
    },
    {
      question: "Are the prompts and guides free to use?",
      answer: "Yes, 100%! All workflows, prompts, and tutorials on the hub are completely free. You can copy the prompts directly and use them in your own creative projects."
    },
    {
      question: "How often are new trends added?",
      answer: "We update the library weekly. As soon as a new AI content trend starts gaining viral traction on social media, our researchers test the prompts and upload a verified guide here."
    },
    {
      question: "Can I submit a trend that I found online?",
      answer: "Absolutely! We love community contributions. Click the 'Submit a Trend' button at the top right of the page to submit a new workflow, prompts, and tool details. After review, we'll publish it to the hub."
    }
  ];

  return (
    <section className="w-full py-12 max-w-3xl mx-auto space-y-8 relative z-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-2.5 bg-[#f0eee7] border border-[#d9d9dd] rounded-xl text-[#212121] mb-2">
          <HelpCircle size={18} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-[#212121]">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#616161] font-light max-w-md mx-auto">
          Everything you need to know about replicating viral AI workflows.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
