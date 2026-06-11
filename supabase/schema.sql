-- Create Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create Trends Table
CREATE TABLE trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tools text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  thumbnail_url text,
  video_preview_url text,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Steps Table
CREATE TABLE steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES trends(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  tip text,
  warning text,
  created_at timestamptz DEFAULT now()
);

-- Create Prompts Table
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES trends(id) ON DELETE CASCADE,
  step_number integer,
  label text NOT NULL,
  prompt_text text NOT NULL,
  tool_name text,
  created_at timestamptz DEFAULT now()
);

-- Create Resources Table
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES trends(id) ON DELETE CASCADE,
  youtube_video_id text,
  created_at timestamptz DEFAULT now()
);

-- Create Articles Table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES trends(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  source_name text,
  created_at timestamptz DEFAULT now()
);

-- Create Subscribers Table (Newsletter)
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Enable public read access for SELECT
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read trends" ON trends FOR SELECT USING (true);
CREATE POLICY "Allow public read steps" ON steps FOR SELECT USING (true);
CREATE POLICY "Allow public read prompts" ON prompts FOR SELECT USING (true);
CREATE POLICY "Allow public read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow public read articles" ON articles FOR SELECT USING (true);

-- Enable subscriber INSERT for newsletter signup
CREATE POLICY "Allow public insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read subscribers" ON subscribers FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com');

-- Enable all permissions for authenticated Admin users
CREATE POLICY "Allow admin all categories" ON categories FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all trends" ON trends FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all steps" ON steps FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all prompts" ON prompts FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all resources" ON resources FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all articles" ON articles FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');
CREATE POLICY "Allow admin all subscribers" ON subscribers FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@viralaihub.com') WITH CHECK (auth.jwt() ->> 'email' = 'admin@viralaihub.com');

-- Secure database functions for incrementing trend views and copies
-- Run these in Supabase dashboard or SQL script execution:
--
-- CREATE OR REPLACE FUNCTION increment_trend_view(trend_id uuid)
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE trends
--   SET view_count = COALESCE(view_count, 0) + 1
--   WHERE id = trend_id;
-- END;
-- $$;
--
-- CREATE OR REPLACE FUNCTION increment_trend_copy(trend_id uuid)
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE trends
--   SET copied_count = COALESCE(copied_count, 0) + 1
--   WHERE id = trend_id;
-- END;
-- $$;

