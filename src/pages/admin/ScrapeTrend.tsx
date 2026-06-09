import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Globe, 
  Key, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  FileText, 
  Terminal, 
  Link2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { scrapeAndExtractTrend } from '../../services/firecrawl';
import type { ExtractedTrend } from '../../services/firecrawl';

export const ScrapeTrend = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // Inputs
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saveKeyToBrowser, setSaveKeyToBrowser] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);

  // Scraper State
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedTrend | null>(null);

  // Load API Key from environment or localStorage on mount
  useEffect(() => {
    const localKey = localStorage.getItem('firecrawl_api_key');
    const envKey = import.meta.env.VITE_FIRECRAWL_API_KEY || '';
    
    if (localKey) {
      setApiKey(localKey);
    } else if (envKey) {
      setApiKey(envKey);
    }
  }, []);

  const stepsList = [
    { label: 'Connecting to Firecrawl service...', desc: 'Initiating API request and validating API keys.' },
    { label: 'Fetching page & parsing layout...', desc: 'Reading the content of the target webpage.' },
    { label: 'Running structured prompt extraction...', desc: 'Firecrawl LLM is extracting steps, prompts, and tools.' },
    { label: 'Structuring fields & formatting...', desc: 'Converting the extracted details to database structure.' }
  ];

  // Simulated progress transitions to make the loading experience feel responsive and alive
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'loading') {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 3) {
            return prev + 1;
          }
          return prev;
        });
      }, 5000); // Shift simulated progress step every 5 seconds
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl) {
      toast.show('Please enter a target URL to scrape.', 'info');
      return;
    }
    if (!apiKey) {
      toast.show('Please provide your Firecrawl API Key.', 'info');
      return;
    }

    // Save key if chosen
    if (saveKeyToBrowser) {
      localStorage.setItem('firecrawl_api_key', apiKey);
    } else {
      localStorage.removeItem('firecrawl_api_key');
    }

    try {
      setStatus('loading');
      setErrorMsg('');
      setExtractedData(null);
      setCurrentStep(0);

      // Call API
      const results = await scrapeAndExtractTrend(scrapeUrl, apiKey);
      
      // Grab first extracted trend
      const trend = results[0];
      setExtractedData(trend);
      setStatus('success');
      toast.show('Trend extracted successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred while scraping. Please verify your URL and API Key.');
      toast.show('Extraction failed.', 'info');
    }
  };

  const handleImport = () => {
    if (!extractedData) return;
    
    // Redirect to TrendForm with prefilled state
    navigate('/admin/trends/new', { 
      state: { prefilledData: extractedData } 
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Trend Scraper | Admin | ViralAI Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6 pt-24">
        
        {/* Back Link */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="space-y-1">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center space-x-1.5 text-xs text-textMuted hover:text-textPrimary transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-textPrimary">
              AI Prompt Scraper
            </h1>
          </div>
          <p className="text-[10px] text-textMuted font-mono">POWERED BY FIRECRAWL</p>
        </div>

        {/* Form panel */}
        {status !== 'loading' && status !== 'success' && (
          <div className="max-w-3xl">
            <Card hoverEffect={false} className="p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-border1 pb-4">
                <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-textPrimary">Import AI Guides via Web scraping</h3>
                  <p className="text-xs text-textSecondary mt-0.5">Extract fully structured guide steps, copyable prompts, and tools from any webpage using Firecrawl LLM-based scraping.</p>
                </div>
              </div>

              <form onSubmit={handleScrape} className="space-y-5 text-xs">
                {/* Target URL */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-textSecondary flex items-center gap-1">
                    <Globe size={13} className="text-textMuted" />
                    <span>Target URL to Scrape</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://prompthero.com/prompt/midjourney-neon-action-sports..."
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* API Key */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-textSecondary flex items-center gap-1">
                    <Key size={13} className="text-textMuted" />
                    <span>Firecrawl API Key</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      required
                      placeholder="fc_..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-textMuted hover:text-textPrimary cursor-pointer font-bold uppercase"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 pt-1.5">
                    <input
                      type="checkbox"
                      id="saveKey"
                      checked={saveKeyToBrowser}
                      onChange={(e) => setSaveKeyToBrowser(e.target.checked)}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-opacity-50 cursor-pointer"
                    />
                    <label htmlFor="saveKey" className="text-[10px] text-textSecondary cursor-pointer select-none">
                      Save API key to browser storage for convenience
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="premium"
                    className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold"
                  >
                    <Cpu size={14} />
                    <span>Scrape & Extract Guide</span>
                  </Button>
                </div>
              </form>
            </Card>

            {/* Error Message */}
            {status === 'error' && (
              <div className="mt-6 p-5 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-rose-400 flex items-start space-x-3 text-xs leading-relaxed">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-300">Extraction Failed</h4>
                  <p>{errorMsg}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStatus('idle')} 
                    className="mt-3 h-8 border-rose-500/20 text-rose-300 hover:bg-rose-500/10"
                  >
                    Adjust inputs and try again
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOADING ANIMATED PROGRESS SCREEN */}
        {status === 'loading' && (
          <div className="max-w-2xl py-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
              {/* Spinning Ring */}
              <div className="w-16 h-16 rounded-full border-4 border-white/5" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary border-r-secondary border-transparent animate-spin" />
              
              <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
                <Cpu size={24} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-textPrimary">Extracting AI Prompt Structure</h2>
              <p className="text-xs text-textSecondary max-w-sm">Please wait while Firecrawl connects to the target page, downloads content, and parses data using LLMs.</p>
            </div>

            {/* Steps Progress Checklist */}
            <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-left space-y-4 text-xs">
              {stepsList.map((step, idx) => {
                const isActive = currentStep === idx;
                const isCompleted = currentStep > idx;
                
                return (
                  <div key={idx} className={`flex items-start space-x-3 transition-opacity duration-300 ${
                    isActive ? 'opacity-100 font-medium' : isCompleted ? 'opacity-85' : 'opacity-40'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-t-primary border-r-secondary border-transparent animate-spin mt-0.5 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10 mt-0.5 shrink-0 bg-white/5" />
                    )}
                    
                    <div className="space-y-0.5">
                      <span className={isCompleted ? 'line-through text-textMuted' : isActive ? 'text-primary' : 'text-textSecondary'}>
                        {step.label}
                      </span>
                      {isActive && (
                        <p className="text-[10px] text-textMuted animate-pulse">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXTRACTION PREVIEW SCREEN */}
        {status === 'success' && extractedData && (
          <div className="space-y-8 max-w-4xl animate-fadeIn">
            {/* Control bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-xs">
                <div className="h-8.5 w-8.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-textPrimary">Extraction Preview</h4>
                  <p className="text-[10px] text-textSecondary">Extracted 1 trend successfully. Review results below before editor import.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStatus('idle')}
                  className="h-9 text-xs"
                >
                  Scrape Another
                </Button>
                <Button 
                  variant="premium" 
                  size="sm" 
                  onClick={handleImport}
                  className="h-9 text-xs flex items-center gap-1 font-bold"
                >
                  <span>Import to Editor</span>
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* Left Column: General Info (1 column) */}
              <div className="lg:col-span-1 space-y-6">
                <Card hoverEffect={false} className="p-5 space-y-4">
                  <h4 className="font-heading uppercase tracking-wider text-[10px] font-extrabold text-textPrimary pb-2 border-b border-border1">
                    General details
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-textMuted uppercase font-semibold">Title</span>
                      <div className="font-heading font-extrabold text-sm text-textPrimary">{extractedData.title}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-textMuted uppercase font-semibold">Category</span>
                      <div>
                        <Badge variant="default" className="bg-primary/5 text-primary border-primary/10">
                          {extractedData.category_name}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-textMuted uppercase font-semibold">Difficulty</span>
                      <div>
                        <Badge variant="difficulty" difficulty={extractedData.difficulty} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-textMuted uppercase font-semibold">Tools List</span>
                      <div className="flex flex-wrap gap-1">
                        {extractedData.tools?.map((tool) => (
                          <span key={tool} className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-[10px] font-medium text-textSecondary">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] text-textMuted uppercase font-semibold">Description</span>
                      <p className="text-textSecondary leading-relaxed bg-white/5 border border-white/10 rounded-xl p-3">
                        {extractedData.short_description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Articles List */}
                {extractedData.articles && extractedData.articles.length > 0 && (
                  <Card hoverEffect={false} className="p-5 space-y-4">
                    <h4 className="font-heading uppercase tracking-wider text-[10px] font-extrabold text-textPrimary pb-2 border-b border-border1">
                      Reference Links
                    </h4>
                    <div className="space-y-3">
                      {extractedData.articles.map((art, idx) => (
                        <a 
                          key={idx} 
                          href={art.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-start space-x-2 p-2 rounded-xl border border-white/10 hover:border-primary/20 hover:bg-white/5 transition-colors text-textSecondary hover:text-textPrimary"
                        >
                          <Link2 size={13} className="mt-0.5 text-textMuted shrink-0" />
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="font-bold truncate">{art.title}</div>
                            <div className="text-[9px] text-textMuted truncate">{art.source_name || 'External Link'}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column: Steps & Prompts (2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Steps Section */}
                <Card hoverEffect={false} className="p-5 space-y-5">
                  <h4 className="font-heading uppercase tracking-wider text-[10px] font-extrabold text-textPrimary pb-2 border-b border-border1 flex items-center gap-1.5">
                    <FileText size={13} className="text-secondary" />
                    <span>Instruction Steps ({extractedData.steps?.length || 0})</span>
                  </h4>

                  <div className="space-y-5">
                    {extractedData.steps?.map((step) => (
                      <div key={step.step_number} className="relative pl-7 border-l border-border1/60 space-y-1.5 pb-2">
                        {/* Number bullet */}
                        <div className="absolute -left-3.5 top-0.5 h-6.5 w-6.5 rounded-full bg-primary text-[#07070d] border border-white/20 flex items-center justify-center font-bold font-heading text-xs">
                          {step.step_number}
                        </div>

                        <h5 className="font-bold text-textPrimary text-xs">{step.title}</h5>
                        <p className="text-textSecondary leading-relaxed">{step.description}</p>
                        
                        {step.tip && (
                          <div className="text-[10px] bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-lg p-2 font-medium">
                            <span className="font-bold">Tip:</span> {step.tip}
                          </div>
                        )}
                        {step.warning && (
                          <div className="text-[10px] bg-rose-500/5 text-rose-400 border border-rose-500/10 rounded-lg p-2 font-medium">
                            <span className="font-bold">Warning:</span> {step.warning}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Prompts Section */}
                <Card hoverEffect={false} className="p-5 space-y-5">
                  <h4 className="font-heading uppercase tracking-wider text-[10px] font-extrabold text-textPrimary pb-2 border-b border-border1 flex items-center gap-1.5">
                    <Terminal size={13} className="text-emerald-400" />
                    <span>Copyable Prompt Templates ({extractedData.prompts?.length || 0})</span>
                  </h4>

                  <div className="space-y-4">
                    {extractedData.prompts?.map((p, idx) => (
                      <div key={idx} className="border border-white/10 bg-white/[0.01] rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-border1">
                          <span className="font-bold text-textPrimary">{p.label}</span>
                          <Badge variant="outline" className="text-[9px] uppercase tracking-wider border-white/10 px-2 py-0">
                            {p.tool_name}
                          </Badge>
                        </div>
                        <pre className="monospace-code text-textSecondary bg-white/5 border border-white/10 p-3 rounded-xl overflow-x-auto text-[10px] leading-relaxed max-h-48 whitespace-pre-wrap">
                          {p.prompt_text}
                        </pre>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ScrapeTrend;
