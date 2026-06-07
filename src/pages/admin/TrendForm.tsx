import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Trash2, Save, Check, ChevronRight } from 'lucide-react';
import { dbService } from '../../services/db';
import { useTrendActions } from '../../hooks/useTrends';
import type { Category, Step, Prompt, Article } from '../../types';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ui/toast';

export const TrendForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { createTrend, updateTrend, actionLoading } = useTrendActions();

  // Categories loading
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Tab State
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'steps' | 'prompts' | 'resources'>('basic');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [toolsInput, setToolsInput] = useState(''); // comma separated
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isFeatured, setIsFeatured] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');

  // Dynamic lists
  const [steps, setSteps] = useState<Partial<Step>[]>([
    { title: '', description: '', tip: '', warning: '' }
  ]);
  const [prompts, setPrompts] = useState<Partial<Prompt>[]>([
    { label: 'Main Prompt', prompt_text: '', tool_name: '' }
  ]);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [articles, setArticles] = useState<Partial<Article>[]>([
    { title: '', url: '', source_name: '' }
  ]);

  // Load categories and initial trend data if editing
  useEffect(() => {
    async function loadData() {
      try {
        const cats = await dbService.getCategories();
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);

        if (id) {
          // Fetch trend details
          // Find the trend by listing or retrieving details
          const trends = await dbService.getTrends();
          const targetTrend = trends.find(t => t.id === id);
          if (targetTrend) {
            const detail = await dbService.getTrendBySlug(targetTrend.slug);
            if (detail) {
              setTitle(detail.title);
              setSlug(detail.slug);
              setShortDescription(detail.short_description || '');
              setCategoryId(detail.category_id || '');
              setToolsInput(detail.tools?.join(', ') || '');
              setDifficulty(detail.difficulty || 'Beginner');
              setIsFeatured(detail.is_featured || false);
              setThumbnailUrl(detail.thumbnail_url || '');
              setVideoPreviewUrl(detail.video_preview_url || '');
              setYoutubeVideoId(detail.resources?.youtube_video_id || '');
              
              if (detail.steps && detail.steps.length > 0) {
                setSteps(detail.steps.map(s => ({
                  title: s.title,
                  description: s.description,
                  tip: s.tip || '',
                  warning: s.warning || ''
                })));
              }
              if (detail.prompts && detail.prompts.length > 0) {
                setPrompts(detail.prompts.map(p => ({
                  label: p.label,
                  prompt_text: p.prompt_text,
                  tool_name: p.tool_name || ''
                })));
              }
              if (detail.articles && detail.articles.length > 0) {
                setArticles(detail.articles.map(a => ({
                  title: a.title,
                  url: a.url,
                  source_name: a.source_name || ''
                })));
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.show('Failed to load form dependencies.');
      }
    }
    loadData();
  }, [id]);

  // Auto-generate slug from title
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    // Auto generate slug only when creating new trend
    if (!id) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

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

  // Dynamic Articles Methods
  const addArticle = () => {
    setArticles([...articles, { title: '', url: '', source_name: '' }]);
  };
  const removeArticle = (index: number) => {
    setArticles(articles.filter((_, idx) => idx !== index));
  };
  const handleArticleChange = (index: number, field: keyof Article, value: string) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [field]: value };
    setArticles(updated);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !categoryId) {
      toast.show('Please fill in all basic info fields.', 'info');
      setActiveFormTab('basic');
      return;
    }

    // Validate steps
    const validSteps = steps.filter(s => s.title && s.description);
    if (validSteps.length === 0) {
      toast.show('Please add at least one step in the Guide tab.', 'info');
      setActiveFormTab('steps');
      return;
    }

    // Validate prompts
    const validPrompts = prompts.filter(p => p.label && p.prompt_text);
    if (validPrompts.length === 0) {
      toast.show('Please add at least one prompt template.', 'info');
      setActiveFormTab('prompts');
      return;
    }

    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formData = {
      title,
      slug,
      short_description: shortDescription,
      category_id: categoryId,
      tools,
      difficulty,
      thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      video_preview_url: videoPreviewUrl,
      is_featured: isFeatured,
      steps: validSteps,
      prompts: validPrompts,
      youtubeVideoId: youtubeVideoId || undefined,
      articles: articles.filter(a => a.title && a.url),
    };

    try {
      if (id) {
        await updateTrend(id, formData);
        toast.show('Trend guide updated successfully!');
      } else {
        await createTrend(formData);
        toast.show('Trend guide created successfully!');
      }
      navigate('/admin/trends');
    } catch (err) {
      console.error(err);
      toast.show('Failed to save trend guide.');
    }
  };

  const formTabs = [
    { id: 'basic', label: 'A. Basic Info' },
    { id: 'steps', label: 'B. Guide Steps' },
    { id: 'prompts', label: 'C. Prompts' },
    { id: 'resources', label: 'D. Resources' }
  ] as const;

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit Trend Guide' : 'Create Trend Guide'} | Admin | ViralAI Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="space-y-1">
            <Link 
              to="/admin/trends" 
              className="inline-flex items-center space-x-1.5 text-xs text-textMuted hover:text-textPrimary transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Listings</span>
            </Link>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-textPrimary">
              {id ? 'Edit Trend Guide' : 'Create Trend Guide'}
            </h1>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={actionLoading}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Save size={14} />
            <span>{actionLoading ? 'Saving...' : 'Save Guide'}</span>
          </Button>
        </div>

        {/* Tab Headers */}
        <div className="flex space-x-1 bg-surface1 p-1 rounded-full border border-border1 max-w-xl">
          {formTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormTab(tab.id)}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                activeFormTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Grid */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 max-w-4xl">
          
          {/* TAB A: BASIC INFO */}
          {activeFormTab === 'basic' && (
            <Card hoverEffect={false} className="p-6 space-y-5 bg-white border border-border1">
              <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-extrabold pb-2 border-b border-border1">
                Section A — General Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="IPL Cinematic AI Reel"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="ipl-cinematic-ai-reel"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Short Description (Max 160 chars)</label>
                  <textarea
                    maxLength={160}
                    rows={3}
                    placeholder="Write a brief overview for search listings..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-2xl px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <div className="text-right text-[10px] text-textMuted">{shortDescription.length}/160</div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-textSecondary">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-textSecondary">Difficulty</label>
                  <div className="flex space-x-2 bg-surface1 p-1 rounded-full border border-border1 w-fit">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                          difficulty === diff
                            ? 'bg-primary text-white'
                            : 'text-textSecondary hover:text-textPrimary'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tools Used */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Tools Used (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Midjourney, Kling AI, ElevenLabs, CapCut"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Thumbnail URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo..."
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                  {thumbnailUrl && (
                    <div className="mt-2 w-48 aspect-video rounded-lg overflow-hidden border border-border1 bg-surface2">
                      <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Video Preview URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-textSecondary">Video Loop Preview URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://assets.mixkit.co/videos/preview..."
                    value={videoPreviewUrl}
                    onChange={(e) => setVideoPreviewUrl(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Is Featured Toggle */}
                <div className="flex items-center space-x-3 sm:col-span-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border1 bg-white text-primary focus:ring-primary focus:ring-opacity-50 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="font-semibold text-textPrimary cursor-pointer select-none">
                    Feature on Homepage?
                  </label>
                </div>

              </div>
            </Card>
          )}

          {/* TAB B: GUIDE STEPS */}
          {activeFormTab === 'steps' && (
            <Card hoverEffect={false} className="p-6 space-y-6 bg-white border border-border1">
              <div className="flex items-center justify-between border-b border-border1 pb-2">
                <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-extrabold">
                  Section B — Step-by-Step Instructions
                </h3>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="flex items-center gap-1 text-[10px] h-7 px-3 border-border1"
                >
                  <Plus size={12} />
                  <span>Add Step</span>
                </Button>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative p-5 rounded-2xl border border-border1 bg-surface1 space-y-4 text-xs">
                    
                    {/* Index & Delete bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-border1">
                      <span className="font-heading font-bold text-primary">Step #{idx + 1}</span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="text-textMuted hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Step Title */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-textSecondary">Step Title</label>
                      <input
                        type="text"
                        required
                        placeholder="Generate Stills in Midjourney"
                        value={step.title || ''}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Step Description */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-textSecondary">Step Description (markdown allowed)</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Provide detailed instructions on what configurations or sliders to adjust..."
                        value={step.description || ''}
                        onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-border1 rounded-2xl px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Tip & Warning */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Tip (Optional)</label>
                        <input
                          type="text"
                          placeholder="Use --style raw --ar 16:9"
                          value={step.tip || ''}
                          onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                          className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Warning/Caution (Optional)</label>
                        <input
                          type="text"
                          placeholder="Keep transitions high; slow transitions look generic"
                          value={step.warning || ''}
                          onChange={(e) => handleStepChange(idx, 'warning', e.target.value)}
                          className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB C: PROMPTS */}
          {activeFormTab === 'prompts' && (
            <Card hoverEffect={false} className="p-6 space-y-6 bg-white border border-border1">
              <div className="flex items-center justify-between border-b border-border1 pb-2">
                <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-extrabold">
                  Section C — Prompt Code Blocks
                </h3>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPrompt}
                  className="flex items-center gap-1 text-[10px] h-7 px-3 border-border1"
                >
                  <Plus size={12} />
                  <span>Add Prompt</span>
                </Button>
              </div>

              <div className="space-y-6">
                {prompts.map((p, idx) => (
                  <div key={idx} className="relative p-5 rounded-2xl border border-border1 bg-surface1 space-y-4 text-xs">
                    
                    {/* Index & Delete bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-border1">
                      <span className="font-heading font-bold text-secondary">Prompt Template #{idx + 1}</span>
                      {prompts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePrompt(idx)}
                          className="text-textMuted hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Label */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Prompt Label</label>
                        <input
                          type="text"
                          required
                          placeholder="Midjourney Image Prompt"
                          value={p.label || ''}
                          onChange={(e) => handlePromptChange(idx, 'label', e.target.value)}
                          className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Tool Name */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-textSecondary">Specific Tool Name</label>
                        <input
                          type="text"
                          placeholder="Midjourney"
                          value={p.tool_name || ''}
                          onChange={(e) => handlePromptChange(idx, 'tool_name', e.target.value)}
                          className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Prompt Text */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-textSecondary">Exact Prompt Text (monospace)</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Paste prompt template here..."
                        value={p.prompt_text || ''}
                        onChange={(e) => handlePromptChange(idx, 'prompt_text', e.target.value)}
                        className="w-full bg-white border border-border1 rounded-2xl px-4 py-2 monospace-code text-textPrimary focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB D: RESOURCES */}
          {activeFormTab === 'resources' && (
            <Card hoverEffect={false} className="p-6 space-y-6 bg-white border border-border1">
              <h3 className="font-heading text-xs uppercase tracking-wider text-textPrimary font-extrabold pb-2 border-b border-border1">
                Section D — Reference Links & YouTube Walkthroughs
              </h3>

              <div className="space-y-6 text-xs">
                {/* YouTube Video ID */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-textSecondary">YouTube Video ID (11 characters)</label>
                  <input
                    type="text"
                    placeholder="dQw4w9WgXcQ"
                    value={youtubeVideoId}
                    onChange={(e) => setYoutubeVideoId(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                  {youtubeVideoId && youtubeVideoId.length === 11 && (
                    <div className="mt-2 w-48 aspect-video rounded-lg overflow-hidden border border-border1 bg-surface2">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="Preview"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border1 pb-2">
                    <span className="font-semibold text-textSecondary">Reference Articles</span>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addArticle}
                      className="flex items-center gap-1 text-[10px] h-7 px-3 border-border1"
                    >
                      <Plus size={12} />
                      <span>Add Article Link</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {articles.map((art, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 border border-border1 rounded-2xl bg-surface1">
                        
                        {/* Title */}
                        <div className="flex-1 space-y-1.5">
                          <label className="font-semibold text-textMuted">Article Title</label>
                          <input
                            type="text"
                            placeholder="Veo 3 Animation Guide"
                            value={art.title || ''}
                            onChange={(e) => handleArticleChange(idx, 'title', e.target.value)}
                            className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        {/* URL */}
                        <div className="flex-1 space-y-1.5">
                          <label className="font-semibold text-textMuted">External URL</label>
                          <input
                            type="text"
                            placeholder="https://deepmind.google/..."
                            value={art.url || ''}
                            onChange={(e) => handleArticleChange(idx, 'url', e.target.value)}
                            className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        {/* Source Name */}
                        <div className="flex-1 space-y-1.5">
                          <label className="font-semibold text-textMuted">Source Name</label>
                          <input
                            type="text"
                            placeholder="Google DeepMind"
                            value={art.source_name || ''}
                            onChange={(e) => handleArticleChange(idx, 'source_name', e.target.value)}
                            className="w-full bg-white border border-border1 rounded-full px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        {/* Delete Row */}
                        {articles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArticle(idx)}
                            className="text-textMuted hover:text-rose-400 transition-colors self-end pb-3.5 cursor-pointer shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Card>
          )}

          {/* Navigation Form Actions */}
          <div className="flex items-center justify-between border-t border-border1 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (activeFormTab === 'steps') setActiveFormTab('basic');
                if (activeFormTab === 'prompts') setActiveFormTab('steps');
                if (activeFormTab === 'resources') setActiveFormTab('prompts');
              }}
              disabled={activeFormTab === 'basic'}
              className="text-xs h-9"
            >
              Previous Tab
            </Button>
            
            {activeFormTab !== 'resources' ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (activeFormTab === 'basic') setActiveFormTab('steps');
                  else if (activeFormTab === 'steps') setActiveFormTab('prompts');
                  else if (activeFormTab === 'prompts') setActiveFormTab('resources');
                }}
                className="text-xs h-9 flex items-center gap-1.5"
              >
                <span>Next Tab</span>
                <ChevronRight size={12} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={actionLoading}
                variant="premium"
                className="text-xs h-9 flex items-center gap-1.5"
              >
                <Check size={12} />
                <span>{id ? 'Save Changes' : 'Create Trend'}</span>
              </Button>
            )}
          </div>

        </form>
      </div>
    </>
  );
};
export default TrendForm;
