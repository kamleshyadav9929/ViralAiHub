export interface ExtractedTrend {
  title: string;
  short_description: string;
  category_name: string;
  tools: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: {
    step_number: number;
    title: string;
    description: string;
    tip?: string;
    warning?: string;
  }[];
  prompts: {
    step_number?: number;
    label: string;
    prompt_text: string;
    tool_name?: string;
  }[];
  articles?: {
    title: string;
    url: string;
    source_name?: string;
  }[];
}

interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    extract?: {
      trends?: ExtractedTrend[];
      [key: string]: any;
    };
    [key: string]: any;
  };
  error?: string;
}

/**
 * Request Firecrawl to scrape a webpage and perform structured extraction of trending AI prompts.
 * Uses the Firecrawl v1 API: https://api.firecrawl.dev/v1/scrape
 * 
 * @param url The page URL containing the prompts to scrape
 * @param apiKey Firecrawl API Key
 */
export async function scrapeAndExtractTrend(url: string, apiKey: string): Promise<ExtractedTrend[]> {
  if (!apiKey) {
    throw new Error('Firecrawl API key is required');
  }
  if (!url) {
    throw new Error('Target URL to scrape is required');
  }

  const schema = {
    type: 'object',
    properties: {
      trends: {
        type: 'array',
        description: 'List of viral AI trends or prompt guides extracted from the page.',
        items: {
          type: 'object',
          properties: {
            title: { 
              type: 'string', 
              description: 'A catchy, descriptive title of the viral trend (e.g. "IPL Cinematic AI Reel", "Vintage Lo-fi Animation").' 
            },
            short_description: { 
              type: 'string', 
              description: 'A brief 1-2 sentence overview of what this AI trend is and why it is popular.' 
            },
            category_name: { 
              type: 'string', 
              description: 'The primary category of this trend. Must be one of: "AI Video", "AI Image", "AI Music", "AI Voice", "AI Avatar", "3D/Animation".' 
            },
            tools: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Specific AI tools and software used, e.g., ["Midjourney", "Kling AI", "ElevenLabs", "CapCut"].' 
            },
            difficulty: { 
              type: 'string', 
              enum: ['Beginner', 'Intermediate', 'Advanced'],
              description: 'Difficulty level to reproduce this trend.' 
            },
            steps: {
              type: 'array',
              description: 'Step-by-step instructions detailing the creation process from start to finish.',
              items: {
                type: 'object',
                properties: {
                  step_number: { type: 'integer', description: 'Index starting at 1.' },
                  title: { type: 'string', description: 'Action-oriented title of this step (e.g. "Generate Base Assets in Midjourney").' },
                  description: { type: 'string', description: 'Detailed markdown-friendly description of what to configure, sliders to adjust, or options to set.' },
                  tip: { type: 'string', description: 'Pro-tip for getting better results, optional.' },
                  warning: { type: 'string', description: 'Warning about potential rate limits, errors, or common mistakes, optional.' }
                },
                required: ['step_number', 'title', 'description']
              }
            },
            prompts: {
              type: 'array',
              description: 'The exact prompts, commands, or text configurations used inside the tools for specific steps.',
              items: {
                type: 'object',
                properties: {
                  step_number: { type: 'integer', description: 'The step number this prompt is associated with.' },
                  label: { type: 'string', description: 'Title label of the prompt, e.g., "Midjourney Image Prompt", "Suno Style Tags", "ChatGPT Script Prompt".' },
                  prompt_text: { type: 'string', description: 'The exact prompt code/text copy-pasteable block.' },
                  tool_name: { type: 'string', description: 'Name of the tool, e.g., "Midjourney", "Suno AI", "ElevenLabs".' }
                },
                required: ['label', 'prompt_text', 'tool_name']
              }
            },
            articles: {
              type: 'array',
              description: 'Relevant tutorials, references, or source website links.',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Title of the article or resource page.' },
                  url: { type: 'string', description: 'Absolute HTTP URL of the article.' },
                  source_name: { type: 'string', description: 'Name of the website, e.g. "Kling AI Blog".' }
                },
                required: ['title', 'url']
              }
            }
          },
          required: ['title', 'short_description', 'category_name', 'tools', 'difficulty', 'steps', 'prompts']
        }
      }
    },
    required: ['trends']
  };

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: url,
      formats: ['extract'],
      extract: {
        prompt: 'Identify and extract the list of trending AI prompt guides, including all steps, exact prompt templates, and tools used.',
        schema: schema
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firecrawl API error (Status ${response.status}): ${errorText || response.statusText}`);
  }

  const result: FirecrawlScrapeResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Firecrawl scraping failed');
  }

  const trends = result.data?.extract?.trends;
  if (!trends || !Array.isArray(trends) || trends.length === 0) {
    throw new Error('No structured trends were extracted from this page. Try a different URL or refine the page context.');
  }

  return trends;
}
