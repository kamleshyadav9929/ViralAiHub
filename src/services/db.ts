import { supabase } from '../lib/supabase';
import type { Category, Trend, Step, Prompt, Resource, Article, Subscriber, AdminStats } from '../types';

// Mock Seed Data Definitions
const SEED_CATEGORIES: Category[] = [
  { id: '5ff7382c-47db-45bf-ad97-e89c6d3df3be', name: 'AI Video', slug: 'ai-video', description: 'Create high-fidelity cinematic videos using modern AI diffusion models.', icon: 'Video' },
  { id: 'df87c12b-34a8-4228-b80c-2df54db27c89', name: 'AI Image', slug: 'ai-image', description: 'Generate stunning art, photos, and assets from text prompts.', icon: 'Image' },
  { id: '14711317-0248-4395-8bdf-324c4e7239cc', name: 'AI Music', slug: 'ai-music', description: 'Compose full tracks, beats, and songs using advanced audio generation.', icon: 'Music' },
  { id: '0bbdb2e7-ebc5-4d2d-9477-9df03de73562', name: 'AI Voice', slug: 'ai-voice', description: 'Synthesize hyper-realistic speech, cloning, and voiceovers.', icon: 'Mic' },
  { id: 'd5d71c4c-3c35-4309-906d-74dbe925f69c', name: 'AI Avatar', slug: 'ai-avatar', description: 'Generate digital humans, talking heads, and virtual presenters.', icon: 'User' },
  { id: '2ad0a4bb-3037-4d7a-afcf-c774b9319e7a', name: '3D/Animation', slug: '3d-animation', description: 'Render 3D assets, animations, and rigs with AI generators.', icon: 'Layers' },
];

