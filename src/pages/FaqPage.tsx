import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';
import FaqSection from '../components/home/FaqSection';
import { Card } from '../components/ui/card';

export const FaqPage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ & Help Center | ViralAI Hub</title>
        <meta name="description" content="Find answers to common questions about ViralAI Hub. Learn how to copy prompts, tools covered, and how to submit new trends." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-[#07070d] text-white py-16 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#ff7759]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Faq Section Component */}
          <FaqSection />

          {/* Need More Help callout */}
          <div className="max-w-3xl mx-auto mt-16 border-t border-white/10 pt-10">
            <Card hoverEffect={false} className="p-6 md:p-8 bg-white/[0.02] border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-2 max-w-md">
                <h3 className="font-heading text-lg font-semibold text-white leading-tight">
                  Still have questions?
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  If you can't find the answers you're looking for, or if you need assistance replicating an advanced prompt workflow, send a ticket directly to our support inbox.
                </p>
              </div>

              <a
                href="/contact"
                className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-[#07070d] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-colors duration-300 shrink-0"
              >
                <Mail size={12} />
                <span>Contact Support</span>
              </a>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;
