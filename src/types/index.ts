export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at?: string;
}

export interface Trend {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  category_id?: string;
  tools?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail_url?: string;
  video_preview_url?: string;
  is_featured?: boolean;
  view_count?: number;
  copied_count?: number;
  created_at?: string;
  updated_at?: string;
  
  // Joins
  category?: Category;
  steps?: Partial<Step>[];
  prompts?: Partial<Prompt>[];
  resources?: Resource;
  articles?: Partial<Article>[];
}

export interface Step {
  id: string;
  trend_id: string;
  step_number: number;
  title: string;
  description: string;
  tip?: string;
  warning?: string;
  created_at?: string;
}

export interface Prompt {
  id: string;
  trend_id: string;
  step_number?: number;
  label: string;
  prompt_text: string;
  tool_name?: string;
  created_at?: string;
}

export interface Resource {
  id: string;
  trend_id: string;
  youtube_video_id?: string;
  created_at?: string;
}

export interface Article {
  id: string;
  trend_id: string;
  title: string;
  url: string;
  source_name?: string;
  created_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at?: string;
}

export interface AdminStats {
  totalTrends: number;
  totalViews: number;
  mostCopiedPrompt: string;
  recentlyAdded: Trend[];
}