const SEED_TRENDS: Trend[] = [
  {
    id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    title: 'IPL Cinematic AI Reel',
    slug: 'ipl-cinematic-ai-reel',
    short_description: 'A high-octane cinematic AI reel capturing the electrifying action and emotion of IPL cricket, compiled from Midjourney stills animated with Kling AI.',
    category_id: '5ff7382c-47db-45bf-ad97-e89c6d3df3be',
    tools: ['Kling AI', 'Midjourney', 'ElevenLabs', 'CapCut'],
    difficulty: 'Intermediate',
    thumbnail_url: 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=80',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-41566-large.mp4',
    is_featured: true,
    view_count: 1450,
    copied_count: 342,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    title: 'Hindi Story Animation',
    slug: 'hindi-story-animation',
    short_description: 'Produce highly engaging, cinematic moral stories in Hindi with custom voice acting, high-fidelity characters, and dynamic camera movements.',
    category_id: '5ff7382c-47db-45bf-ad97-e89c6d3df3be',
    tools: ['Veo 3', 'ElevenLabs', 'Runway ML', 'CapCut'],
    difficulty: 'Advanced',
    thumbnail_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-futuristic-city-43224-large.mp4',
    is_featured: true,
    view_count: 980,
    copied_count: 215,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    title: 'Viral Lo-fi Hindi Song',
    slug: 'viral-lo-fi-hindi-song',
    short_description: 'Generate a chart-topping lo-fi Hindi song with deep emotional lyrics, smooth acoustic guitars, and a signature crackling vinyl aesthetic.',
    category_id: '14711317-0248-4395-8bdf-324c4e7239cc',
    tools: ['Suno AI', 'Udio', 'Midjourney'],
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-lofi-aesthetic-bedroom-view-48482-large.mp4',
    is_featured: true,
    view_count: 2310,
    copied_count: 589,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    title: 'AI Fashion Model Shoot',
    slug: 'ai-fashion-model-shoot',
    short_description: 'Create highly professional fashion catalog images using AI models, ensuring consistent clothing details, hyper-realistic skin textures, and premium studio lighting.',
    category_id: 'df87c12b-34a8-4228-b80c-2df54db27c89',
    tools: ['Midjourney', 'Magnific AI', 'Adobe Photoshop'],
    difficulty: 'Intermediate',
    thumbnail_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    video_preview_url: '',
    is_featured: false,
    view_count: 812,
    copied_count: 184,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    title: 'E-commerce Product Commercial',
    slug: 'e-commerce-product-commercial',
    short_description: 'Design a premium 15-second cinematic product commercial for a luxury perfume bottle, showcasing liquid splashes, macro lens panning, and high-end brand aesthetics.',
    category_id: '5ff7382c-47db-45bf-ad97-e89c6d3df3be',
    tools: ['Luma Dream Machine', 'Midjourney', 'CapCut'],
    difficulty: 'Intermediate',
    thumbnail_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-water-droplets-falling-on-glass-41595-large.mp4',
    is_featured: false,
    view_count: 654,
    copied_count: 120,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    title: 'Virtual Podcast Host',
    slug: 'virtual-podcast-host',
    short_description: 'Launch a virtual podcast host or educational explainer channel featuring a hyper-realistic talking avatar with natural micro-gestures and perfectly synchronized speech.',
    category_id: 'd5d71c4c-3c35-4309-906d-74dbe925f69c',
    tools: ['HeyGen', 'ChatGPT', 'ElevenLabs'],
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    video_preview_url: '',
    is_featured: false,
    view_count: 1120,
    copied_count: 298,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    title: 'Audiobook Voice Narration',
    slug: 'audiobook-voice-narration',
    short_description: 'Synthesize a full-length audiobook narration with consistent character voices, emotional storytelling pacing, and studio-grade noise floor cleanup.',
    category_id: '0bbdb2e7-ebc5-4d2d-9477-9df03de73562',
    tools: ['ElevenLabs', 'Audacity', 'Descript'],
    difficulty: 'Intermediate',
    thumbnail_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    video_preview_url: '',
    is_featured: false,
    view_count: 432,
    copied_count: 95,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    title: 'Sci-Fi Movie Trailer',
    slug: 'sci-fi-movie-trailer',
    short_description: 'Build a blockbuster-style sci-fi movie trailer with dramatic cinematic footage, a gritty voiceover, epic orchestral risers, and sound design.',
    category_id: '5ff7382c-47db-45bf-ad97-e89c6d3df3be',
    tools: ['Runway Gen-3', 'Midjourney', 'ElevenLabs', 'Premiere Pro'],
    difficulty: 'Advanced',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-space-odyssey-flying-through-clouds-to-earth-31846-large.mp4',
    is_featured: true,
    view_count: 1890,
    copied_count: 412,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    title: 'Architectural Concept Visualization',
    slug: 'architectural-concept-visualization',
    short_description: 'Create photorealistic architectural renderings from raw sketches or wireframes, utilizing precise material textures and realistic environmental lighting.',
    category_id: 'df87c12b-34a8-4228-b80c-2df54db27c89',
    tools: ['Midjourney', 'Stable Diffusion', 'Adobe Photoshop'],
    difficulty: 'Intermediate',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    video_preview_url: '',
    is_featured: false,
    view_count: 730,
    copied_count: 154,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    title: '3D Character Model for Games',
    slug: '3d-character-model-for-games',
    short_description: 'Create a game-ready, fully textured 3D character from a single 2D concept image, including topology optimization and auto-rigging.',
    category_id: '2ad0a4bb-3037-4d7a-afcf-c774b9319e7a',
    tools: ['Midjourney', 'Meshy', 'Blender'],
    difficulty: 'Advanced',
    thumbnail_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    video_preview_url: '',
    is_featured: false,
    view_count: 520,
    copied_count: 110,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const SEED_STEPS: Step[] = [
  // Steps for IPL Reel
  {
    id: 'step-1-1',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 1,
    title: 'Generate Cinematic Stills in Midjourney',
    description: 'Create dramatic cricket action stills using specialized sport and neon prompts. Focus on getting dynamic angles, facial intensity, and high contrast lighting.',
    tip: 'Use "--style raw" and aspect ratio "--ar 16:9" to keep stills ready for widescreen video editing.',
  },
  {
    id: 'step-1-2',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 2,
    title: 'Animate Stills with Kling AI',
    description: 'Upload your generated Midjourney stills into Kling AI. Enter high-motion video prompts, setting the motion parameter between 7 and 9 for explosive effects.',
    tip: 'Add descriptive movement keywords like "debris flying, camera panning, stadium spotlights flaring" to guide the motion.',
  },
  {
    id: 'step-1-3',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 3,
    title: 'Synthesize Cricket SFX in ElevenLabs',
    description: 'Use the ElevenLabs sound effects generator to create authentic stadium sounds: a deep wooden "crack" of a cricket bat hitting a ball, crowd roar, stadium echoes, and wind swooshes.',
  },
  {
    id: 'step-1-4',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 4,
    title: 'Sync and Speed-Ramp in CapCut',
    description: 'Import your animated clips and custom sound effects. Trim the clips to match the beat of a trending soundtrack. Apply velocity speed-ramping (fast-slow-fast) to match the batsman hitting the ball.',
    warning: 'Keep the transition speed high; viral sports reels thrive on fast, rhythmic transitions.',
  },

  // Steps for Hindi Animation
  {
    id: 'step-2-1',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 1,
    title: 'Scripting in Hindi & Storyboard',
    description: 'Write a classic Panchatantra moral story in conversational, emotional Hindi. Break it down into 5-6 distinct key visual scenes.',
  },
  {
    id: 'step-2-2',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 2,
    title: 'Synthesize Indian Voiceover in ElevenLabs',
    description: 'Enter your Hindi script into ElevenLabs. Use the "Rohan" (Indian accent) voice profile. Adjust voice settings to increase stability and clarify to sound like an old sage or warm storyteller.',
    tip: 'Add commas and ellipses (...) in the text to introduce natural pauses and dramatic storytelling breaths.',
  },
  {
    id: 'step-2-3',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 3,
    title: 'Generate Visuals in Veo 3 / Google Flow',
    description: 'Render high-quality 3D stylized scenes. Prompt Veo 3 to create characters with specific facial features, village mud houses, and golden hour sunset rays.',
  },
  {
    id: 'step-2-4',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 4,
    title: 'Assemble, Add Subtitles and BGM',
    description: 'Assemble visual scenes in CapCut. Place a soft traditional Indian flute track at 15% volume in the background. Auto-generate or add glowing Hindi font subtitles for viewer retention.',
  },

  // Steps for Lo-fi Song
  {
    id: 'step-3-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    step_number: 1,
    title: 'Draft Rhythmic Urdu-Hindi Lyrics',
    description: 'Draft poetic, deep-meaning lyrics. Focus on themes of nostalgia, monsoon rain, and heartbreak. Include explicit [Verse], [Chorus], and [Outro] structural tags.',
  },
  {
    id: 'step-3-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    step_number: 2,
    title: 'Generate Audio Track in Suno AI',
    description: 'Toggle "Custom Mode" in Suno. Paste your lyrics and use targeted style tags. Generate 2-3 variants and choose the one with the most authentic lo-fi drum beats and warm vocal tones.',
    tip: 'Combine style tags like "warm vinyl crackle, 808 sub bass, dusty keys, melancholic male vocals" for that signature aesthetic.',
  },
  {
    id: 'step-3-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    step_number: 3,
    title: 'Render Retro Lo-fi Video Loop',
    description: 'Generate a looping retro 90s anime style bedroom scene with Midjourney. Animate minor details (like falling rain outside the window) using Runway Gen-3 to make a perfect loop.',
  },

  // Steps for Fashion Shoot
  {
    id: 'step-4-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 1,
    title: 'Generate Base Model in Midjourney',
    description: 'Generate a high fashion base model wearing the specific clothing outline. Keep the lighting clean and background simple for editing.',
    tip: 'Use --style raw and aspect ratio --ar 3:4 for vertical fashion catalogs.',
  },
  {
    id: 'step-4-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 2,
    title: 'Face and Outfit Swapping',
    description: 'Use tools like InsightFace or Refacer to swap facial details, or use Photoshop\'s Generative Fill to alter clothing patterns while preserving natural model poses.',
  },
  {
    id: 'step-4-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 3,
    title: 'Upscale and Enhance with Magnific AI',
    description: 'Enhance skin pores, garment textures, and jewelry sparkles. Set the resemblance parameters high to avoid shifting the model\'s actual features.',
    warning: 'Avoid setting creativity too high as it can add unnatural artifacts to fabric patterns.',
  },
  {
    id: 'step-4-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 4,
    title: 'Background Replacement & Grading',
    description: 'Import into Photoshop or Canva, mask out the studio background, and place the model in a high-end runway or urban scene. Apply a cinematic LUT color grade.',
  },

  // Steps for Product Commercial
  {
    id: 'step-5-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 1,
    title: 'Generate Product Still in Midjourney',
    description: 'Render a highly clean, well-lit studio shot of the perfume bottle. Ensure the glass texture, reflections, and shadow gradients look premium.',
    tip: 'Add prompts like \'shot on Hasselblad, studio lighting, studio softbox, luxury packaging design\'.',
  },
  {
    id: 'step-5-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 2,
    title: 'Animate Liquid Splashes in Luma',
    description: 'Upload the generated perfume still to Luma Dream Machine. Enter prompts to simulate fluid motion, splashes, or steam arising around the product.',
  },
  {
    id: 'step-5-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 3,
    title: 'Create Audio Soundscapes in ElevenLabs',
    description: 'Synthesize commercial sounds: glass bottle placing down, fluid pouring, water splash, and a soft ambient synthesizer sound in the background.',
  },
  {
    id: 'step-5-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 4,
    title: 'Edit and Color Grade in CapCut',
    description: 'Assemble the commercial, matching the visual drops to the audio cues. Apply speed-ramping to build tension and use color wheels to enhance the teal & gold contrast.',
  },

  // Steps for Podcast
  {
    id: 'step-6-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 1,
    title: 'Generate Podcast Script in ChatGPT',
    description: 'Generate a 60-second podcast script using conversational language, natural rhetorical questions, and highly engaging hooks in the introduction.',
  },
  {
    id: 'step-6-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 2,
    title: 'Synthesize Voice Clone in ElevenLabs',
    description: 'Clone a high-quality studio-recorded voice. Adjust the stability to 50% and clarity to 85% to maintain a highly expressive, natural tone.',
    tip: 'Insert commas and ellipses to let the avatar take natural breathing pauses.',
  },
  {
    id: 'step-6-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 3,
    title: 'Setup Talking Avatar in HeyGen',
    description: 'Create a new HeyGen video project. Choose a high-quality presenter avatar in a professional suit. Upload the audio script and generate the video.',
  },
  {
    id: 'step-6-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 4,
    title: 'Render and Add Subtitles',
    description: 'Download the talking avatar video. Import it into CapCut or Premiere and auto-generate captions. Use animated text highlights to retain audience attention.',
    warning: 'Ensure caption placement does not block the presenter\'s face.',
  },

  // Steps for Audiobook
  {
    id: 'step-7-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 1,
    title: 'Prepare Manuscript and Voice Mapping',
    description: 'Go through the book manuscript and highlight narrator blocks versus character dialogue blocks. Map distinct voice styles to each.',
  },
  {
    id: 'step-7-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 2,
    title: 'Generate Audio in ElevenLabs',
    description: 'Generate narrator segments using deep, stable voices, and characters using more emotional, high-variance voices.',
    tip: 'Save each chapter in separate high-quality WAV files to maintain uncompressed quality.',
  },
  {
    id: 'step-7-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 3,
    title: 'Remove Breaths and Gaps in Descript',
    description: 'Import the audio into Descript. Use the filler word remover and silence shortening tools to clean up any awkward pauses or microphone bumps.',
    warning: 'Do not over-cut the natural breathing space, or it will sound robotic.',
  },
  {
    id: 'step-7-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 4,
    title: 'Mastering in Audacity',
    description: 'Apply a high-pass filter at 80Hz, run soft compression to even out volume levels, and limit to -3dB peak to match ACX/Audible standards.',
  },

  // Steps for Sci-Fi Trailer
  {
    id: 'step-8-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 1,
    title: 'Generate Concept Scenes in Midjourney',
    description: 'Generate base cinematic scenes covering astronauts, spaceships, alien landscapes, and high-tech cityscapes.',
    tip: 'Use cinematic camera lens specifications like \'anamorphic lens, cinematography --ar 16:9\'.',
  },
  {
    id: 'step-8-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 2,
    title: 'Animate Scenes in Runway Gen-3',
    description: 'Use Runway Gen-3 Alpha to animate the stills, specifying exact camera moves like slow zoom-ins, pans, or aerial drone flybys.',
  },
  {
    id: 'step-8-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 3,
    title: 'Generate Voiceover and Sound Effects',
    description: 'Generate a deep, gritty sci-fi narrator voiceover in ElevenLabs, alongside sound effects of spaceships roaring, explosions, and deep synth swells.',
  },
  {
    id: 'step-8-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 4,
    title: 'Final Compilation in Premiere Pro',
    description: 'Import all video clips, sound effects, and voiceover. Cut the video clips to match the tempo of a dramatic cinematic soundtrack. Color grade with blue and orange tones.',
  },

  // Steps for Architectural Viz
  {
    id: 'step-9-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 1,
    title: 'Create Base Line Sketch',
    description: 'Draft a basic exterior layout of the building using CAD software or manual drawing. Export as a high-resolution PNG with clean black lines.',
  },
  {
    id: 'step-9-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 2,
    title: 'Apply Stable Diffusion ControlNet',
    description: 'Input the sketch into Stable Diffusion. Use the Canny or Scribble ControlNet model. Set the prompt to render realistic building materials like wood, glass, and concrete.',
    tip: 'Set the control weight to 0.85 to allow the AI to add natural landscape details.',
  },
  {
    id: 'step-9-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 3,
    title: 'Refine Lighting in Midjourney',
    description: 'Take the Stable Diffusion render and feed it into Midjourney as an image prompt to refine the lighting, foliage, and sky realism.',
  },
  {
    id: 'step-9-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 4,
    title: 'Post-Processing in Photoshop',
    description: 'Composite realistic people, trees, reflections, and sun flares. Run a final camera raw filter to balance highlights and shadows.',
  },

  // Steps for 3D Character
  {
    id: 'step-10-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 1,
    title: 'Create Concept Art in Midjourney',
    description: 'Render a character concept sheet. Prompt Midjourney for a front view in a T-pose with flat colors and no background shading.',
    tip: 'Add \'character design sheet, T-pose, front view, simple gray background, flat shading\' to your prompt.',
  },
  {
    id: 'step-10-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 2,
    title: 'Convert 2D to 3D in Meshy',
    description: 'Crop your character image and upload it to Meshy. Generate a high-detail 3D model with auto-generated UV maps and diffuse textures.',
  },
  {
    id: 'step-10-3',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 3,
    title: 'Clean Topology in Blender',
    description: 'Import the OBJ file into Blender. Perform retopology to reduce polygon count and ensure clean vertex flow for joints.',
    warning: 'Ensure clean edge loops around the shoulders and knees to prevent mesh stretching during animation.',
  },
  {
    id: 'step-10-4',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 4,
    title: 'Auto-Rig in Mixamo',
    description: 'Export your cleaned FBX model and upload it to Mixamo. Place markers on the chin, wrists, elbows, knees, and groin to generate a character skeleton, then export animations.',
  }
];

const SEED_PROMPTS: Prompt[] = [
  // Prompts for IPL Reel
  {
    id: 'prompt-1-1',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 1,
    label: 'Midjourney Image Prompt',
    prompt_text: 'Cinematic action shot of an Indian Premier League batsman hitting a shot, stadium filled with cheering fans, dust, lens flares, dramatic overhead stadium neon lighting, hyper-realistic, photorealistic, 8k, Unreal Engine 5 render, dramatic contrast --ar 16:9 --style raw',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-1-2',
    trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e',
    step_number: 2,
    label: 'Kling AI Video Prompt',
    prompt_text: 'Electrifying cricket batsman hitting a massive shot, camera panning, stadium light flares, flying debris, cheering crowd, extreme action, cinematic slow motion, 60fps, ultra-high quality',
    tool_name: 'Kling AI',
  },

  // Prompts for Hindi Story
  {
    id: 'prompt-2-1',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 2,
    label: 'ElevenLabs Voice Config',
    prompt_text: 'Hindi script: "एक समय की बात है, एक घने जंगल में एक चतुर लोमड़ी रहती थी..." Voice: Rohan (Indian Narrator), Stability: 45%, Clarity: 85%, Style Exaggeration: 15%',
    tool_name: 'ElevenLabs',
  },
  {
    id: 'prompt-2-2',
    trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8',
    step_number: 3,
    label: 'Veo 3 Character Prompt',
    prompt_text: 'A stylized 3D animation style character of a wise old man in a traditional Indian village setting, sitting under a large Banyan tree, warm evening sunset lighting, detailed expressions, Pixar style, hyper-detailed, 8k resolution, cinematic composition',
    tool_name: 'Veo 3',
  },

  // Prompts for Lo-fi Music
  {
    id: 'prompt-3-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    step_number: 2,
    label: 'Suno AI Style Tags',
    prompt_text: 'lo-fi, hindi, acoustic guitar, soft drums, warm vinyl crackle, melancholic male vocals, romantic, slow pace',
    tool_name: 'Suno AI',
  },
  {
    id: 'prompt-3-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb',
    step_number: 2,
    label: 'Suno AI Custom Lyrics',
    prompt_text: '[Verse 1]\nखामोशियां बोलने लगीं,\nधड़कन कुछ हमसे कहने लगीं।\nइस भीगे मौसम की रातों में,\nयादें तुम्हारी तड़पाने लगीं।\n\n[Chorus]\nहौले हौले से दिल ये मेरा,\nखो गया है कहीं रास्ता।\nतुम हो या सिर्फ साया तुम्हारा,\nकैसा है ये अजब वास्ता।',
    tool_name: 'Suno AI',
  },

  // Prompts for Fashion Model Shoot
  {
    id: 'prompt-4-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 1,
    label: 'Midjourney Model Prompt',
    prompt_text: 'High fashion editorial photoshoot, professional Indian female model wearing an elegant emerald green silk saree, minimalist concrete studio background, soft dramatic key lighting, Hasselblad 80mm lens, f/2.8, photorealistic, Vogue aesthetic --ar 3:4 --style raw',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-4-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc',
    step_number: 3,
    label: 'Magnific AI Configuration',
    prompt_text: 'Creativity: 2, HDR: 1, Resemblance: 8, Description: High-end fashion silk fabric textures, intricate embroidery detail, hyper-detailed skin pore texture, studio lighting',
    tool_name: 'Magnific AI',
  },

  // Prompts for E-commerce Product Commercial
  {
    id: 'prompt-5-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 1,
    label: 'Midjourney Perfume Prompt',
    prompt_text: 'A luxurious glass perfume bottle with gold accents sitting on a wet black marble slab, dark atmospheric background, water droplets, soft golden backlight, reflection, commercial photography, 8k resolution --ar 16:9',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-5-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd',
    step_number: 2,
    label: 'Luma Dream Machine Prompt',
    prompt_text: 'Extreme close up of the perfume bottle as golden liquid splash bursts around it in slow motion, water droplets flying towards the camera, cinematic lighting, photorealistic',
    tool_name: 'Luma Dream Machine',
  },

  // Prompts for Virtual Podcast Host
  {
    id: 'prompt-6-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 1,
    label: 'ChatGPT Script Prompt',
    prompt_text: 'Write a highly engaging 60-second podcast script about "The Future of AI in Creative Design", focusing on how tools are empowering creators, using short sentences and transitions.',
    tool_name: 'ChatGPT',
  },
  {
    id: 'prompt-6-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be',
    step_number: 3,
    label: 'HeyGen Avatar Settings',
    prompt_text: 'Avatar: Joshua (Studio Suit), Voice: ElevenLabs Custom Clone, Background: Modern High-tech Podcast Studio, Framing: Medium Close-up',
    tool_name: 'HeyGen',
  },

  // Prompts for Audiobook Narration
  {
    id: 'prompt-7-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 2,
    label: 'ElevenLabs Narrator Config',
    prompt_text: 'Text: "The wind howled through the canyon as Marcus drew his sword..." Voice: George (Narrator - deep British), Stability: 60%, Clarity: 85%, Style Exaggeration: 0%',
    tool_name: 'ElevenLabs',
  },
  {
    id: 'prompt-7-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf',
    step_number: 2,
    label: 'ElevenLabs Character Config',
    prompt_text: 'Text: "Stop right there! Who goes there?" Voice: Freya (Young female - high energy), Stability: 35%, Clarity: 75%',
    tool_name: 'ElevenLabs',
  },

  // Prompts for Sci-Fi Trailer
  {
    id: 'prompt-8-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 1,
    label: 'Midjourney Sci-Fi Scene',
    prompt_text: 'An astronaut standing on the edge of a massive cliff on Mars looking at a glowing futuristic city in the valley, starry night sky, epic scale, cinematic lighting, 8k --ar 16:9',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-8-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0',
    step_number: 2,
    label: 'Runway Gen-3 Prompt',
    prompt_text: 'A slow cinematic drone push-in towards a glowing futuristic cyberpunk city on a red planet, spaceship flying overhead, neon lights flickering, dust and fog, hyper-realistic, 4k',
    tool_name: 'Runway Gen-3',
  },

  // Prompts for Architectural Viz
  {
    id: 'prompt-9-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 3,
    label: 'Midjourney Architectural Prompt',
    prompt_text: 'Modern minimalist villa nestled in a forest, concrete and glass materials, large sliding glass doors, pool reflecting the building, warm sunset lighting, autumn foliage, architectural photography, photorealistic, 8k --ar 16:9',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-9-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1',
    step_number: 2,
    label: 'ControlNet Configuration',
    prompt_text: 'Model: control_v11p_sd15_canny, Preprocessor: canny, Weight: 0.85, Prompt: modern concrete house in woods, photorealistic, warm light, 8k',
    tool_name: 'Stable Diffusion',
  },

  // Prompts for 3D Character
  {
    id: 'prompt-10-1',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 1,
    label: 'Midjourney Concept Sheet',
    prompt_text: 'Concept art sheet of a futuristic sci-fi warrior, T-pose, front view, simple gray background, flat colors, clear details, game asset design --ar 1:1',
    tool_name: 'Midjourney',
  },
  {
    id: 'prompt-10-2',
    trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2',
    step_number: 2,
    label: 'Meshy settings',
    prompt_text: 'Mode: Image-to-3D, Model: High-detail character, Output: OBJ with diffuse map',
    tool_name: 'Meshy',
  }
];

const SEED_RESOURCES: Resource[] = [
  { id: 'res-1', trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e', youtube_video_id: 'o7xSnpC5K6U' },
  { id: 'res-2', trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8', youtube_video_id: '7FwD_jK2Q6U' },
  { id: 'res-3', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb', youtube_video_id: 'LFeKBEJ_iP0' },
  { id: 'res-4', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc', youtube_video_id: 'vP-0D6zF4-I' },
  { id: 'res-5', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd', youtube_video_id: 'm7R6m91mPlI' },
  { id: 'res-6', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be', youtube_video_id: 'gWpE1B2LelA' },
  { id: 'res-7', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf', youtube_video_id: 'v_q5o8e-p-Q' },
  { id: 'res-8', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0', youtube_video_id: 'HszfKqS0QpE' },
  { id: 'res-9', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1', youtube_video_id: 'Z_E7Rk3J6p0' },
  { id: 'res-10', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2', youtube_video_id: 'Fk1X0pYh8g4' }
];

const SEED_ARTICLES: Article[] = [
  { id: 'art-1-1', trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e', title: 'How Kling AI is Revolutionizing Cinematic Video Stills', url: 'https://klingai.org/blog/cinematic-video', source_name: 'Kling AI Blog' },
  { id: 'art-1-2', trend_id: '9f6b97eb-cf12-4ee1-ba5b-2a78f3074d9e', title: 'Creating Hyper-Realistic Sports Reels', url: 'https://midjourney.com/showcase/sports', source_name: 'Midjourney Showcase' },
  { id: 'art-2-1', trend_id: 'b93e507b-cb62-43bb-bdf0-06f1406e2ea8', title: 'Veo 3 Animation Techniques & Prompts', url: 'https://deepmind.google/technologies/veo/', source_name: 'Google DeepMind' },
  { id: 'art-3-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bb', title: 'Mastering Custom Song Creation in Suno', url: 'https://suno.com/blog/custom-lyrics-guide', source_name: 'Suno AI Blog' },
  { id: 'art-4-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bc', title: 'Upscaling with Magnific AI for Fashion Photography', url: 'https://magnific.ai/docs/fashion-guide', source_name: 'Magnific AI Docs' },
  { id: 'art-5-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bd', title: 'E-commerce Product Animation in Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine/tutorials', source_name: 'Luma Labs Tutorials' },
  { id: 'art-6-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782be', title: 'Creating High-Fidelity Talking Avatars', url: 'https://docs.heygen.com/docs/talking-avatar', source_name: 'HeyGen Help Center' },
  { id: 'art-7-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782bf', title: 'ElevenLabs Audiobook Creation Standards', url: 'https://elevenlabs.io/blog/audiobook-narration', source_name: 'ElevenLabs Blog' },
  { id: 'art-8-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c0', title: 'Cinematic Directing inside Runway Gen-3', url: 'https://runwayml.com/tutorials/gen-3', source_name: 'Runway Academy' },
  { id: 'art-9-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c1', title: 'ControlNet Workflow for Architectural Renders', url: 'https://stable-diffusion-art.com/controlnet', source_name: 'Stable Diffusion Art' },
  { id: 'art-10-1', trend_id: 'f4c5c7d8-8d02-4043-b9b5-fcd7be4782c2', title: 'Developing 3D Mesh Assets using Meshy AI', url: 'https://docs.meshy.ai/image-to-3d', source_name: 'Meshy Documentation' }
];

// Local DB State Management using localStorage
const LOCAL_STORAGE_KEY = 'viralai_local_db';

const getLocalDB = (): {
  categories: Category[];
  trends: Trend[];
  steps: Step[];
  prompts: Prompt[];
  resources: Resource[];
  articles: Article[];
  subscribers: Subscriber[];
} => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const initialDB = {
      categories: SEED_CATEGORIES,
      trends: SEED_TRENDS,
      steps: SEED_STEPS,
      prompts: SEED_PROMPTS,
      resources: SEED_RESOURCES,
      articles: SEED_ARTICLES,
      subscribers: []
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
  return JSON.parse(data);
};

const saveLocalDB = (db: any) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
};

// Unified Database Service Wrapper and Cache Store
const queryCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const CACHE_TTL = 15000; // 15 seconds Cache TTL for quick page transitions

async function cachedQuery<T>(key: string, queryFn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  const promise = queryFn().then(data => {
    queryCache.set(key, { data, timestamp: Date.now() });
    pendingRequests.delete(key);
    return data;
  }).catch(err => {
    pendingRequests.delete(key);
    throw err;
  });
  pendingRequests.set(key, promise);
  return promise;
}

export const clearCache = () => {
  queryCache.clear();
  pendingRequests.clear();
};

export const dbService = {
  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    return cachedQuery('categories', async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('categories').select('*').order('name');
          if (error) throw error;
          if (data && data.length > 0) return data;
        } catch (err) {
          console.error('Supabase getCategories failed, falling back to local.', err);
        }
      }
      return getLocalDB().categories;
    });
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return cachedQuery(`category:${slug}`, async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
          if (error) throw error;
          if (data) return data;
        } catch (err) {
          console.error('Supabase getCategoryBySlug failed, falling back to local.', err);
        }
      }
      const categories = getLocalDB().categories;
      return categories.find(c => c.slug === slug) || null;
    });
  },

  // --- TRENDS ---
  async getTrends(filters?: {
    categorySlug?: string;
    search?: string;
    tool?: string;
    difficulty?: string;
    featuredOnly?: boolean;
    limit?: number;
  }): Promise<Trend[]> {
    const cacheKey = `trends:${JSON.stringify(filters || {})}`;
    return cachedQuery(cacheKey, async () => {
      if (supabase) {
        try {
          let query = supabase.from('trends').select(`
            *,
            category:categories(*)
          `);

          if (filters?.featuredOnly) {
            query = query.eq('is_featured', true);
          }

          if (filters?.difficulty) {
            query = query.eq('difficulty', filters.difficulty);
          }

          if (filters?.categorySlug) {
            const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.categorySlug).single();
            if (cat) {
              query = query.eq('category_id', cat.id);
            }
          }

          if (filters?.tool) {
            query = query.contains('tools', [filters.tool]);
          }

          if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
          }

          query = query.order('created_at', { ascending: false });

          if (filters?.limit) {
            query = query.limit(filters.limit);
          }

          // Removed redundant basic select fallback check that triggered duplicate DB query hits

          const { data: fullData, error: fullError } = await query;
          if (fullError) throw fullError;
          if (fullData) {
            return fullData as Trend[];
          }
        } catch (err) {
          console.error('Supabase getTrends failed, falling back to local.', err);
        }
      }

      // Local DB Fallback Filter Logic
      const db = getLocalDB();
      let results = [...db.trends];

      // Map categories onto trends
      results = results.map(t => ({
        ...t,
        category: db.categories.find(c => c.id === t.category_id)
      }));

      if (filters?.featuredOnly) {
        results = results.filter(t => t.is_featured);
      }

      if (filters?.difficulty) {
        results = results.filter(t => t.difficulty === filters.difficulty);
      }

      if (filters?.categorySlug) {
        results = results.filter(t => t.category?.slug === filters.categorySlug);
      }

      if (filters?.tool) {
        results = results.filter(t => t.tools?.includes(filters.tool!));
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          t.short_description?.toLowerCase().includes(searchLower) ||
          t.tools?.some(tool => tool.toLowerCase().includes(searchLower))
        );
      }

      // Sort by latest
      results.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

      if (filters?.limit) {
        results = results.slice(0, filters.limit);
      }

      return results;
    });
  },

  async getTrendBySlug(slug: string): Promise<Trend | null> {
    return cachedQuery(`trend:${slug}`, async () => {
      if (supabase) {
        try {
          // Fetch everything using relationships in 1 database call instead of 5 separate ones
          const { data: trend, error: trendError } = await supabase
            .from('trends')
            .select(`
              *,
              category:categories(*),
              steps(*),
              prompts(*),
              resources(*),
              articles(*)
            `)
            .eq('slug', slug)
            .single();

          if (trendError) throw trendError;

          if (trend) {
            // Sort relations client-side to maintain clean order
            const steps = trend.steps ? [...trend.steps].sort((a: any, b: any) => a.step_number - b.step_number) : [];
            const prompts = trend.prompts ? [...trend.prompts].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [];
            const resources = trend.resources && trend.resources.length > 0 ? trend.resources[0] : undefined;
            const articles = trend.articles || [];

            return {
              ...trend,
              steps,
              prompts,
              resources,
              articles
            };
          }
        } catch (err) {
          console.error('Supabase getTrendBySlug failed, falling back to local.', err);
        }
      }

      // Local DB Fallback
      const db = getLocalDB();
      const trend = db.trends.find(t => t.slug === slug);
      if (!trend) return null;

      return {
        ...trend,
        category: db.categories.find(c => c.id === trend.category_id),
        steps: db.steps.filter(s => s.trend_id === trend.id).sort((a, b) => a.step_number - b.step_number),
        prompts: db.prompts.filter(p => p.trend_id === trend.id),
        resources: db.resources.find(r => r.trend_id === trend.id),
        articles: db.articles.filter(a => a.trend_id === trend.id)
      };
    });
  },

  async createTrend(trendData: Partial<Trend> & {
    steps: Partial<Step>[];
    prompts: Partial<Prompt>[];
    youtubeVideoId?: string;
    articles: Partial<Article>[];
  }): Promise<Trend> {
    clearCache();
    const trendId = crypto.randomUUID ? crypto.randomUUID() : `trend-${Math.random().toString(36).substr(2, 9)}`;
    const newTrend: Trend = {
      id: trendId,
      title: trendData.title!,
      slug: trendData.slug!,
      short_description: trendData.short_description || '',
      category_id: trendData.category_id || '',
      tools: trendData.tools || [],
      difficulty: trendData.difficulty || 'Beginner',
      thumbnail_url: trendData.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      video_preview_url: trendData.video_preview_url || '',
      is_featured: trendData.is_featured || false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        // Insert trend
        const { data: insertedTrend, error: trendErr } = await supabase
          .from('trends')
          .insert({
            title: newTrend.title,
            slug: newTrend.slug,
            short_description: newTrend.short_description,
            category_id: newTrend.category_id,
            tools: newTrend.tools,
            difficulty: newTrend.difficulty,
            thumbnail_url: newTrend.thumbnail_url,
            video_preview_url: newTrend.video_preview_url,
            is_featured: newTrend.is_featured
          })
          .select()
          .single();

        if (trendErr) throw trendErr;
        const liveTrendId = insertedTrend.id;

        // Insert steps
        if (trendData.steps && trendData.steps.length > 0) {
          const stepsToInsert = trendData.steps.map((s, idx) => ({
            trend_id: liveTrendId,
            step_number: idx + 1,
            title: s.title || '',
            description: s.description || '',
            tip: s.tip || null,
            warning: s.warning || null
          }));
          await supabase.from('steps').insert(stepsToInsert);
        }

        // Insert prompts
        if (trendData.prompts && trendData.prompts.length > 0) {
          const promptsToInsert = trendData.prompts.map(p => ({
            trend_id: liveTrendId,
            step_number: p.step_number || null,
            label: p.label || '',
            prompt_text: p.prompt_text || '',
            tool_name: p.tool_name || null
          }));
          await supabase.from('prompts').insert(promptsToInsert);
        }

        // Insert resource (youtube)
        if (trendData.youtubeVideoId) {
          await supabase.from('resources').insert({
            trend_id: liveTrendId,
            youtube_video_id: trendData.youtubeVideoId
          });
        }

        // Insert articles
        if (trendData.articles && trendData.articles.length > 0) {
          const articlesToInsert = trendData.articles.map(a => ({
            trend_id: liveTrendId,
            title: a.title || '',
            url: a.url || '',
            source_name: a.source_name || null
          }));
          await supabase.from('articles').insert(articlesToInsert);
        }

        return insertedTrend;
      } catch (err) {
        console.error('Supabase createTrend failed, falling back to local storage.', err);
      }
    }

    // Local DB Fallback Write
    const db = getLocalDB();
    db.trends.push(newTrend);

    // Save Steps
    trendData.steps.forEach((s, idx) => {
      db.steps.push({
        id: `step-${Date.now()}-${idx}`,
        trend_id: trendId,
        step_number: idx + 1,
        title: s.title || '',
        description: s.description || '',
        tip: s.tip,
        warning: s.warning,
        created_at: new Date().toISOString()
      });
    });

    // Save Prompts
    trendData.prompts.forEach((p, idx) => {
      db.prompts.push({
        id: `prompt-${Date.now()}-${idx}`,
        trend_id: trendId,
        step_number: p.step_number,
        label: p.label || '',
        prompt_text: p.prompt_text || '',
        tool_name: p.tool_name || '',
        created_at: new Date().toISOString()
      });
    });

    // Save Resource (youtube)
    if (trendData.youtubeVideoId) {
      db.resources.push({
        id: `res-${Date.now()}`,
        trend_id: trendId,
        youtube_video_id: trendData.youtubeVideoId,
        created_at: new Date().toISOString()
      });
    }

    // Save Articles
    trendData.articles.forEach((a, idx) => {
      db.articles.push({
        id: `art-${Date.now()}-${idx}`,
        trend_id: trendId,
        title: a.title || '',
        url: a.url || '',
        source_name: a.source_name || '',
        created_at: new Date().toISOString()
      });
    });

    saveLocalDB(db);
    return newTrend;
  },

  async updateTrend(id: string, trendData: Partial<Trend> & {
    steps: Partial<Step>[];
    prompts: Partial<Prompt>[];
    youtubeVideoId?: string;
    articles: Partial<Article>[];
  }): Promise<void> {
    clearCache();
    if (supabase) {
      try {
        const { error: trendErr } = await supabase
          .from('trends')
          .update({
            title: trendData.title,
            slug: trendData.slug,
            short_description: trendData.short_description,
            category_id: trendData.category_id,
            tools: trendData.tools,
            difficulty: trendData.difficulty,
            thumbnail_url: trendData.thumbnail_url,
            video_preview_url: trendData.video_preview_url,
            is_featured: trendData.is_featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (trendErr) throw trendErr;

        // Cascade delete old relations and insert new ones
        await Promise.all([
          supabase.from('steps').delete().eq('trend_id', id),
          supabase.from('prompts').delete().eq('trend_id', id),
          supabase.from('resources').delete().eq('trend_id', id),
          supabase.from('articles').delete().eq('trend_id', id)
        ]);

        // Re-insert relations
        if (trendData.steps && trendData.steps.length > 0) {
          const stepsToInsert = trendData.steps.map((s, idx) => ({
            trend_id: id,
            step_number: idx + 1,
            title: s.title || '',
            description: s.description || '',
            tip: s.tip || null,
            warning: s.warning || null
          }));
          await supabase.from('steps').insert(stepsToInsert);
        }

        if (trendData.prompts && trendData.prompts.length > 0) {
          const promptsToInsert = trendData.prompts.map(p => ({
            trend_id: id,
            step_number: p.step_number || null,
            label: p.label || '',
            prompt_text: p.prompt_text || '',
            tool_name: p.tool_name || null
          }));
          await supabase.from('prompts').insert(promptsToInsert);
        }

        if (trendData.youtubeVideoId) {
          await supabase.from('resources').insert({
            trend_id: id,
            youtube_video_id: trendData.youtubeVideoId
          });
        }

        if (trendData.articles && trendData.articles.length > 0) {
          const articlesToInsert = trendData.articles.map(a => ({
            trend_id: id,
            title: a.title || '',
            url: a.url || '',
            source_name: a.source_name || null
          }));
          await supabase.from('articles').insert(articlesToInsert);
        }

        return;
      } catch (err) {
        console.error('Supabase updateTrend failed, falling back to local storage.', err);
      }
    }

    // Local DB Fallback Update
    const db = getLocalDB();
    const trendIdx = db.trends.findIndex(t => t.id === id);
    if (trendIdx !== -1) {
      db.trends[trendIdx] = {
        ...db.trends[trendIdx],
        title: trendData.title!,
        slug: trendData.slug!,
        short_description: trendData.short_description || '',
        category_id: trendData.category_id || '',
        tools: trendData.tools || [],
        difficulty: trendData.difficulty || 'Beginner',
        thumbnail_url: trendData.thumbnail_url || db.trends[trendIdx].thumbnail_url,
        video_preview_url: trendData.video_preview_url || '',
        is_featured: trendData.is_featured || false,
        updated_at: new Date().toISOString()
      };

      // Remove old dependent entities
      db.steps = db.steps.filter(s => s.trend_id !== id);
      db.prompts = db.prompts.filter(p => p.trend_id !== id);
      db.resources = db.resources.filter(r => r.trend_id !== id);
      db.articles = db.articles.filter(a => a.trend_id !== id);

      // Re-add steps
      trendData.steps.forEach((s, idx) => {
        db.steps.push({
          id: `step-${Date.now()}-${idx}`,
          trend_id: id,
          step_number: idx + 1,
          title: s.title || '',
          description: s.description || '',
          tip: s.tip || undefined,
          warning: s.warning || undefined,
          created_at: new Date().toISOString()
        });
      });

      // Re-add prompts
      trendData.prompts.forEach((p, idx) => {
        db.prompts.push({
          id: `prompt-${Date.now()}-${idx}`,
          trend_id: id,
          step_number: p.step_number,
          label: p.label || '',
          prompt_text: p.prompt_text || '',
          tool_name: p.tool_name || '',
          created_at: new Date().toISOString()
        });
      });

      // Re-add resources
      if (trendData.youtubeVideoId) {
        db.resources.push({
          id: `res-${Date.now()}`,
          trend_id: id,
          youtube_video_id: trendData.youtubeVideoId,
          created_at: new Date().toISOString()
        });
      }

      // Re-add articles
      trendData.articles.forEach((a, idx) => {
        db.articles.push({
          id: `art-${Date.now()}-${idx}`,
          trend_id: id,
          title: a.title || '',
          url: a.url || '',
          source_name: a.source_name || '',
          created_at: new Date().toISOString()
        });
      });

      saveLocalDB(db);
    }
  },

  async deleteTrend(id: string): Promise<void> {
    clearCache();
    if (supabase) {
      try {
        const { error } = await supabase.from('trends').delete().eq('id', id);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase deleteTrend failed, falling back to local storage.', err);
      }
    }

    const db = getLocalDB();
    db.trends = db.trends.filter(t => t.id !== id);
    db.steps = db.steps.filter(s => s.trend_id !== id);
    db.prompts = db.prompts.filter(p => p.trend_id !== id);
    db.resources = db.resources.filter(r => r.trend_id !== id);
    db.articles = db.articles.filter(a => a.trend_id !== id);
    saveLocalDB(db);
  },

  async incrementViewCount(id: string): Promise<void> {
    clearCache(); // Clear cache to reflect new view counts in grids
    if (supabase) {
      try {
        const { data } = await supabase.from('trends').select('view_count').eq('id', id).single();
        if (data) {
          await supabase.from('trends').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
          return;
        }
      } catch (err) {
        // silent catch
      }
    }

    // Local DB Fallback
    const db = getLocalDB();
    const trend = db.trends.find(t => t.id === id);
    if (trend) {
      trend.view_count = (trend.view_count || 0) + 1;
      saveLocalDB(db);
    }
  },

  async incrementCopyCount(id: string): Promise<void> {
    clearCache(); // Clear cache to reflect new copy counts in grids
    if (supabase) {
      try {
        const { data } = await supabase.from('trends').select('copied_count').eq('id', id).single();
        if (data) {
          await supabase.from('trends').update({ copied_count: (data.copied_count || 0) + 1 }).eq('id', id);
          return;
        }
      } catch (err) {
        // silent catch
      }
    }

    // Local DB Fallback
    const db = getLocalDB();
    const trend = db.trends.find(t => t.id === id);
    if (trend) {
      trend.copied_count = (trend.copied_count || 0) + 1;
      saveLocalDB(db);
    }
  },

  // --- NEWSLETTER ---
  async addSubscriber(email: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase.from('subscribers').insert({ email });
        if (!error) return;
        if (error.code === '23505') return; 
        throw error;
      } catch (err) {
        console.error('Supabase addSubscriber failed, falling back to local storage.', err);
      }
    }

    const db = getLocalDB();
    const exists = db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      db.subscribers.push({
        id: `sub-${Date.now()}`,
        email,
        created_at: new Date().toISOString()
      });
      saveLocalDB(db);
    }
  },

  // --- ADMIN PANEL STATS ---
  async getAdminStats(): Promise<AdminStats> {
    return cachedQuery('adminStats', async () => {
      if (supabase) {
        try {
          const [trendsRes, viewsRes, promptsRes] = await Promise.all([
            supabase.from('trends').select('id, created_at, title, slug, thumbnail_url, tools, difficulty, view_count'),
            supabase.from('trends').select('view_count'),
            supabase.from('prompts').select('prompt_text')
          ]);

          if (!trendsRes.error && trendsRes.data) {
            const totalTrends = trendsRes.data.length;
            const totalViews = (viewsRes.data || []).reduce((sum, t) => sum + (t.view_count || 0), 0);
            
            const mostCopiedPrompt = promptsRes.data && promptsRes.data.length > 0 
              ? promptsRes.data.reduce((max, p) => p.prompt_text.length > max.length ? p.prompt_text : max, '').substring(0, 50) + '...'
              : 'Midjourney Action Stadium Prompt';

            const recentlyAdded = [...trendsRes.data]
              .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
              .slice(0, 5) as Trend[];

            return {
              totalTrends,
              totalViews,
              mostCopiedPrompt,
              recentlyAdded
            };
          }
        } catch (err) {
          console.error('Supabase getAdminStats failed, falling back to local.', err);
        }
      }

      // Local DB Fallback Stats
      const db = getLocalDB();
      const totalTrends = db.trends.length;
      const totalViews = db.trends.reduce((sum, t) => sum + (t.view_count || 0), 0);
      
      const longestPrompt = db.prompts.reduce((max, p) => p.prompt_text.length > max.length ? p.prompt_text : max, '');
      const mostCopiedPrompt = longestPrompt 
        ? longestPrompt.substring(0, 50) + '...'
        : 'Suno Lo-Fi Lyrics Prompt';

      const recentlyAdded = [...db.trends]
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
        .slice(0, 5)
        .map(t => ({
          ...t,
          category: db.categories.find(c => c.id === t.category_id)
        }));

      return {
        totalTrends,
        totalViews,
        mostCopiedPrompt,
        recentlyAdded
      };
    });
  },

  // --- PROMPTS COUNT (OPTIMIZED METADATA) ---
  async getPromptsCount(): Promise<number> {
    return cachedQuery('promptsCount', async () => {
      if (supabase) {
        try {
          const { count, error } = await supabase
            .from('prompts')
            .select('*', { count: 'exact', head: true });
          if (!error && count !== null) return count;
        } catch (err) {
          console.error('Supabase getPromptsCount failed', err);
        }
      }
      return getLocalDB().prompts.length;
    });
  }
};
