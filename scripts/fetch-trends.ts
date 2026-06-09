import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { scrapeAndExtractTrend } from '../src/services/firecrawl';

// Load environment variables
dotenv.config();

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function run() {
  const urlArg = process.argv[2];

  if (!urlArg) {
    console.error('\x1b[31mError: Please provide a target URL to scrape.\x1b[0m');
    console.log('Usage: npm run fetch-trends -- "https://example.com/trending-prompts"');
    process.exit(1);
  }

  if (!FIRECRAWL_API_KEY) {
    console.error('\x1b[31mError: FIRECRAWL_API_KEY environment variable is not defined in .env.\x1b[0m');
    process.exit(1);
  }

  if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\x1b[31mError: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are not defined.\x1b[0m');
    console.log('Note: To write to the remote Supabase database, the Service Role key is required to bypass Row Level Security.');
    process.exit(1);
  }

  console.log(`\n\x1b[36m🚀 Starting Firecrawl Scraper...\x1b[0m`);
  console.log(`\x1b[33mTarget URL:\x1b[0m ${urlArg}`);

  // Create admin client to bypass RLS policies
  const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    console.log('\x1b[35m⏳ Contacting Firecrawl API for structured LLM extraction (this may take 10-30 seconds)...\x1b[0m');
    const extractedTrends = await scrapeAndExtractTrend(urlArg, FIRECRAWL_API_KEY);

    console.log(`\x1b[32m✔ Successfully extracted ${extractedTrends.length} trends from page!\x1b[0m`);

    // Fetch existing categories to map them
    const { data: dbCategories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (catError) {
      throw new Error(`Failed to load categories from database: ${catError.message}`);
    }

    console.log(`Fetched ${dbCategories?.length || 0} categories from database for matching.`);

    for (const extracted of extractedTrends) {
      console.log(`\n----------------------------------------`);
      console.log(`\x1b[34mProcessing trend:\x1b[0m "${extracted.title}"`);

      // 1. Resolve category
      let categoryId = '';
      const matchedCat = dbCategories?.find(
        (c) =>
          c.name.toLowerCase() === extracted.category_name.toLowerCase() ||
          c.slug.toLowerCase() === extracted.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      );

      if (matchedCat) {
        categoryId = matchedCat.id;
        console.log(`Matched with category: \x1b[32m"${matchedCat.name}"\x1b[0m`);
      } else {
        // Create a new category if it doesn't match
        console.log(`Category "${extracted.category_name}" not found. Creating a new category...`);
        const catSlug = extracted.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const { data: newCat, error: insertCatError } = await supabase
          .from('categories')
          .insert({
            name: extracted.category_name,
            slug: catSlug,
            description: `Auto-crawled category for ${extracted.category_name}`,
            icon: 'Terminal',
          })
          .select()
          .single();

        if (insertCatError) {
          console.error(`\x1b[31mFailed to create category:\x1b[0m ${insertCatError.message}`);
          // Fall back to first category
          if (dbCategories && dbCategories.length > 0) {
            categoryId = dbCategories[0].id;
            console.log(`Falling back to category: "${dbCategories[0].name}"`);
          } else {
            throw new Error('No categories available in the database.');
          }
        } else {
          categoryId = newCat.id;
          console.log(`Successfully created new category \x1b[32m"${newCat.name}"\x1b[0m with ID ${categoryId}`);
          // Add to current loaded categories array to prevent creating it again in subsequent loops
          dbCategories.push(newCat);
        }
      }

      // Generate slug
      const trendSlug = extracted.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // 2. Check if trend already exists
      const { data: existingTrend } = await supabase
        .from('trends')
        .select('id')
        .eq('slug', trendSlug)
        .maybeSingle();

      if (existingTrend) {
        console.log(`\x1b[33m⚠ Trend with slug "${trendSlug}" already exists in the database. Skipping.\x1b[0m`);
        continue;
      }

      // 3. Insert Trend
      const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      const { data: insertedTrend, error: trendInsertError } = await supabase
        .from('trends')
        .insert({
          title: extracted.title,
          slug: trendSlug,
          short_description: extracted.short_description,
          category_id: categoryId,
          tools: extracted.tools,
          difficulty: extracted.difficulty || 'Beginner',
          thumbnail_url: defaultThumbnail,
          is_featured: false,
          view_count: 0,
        })
        .select()
        .single();

      if (trendInsertError) {
        console.error(`\x1b[31mFailed to insert trend:\x1b[0m ${trendInsertError.message}`);
        continue;
      }

      const newTrendId = insertedTrend.id;
      console.log(`\x1b[32m✔ Inserted trend successfully!\x1b[0m ID: ${newTrendId}`);

      // 4. Insert Steps
      if (extracted.steps && extracted.steps.length > 0) {
        const stepsToInsert = extracted.steps.map((s, idx) => ({
          trend_id: newTrendId,
          step_number: s.step_number || idx + 1,
          title: s.title,
          description: s.description,
          tip: s.tip || null,
          warning: s.warning || null,
        }));

        const { error: stepsError } = await supabase.from('steps').insert(stepsToInsert);
        if (stepsError) {
          console.error(`\x1b[31mFailed to insert steps:\x1b[0m ${stepsError.message}`);
        } else {
          console.log(`\x1b[32m✔ Inserted ${stepsToInsert.length} instruction steps.\x1b[0m`);
        }
      }

      // 5. Insert Prompts
      if (extracted.prompts && extracted.prompts.length > 0) {
        const promptsToInsert = extracted.prompts.map((p) => ({
          trend_id: newTrendId,
          step_number: p.step_number || null,
          label: p.label,
          prompt_text: p.prompt_text,
          tool_name: p.tool_name || null,
        }));

        const { error: promptsError } = await supabase.from('prompts').insert(promptsToInsert);
        if (promptsError) {
          console.error(`\x1b[31mFailed to insert prompts:\x1b[0m ${promptsError.message}`);
        } else {
          console.log(`\x1b[32m✔ Inserted ${promptsToInsert.length} copyable prompts.\x1b[0m`);
        }
      }

      // 6. Insert Articles
      if (extracted.articles && extracted.articles.length > 0) {
        const articlesToInsert = extracted.articles.map((a) => ({
          trend_id: newTrendId,
          title: a.title,
          url: a.url,
          source_name: a.source_name || null,
        }));

        const { error: articlesError } = await supabase.from('articles').insert(articlesToInsert);
        if (articlesError) {
          console.error(`\x1b[31mFailed to insert reference articles:\x1b[0m ${articlesError.message}`);
        } else {
          console.log(`\x1b[32m✔ Inserted ${articlesToInsert.length} reference articles.\x1b[0m`);
        }
      }
    }

    console.log(`\n\x1b[32m🎉 All operations completed successfully!\x1b[0m\n`);
  } catch (error: any) {
    console.error(`\n\x1b[31m❌ Scraper execution failed:\x1b[0m`, error.message || error);
    process.exit(1);
  }
}

run();
