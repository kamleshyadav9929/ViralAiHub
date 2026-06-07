import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TOOL_WEBSITES: Record<string, { url: string; domain: string }> = {
  'Kling AI': { url: 'https://klingai.com', domain: 'klingai.com' },
  'Midjourney': { url: 'https://midjourney.com', domain: 'midjourney.com' },
  'ElevenLabs': { url: 'https://elevenlabs.io', domain: 'elevenlabs.io' },
  'CapCut': { url: 'https://capcut.com', domain: 'capcut.com' },
  'Veo 3': { url: 'https://deepmind.google/technologies/veo', domain: 'deepmind.google' },
  'Veo': { url: 'https://deepmind.google/technologies/veo', domain: 'deepmind.google' },
  'Runway ML': { url: 'https://runwayml.com', domain: 'runwayml.com' },
  'Runway Gen-3': { url: 'https://runwayml.com', domain: 'runwayml.com' },
  'Runway': { url: 'https://runwayml.com', domain: 'runwayml.com' },
  'Suno AI': { url: 'https://suno.com', domain: 'suno.com' },
  'Udio': { url: 'https://udio.com', domain: 'udio.com' },
  'Magnific AI': { url: 'https://magnific.ai', domain: 'magnific.ai' },
  'Adobe Photoshop': { url: 'https://adobe.com/products/photoshop.html', domain: 'adobe.com' },
  'Luma Dream Machine': { url: 'https://lumalabs.ai/dream-machine', domain: 'lumalabs.ai' },
  'Luma': { url: 'https://lumalabs.ai', domain: 'lumalabs.ai' },
  'HeyGen': { url: 'https://heygen.com', domain: 'heygen.com' },
  'ChatGPT': { url: 'https://chatgpt.com', domain: 'openai.com' },
  'Audacity': { url: 'https://audacityteam.org', domain: 'audacityteam.org' },
  'Descript': { url: 'https://descript.com', domain: 'descript.com' },
  'Premiere Pro': { url: 'https://adobe.com/products/premiere.html', domain: 'adobe.com' },
  'Stable Diffusion': { url: 'https://stability.ai', domain: 'stability.ai' },
  'Meshy': { url: 'https://meshy.ai', domain: 'meshy.ai' },
  'Blender': { url: 'https://blender.org', domain: 'blender.org' }
};

export function getToolInfo(tool: string) {
  const normalizedKey = tool.replace(/\s+Gen-\d+/, '').replace(/\s+\d+/, '');
  const match = TOOL_WEBSITES[tool] || TOOL_WEBSITES[normalizedKey];
  if (match) return match;

  const cleanName = tool.toLowerCase().replace(/[^a-z0-9]/g, '');
  return {
    url: `https://google.com/search?q=${encodeURIComponent(tool)}`,
    domain: `${cleanName || 'tool'}.com`
  };
}

export function getToolGradient(name: string) {
  const gradients = [
    'bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white',
    'bg-gradient-to-br from-[#ec4899] to-[#f43f5e] text-white',
    'bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] text-white',
    'bg-gradient-to-br from-[#10b981] to-[#14b8a6] text-white',
    'bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
