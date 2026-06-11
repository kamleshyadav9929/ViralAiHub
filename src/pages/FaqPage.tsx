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

      <div className="relative min-h-[90vh] bg-white text-[#17171c] py-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Faq Section Component */}
          <FaqSection />

          {/* Need More Help callout */}
          <div className="max-w-3xl mx-auto mt-16 border-t border-neutral-200 pt-10 text-left">
            <Card hoverEffect={false} className="p-6 md:p-8 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm">
              <div className="space-y-2 max-w-md">
                <h3 className="font-heading text-lg font-bold text-[#17171c] leading-tight">
                  Still have questions?
                </h3>
                <p className="text-xs text-[#616161] leading-relaxed font-light">
                  If you can't find the answers you're looking for, or if you need assistance replicating an advanced prompt workflow, send a ticket directly to our support inbox.
                </p>
              </div>

              <a
                href="/contact"
                className="inline-flex items-center space-x-2 bg-[#17171c] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-colors duration-300 shrink-0 shadow-sm"
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
