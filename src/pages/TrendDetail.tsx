import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Wrench, Sparkles, AlertTriangle, ArrowRight, Eye, Download } from 'lucide-react';
import { useTrendDetail, useTrends } from '../hooks/useTrends';
import { dbService } from '../services/db';
import TrendHeader from '../components/trend/TrendHeader';
import StepCard from '../components/trend/StepCard';
import ResourceCard from '../components/trend/ResourceCard';
import { Tabs } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendDetailSkeleton } from '../components/ui/Skeletons';
import { getToolInfo, getToolGradient } from '../lib/utils';
import { playSuccessSound } from '../lib/sound';

export const TrendDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { trend, loading, error } = useTrendDetail(slug);
  const [activeTab, setActiveTab] = useState('guide');

  // Fetch related trends
  const { trends: allTrends } = useTrends({
    categorySlug: trend?.category?.slug
  });
  
  // Exclude current trend and take top 3
  const relatedTrends = allTrends
    .filter(t => t.id !== trend?.id)
    .slice(0, 3);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = trend ? {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': trend.title,
    'description': trend.short_description,
    'image': trend.thumbnail_url,
    'datePublished': trend.created_at,
    'author': {
      '@type': 'Organization',
      'name': 'ViralAI Hub'
    },
    'dependencies': trend.tools?.join(', ')
  } : null;

  if (loading) {
    return <TrendDetailSkeleton />;
  }

  if (error || !trend) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-full mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#17171c]">Trend Guide Not Found</h2>
        <p className="text-xs text-[#616161] max-w-sm">
          The trend guide you are looking for does not exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="secondary" size="sm" className="mt-4">
            Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  const detailTabs = [
    { id: 'guide', label: 'Step-by-Step Guide' },
    { id: 'resources', label: 'Resources & Links' },
  ];

  return (
    <>
      <Helmet>
        <title>{`${trend.title} — Step-by-Step AI Guide & Prompts | ViralAI Hub`}</title>
        <meta name="description" content={`${trend.short_description || 'Learn how to replicate this viral trend.'} Find copy-paste templates for ${trend.tools?.join(', ')}.`} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={`${trend.title} — Step-by-Step AI Guide & Prompts`} />
        <meta property="og:description" content={`${trend.short_description || 'Learn how to replicate this viral trend.'}`} />
        <meta property="og:image" content={trend.thumbnail_url} />
        <meta property="og:type" content="article" />
        
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <div className="px-6 md:px-12 py-6 pt-16">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-6 text-left">
          <Link to="/" className="hover:text-[#17171c] transition-colors">Explore</Link>
          <ChevronRight size={10} />
          {trend.category && (
            <>
              <Link to={`/category/${trend.category.slug}`} className="hover:text-[#17171c] transition-colors">
                {trend.category.name}
              </Link>
              <ChevronRight size={10} />
            </>
          )}
          <span className="text-neutral-500 font-semibold truncate max-w-[200px]">
            {trend.title}
          </span>
        </div>

        {/* Main Detail Header */}
        <TrendHeader trend={trend} />

        {/* Main Grid: Details + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          
          {/* Left Side: Tabs + Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab Selector */}
            <Tabs 
              tabs={detailTabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />

            {/* Active Tab Contents */}
            <div className="space-y-6">
              {activeTab === 'guide' && (
                <div className="space-y-6">
                  {trend.steps && trend.steps.length > 0 ? (
                    <>
                      {trend.steps.map((step) => {
                        const stepPrompts = trend.prompts?.filter(p => p.step_number === step.step_number) || [];
                        return <StepCard key={step.id} step={step} prompts={stepPrompts} />;
                      })}

                      {/* Monetization: Get Premium Pack CTA - Cohere Deep Green Band style */}
                      <Card hoverEffect={false} className="relative overflow-hidden bg-[#003c33] border border-transparent p-8 rounded-2xl mt-8 text-white text-left">
                        <div className="relative z-10 space-y-4 max-w-lg">
                          <div className="inline-flex items-center space-x-1.5 text-xs text-[#ff7759] font-mono tracking-widest font-bold uppercase">
                            <Sparkles size={14} />
                            <span>Premium Add-on</span>
                          </div>
                          <h4 className="font-heading text-xl font-medium text-white leading-tight">
                            Want 500+ more templates like these?
                          </h4>
                          <p className="text-xs text-white/75 leading-relaxed font-light">
                            Get instant access to our master database of production-ready prompts, variables configuration, and advanced cinematic editing notes.
                          </p>
                          <Button variant="premium" size="sm" className="flex items-center gap-1.5 font-bold text-xs mt-2">
                            <Download size={12} />
                            Get Premium Pack
                          </Button>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 border border-neutral-200 rounded-2xl">
                      <p className="text-xs text-[#616161]">No steps defined for this guide yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'resources' && (
                <ResourceCard
                  youtubeVideoId={trend.resources?.youtube_video_id}
                  articles={trend.articles || []}
                  tools={trend.tools || []}
                />
              )}
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <div className="space-y-8">
            
            {/* Tools Used Box */}
            <Card hoverEffect={false} className="p-6 space-y-4 bg-white border border-neutral-200 rounded-2xl shadow-sm">
              <h3 className="font-heading text-xs uppercase tracking-wider text-[#17171c] font-bold flex items-center gap-2 text-left border-b border-neutral-100 pb-2">
                <Wrench size={14} className="text-[#ff7759]" />
                <span>Tools Used</span>
              </h3>
              
              <div className="flex flex-col space-y-2.5">
                {trend.tools?.map((tool) => {
                  const info = getToolInfo(tool);
                  const gradient = getToolGradient(tool);
                  return (
                    <a
                      key={tool}
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 border border-neutral-200/60 hover:border-neutral-300 transition-all duration-300 text-xs font-semibold text-neutral-600 hover:text-[#17171c] group/tool"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Real icon wrapper */}
                        <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-sm relative">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${info.domain}&sz=64`}
                            alt={`${tool} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.style.display = 'none';
                              const fallback = img.parentElement?.querySelector('.fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                          <span className={`fallback hidden absolute inset-0 flex items-center justify-center text-[10px] font-bold ${gradient}`}>
                            {tool[0]}
                          </span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-[#17171c] text-xs leading-none mb-1">{tool}</span>
                          <span className="text-[10px] text-neutral-400 font-light leading-none">{info.domain}</span>
                        </div>
                      </div>
                      <ChevronRight size={12} className="text-neutral-400 group-hover/tool:text-black transition-colors transform group-hover/tool:translate-x-0.5 duration-200" />
                    </a>
                  );
                })}
              </div>
            </Card>

            {/* Related Trends Box */}
            {relatedTrends.length > 0 && (
              <Card hoverEffect={false} className="p-6 space-y-4 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                <h3 className="font-heading text-xs uppercase tracking-wider text-[#17171c] font-bold flex items-center gap-2 text-left border-b border-neutral-100 pb-2">
                  <Sparkles size={14} className="text-[#ff7759]" />
                  <span>Related Guides</span>
                </h3>

                <div className="flex flex-col space-y-4">
                  {relatedTrends.map((rel) => (
                    <Link 
                      key={rel.id} 
                      to={`/trend/${rel.slug}`}
                      className="flex space-x-3 group/item border-b border-neutral-100 last:border-b-0 pb-3 last:pb-0"
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <img 
                          src={rel.thumbnail_url} 
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <h4 className="text-xs font-semibold text-[#17171c] leading-tight group-hover/item:text-[#ff7759] transition-colors duration-200 line-clamp-2">
                          {rel.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-neutral-400">
                          <span className="flex items-center gap-0.5">
                            <Eye size={10} />
                            {rel.view_count}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#1863dc]">{rel.difficulty}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Try Prompt Box */}
            {trend.prompts && trend.prompts.length > 0 && (
              <Card hoverEffect={false} className="p-6 space-y-4 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-sm text-left">
                <h3 className="font-heading text-xs uppercase tracking-wider text-[#17171c] font-bold border-b border-neutral-200 pb-2">
                  Try this Prompt
                </h3>
                
                <p className="text-[11px] text-neutral-800 line-clamp-4 leading-relaxed monospace-code bg-white p-3 rounded-lg border border-neutral-200">
                  {trend.prompts?.[0]?.prompt_text || ''}
                </p>

                <button
                  onClick={() => {
                    const text = trend.prompts?.[0]?.prompt_text || '';
                    if (text) {
                      navigator.clipboard.writeText(text);
                      playSuccessSound();
                      dbService.incrementCopyCount(trend.id).catch(err => console.error(err));
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 text-xs font-bold py-2 rounded-full border border-[#17171c] text-[#17171c] hover:bg-[#17171c] hover:text-white bg-transparent transition-all cursor-pointer"
                >
                  <span>Quick Copy Main Prompt</span>
                  <ArrowRight size={12} />
                </button>
              </Card>
            )}

          </div>
        </div>
      </div>
    </>
  );
};
export default TrendDetail;
