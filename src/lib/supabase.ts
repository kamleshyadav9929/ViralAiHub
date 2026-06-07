import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  isValidUrl(supabaseUrl);

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isConfigured) {
  if (import.meta.env.DEV) {
    console.log('Supabase is not configured. Running in Local Database Mock mode.');
  }
}
