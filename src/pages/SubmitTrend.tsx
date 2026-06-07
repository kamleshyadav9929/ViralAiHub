import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Trash2, Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/db';
import { useTrendActions } from '../hooks/useTrends';
import type { Category, Step, Prompt, Article } from '../types';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../components/ui/toast';

export const SubmitTrend = () => {
  const toast = useToast();
  const { createTrend, actionLoading } = useTrendActions();

  // Categories loading
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Wizard Step State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1); // 1 = General, 2 = Steps, 3 = Prompts, 4 = Success

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [toolsInput, setToolsInput] = useState(''); // comma separated
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');

  // Dynamic lists
  const [steps, setSteps] = useState<Partial<Step>[]>([
    { title: '', description: '', tip: '', warning: '' }
  ]);
  const [prompts, setPrompts] = useState<Partial<Prompt>[]>([
    { label: 'Main Prompt', prompt_text: '', tool_name: '' }
  ]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await dbService.getCategories();
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      } catch (err) {
        console.error(err);
        toast.show('Failed to load categories.');
      }
    }
    loadCategories();
  }, []);

  // Dynamic Steps Methods
  const addStep = () => {
    setSteps([...steps, { title: '', description: '', tip: '', warning: '' }]);
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };
  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  // Dynamic Prompts Methods
  const addPrompt = () => {
    setPrompts([...prompts, { label: '', prompt_text: '', tool_name: '' }]);
  };
  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, idx) => idx !== index));
  };
  const handlePromptChange = (index: number, field: keyof Prompt, value: string) => {
    const updated = [...prompts];
    updated[index] = { ...updated[index], [field]: value };
    setPrompts(updated);
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!title || !shortDescription || !categoryId || !toolsInput) {
        toast.show('Please fill in all required general fields.', 'info');
        return;
      }
      setWizardStep(2);
    } else if (wizardStep === 2) {
      const validSteps = steps.filter(s => s.title && s.description);
      if (validSteps.length === 0) {
        toast.show('Please add at least one complete guide step.', 'info');
        return;
      }
      setWizardStep(3);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep === 2) setWizardStep(1);
    else if (wizardStep === 3) setWizardStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validSteps = steps.filter(s => s.title && s.description);
    const validPrompts = prompts.filter(p => p.label && p.prompt_text);

    if (validPrompts.length === 0) {
      toast.show('Please add at least one prompt template.', 'info');
      return;
    }

    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const formData = {
      title,
      slug,
      short_description: shortDescription,
      category_id: categoryId,
      tools,
      difficulty,
      thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      video_preview_url: videoPreviewUrl,
      is_featured: false, // Public submissions are pending verification / dashboard review
      steps: validSteps,
      prompts: validPrompts,
      articles: [] as Partial<Article>[],
    };

    try {
      await createTrend(formData);
      setWizardStep(4);
      toast.show('Trend guide submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.show('Failed to submit trend guide.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit a Trend Guide | ViralAI Hub</title>
        <meta name="description" content="Share your viral AI workflow, prompts, and tutorials with other creators on ViralAI Hub." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-[#07070d] text-white py-24 px-6 md:px-12 overflow-hidden flex flex-col justify-start">
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff7759]/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto w-full space-y-8 relative z-10">
          
          {/* Header */}
          {wizardStep !== 4 && (
            <div className="space-y-4 text-center md:text-left">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-1.5 text-xs text-textMuted hover:text-textPrimary transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Back to Explore</span>
              </Link>
              <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-none tracking-tight">
                Submit an <span className="text-[#ff7759]">AI Trend Guide</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/50 font-light max-w-xl">
                Have you mastered a trending AI generation workflow? Share your step-by-step guides, specific prompts, and settings with our global community.
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          {wizardStep !== 4 && (
            <div className="flex items-center space-x-3 text-xs font-semibold py-4 border-y border-white/10 select-none">
              <div className="flex items-center space-x-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 1 ? 'bg-primary text-[#07070d]' : 'bg-white/10 text-white/40'}`}>1</span>
                <span className={wizardStep === 1 ? 'text-white' : 'text-white/40'}>General Info</span>
              </div>
              <ChevronRight size={12} className="text-white/25" />
              <div className="flex items-center space-x-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 2 ? 'bg-primary text-[#07070d]' : 'bg-white/10 text-white/40'}`}>2</span>
                <span className={wizardStep === 2 ? 'text-white' : 'text-white/40'}>Steps & Tips</span>
              </div>
              <ChevronRight size={12} className="text-white/25" />
              <div className="flex items-center space-x-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep >= 3 ? 'bg-primary text-[#07070d]' : 'bg-white/10 text-white/40'}`}>3</span>
                <span className={wizardStep === 3 ? 'text-white' : 'text-white/40'}>Prompts</span>
              </div>
            </div>
          )}

          {/* Wizard step panels */}
          <div className="space-y-6">
            
            {/* Step 1: General Info */}
            {wizardStep === 1 && (
              <Card hoverEffect={false} className="p-6 md:p-8 bg-white/[0.02] border-white/10 rounded-3xl space-y-6">
                <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-bold pb-2 border-b border-white/5 text-left">
                  General Details
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Title */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-semibold text-textSecondary">Trend Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Retro 90s Anime Video Loop"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-semibold text-textSecondary">Short Description (Max 160 characters) *</label>
                    <textarea
                      maxLength={160}
                      rows={3}
                      required
                      placeholder="Describe what the trend accomplishes and the visual style..."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
                    />
                    <div className="text-right text-[10px] text-white/30">{shortDescription.length}/160</div>
                  </div>

                  {/* Category & Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-textSecondary">Category *</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-[#07070d] border border-white/10 rounded-full px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#07070d]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-textSecondary">Difficulty *</label>
                      <div className="flex space-x-2 bg-white/5 p-1 rounded-full border border-white/10 w-fit">
                        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                          <button
                            key={diff}
                            type="button"
                            onClick={() => setDifficulty(diff)}
                            className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                              difficulty === diff
                                ? 'bg-white text-[#07070d]'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-semibold text-textSecondary">Tools Used (comma-separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Midjourney, Kling AI, CapCut"
                      value={toolsInput}
                      onChange={(e) => setToolsInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-semibold text-textSecondary">Thumbnail Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo..."
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {/* Video Preview URL */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-semibold text-textSecondary">Video Loop Preview URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://assets.mixkit.co/videos/preview..."
                      value={videoPreviewUrl}
                      onChange={(e) => setVideoPreviewUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1 text-xs font-semibold h-10"
                  >
                    <span>Next: Steps & Tips</span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Guide Steps */}
            {wizardStep === 2 && (
              <Card hoverEffect={false} className="p-6 md:p-8 bg-white/[0.02] border-white/10 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-bold">
                    Instructions & Tutorial Steps
                  </h3>
                  
                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white hover:text-[#ff7759] transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    <Plus size={12} />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-6 text-left">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="font-heading font-bold text-white/80">Step #{idx + 1}</span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(idx)}
                            className="text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Step Title */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Step Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Generate character concept still"
                          value={step.title || ''}
                          onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                        />
                      </div>

                      {/* Step Description */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Detailed Instructions *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Provide step-by-step detail of what the creator needs to do in this stage..."
                          value={step.description || ''}
                          onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
                        />
                      </div>

                      {/* Tip & Warning */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-textSecondary">Tip (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Set aspect ratio to --ar 16:9"
                            value={step.tip || ''}
                            onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-textSecondary">Warning (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Avoid setting motion value too high"
                            value={step.warning || ''}
                            onChange={(e) => handleStepChange(idx, 'warning', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs h-10"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1 text-xs font-semibold h-10"
                  >
                    <span>Next: Add Prompts</span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Prompts */}
            {wizardStep === 3 && (
              <Card hoverEffect={false} className="p-6 md:p-8 bg-white/[0.02] border-white/10 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-bold">
                    Prompt Templates
                  </h3>
                  
                  <button
                    type="button"
                    onClick={addPrompt}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white hover:text-[#ff7759] transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    <Plus size={12} />
                    <span>Add Prompt</span>
                  </button>
                </div>

                <div className="space-y-6 text-left">
                  {prompts.map((p, idx) => (
                    <div key={idx} className="relative p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="font-heading font-bold text-white/80">Prompt Template #{idx + 1}</span>
                        {prompts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrompt(idx)}
                            className="text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Label */}
                        <div className="space-y-1.5">
                          <label className="font-semibold text-textSecondary">Prompt Label *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Midjourney Image Prompt"
                            value={p.label || ''}
                            onChange={(e) => handlePromptChange(idx, 'label', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>

                        {/* Tool Name */}
                        <div className="space-y-1.5">
                          <label className="font-semibold text-textSecondary">AI Tool Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Midjourney"
                            value={p.tool_name || ''}
                            onChange={(e) => handlePromptChange(idx, 'tool_name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Prompt Text */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Exact Prompt Text *</label>
                        <textarea
                          rows={5}
                          required
                          placeholder="Paste prompt template or settings code block..."
                          value={p.prompt_text || ''}
                          onChange={(e) => handlePromptChange(idx, 'prompt_text', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 monospace-code text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs h-10"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={actionLoading}
                    variant="premium"
                    className="flex items-center gap-1.5 text-xs font-bold h-10"
                  >
                    <Check size={14} />
                    <span>{actionLoading ? 'Submitting...' : 'Submit Trend Guide'}</span>
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 4: Success Screen */}
            {wizardStep === 4 && (
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto text-center py-16 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Check size={32} className="stroke-[3px]" />
                </div>
                
                <h2 className="font-heading text-3xl font-bold leading-tight">
                  Submission Received!
                </h2>
                
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-sm mx-auto font-light">
                  Thank you for contributing! Your guide has been added to our pending review queue. Once approved by our team, it will go live on the homepage list.
                </p>

                <div className="pt-6 flex justify-center gap-4">
                  <Link to="/">
                    <Button variant="default" className="text-xs font-bold px-6 py-2.5">
                      Back to Library
                    </Button>
                  </Link>
                  <a href="/community">
                    <Button variant="outline" className="text-xs font-bold px-6 py-2.5 border-white/10">
                      Join Community
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default SubmitTrend;
